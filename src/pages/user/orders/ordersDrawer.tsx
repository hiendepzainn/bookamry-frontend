import { Divider, Drawer } from "antd";

interface IProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (value: boolean) => void;
  dataDrawer: IOrderTable;
}

const OrdersDrawer = (props: IProps) => {
  const { isDrawerOpen, setIsDrawerOpen, dataDrawer } = props;

  return (
    <Drawer
      title="Chi tiết đơn hàng"
      onClose={() => setIsDrawerOpen(false)}
      open={isDrawerOpen}
    >
      {dataDrawer.detail.map((item) => {
        return (
          <>
            <div>
              <b>- Tên sách:</b> {item.bookName}
            </div>

            <div>
              <b>- Số lượng:</b> {item.quantity}
            </div>

            <Divider />
          </>
        );
      })}
    </Drawer>
  );
};

export default OrdersDrawer;
