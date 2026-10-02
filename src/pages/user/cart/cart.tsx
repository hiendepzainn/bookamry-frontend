import { MyContext } from "@/components/context/app.context";
import { Breadcrumb, Col, Grid, Row, Steps } from "antd";
import { useContext, useState } from "react";
import Step1 from "./cartStep/step1";
import Step2 from "./cartStep/step2";
import Step3 from "./cartStep/step3";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart, setCart } = useContext(MyContext);

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const [current, setCurrent] = useState<number>(0);

  const steps = [
    {
      title: "Kiểm tra đơn hàng",
    },
    {
      title: "Đặt hàng",
    },
    {
      title: "Thanh toán",
    },
  ];

  const stepItems = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const getTotalFromCart = (cart: IBookInCart[]) => {
    let total: number = 0;

    cart.forEach((item) => {
      total += item.quantity * item.detail.price;
    });

    return total;
  };

  return (
    <Row
      style={{
        backgroundColor: "#e6e6e6",
        padding: screens.md ? "15px 40px" : "5px 10px",
      }}
    >
      <Breadcrumb
        style={{ margin: screens.md ? "20px 10px" : "10px 10px" }}
        items={[
          {
            title: <Link to="/">Trang chủ</Link>,
          },
          {
            title: "Chi tiết Giỏ hàng",
          },
        ]}
      />

      <Col
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "6px",
          margin: "0px 0px 20px 10px",
        }}
        span={23}
      >
        <Steps current={current} items={stepItems} />
      </Col>

      {current === 0 && (
        <Step1
          setCart={setCart}
          cart={cart}
          getTotalFromCart={getTotalFromCart}
          setCurrent={setCurrent}
        />
      )}

      {current === 1 && (
        <Step2
          getTotalFromCart={getTotalFromCart}
          cart={cart}
          setCurrent={setCurrent}
          setCart={setCart}
        />
      )}

      {current === 2 && <Step3 />}
    </Row>
  );
};

export default Cart;
