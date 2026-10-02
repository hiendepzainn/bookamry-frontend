import { createNewUser } from "@/services/user.api";
import { App, Divider, Form, Input, Modal } from "antd";
import type { FormProps } from "antd";

interface IProps {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  fetchUser: (
    current: number,
    pageSize: number,
    fullName?: string,
    email?: string,
    createdAt?: string[],
    sort?: ISort,
  ) => void;
  pageSize: number;
  sort: ISort;
  current: number;
  searchObject: IUserSearchField;
}

const UsersModal = (props: IProps) => {
  const {
    isModalOpen,
    setIsModalOpen,
    fetchUser,
    current,
    pageSize,
    searchObject,
    sort,
  } = props;
  const [form] = Form.useForm();
  const { notification } = App.useApp();

  const onFinish: FormProps<IFieldRegister>["onFinish"] = async (values) => {
    console.log("Success:", values);
    const res = await createNewUser(values);

    if (res.data) {
      // reset modal
      form.resetFields();

      // close modal
      setIsModalOpen(false);

      // display message
      notification.success({ message: "Create Successful!" });

      // fetchUser
      fetchUser(
        current,
        pageSize,
        searchObject.fullName,
        searchObject.email,
        searchObject.createdAt,
        sort,
      );
    } else {
      //display message
      notification.success({ message: res.message });
    }
  };

  return (
    <Modal
      title="Thêm mới người dùng"
      closable={{ "aria-label": "Custom Close Button" }}
      open={isModalOpen}
      onOk={() => {
        form.submit();
      }}
      onCancel={() => setIsModalOpen(false)}
      okText="Tạo mới"
      cancelText="Hủy"
    >
      <Divider />
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item<IFieldRegister>
          label="Tên hiển thị"
          name="fullName"
          rules={[
            {
              required: true,
              message: "Vui lòng không bỏ trống!",
            },
            {
              pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
              message: "Chỉ được phép nhập chữ cái!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item<IFieldRegister>
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Vui lòng không bỏ trống email!",
            },
            {
              type: "email",
              message: "Email không đúng định dạng!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item<IFieldRegister>
          label="Password"
          name="password"
          rules={[
            {
              validator: (_, value) => {
                if (!value || value.trim() === "") {
                  return Promise.reject(
                    new Error("Vui lòng không bỏ trống mật khẩu!"),
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
                    new Error("Mật khẩu phải chứa ít nhất 1 chữ cái viết hoa!"),
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

        <Form.Item<IFieldRegister>
          label="Số điện thoại"
          name="phone"
          rules={[
            {
              validator: (_, value) => {
                if (!value || value.trim() === "") {
                  return Promise.reject(
                    new Error("Vui lòng không bỏ trống số điện thoại!"),
                  );
                }

                if (!/^\d+$/.test(value)) {
                  return Promise.reject(
                    new Error("Số điện thoại chỉ được phép chứa các chữ số!"),
                  );
                }

                if (value.length !== 10) {
                  return Promise.reject(
                    new Error("Số điện thoại phải có đúng 10 chữ số!"),
                  );
                }

                const validPrefixes = ["03", "05", "07", "08", "09"];
                const prefix = value.substring(0, 2);
                if (!validPrefixes.includes(prefix)) {
                  return Promise.reject(
                    new Error(
                      "Đầu số điện thoại phải bắt đầu bằng 03, 05, 07, 08, 09!",
                    ),
                  );
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UsersModal;
