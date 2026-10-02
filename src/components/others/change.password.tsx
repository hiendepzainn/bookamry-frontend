import { changePassword } from "@/services/user.api";
import { App, Button, Col, Form, FormProps, Grid, Input, Row } from "antd";
import { useEffect } from "react";

interface IProps {
  userModal: IDataLoginUser;
}

const ChangePassword = (props: IProps) => {
  const { userModal } = props;

  const { notification } = App.useApp();

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const [form] = Form.useForm<IFieldChangePassword>();

  const onFinish: FormProps<IFieldChangePassword>["onFinish"] = async (
    values,
  ) => {
    const res = await changePassword(
      values.email,
      values.currentPassword,
      values.newPassword,
    );

    if (res.data) {
      //noti
      notification.success({
        message: "Success",
        description: "Đổi mật khẩu thành công!",
      });

      //clear field
      form.setFieldsValue({ currentPassword: "", newPassword: "" });
    } else {
      notification.error({ message: "Error", description: res.message });
    }
  };

  useEffect(() => {
    form.setFieldValue("email", userModal.email);
  }, [userModal]);

  return (
    <Row>
      <Col span={screens.md ? 12 : 24}>
        <Form onFinish={onFinish} form={form} layout="vertical">
          <Form.Item<IFieldChangePassword> name={"email"} label="Email">
            <Input disabled />
          </Form.Item>

          <Form.Item<IFieldChangePassword>
            name={"currentPassword"}
            label="Mật khẩu hiện tại"
            rules={[
              {
                validator: (_, value) => {
                  if (!value || value.trim() === "") {
                    return Promise.reject(
                      new Error("Vui lòng không bỏ trống!"),
                    );
                  }

                  if (value.length < 6) {
                    return Promise.reject(
                      new Error("Mật khẩu phải có ít nhất 6 ký tự!"),
                    );
                  }

                  if (value.length > 25) {
                    return Promise.reject(
                      new Error("Mật khẩu không được vượt quá 25 ký tự!"),
                    );
                  }

                  if (!/[A-Z]/.test(value)) {
                    return Promise.reject(
                      new Error(
                        "Mật khẩu phải chứa ít nhất 1 chữ cái viết hoa!",
                      ),
                    );
                  }

                  if (!/[a-z]/.test(value)) {
                    return Promise.reject(
                      new Error(
                        "Mật khẩu phải chứa ít nhất 1 chữ cái viết thường!",
                      ),
                    );
                  }

                  if (!/\d/.test(value)) {
                    return Promise.reject(
                      new Error("Mật khẩu phải chứa ít nhất 1 chữ số!"),
                    );
                  }

                  if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
                    return Promise.reject(
                      new Error("Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt!"),
                    );
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<IFieldChangePassword>
            name={"newPassword"}
            label="Mật khẩu mới"
            rules={[
              {
                validator: (_, value) => {
                  if (!value || value.trim() === "") {
                    return Promise.reject(
                      new Error("Vui lòng không bỏ trống!"),
                    );
                  }

                  if (value.length < 6) {
                    return Promise.reject(
                      new Error("Mật khẩu phải có ít nhất 6 ký tự!"),
                    );
                  }

                  if (value.length > 25) {
                    return Promise.reject(
                      new Error("Mật khẩu không được vượt quá 25 ký tự!"),
                    );
                  }

                  if (!/[A-Z]/.test(value)) {
                    return Promise.reject(
                      new Error(
                        "Mật khẩu phải chứa ít nhất 1 chữ cái viết hoa!",
                      ),
                    );
                  }

                  if (!/[a-z]/.test(value)) {
                    return Promise.reject(
                      new Error(
                        "Mật khẩu phải chứa ít nhất 1 chữ cái viết thường!",
                      ),
                    );
                  }

                  if (!/\d/.test(value)) {
                    return Promise.reject(
                      new Error("Mật khẩu phải chứa ít nhất 1 chữ số!"),
                    );
                  }

                  if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
                    return Promise.reject(
                      new Error("Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt!"),
                    );
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      </Col>
      <Col span={14}></Col>
    </Row>
  );
};

export default ChangePassword;
