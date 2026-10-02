import { formatDate, formatPrice } from "@/services/helpers";
import {
  DeleteTwoTone,
  EditTwoTone,
  ExportOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { App, Button, Pagination, Popconfirm, Space, Table } from "antd";
import type { TableProps } from "antd";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import BookDrawer from "./tableComponents/drawer";
import BookCreateModal from "./tableComponents/createModal";
import BookUpdateModal from "./tableComponents/updateModal";
import { deleteBook, getBookCategory } from "@/services/book.api";

interface IProps {
  searchObject: IBookSearchField;
  data: IBookTable[];
  total: number;
  isLoadingTable: boolean;
  fetchBooks: (
    current: number,
    pageSize: number,
    mainText: string,
    author: string,
    sort: ISort,
  ) => void;
  current: number;
  setCurrent: (value: number) => void;
  pageSize: number;
  setPageSize: (value: number) => void;
  setSort: (value: ISort) => void;
  sort: ISort;
}

const BookTable = (props: IProps) => {
  const {
    searchObject,
    data,
    total,
    isLoadingTable,
    fetchBooks,
    current,
    setCurrent,
    pageSize,
    setPageSize,
    setSort,
    sort,
  } = props;

  const { message } = App.useApp();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [dataDrawer, setDataDrawer] = useState<IBookTable>({
    __v: 0,
    _id: "",
    author: "",
    category: "",
    createdAt: "",
    mainText: "",
    price: 0,
    quantity: 0,
    slider: [],
    sold: 0,
    thumbnail: "",
    updatedAt: "",
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [categoryList, setCategoryList] = useState<IBookCategory[]>([]);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<IBookTable>({
    __v: 0,
    _id: "",
    author: "",
    category: "",
    createdAt: "",
    mainText: "",
    price: 0,
    quantity: 0,
    slider: [],
    sold: 0,
    thumbnail: "",
    updatedAt: "",
  });

  const columns: TableProps<IBookTable>["columns"] = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "id",
      render: (value, record) => {
        return (
          <a
            onClick={() => {
              setIsDrawerOpen(true);
              setDataDrawer(record);
            }}
          >
            {value}
          </a>
        );
      },
    },
    {
      title: "Tên sách",
      dataIndex: "mainText",
      key: "mainText",
      sorter: true,
    },
    {
      title: "Thể loại",
      dataIndex: "category",
      key: "category",
      sorter: true,
      width: "10%",
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      key: "author",
      width: "20%",
      sorter: true,
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      key: "price",
      render: (value) => formatPrice(value),
      width: "9%",
      sorter: true,
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (value) => {
        return <div>{formatDate(value)}</div>;
      },
      width: "13%",
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
              onClick={() => {
                setIsUpdateModalOpen(true);
                setDataUpdate(record);
              }}
            />

            <Popconfirm
              placement="left"
              title="Delete Book"
              description="Are you sure to Delete this Book?"
              okText="Delete"
              cancelText="Cancel"
              onConfirm={() => confirmDelete(record._id)}
            >
              <DeleteTwoTone twoToneColor="#f71a1a" />
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const changePagination = async (page: number, pageSize: number) => {
    setCurrent(page);
    setPageSize(pageSize);
    await fetchBooks(
      page,
      pageSize,
      searchObject.mainText,
      searchObject.author,
      sort,
    );
  };

  const changeTable: TableProps<IBookTable>["onChange"] = (
    pagination,
    filters,
    sorter,
  ) => {
    //check empty object
    if (Object.keys(sorter).length !== 0) {
      //check is not Array
      if (!Array.isArray(sorter)) {
        const newSort: ISort = { name: "", type: "" };

        switch (sorter.order) {
          case "ascend":
            if (typeof sorter.field === "string") {
              newSort.name = sorter.field;
              newSort.type = sorter.order;
            }
            break;

          case "descend":
            if (typeof sorter.field === "string") {
              newSort.name = sorter.field;
              newSort.type = sorter.order;
            }
            break;

          default:
            break;
        }

        setSort(newSort);

        //fetchBooks
        fetchBooks(
          current,
          pageSize,
          searchObject.mainText,
          searchObject.author,
          newSort,
        );
      }
    }
  };

  const fetchCategory = async () => {
    const list: IBookCategory[] = [];

    const res = await getBookCategory();

    if (res.data) {
      res.data.forEach((value) => {
        list.push({
          label: value,
          value: value,
        });
      });

      setCategoryList(list);
    }
  };

  const confirmDelete = async (id: string) => {
    const res = await deleteBook(id);

    if (res.data) {
      message.success("Delete success!");

      await fetchBooks(
        current,
        pageSize,
        searchObject.mainText,
        searchObject.author,
        sort,
      );
    }
  };

  useEffect(() => {
    fetchBooks(
      current,
      pageSize,
      searchObject.mainText,
      searchObject.author,
      sort,
    );
    fetchCategory();
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h3>Book List</h3>

        <Space>
          <CSVLink data={data} filename={"booksExport.csv"}>
            <Button type="primary">
              <ExportOutlined />
              Export
            </Button>
          </CSVLink>

          <Button onClick={() => setIsCreateModalOpen(true)} type="primary">
            <PlusOutlined />
            Add new
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey="_id"
        loading={isLoadingTable}
        onChange={changeTable}
      />

      <Pagination
        style={{ marginTop: "15px" }}
        align="end"
        total={total}
        showTotal={(total, range) =>
          `${range[0]}-${range[1]} of ${total} items`
        }
        current={current}
        pageSize={pageSize}
        showSizeChanger={true}
        onChange={changePagination}
      />

      <BookDrawer
        dataDrawer={dataDrawer}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
      />

      <BookCreateModal
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        current={current}
        pageSize={pageSize}
        sort={sort}
        searchObject={searchObject}
        fetchBooks={fetchBooks}
        categoryList={categoryList}
      />

      <BookUpdateModal
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        dataUpdate={dataUpdate}
        categoryList={categoryList}
        current={current}
        pageSize={pageSize}
        sort={sort}
        searchObject={searchObject}
        fetchBooks={fetchBooks}
      />
    </>
  );
};

export default BookTable;
