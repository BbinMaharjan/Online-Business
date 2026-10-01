import {
  DeleteOutlined,
  PictureOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Form, Input, message, Row, Switch } from "antd";
import { useEffect, useState } from "react";
import { useUploadMediaMutation } from "../media/hooks/useMedia";
import {
  useSettingsQuery,
  useUpdateSettingsMutation,
} from "./hooks/useSettings";
import styles from "./SettingsPage.module.css";

const SettingsPage = () => {
  const { data: settings, isLoading } = useSettingsQuery();
  const updateMutation = useUpdateSettingsMutation();
  const [form] = Form.useForm();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (settings && !isLoading) {
      form.setFieldsValue(settings);
      if (settings.storeLogo) {
        setLogoPreview(settings.storeLogo);
      }
    }
  }, [settings, form, isLoading]);

  const uploadMutation = useUploadMediaMutation({
    onSuccess: (res) => {
      const url = res.data.data.url;
      form.setFieldValue("storeLogo", url);
      setLogoPreview(url);
      message.success("Logo uploaded successfully");
    },
    onError: () => {
      message.error("Logo upload failed");
    },
  });

  const onFinish = async (values: any) => {
    try {
      await updateMutation.mutateAsync(values);
      message.success("Settings saved");
    } catch {
      message.error("Failed to save settings");
    }
  };

  const handleLogoRemove = () => {
    form.setFieldValue("storeLogo", "");
    setLogoPreview(null);
    message.success("Logo removed");
  };

  const handleLogoFileSelect = (file: File | undefined) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      message.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const previewUrl = e.target?.result as string;
      setLogoPreview(previewUrl);
    };
    reader.readAsDataURL(file);

    uploadMutation.mutate({
      file,
      referenceId: "store-settings",
      referenceType: "SETTINGS",
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Settings</h1>
          <p className={styles.subtitle}>Configure store settings</p>
        </div>
      </div>
      {isLoading && <div>Loading settings...</div>}
      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Card title="General">
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="siteName"
                  label="Store Name"
                  rules={[
                    { required: true, message: "Please enter store name" },
                  ]}
                >
                  <Input placeholder="Store Name" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="siteDescription" label="Store Description">
                  <Input.TextArea rows={3} placeholder="Store Description" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                {/* Hidden input to keep storeLogo registered in Ant Design Form */}
                <Form.Item name="storeLogo" hidden>
                  <Input />
                </Form.Item>

                <Form.Item label="Store Logo">
                  <div className={styles.logoUploadWrapper}>
                    <input
                      type="file"
                      id="logo-upload"
                      accept="image/*"
                      className={styles.hiddenInput}
                      onChange={(e) =>
                        handleLogoFileSelect(e.target.files?.[0])
                      }
                    />
                    {logoPreview ? (
                      <div className={styles.logoPreview}>
                        <img src={logoPreview} alt="Store Logo" />
                        <div className={styles.logoActions}>
                          <Button
                            type="text"
                            onClick={handleLogoRemove}
                            danger
                            icon={<DeleteOutlined />}
                          >
                            Remove
                          </Button>
                          <Button
                            type="text"
                            onClick={() =>
                              document.getElementById("logo-upload")?.click()
                            }
                            icon={<UploadOutlined />}
                            loading={uploadMutation.isPending}
                          >
                            Change
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        type="dashed"
                        icon={<UploadOutlined />}
                        block
                        loading={uploadMutation.isPending}
                        onClick={() =>
                          document.getElementById("logo-upload")?.click()
                        }
                      >
                        <PictureOutlined style={{ marginRight: 8 }} />
                        Click to upload store logo
                      </Button>
                    )}
                  </div>
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card title="Maintenance" style={{ marginTop: 16 }}>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="maintenanceMode"
                  label="Maintenance Mode"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="maintenanceMessage"
                  label="Maintenance Message"
                >
                  <Input.TextArea
                    rows={3}
                    placeholder="Message to display during maintenance"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Form.Item style={{ marginTop: 24 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={updateMutation.isPending}
            >
              Save Settings
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SettingsPage;
