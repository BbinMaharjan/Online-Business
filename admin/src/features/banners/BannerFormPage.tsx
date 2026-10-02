import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Card,
  Button,
  Row,
  Col,
  message,
  Upload,
} from "antd";
import { PictureOutlined } from "@ant-design/icons";
import { useAppDispatch } from "../../store/hooks";
import { setBreadcrumbs } from "../../store/uiSlice";
import {
  useBannerQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
} from "./hooks/useBanners";
import { useUploadMediaMutation } from "../media/hooks/useMedia";
import styles from "./BannerFormPage.module.css";

const BannerFormPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const uploadMutation = useUploadMediaMutation();
  const createMutation = useCreateBannerMutation();
  const updateMutation = useUpdateBannerMutation();
  const [form] = Form.useForm();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: banner, isLoading } = useBannerQuery(id || "", {
    enabled: isEditing,
  });

  useEffect(() => {
    if (isEditing && banner) {
      form.setFieldsValue({
        title: banner.title,
        description: banner.description,
        buttonText: banner.buttonText,
        buttonLink: banner.buttonLink,
        image: banner.image,
        status: banner.status,
        sortOrder: banner.sortOrder,
      });
      setImagePreview(banner.image);
    }
  }, [isEditing, banner, form]);

  const onFinish = async (values: any) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: id!, data: values });
        message.success("Banner updated");
      } else {
        await createMutation.mutateAsync(values);
        message.success("Banner created");
      }
      navigate("/banners");
    } catch {
      message.error(isEditing ? "Failed to update banner" : "Failed to create banner");
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const res = await uploadMutation.mutateAsync({
        file,
        referenceId: "banner",
        referenceType: "BANNER",
      });
      const url = res.data.data.url;
      form.setFieldValue("image", url);
      setImagePreview(url);
      message.success("Image uploaded successfully");
    } catch {
      message.error("Image upload failed");
    }
  };

  const handleImageRemove = () => {
    form.setFieldValue("image", "");
    setImagePreview(null);
    message.success("Image removed");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            {isEditing ? "Edit Banner" : "Create Banner"}
          </h1>
          <p className={styles.subtitle}>
            {isEditing ? "Update banner details" : "Add a new banner to your store"}
          </p>
        </div>
      </div>
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            status: "ACTIVE",
            sortOrder: 0,
          }}
        >
          <Card title="Basic Information">
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="title"
                  label="Title"
                  rules={[{ required: true, message: "Please enter a title" }]}
                >
                  <Input placeholder="Banner title" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="buttonText" label="Button Text">
                  <Input placeholder="Button text (optional)" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="buttonLink" label="Button Link">
                  <Input placeholder="/products or https://example.com" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="sortOrder" label="Sort Order">
                  <InputNumber min={0} placeholder="Display order" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24}>
                <Form.Item name="description" label="Description">
                  <Input.TextArea rows={3} placeholder="Banner description (optional)" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card title="Banner Image">
            <Form.Item name="image" label="Image" valuePropName="url">
              <Upload
                name="file"
                action="/api/v1/media/upload"
                listType="picture"
                showUploadList={false}
                beforeUpload={handleImageUpload}
                maxCount={1}
              >
                {imagePreview ? (
                  <div className={styles.imagePreview}>
                    <img src={imagePreview} alt="Banner" />
                    <div className={styles.imageActions}>
                      <Button type="text" onClick={handleImageRemove} danger>
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <PictureOutlined />
                    <div className={styles.uploadHint}>
                      Click to upload banner image
                    </div>
                  </>
                )}
              </Upload>
            </Form.Item>
          </Card>
          <Card title="Status">
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="status"
                  label="Status"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Form.Item style={{ marginTop: 24 }}>
            <Button type="primary" htmlType="submit" size="large">
              {isEditing ? "Update Banner" : "Create Banner"}
            </Button>
            <Button style={{ marginLeft: 16 }} onClick={() => navigate("/banners")}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default BannerFormPage;