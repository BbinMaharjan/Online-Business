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
  useCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "./hooks/useCategories";
import { useUploadMediaMutation } from "../media/hooks/useMedia";
import { PermissionGuard } from "../../components/common/PermissionGuard";
import styles from "./CategoryFormPage.module.css";

const CategoryFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isEdit = !!id;
  const { data: categoryResponse, isLoading } = useCategoryQuery(id || "");
  const category = categoryResponse?.data;
  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation();
  const uploadMutation = useUploadMediaMutation();
  const [image, setImage] = useState<string | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEdit && category) {
      form.setFieldsValue({
        name: category.name,
        slug: category.slug,
        description: category.description,
        parentId: category.parentId,
        status: category.status,
        sortOrder: category.sortOrder,
        seoTitle: category.seo?.title,
        seoDescription: category.seo?.description,
        seoKeywords: category.seo?.keywords?.join(", "),
      });
      setImage(category.image);
      dispatch(
        setBreadcrumbs([
          { label: "Categories", path: "/categories" },
          { label: isEdit ? "Edit Category" : "Create Category" },
        ]),
      );
    } else {
      dispatch(
        setBreadcrumbs([
          { label: "Categories", path: "/categories" },
          { label: "Create Category" },
        ]),
      );
    }
  }, [category, isEdit, dispatch]);

  const handleImageUpload = async (file: File) => {
    try {
      const res = await uploadMutation.mutateAsync({
        file,
        referenceId: id || "temp",
        referenceType: "CATEGORY",
      });
      setImage(res.data.url);
      return res.data.url;
    } catch {
      message.error("Upload failed");
      throw new Error("Upload failed");
    }
  };

  const onFinish = async (values: any) => {
    try {
      const data = {
        ...values,
        image,
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
      message.success(isEdit ? "Category updated" : "Category created");
      navigate("/categories");
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
          onClick={() => navigate("/categories")}
        >
          Back
        </Button>
        <h1 className={styles.title}>
          {isEdit ? "Edit Category" : "Create Category"}
        </h1>
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className={styles.form}
        initialValues={{ status: "ACTIVE", sortOrder: 0 }}
      >
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input placeholder="Category name" />
        </Form.Item>
        <Form.Item name="slug" label="Slug" rules={[{ required: true }]}>
          <Input placeholder="URL-friendly slug" />
        </Form.Item>
        <Form.Item name="parentId" label="Parent Category">
          <Select
            placeholder="Select parent"
            options={[]}
            allowClear
            showSearch
          />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} placeholder="Description" />
        </Form.Item>
        <Form.Item name="image" label="Image">
          <Upload
            listType="picture-card"
            beforeUpload={handleImageUpload}
            onRemove={() => {
              setImage(null);
              return false;
            }}
          >
            {image ? <img src={image} alt="category" /> : <PictureOutlined />}
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
        <Form.Item name="sortOrder" label="Sort Order">
          <InputNumber min={0} style={{ width: "100%" }} />
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
          {isEdit ? "Save Changes" : "Create Category"}
        </Button>
      </Form>
    </div>
  );
};

export default CategoryFormPage;
