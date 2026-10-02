import { createNewBook, uploadFileImage } from "@/services/book.api";
import { PlusOutlined } from "@ant-design/icons";
import {
  App,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Upload,
} from "antd";
import { useState } from "react";
import type { FormProps, UploadFile } from "antd";
import { RcFile, UploadChangeParam } from "antd/es/upload";

interface IProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (vue: boolean) => void;
  current: number;
  pageSize: number;
  sort: ISort;
  searchObject: IBookSearchField;
  fetchBooks: (
    current: number,
    pageSize: number,
    mainText: string,
    author: string,
    sort: ISort,
  ) => void;
  categoryList: IBookCategory[];
}

const BookCreateModal = (props: IProps) => {
  const {
    isCreateModalOpen,
    setIsCreateModalOpen,
    current,
    pageSize,
    sort,
    searchObject,
    fetchBooks,
    categoryList,
  } = props;

  const { message } = App.useApp();

  const [form] = Form.useForm();

  const [isThumbnailUploaded, setIsThumbnailUploaded] = useState(false);

  const onFinish: FormProps<IBookCreate>["onFinish"] = async (values) => {
    console.log("Success:", values);

    //upload thumbnail
    let thumbnail = "";
    const res1 = await uploadFileImage(values.thumbnail[0].originFileObj);
    if (res1.data) {
      thumbnail = res1.data.fileUploaded;
    }

    //upload slider
    const sliderList: string[] = [];
    for (const item of values.slider) {
      const res = await uploadFileImage(item.originFileObj);
      if (res.data) {
        sliderList.push(res.data.fileUploaded);
      }
    }

    //create new book
    const res2 = await createNewBook(
      values.mainText,
      values.author,
      values.price,
      values.quantity,
      values.category,
      thumbnail,
      sliderList,
    );

    if (res2.data) {
      message.success("create book success!!!");

      //close & reset
      setIsCreateModalOpen(false);
      form.resetFields();

      //reset Upload
      setIsThumbnailUploaded(false);

      //reload Table
      await fetchBooks(
        current,
        pageSize,
        searchObject.mainText,
        searchObject.author,
        sort,
      );
    }
  };

  const beforeUploadThumbnail = (file: RcFile) => {
    if (file.size > 2097152) {
      message.error("File must < 2MB");
      return Upload.LIST_IGNORE;
    }
    setIsThumbnailUploaded(true);
    return false;
  };

  const beforeUploadSlider = (file: RcFile) => {
    if (file.size > 2097152) {
      message.error(`Invalid file size: ${file.name}`);
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  const normFile = (e: UploadChangeParam<UploadFile>) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <Modal
      width="60vw"
      title="Thêm mới Book"
      open={isCreateModalOpen}
      okText="Tạo mới"
      cancelText="Hủy"
      onOk={() => form.submit()}
      onCancel={() => {
        setIsCreateModalOpen(false);
      }}
    >
      <Divider />

      <Form onFinish={onFinish} form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item<IBookCreate>
              label="Tên sách"
              name="mainText"
              rules={[
                {
                  required: true,
                  message: "Vui lòng không bỏ trống!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item<IBookCreate>
              label="Tác giả"
              name="author"
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
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item<IBookCreate>
              label="Giá tiền"
              name="price"
              rules={[
                {
                  required: true,
                  message: "Vui lòng không bỏ trống!",
                },
              ]}
            >
              <InputNumber
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) =>
                  value?.replace(/\$\s?|(,*)/g, "") as unknown as number
                }
                addonAfter="đ"
              />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item<IBookCreate>
              label="Thể loại"
              name="category"
              rules={[
                {
                  required: true,
                  message: "Vui lòng không bỏ trống!",
                },
              ]}
            >
              <Select options={categoryList} />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item<IBookCreate>
              label="Số lượng"
              name="quantity"
              rules={[
                {
                  required: true,
                  message: "Vui lòng không bỏ trống!",
                },
              ]}
            >
              <InputNumber />
            </Form.Item>
          </Col>

          <Col span={6}></Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item<IBookCreate>
              label="Ảnh Thumbnail"
              name="thumbnail"
              rules={[
                {
                  required: true,
                  message: "Vui lòng không bỏ trống!",
                },
              ]}
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload
                accept=".jpg,.JPG,.jpeg,.JPEG,.png,.PNG"
                onRemove={() => setIsThumbnailUploaded(false)}
                beforeUpload={beforeUploadThumbnail}
                listType="picture-card"
                showUploadList={{ showPreviewIcon: false }}
              >
                {isThumbnailUploaded ? (
                  ""
                ) : (
                  <div>
                    <PlusOutlined />
                    <div>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item<IBookCreate>
              label="Ảnh Slider"
              name="slider"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              initialValue={[]}
            >
              <Upload
                accept=".jpg,.JPG,.jpeg,.JPEG,.png,.PNG"
                multiple={true}
                beforeUpload={beforeUploadSlider}
                listType="picture-card"
                showUploadList={{ showPreviewIcon: false }}
              >
                <div>
                  <PlusOutlined />
                  <div>Upload</div>
                </div>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default BookCreateModal;
