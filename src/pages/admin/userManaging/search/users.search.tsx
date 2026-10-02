import { getStringArrayDateRange } from "@/services/helpers";
import { Button, Col, DatePicker, Form, Input, Row, Space } from "antd";
import type { FormProps } from "antd";
import UsersModal from "./users.search.modal";
import { useState } from "react";

const { RangePicker } = DatePicker;

interface IProps {
  fetchUser: (
    current: number,
    pageSize: number,
    fullName?: string,
    email?: string,
    createdAt?: string[],
    sort?: ISort,
  ) => void;
  pageSize: number;
  setCurrent: (value: number) => void;
  setSearchObject: (value: IUserSearchField) => void;
  sort: ISort;
  current: number;
  searchObject: IUserSearchField;
}

const UsersSearch = (props: IProps) => {
  const [form] = Form.useForm();
  const {
    fetchUser,
    pageSize,
    setCurrent,
    setSearchObject,
    sort,
    current,
    searchObject,
  } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onFinish: FormProps<IUserSearchField>["onFinish"] = async (values) => {
    const newQuery: IUserSearchField = {
      fullName: values.fullName ? values.fullName : "",
      email: values.email ? values.email : "",
      createdAt: values.createdAt
        ? getStringArrayDateRange(values.createdAt)
        : [],
    };

    setSearchObject(newQuery);

    await fetchUser(
      1,
      pageSize,
      newQuery.fullName,
      newQuery.email,
      newQuery.createdAt,
      sort,
    );
    setCurrent(1);
  };

  const handleReset = () => {
    //clear input
    form.resetFields();

    //setSearchObject
    setSearchObject({
      fullName: "",
      email: "",
      createdAt: [],
    });

    //fetchUser
    fetchUser(1, pageSize, "", "", [], sort);

    //setCurrent=1
    setCurrent(1);
  };

  return (
    <>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item<IUserSearchField> name="fullName" label="Full Name">
              <Input placeholder="Please enter" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item<IUserSearchField> name="email" label="Email">
              <Input placeholder="Please enter" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item<IUserSearchField> name="createdAt" label="Created At">
              <RangePicker />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
              + Add new
            </Button>
            <Space>
              <Button htmlType="button" onClick={handleReset}>
                Reset
              </Button>
              <Button htmlType="submit" type="primary">
                Search
              </Button>
            </Space>
          </div>
        </Form.Item>
      </Form>
      <UsersModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        fetchUser={fetchUser}
        pageSize={pageSize}
        sort={sort}
        current={current}
        searchObject={searchObject}
      />
    </>
  );
};

export default UsersSearch;
