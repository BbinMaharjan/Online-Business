import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Checkbox, Form, Input, message } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../../lib/apiClient";
import { setAuth } from "../../store/authSlice";
import { useAppDispatch } from "../../store/hooks";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFinish = async (values: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: {
          user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            role: string;
          };
        };
        accessToken: string;
        refreshToken: string;
      }>("/auth/login", {
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      });
      if (response.data?.success) {
        const { user } = response.data.data;
        const { accessToken, refreshToken } = response.data;
        const permissions = (user as any).permissions || [];

        dispatch(
          setAuth({
            admin: {
              _id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              role: user.role,
              permissions,
              avatar: (user as any).avatar,
              lastLoginAt: (user as any).lastLoginAt,
              status: (user as any).status,
              phone: (user as any).phone,
              createdAt: (user as any).createdAt,
              updatedAt: (user as any).updatedAt,
            },
            permissions,
            accessToken,
            refreshToken,
          }),
        );

        message.success("Login successful");
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card} title="Admin Portal" bordered={false}>
        <div className={styles.logo}>
          <span>🛍️</span>
        </div>
        <p className={styles.subtitle}>Sign in to your admin account</p>

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

        <Form
          onFinish={onFinish}
          layout="vertical"
          className={styles.form}
          initialValues={{ rememberMe: true }}
        >
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

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password" }]}
          >
            <Input.Password
              prefix={<LockOutlined className={styles.inputIcon} />}
              placeholder="Password"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item name="rememberMe" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
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
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <div className={styles.footer}>
          <Link to="/forgot-password">Forgot password?</Link>
          <br />
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
