import { getOrderList } from "@/services/cart.api";
import { formatDate, formatPrice } from "@/services/helpers";
import { Divider, Grid, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { useEffect, useState } from "react";
import OrdersDrawer from "./ordersDrawer";

const OrdersHistory = () => {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const [data, setData] = useState<IOrderTable[]>();
  const [dataDrawer, setDataDrawer] = useState<IOrderTable>({
    _id: "",
    name: "",
    type: "",
    email: "",
    phone: "",
    userId: "",
    detail: [],
    totalPrice: 0,
    paymentStatus: "",
    paymentRef: "",
    createdAt: "",
    updatedAt: "",
    __v: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const columns: TableProps<IOrderTable>["columns"] = [
    {
      title: "STT",
      key: "stt",
      render: (value, record, index) => {
        return index + 1;
      },
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) => {
        return formatDate(value);
      },
    },
    {
      title: "Tổng số tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (value) => {
        return formatPrice(value);
      },
    },
    ...(screens.md
      ? [
          {
            title: "Trạng thái",
            key: "status",
            render: () => {
              return <Tag color="green">Thành công</Tag>;
            },
          },
        ]
      : []),
    {
      title: "Chi tiết",
      key: "details",
      render: (value, record) => {
        return (
          <a
            onClick={() => {
              setDataDrawer(record);
              setIsDrawerOpen(true);
            }}
          >
            Xem chi tiết
          </a>
        );
      },
    },
  ];

  const fetchOrder = async () => {
    setIsLoading(true);

    const res = await getOrderList();

    if (res.data) {
      setData(res.data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <>
      <div style={{ padding: "40px 30px" }}>
        <h2 style={{ textAlign: "center" }}>Lịch sử mua hàng</h2>

        <Divider />

        <Table<IOrderTable>
          columns={columns}
          dataSource={data}
          loading={isLoading}
        />
      </div>

      <OrdersDrawer
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        dataDrawer={dataDrawer}
      />
    </>
  );
};

export default OrdersHistory;
