import { useState } from "react";
import { Form, Input, Button, Card, message, Alert } from "antd";
import { LockOutlined, MailOutlined, UnlockOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../../lib/apiClient";
import styles from "./LoginPage.module.css";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onFinish = async (values: { email: string }) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
      }>("/auth/forgot-password", {
        email: values.email,
      });

      if (response.data.success) {
        setSuccess(response.data.message || "Password reset email sent");
      } else {
        setError(response.data.message || "Failed to send reset email");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card} title="Reset Password" bordered={false}>
        <div className={styles.logo}>
          <UnlockOutlined style={{ fontSize: 48 }} />
        </div>
        <p className={styles.subtitle}>
          Enter your email to receive a password reset link
        </p>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            className={styles.error}
            closable
            onClose={() => setError(null)}
          />
        )}

        {success && (
          <Alert
            message={success}
            type="success"
            showIcon
            className={styles.error}
            closable
            onClose={() => setSuccess(null)}
          />
        )}

        <Form onFinish={onFinish} layout="vertical" className={styles.form}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email" },
              { type: "email", message: "Please input a valid email" },
            ]}
          >
            <Input
              prefix={<MailOutlined className={styles.inputIcon} />}
              placeholder="Email"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.submitButton}
              loading={loading}
              block
              size="large"
            >
              Send Reset Link
            </Button>
          </Form.Item>
        </Form>

        <div className={styles.footer}>
          <Link to="/login">Back to login</Link>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;