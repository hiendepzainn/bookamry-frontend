import { getOrdersPaginate } from "@/services/cart.api";
import { formatDate, formatPrice } from "@/services/helpers";
import { Pagination, Table, TableProps } from "antd";
import { useEffect, useState } from "react";

const OrdersPageAdmin = () => {
  const [data, setData] = useState<IOrderManaging[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [isLoading, setIsLoading] = useState(false);

  const columns: TableProps<IOrderManaging>["columns"] = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      render: (text) => <a>{text}</a>,
    },

    {
      title: "Full Name",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },

    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (value) => <span>{formatPrice(value)}</span>,
    },

    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) => <span>{formatDate(value)}</span>,
    },
  ];

  const changePagination = async (newPage: number, newPageSize: number) => {
    setCurrent(newPage);
    setPageSize(newPageSize);
    await fetchOrders(newPage, newPageSize);
  };

  const fetchOrders = async (current: number, pageSize: number) => {
    setIsLoading(true);
    const res = await getOrdersPaginate(current, pageSize);
    if (res.data) {
      setTotal(res.data.meta.total);
      setData(res.data.result);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(current, pageSize);
  }, []);

  return (
    <div>
      <h2>List Orders</h2>

      <Table<IOrderManaging>
        style={{ margin: "15px 0px" }}
        columns={columns}
        dataSource={data}
        loading={isLoading}
        pagination={false}
      />

      <Pagination
        align="end"
        total={total}
        showTotal={(total, range) =>
          `${range[0]}-${range[1]} of ${total} items`
        }
        current={current}
        pageSize={pageSize}
        onChange={changePagination}
      />
    </div>
  );
};

export default OrdersPageAdmin;
