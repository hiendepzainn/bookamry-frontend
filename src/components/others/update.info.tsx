import { logout } from "@/services/auth.api";
import { updateInfoUser, uploadFileAvatar } from "@/services/user.api";
import { UploadOutlined } from "@ant-design/icons";
import {
  App,
  Button,
  Col,
  Form,
  FormProps,
  Input,
  Row,
  Upload,
  UploadFile,
} from "antd";
import { UploadChangeParam } from "antd/es/upload";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../context/app.context";

interface IProps {
  userModal: IDataLoginUser;
  setIsModalUserInfoOpen: (value: boolean) => void;
}

const UpdateInfo = (props: IProps) => {
  const { userModal, setIsModalUserInfoOpen } = props;

  const { setAuthenticated, setUser, setCart } = useContext(MyContext);

  const [form] = Form.useForm<IUserUpdateInfo>();

  const { message } = App.useApp();

  const [listAvatar, setListAvatar] = useState<UploadFile[]>([]);

  const changeUpload = (info: UploadChangeParam<UploadFile>) => {
    if (info.fileList) setListAvatar(info.fileList);
  };

  const onFinish: FormProps<IUserUpdateInfo>["onFinish"] = async (values) => {
    let newAvatar: string = "";

    //check upload avatar?
    if (listAvatar[0].url) {
      newAvatar = userModal.avatar;
    } else {
      if (listAvatar[0].originFileObj) {
        const res = await uploadFileAvatar(listAvatar[0].originFileObj);
        if (res.data) {
          newAvatar = res.data.fileUploaded;
        }
      }
    }

    //update info
    const res = await updateInfoUser(
      userModal.id,
      values.fullName,
      values.phone,
      newAvatar,
    );

    if (res.data) {
      message.success("Update thành công, vui lòng Login lại!");

      setIsModalUserInfoOpen(false);

      //LOGOUT
      const res2 = await logout();
      if (res2.data) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("cart");
        setCart([]);
        setAuthenticated(false);
        setUser({
          avatar: "",
          email: "",
          fullName: "",
          id: "",
          phone: "",
          role: "",
        });
      }
    } else {
      message.error("Có lỗi xảy ra!");
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      email: userModal.email,
      fullName: userModal.fullName,
      phone: userModal.phone,
    });

    setListAvatar([
      {
        uid: "1",
        name: "image.png",
        status: "done",
        url: `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${userModal.avatar}`,
      },
    ]);
  }, [userModal]);

  return (
    <Row>
      <Col span={10}>
        <Upload
          showUploadList={{ showRemoveIcon: false, showPreviewIcon: false }}
          fileList={listAvatar}
          listType="picture-circle"
        ></Upload>

        <br />

        <Upload
          fileList={[]}
          beforeUpload={() => {
            return false;
          }}
          onChange={changeUpload}
        >
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </Col>
      <Col span={14}>
        <Form onFinish={onFinish} form={form} layout="vertical">
          <Form.Item<IUserUpdateInfo> name={"email"} label="Email">
            <Input disabled />
          </Form.Item>

          <Form.Item<IUserUpdateInfo>
            name={"fullName"}
            label="Tên hiển thị"
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

          <Form.Item<IUserUpdateInfo>
            name={"phone"}
            label="Số điện thoại"
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

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default UpdateInfo;
