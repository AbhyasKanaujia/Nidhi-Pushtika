import React from "react";
import { Form, Input, Button, message, Typography } from "antd";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const { Title } = Typography;

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect param from query string or default to "/"
  const params = new URLSearchParams(location.search);
  const redirect = params.get("redirect") || "/";

  React.useEffect(() => {
    if (user) {
      // If already authenticated, redirect immediately
      navigate(redirect, { replace: true });
    }
  }, [user, navigate, redirect]);

  const onFinish = async (values) => {
    const { email, password } = values;
    const result = await login(email, password);
    if (result.success) {
      message.success("Login successful!");
      navigate(redirect, { replace: true });
    } else {
      message.error(result.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <Title level={2} className="text-center mb-6">
        Login
      </Title>
      <Form
        name="login"
        onFinish={onFinish}
        layout="vertical"
        initialValues={{ email: "", password: "" }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input placeholder="Email" autoComplete="username" id="login_email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Password" autoComplete="current-password" id="login_password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Log In
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
