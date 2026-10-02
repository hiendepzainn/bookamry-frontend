import { formatDate } from "@/services/helpers";
import {
  DeleteTwoTone,
  EditTwoTone,
  ExportOutlined,
  ImportOutlined,
} from "@ant-design/icons";
import { App, Button, Pagination, Popconfirm, Space, Table } from "antd";
import type { TableProps } from "antd";
import { useEffect, useState } from "react";
import UsersDrawer from "./users.table.drawer";
import ImportModal from "./users.table.modal.import";
import { CSVLink } from "react-csv";
import UpdateModal from "./users.table.modal.update";
import { deleteUser } from "@/services/user.api";

interface IProps {
  data: IUserTable[];
  total: number;
  tableLoading: boolean;
  fetchUser: (
    current: number,
    pageSize: number,
    fullName?: string,
    email?: string,
    createdAt?: string[],
    sort?: ISort,
  ) => void;
  pageSize: number;
  setPageSize: (value: number) => void;
  current: number;
  setCurrent: (value: number) => void;
  searchObject: IUserSearchField;
  setSort: (value: ISort) => void;
  sort: ISort;
}

const UsersTable = (props: IProps) => {
  const {
    data,
    total,
    tableLoading,
    fetchUser,
    pageSize,
    setPageSize,
    current,
    setCurrent,
    searchObject,
    setSort,
    sort,
  } = props;

  const { message } = App.useApp();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userDrawer, setUserDrawer] = useState<IUserTable>({
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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateData, setUpdateData] = useState<IUserTable>({
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

  const columns: TableProps<IUserTable>["columns"] = [
    {
      title: "",
      key: "order",
      render: (value, record, index) => {
        return <div>{(current - 1) * pageSize + index + 1}</div>;
      },
    },
    {
      title: "ID",
      dataIndex: "_id",
      key: "id",
      render: (value, record) => {
        return <a onClick={() => openDrawer(record)}>{value}</a>;
      },
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      sorter: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: true,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) => {
        return <div>{formatDate(value)}</div>;
      },
      sorter: true,
    },
    {
      title: "Action",
      key: "action",
      render: (value, record) => {
        return (
          <div>
            <EditTwoTone
              style={{ marginRight: "10px" }}
              twoToneColor="#ff6421"
              onClick={() => clickEditIcon(record)}
            />
            <Popconfirm
              placement="left"
              title="Delete User"
              description="Are you sure to delete this User?"
              onConfirm={() => handleDelete(record._id)}
              okText="Delete"
              cancelText="Cancel"
            >
              <DeleteTwoTone twoToneColor="#f71a1a" />
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const changePagination = async (current: number, pageSize: number) => {
    await fetchUser(
      current,
      pageSize,
      searchObject.fullName,
      searchObject.email,
      searchObject.createdAt,
      sort,
    );
    setCurrent(current);
    setPageSize(pageSize);
  };

  const changeTable: TableProps<IUserTable>["onChange"] = async (
    pagination,
    filters,
    sorter,
  ) => {
    if (Object.keys(sorter).length !== 0) {
      if (!Array.isArray(sorter)) {
        if (sorter.order && sorter.field && typeof sorter.field === "string") {
          const newSort = { name: sorter.field, type: sorter.order };
          setSort(newSort);
          await fetchUser(
            current,
            pageSize,
            searchObject.fullName,
            searchObject.email,
            searchObject.createdAt,
            newSort,
          );
        } else {
          const newSort = {
            name: "",
            type: "",
          };
          setSort(newSort);
          await fetchUser(
            current,
            pageSize,
            searchObject.fullName,
            searchObject.email,
            searchObject.createdAt,
            newSort,
          );
        }
      }
    }
  };

  const openDrawer = (user: IUserTable) => {
    //open drawer
    setIsDrawerOpen(true);
    //set data
    setUserDrawer(user);
  };

  const clickEditIcon = (record: IUserTable) => {
    setIsUpdateModalOpen(true);
    setUpdateData(record);
  };

  const handleDelete = async (id: string) => {
    const res = await deleteUser(id);
    if (res.data) {
      //message
      message.success("Delete successful!");

      //fetch
      fetchUser(
        current,
        pageSize,
        searchObject.fullName,
        searchObject.email,
        searchObject.createdAt,
        sort,
      );
    } else {
      //message
      message.error("Có lỗi xảy ra!");
    }
  };

  useEffect(() => {
    fetchUser(
      current,
      pageSize,
      searchObject.fullName,
      searchObject.email,
      searchObject.createdAt,
      sort,
    );
  }, []);

  return (
    <>
      <div style={{ marginBottom: "15px" }}>
        <Space>
          <CSVLink data={data} filename="data.csv">
            <Button type="primary">
              <ExportOutlined />
              <span> Export</span>
            </Button>
          </CSVLink>

          <Button
            type="primary"
            onClick={() => {
              //open Import modal
              setIsModalOpen(true);
            }}
          >
            <ImportOutlined />
            <span>Import</span>
          </Button>
        </Space>
      </div>

      <Table<IUserTable>
        style={{ marginBottom: "10px" }}
        columns={columns}
        dataSource={data}
        loading={tableLoading}
        pagination={false}
        rowKey="_id"
        onChange={changeTable}
      />

      <Pagination
        align="end"
        current={current}
        pageSize={pageSize}
        total={total}
        showTotal={(total, range) =>
          `${range[0]}-${range[1]} of ${total} items`
        }
        showSizeChanger={true}
        onChange={changePagination}
      />

      <UsersDrawer
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        userDrawer={userDrawer}
      />

      <ImportModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        current={current}
        pageSize={pageSize}
        searchObject={searchObject}
        setSort={setSort}
        fetchUser={fetchUser}
      />

      <UpdateModal
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        updateData={updateData}
        current={current}
        pageSize={pageSize}
        searchObject={searchObject}
        sort={sort}
        fetchUser={fetchUser}
        setUpdateData={setUpdateData}
      />
    </>
  );
};

export default UsersTable;
