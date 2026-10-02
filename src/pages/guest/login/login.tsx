import { MyContext } from "@/components/context/app.context";
import { login } from "@/services/auth.api";
import { App, Button, Divider, Form, Grid, Input } from "antd";
import type { FormProps } from "antd";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { setAuthenticated, setUser } = useContext(MyContext);
  const { notification, message } = App.useApp();
  const navigate = useNavigate();

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const [loading, setLoading] = useState(false);

  const onFinish: FormProps<IFieldLogin>["onFinish"] = async (values) => {
    setLoading(true);

    const res = await login(values);

    if (res.data) {
      setAuthenticated(true);
      setUser(res.data.user);

      message.success("Login successful!");

      localStorage.setItem("access_token", res.data.access_token);

      navigate("/");
    } else {
      notification.error({
        message: "Failed",
        description: res.message,
        placement: "topRight",
      });

      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: screens.md ? "35vw" : "70vw",
          padding: "25px",
          marginTop: "20px",
          borderRadius: "10px",
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        }}
      >
        <Form<IFieldLogin> layout="vertical" onFinish={onFinish}>
          <h2>Đăng nhập</h2>
          <Divider />

          <Form.Item<IFieldLogin>
            label="Email"
            name="username"
            rules={[
              {
                required: true,
                message: "Vui lòng không bỏ trống!",
              },
              {
                type: "email",
                message: "Email không đúng định dạng!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<IFieldLogin>
            label="Mật khẩu"
            name="password"
            rules={[
              {
                required: true,
                message: "Vui lòng không bỏ trống!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Đăng nhập
            </Button>
          </Form.Item>

          <Divider>Or</Divider>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <span>
              Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
            </span>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
