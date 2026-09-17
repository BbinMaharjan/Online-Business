import { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Button,
  Card,
  message,
} from "antd";
import { PictureOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { setBreadcrumbs } from "../../store/uiSlice";
import {
  useBrandQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
} from "./hooks/useBrands";
import { useUploadMediaMutation } from "../media/hooks/useMedia";
import { PermissionGuard } from "../../components/common/PermissionGuard";
import styles from "./BrandFormPage.module.css";

const BrandFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isEdit = !!id;
  const { data: brandResponse, isLoading } = useBrandQuery(id || "");
  const brand = brandResponse?.data;
  const createMutation = useCreateBrandMutation();
  const updateMutation = useUpdateBrandMutation();
  const uploadMutation = useUploadMediaMutation();
  const [logo, setLogo] = useState<string | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEdit && brand) {
      form.setFieldsValue({
        name: brand.name,
        slug: brand.slug,
        description: brand.description,
        status: brand.status,
        seoTitle: brand.seo?.title,
        seoDescription: brand.seo?.description,
        seoKeywords: brand.seo?.keywords?.join(", "),
      });
      setLogo(brand.logo || null);
      dispatch(
        setBreadcrumbs([
          { label: "Brands", path: "/brands" },
          { label: isEdit ? "Edit Brand" : "Create Brand" },
        ]),
      );
    } else {
      dispatch(
        setBreadcrumbs([
          { label: "Brands", path: "/brands" },
          { label: "Create Brand" },
        ]),
      );
    }
  }, [brand, isEdit, dispatch]);

  const handleLogoUpload = async (file: File) => {
    try {
      const res = await uploadMutation.mutateAsync({
        file,
        referenceId: id || "temp",
        referenceType: "BRAND",
      });
      setLogo(res.data.data.url);
      return res.data.data.url;
    } catch {
      message.error("Upload failed");
      throw new Error("Upload failed");
    }
  };

  const onFinish = async (values: any) => {
    try {
      const data = {
        ...values,
        logo,
        seo: {
          title: values.seoTitle,
          description: values.seoDescription,
          keywords:
            values.seoKeywords
              ?.split(",")
              .map((k: string) => k.trim())
              .filter(Boolean) || [],
        },
      };
      if (isEdit) await updateMutation.mutateAsync({ id: id!, data });
      else await createMutation.mutateAsync(data);
      message.success(isEdit ? "Brand updated" : "Brand created");
      navigate("/brands");
    } catch {
      message.error("Failed");
    }
  };

  if (isEdit && isLoading)
    return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/brands")}
        >
          Back
        </Button>
        <h1 className={styles.title}>
          {isEdit ? "Edit Brand" : "Create Brand"}
        </h1>
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className={styles.form}
        initialValues={{ status: "ACTIVE" }}
      >
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input placeholder="Brand name" />
        </Form.Item>
        <Form.Item name="slug" label="Slug" rules={[{ required: true }]}>
          <Input placeholder="URL-friendly slug" />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} placeholder="Description" />
        </Form.Item>
        <Form.Item name="logo" label="Logo">
          <Upload
            listType="picture-card"
            beforeUpload={handleLogoUpload}
            onRemove={() => {
              setLogo(null);
              return false;
            }}
          >
            {logo ? <img src={logo} alt="logo" /> : <PictureOutlined />}
          </Upload>
        </Form.Item>
        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
          <Select
            options={[
              { value: "ACTIVE", label: "Active" },
              { value: "INACTIVE", label: "Inactive" },
            ]}
            placeholder="Select status"
          />
        </Form.Item>
        <Card title="SEO">
          <Form.Item name="seoTitle" label="Meta Title">
            <Input placeholder="Title" />
          </Form.Item>
          <Form.Item name="seoDescription" label="Meta Description">
            <Input.TextArea rows={2} placeholder="Description" />
          </Form.Item>
          <Form.Item name="seoKeywords" label="Meta Keywords">
            <Input placeholder="Keywords (comma separated)" />
          </Form.Item>
        </Card>
        <Button type="primary" htmlType="submit" size="large" block>
          {isEdit ? "Save Changes" : "Create Brand"}
        </Button>
      </Form>
    </div>
  );
};

export default BrandFormPage;
