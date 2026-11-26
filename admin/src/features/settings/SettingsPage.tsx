import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Skeleton,
  Switch,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import {
  useSettingsQuery,
  useUpdateSettingsMutation,
} from "./hooks/useSettings";
import { useImageUpload } from "@/hooks/useImageUpload";
import styles from "./SettingsPage.module.css";

const SettingsPage = () => {
  const { data: settings, isLoading } = useSettingsQuery();
  const updateMutation = useUpdateSettingsMutation();
  const [form] = Form.useForm();
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [faviconPreview, setFaviconPreview] = useState<string>("");
  const [logoFileList, setLogoFileList] = useState<any[]>([]);
  const [faviconFileList, setFaviconFileList] = useState<any[]>([]);

  const logoUpload = useImageUpload({
    type: "settings",
    settingsType: "storeLogo",
    onSuccess: (url) => {
      form.setFieldValue("storeLogo", url);
      setLogoPreview(url);
      setLogoFileList([
        {
          uid: "logo",
          name: "store-logo",
          url,
          status: "done",
        },
      ]);
    },
  });

  const faviconUpload = useImageUpload({
    type: "settings",
    settingsType: "favicon",
    onSuccess: (url) => {
      form.setFieldValue("favicon", url);
      setFaviconPreview(url);
      setFaviconFileList([
        {
          uid: "favicon",
          name: "favicon",
          url,
          status: "done",
        },
      ]);
    },
  });

  const handleLogoChange = async (info: any) => {
    const file = info.file?.originFileObj || info.file;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    if (info.fileList) {
      setLogoFileList(info.fileList);
    }

    await logoUpload.upload(file);
  };

  const handleFaviconChange = async (info: any) => {
    const file = info.file?.originFileObj || info.file;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setFaviconPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    if (info.fileList) {
      setFaviconFileList(info.fileList);
    }

    await faviconUpload.upload(file);
  };

  const onFinish = async () => {
    try {
      const values = await form.validateFields();
      await updateMutation.mutateAsync(values);
      message.success("Settings saved");
    } catch (error) {
      console.error("Form validation failed:", error);
      message.error("Failed to save settings");
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Settings</h1>
          <p className={styles.subtitle}>Configure store settings</p>
        </div>
      </div>
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 10 }} />
      ) : (
        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            disabled={updateMutation.isPending}
            initialValues={{
              siteName: settings?.data?.siteName ?? "",
              siteDescription: settings?.data?.siteDescription ?? "",
              maintenanceMode: settings?.data?.maintenanceMode ?? false,
              maintenanceMessage: settings?.data?.maintenanceMessage ?? "",
              storeLogo: settings?.data?.storeLogo ?? "",
              favicon: settings?.data?.favicon ?? "",
            }}
          >
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
                  <Form.Item label="Store Logo" name="storeLogo">
                    <Upload
                      listType="picture-circle"
                      fileList={logoFileList}
                      onChange={handleLogoChange}
                      beforeUpload={() => false}
                      maxCount={1}
                      showUploadList={false}
                    >
                      {logoFileList.length >= 1 ? (
                        <img
                          src={logoPreview}
                          alt="preview"
                          style={{ width: "100%" }}
                        />
                      ) : (
                        uploadButton
                      )}
                    </Upload>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Favicon" name="favicon">
                    <Upload
                      listType="picture-circle"
                      fileList={faviconFileList}
                      onChange={handleFaviconChange}
                      beforeUpload={() => false}
                      maxCount={1}
                      showUploadList={false}
                    >
                      {faviconFileList.length >= 1 ? (
                        <img
                          src={faviconPreview}
                          alt="preview"
                          style={{ width: "100%" }}
                        />
                      ) : (
                        uploadButton
                      )}
                    </Upload>
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
      )}
    </div>
  );
};

export default SettingsPage;
