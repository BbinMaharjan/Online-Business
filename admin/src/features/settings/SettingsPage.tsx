import { useState } from "react";
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
} from "antd";
import { useAppDispatch } from "../../store/hooks";
import { setBreadcrumbs } from "../../store/uiSlice";
import {
  useSettingsQuery,
  useUpdateSettingsMutation,
} from "./hooks/useSettings";
import styles from "./SettingsPage.module.css";

const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const { data: settings, isLoading } = useSettingsQuery();
  const updateMutation = useUpdateSettingsMutation();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      await updateMutation.mutateAsync(values);
      message.success("Settings saved");
    } catch {
      message.error("Failed to save");
    }
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
                <Form.Item name="currency" label="Currency">
                  <Select
                    options={["USD", "EUR", "GBP", "INR"].map((v) => ({
                      value: v,
                      label: v,
                    }))}
                    placeholder="Select currency"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="timezone" label="Timezone">
                  <Select
                    options={[
                      "UTC",
                      "America/New_York",
                      "Europe/London",
                      "Asia/Tokyo",
                    ].map((v) => ({ value: v, label: v }))}
                    placeholder="Select timezone"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="language" label="Language">
                  <Select
                    options={["en", "es", "fr", "de"].map((v) => ({
                      value: v,
                      label: v,
                    }))}
                    placeholder="Select language"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card title="Tax & Shipping">
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="taxEnabled"
                  label="Enable Tax"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="taxRate" label="Tax Rate (%)">
                  <InputNumber min={0} max={100} precision={2} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="shippingEnabled"
                  label="Enable Shipping"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="freeShippingThreshold"
                  label="Free Shipping Threshold"
                >
                  <InputNumber
                    min={0}
                    precision={2}
                    placeholder="0 for no threshold"
                  />
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
          <Form.Item wrapperStyle={{ marginTop: 24 }}>
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
