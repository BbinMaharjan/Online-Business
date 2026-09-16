import { useState } from "react";
import { Form, Input, Button, Card, message, Alert, Checkbox } from "antd";
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../../lib/apiClient";
import { useAppDispatch } from "../../store/hooks";
import { setAuth } from "../../store/authSlice";
import styles from "./LoginPage.module.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onFinish = async (values: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const regResponse = await apiClient.post<{
        success: boolean;
        message: string;
        data: { admin: any; accessToken: string; refreshToken: string };
      }>("/auth/register", {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      });

      if (!regResponse.data.success) {
        setError(regResponse.data.message || "Registration failed");
        return;
      }

      const loginResponse = await apiClient.post<{
        success: boolean;
        message: string;
        data: { admin: any; accessToken: string; refreshToken: string };
      }>("/auth/login", {
        email: values.email,
        password: values.password,
        rememberMe: true,
      });

      if (loginResponse.data.success) {
        const { admin, accessToken, refreshToken } = loginResponse.data.data;
        const permissions = admin.permissions || [];

        dispatch(
          setAuth({
            admin: {
              _id: admin._id,
              firstName: admin.firstName,
              lastName: admin.lastName,
              email: admin.email,
              role: admin.role,
              permissions,
              avatar: admin.avatar,
              lastLoginAt: admin.lastLoginAt,
              status: admin.status,
              phone: admin.phone,
              createdAt: admin.createdAt,
              updatedAt: admin.updatedAt,
            },
            permissions,
            accessToken,
            refreshToken,
          }),
        );

        message.success("Registration successful! Welcome to Admin Portal.");
        navigate("/dashboard");
      } else {
        setError(loginResponse.data.message || "Auto-login failed. Please sign in manually.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card} title="Create Admin Account" bordered={false}>
        <div className={styles.logo}>
          <UserOutlined style={{ fontSize: 48 }} />
        </div>
        <p className={styles.subtitle}>Register for admin portal access</p>

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
            name="firstName"
            rules={[{ required: true, message: "Please input your first name" }]}
          >
            <Input
              prefix={<UserOutlined className={styles.inputIcon} />}
              placeholder="First Name"
              autoComplete="given-name"
            />
          </Form.Item>

          <Form.Item
            name="lastName"
            rules={[{ required: true, message: "Please input your last name" }]}
          >
            <Input
              prefix={<UserOutlined className={styles.inputIcon} />}
              placeholder="Last Name"
              autoComplete="family-name"
            />
          </Form.Item>

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
            rules={[
              { required: true, message: "Please input your password" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className={styles.inputIcon} />}
              placeholder="Password"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className={styles.inputIcon} />}
              placeholder="Confirm Password"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item name="terms" valuePropName="checked">
            <Checkbox>
              I agree to the <a href="/terms">Terms of Service</a> and{" "}
              <a href="/privacy">Privacy Policy</a>
            </Checkbox>
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
              Create Account
            </Button>
          </Form.Item>
        </Form>

        <div className={styles.footer}>
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;