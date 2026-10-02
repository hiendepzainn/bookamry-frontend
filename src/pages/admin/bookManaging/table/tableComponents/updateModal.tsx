import { updateBook, uploadFileImage } from "@/services/book.api";
import { PlusOutlined } from "@ant-design/icons";
import {
  App,
  Col,
  Divider,
  Form,
  FormProps,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Upload,
  UploadFile,
} from "antd";
import { UploadChangeParam } from "antd/es/upload";
import { useEffect, useState } from "react";

interface IProps {
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (value: boolean) => void;
  dataUpdate: IBookTable;
  categoryList: IBookCategory[];
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
}

const BookUpdateModal = (props: IProps) => {
  const {
    dataUpdate,
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    categoryList,
    current,
    pageSize,
    sort,
    searchObject,
    fetchBooks,
  } = props;

  const { message } = App.useApp();

  const [form] = Form.useForm<IBookCreate>();

  //list for </UPLOAD>
  const [listSlider, setListSlider] = useState<UploadFile[]>([]);
  const [listThumbnail, setListThumbnail] = useState<UploadFile[]>([]);

  const [isThumbnailUploaded, setIsThumbnailUploaded] = useState(true);

  const onFinish: FormProps<IBookCreate>["onFinish"] = async (values) => {
    //SLIDER
    const listFileNameSlider: string[] = [];

    for (const item of listSlider) {
      const fileName = await getImageNameFromFile(item);
      listFileNameSlider.push(fileName);
    }

    //THUMBNAIL
    const fileNameThumbnail = await getImageNameFromFile(listThumbnail[0]);

    //UPDATE
    const res = await updateBook(
      dataUpdate._id,
      values.category,
      values.quantity,
      values.price,
      values.author,
      values.mainText,
      listFileNameSlider,
      fileNameThumbnail,
    );

    if (res.data) {
      message.success("Update Success!!!");
      //close modal
      setIsUpdateModalOpen(false);

      //reload table
      await fetchBooks(
        current,
        pageSize,
        searchObject.mainText,
        searchObject.author,
        sort,
      );
    }
  };

  //get fileName from URL
  const getImageNameFromFile = async (file: UploadFile): Promise<string> => {
    if (file.url) {
      const fileName = file.url.split("/").pop();
      if (fileName) return fileName;
    }
    const res = await uploadFileImage(file.originFileObj as File);
    if (res.data) {
      return res.data.fileUploaded;
    }
    return "";
  };

  useEffect(() => {
    //fill text fields
    form.setFieldsValue({
      mainText: dataUpdate.mainText,
      author: dataUpdate.author,
      category: dataUpdate.category,
      price: dataUpdate.price,
      quantity: dataUpdate.quantity,
    });

    //fill Slider
    const listSlider: UploadFile[] = [];

    dataUpdate.slider.forEach((item, index) => {
      listSlider.push({
        uid: index.toString(),
        name: "image.png",
        status: "done",
        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
      });
    });

    setListSlider(listSlider);

    //fill Thumbnail
    setIsThumbnailUploaded(true);

    form.setFieldValue("thumbnail", "hehe");

    setListThumbnail([
      {
        uid: "0",
        name: "image.png",
        status: "done",
        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataUpdate.thumbnail}`,
      },
    ]);
  }, [dataUpdate]);

  return (
    <Modal
      forceRender
      width="60vw"
      title="Update Book"
      open={isUpdateModalOpen}
      okText="Update"
      cancelText="Hủy"
      onOk={() => form.submit()}
      onCancel={() => {
        setIsUpdateModalOpen(false);
        form.resetFields();
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
            >
              <Upload
                accept=".jpg,.JPG,.jpeg,.JPEG,.png,.PNG"
                beforeUpload={() => false}
                fileList={listThumbnail}
                listType="picture-card"
                onChange={(e: UploadChangeParam<UploadFile>) => {
                  setListThumbnail(e.fileList);
                  setIsThumbnailUploaded(!isThumbnailUploaded);
                  if (isThumbnailUploaded)
                    form.setFieldValue("thumbnail", undefined);
                }}
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
            <Form.Item<IBookCreate> label="Ảnh Slider" name="slider">
              <Upload
                accept=".jpg,.JPG,.jpeg,.JPEG,.png,.PNG"
                multiple={true}
                beforeUpload={() => false}
                fileList={listSlider}
                listType="picture-card"
                onChange={(e: UploadChangeParam<UploadFile>) =>
                  setListSlider(e.fileList)
                }
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

export default BookUpdateModal;
