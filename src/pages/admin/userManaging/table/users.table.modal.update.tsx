import { updateUser } from "@/services/user.api";
import { App, Divider, Form, Input, Modal } from "antd";
import type { FormProps } from "antd";
import { useEffect } from "react";

interface IProps {
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (value: boolean) => void;
  updateData: IUserTable;
  current: number;
  pageSize: number;
  searchObject: IUserSearchField;
  sort: ISort;
  fetchUser: (
    current: number,
    pageSize: number,
    fullName?: string,
    email?: string,
    createdAt?: string[],
    sort?: ISort,
  ) => void;
  setUpdateData: (value: IUserTable) => void;
}

const UpdateModal = (props: IProps) => {
  const { message } = App.useApp();
  const {
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    updateData,
    current,
    pageSize,
    searchObject,
    sort,
    fetchUser,
    setUpdateData,
  } = props;
  const [form] = Form.useForm<IFieldUpdate>();

  const onFinish: FormProps<IFieldUpdate>["onFinish"] = async (values) => {
    console.log(values);

    const res = await updateUser(values);
    if (res.data) {
      // notification
      message.success("Update thành công!");

      //close modal
      setIsUpdateModalOpen(false);

      //reloadTable
      fetchUser(
        current,
        pageSize,
        searchObject.fullName,
        searchObject.email,
        searchObject.createdAt,
        sort,
      );
    } else {
      message.error("Có lỗi xảy ra!");
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      id: updateData._id,
      email: updateData.email,
      fullName: updateData.fullName,
      phone: updateData.phone,
    });
  }, [updateData]);

  return (
    <Modal
      title="Cập nhật người dùng"
      closable={{ "aria-label": "Custom Close Button" }}
      open={isUpdateModalOpen}
      onOk={() => {
        form.submit();
      }}
      onCancel={() => {
        setIsUpdateModalOpen(false);
        setUpdateData({
          _id: "",
          fullName: "",
          email: "",
          phone: "",
          role: "",
          avatar: "",
          isActive: true,
          type: "",
          createdAt: "",
          updatedAt: "",
          __v: 0,
        });
      }}
      okText="Update"
      cancelText="Hủy"
      forceRender
    >
      <Divider />
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <div style={{ display: "none" }}>
          <Form.Item<IFieldUpdate> label="ID" name="id">
            <Input />
          </Form.Item>
        </div>

        <Form.Item<IFieldUpdate>
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
          <Input disabled />
        </Form.Item>

        <Form.Item<IFieldUpdate>
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

        <Form.Item<IFieldUpdate>
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

export default UpdateModal;
