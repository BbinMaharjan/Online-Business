import { useState } from "react";
import {
  Form,
  Input,
  InputNumber,
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
  useSettingsQuery,
  useUpdateSettingsMutation,
} from "./hooks/useSettings";
import { useUploadMediaMutation } from "../media/hooks/useMedia";
import styles from "./SettingsPage.module.css";

const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const { data: settings, isLoading } = useSettingsQuery();
  const updateMutation = useUpdateSettingsMutation();
  const uploadMutation = useUploadMediaMutation();
  const [form] = Form.useForm();
  const [logoPreview, setLogoPreview] = useState<string | null>(settings?.storeLogo || null);

  const onFinish = async (values: any) => {
    try {
      await updateMutation.mutateAsync(values);
      message.success("Settings saved");
    } catch {
      message.error("Failed to save");
    }
  };

  const handleLogoUpload = async (file: File) => {
    try {
      const res = await uploadMutation.mutateAsync({
        file,
        referenceId: "store-settings",
        referenceType: "SETTINGS",
      });
      const url = res.data.data.url;
      form.setFieldValue("storeLogo", url);
      setLogoPreview(url);
      message.success("Logo uploaded successfully");
    } catch {
      message.error("Logo upload failed");
    }
  };

  const handleLogoRemove = () => {
    form.setFieldValue("storeLogo", "");
    setLogoPreview(null);
    message.success("Logo removed");
  };

  const getLogoProps = () => {
    if (logoPreview) {
      return {
        src: logoPreview,
        alt: "Store Logo",
        style: { maxHeight: 120, maxWidth: 200 },
      };
    }
    return null;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Settings</h1>
          <p className={styles.subtitle}>Configure store settings</p>
        </div>
      </div>
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={settings}
        >
          <Card title="General">
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="siteName"
                  label="Store Name"
                  rules={[{ required: true }]}
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
                <Form.Item name="storeLogo" label="Store Logo" valuePropName="url">
                  <Upload
                    name="file"
                    action="/api/upload"
                    listType="picture"
                    showUploadList={false}
                    beforeUpload={handleLogoUpload}
                    maxCount={1}
                  >
                    {logoPreview ? (
                      <div className={styles.logoPreview}>
                        <img src={logoPreview} alt="Store Logo" />
                        <div className={styles.logoActions}>
                          <Button type="text" onClick={handleLogoRemove} danger>
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <PictureOutlined />
                        <div className={styles.uploadHint}>
                          Click to upload store logo
                        </div>
                      </>
                    )}
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card title="Maintenance">
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
            <Button type="primary" htmlType="submit" size="large">
              Save Settings
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SettingsPage;