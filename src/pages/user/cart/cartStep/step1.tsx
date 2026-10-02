import { formatPrice } from "@/services/helpers";
import { DeleteTwoTone } from "@ant-design/icons";
import { Col, Divider, Empty, Grid, InputNumber, Row, Space } from "antd";

interface IProps {
  setCart: (value: IBookInCart[]) => void;
  cart: IBookInCart[];
  getTotalFromCart: (cart: IBookInCart[]) => number;
  setCurrent: (value: number) => void;
}

const Step1 = (props: IProps) => {
  const { setCart, cart, getTotalFromCart, setCurrent } = props;

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const changeInputNumber = (id: string, value: number | null) => {
    if (value == null) return;

    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        return { ...item, quantity: value };
      }
      return item;
    });

    setCart(updatedCart);

    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const deleteBookById = (id: string) => {
    const updatedCart = cart.filter((item) => item.id !== id);

    setCart(updatedCart);

    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <>
      <Col span={screens.md ? 17 : 24}>
        {cart.map((item) => {
          return (
            <Row
              key={item.id}
              style={{
                backgroundColor: "#fff",
                margin: "0px 0px 12px",
                ...(screens.md && { height: "15vh" }),
                padding: "10px",
                boxSizing: "content-box",
                borderRadius: "5px",
              }}
            >
              {!screens.md && (
                <Col
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                  span={24}
                >
                  {item.detail.mainText}
                </Col>
              )}

              <Col style={{ height: "100%" }} span={screens.md ? 3 : 6}>
                <div
                  style={{
                    // backgroundColor: "red",
                    height: "100%",
                    width: "100%",
                    margin: screens.md ? "0px" : "10px 0px",
                  }}
                >
                  <img
                    style={{
                      height: "100%",
                      width: "100%",
                      objectFit: "contain",
                    }}
                    src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.detail.thumbnail}`}
                  />
                </div>
              </Col>

              {!screens.md && <Col span={5}></Col>}

              {screens.md && (
                <Col
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0px 0px 0px 30px",
                  }}
                  span={8}
                >
                  {item.detail.mainText}
                </Col>
              )}

              {screens.md && (
                <Col
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  span={3}
                >
                  {formatPrice(item.detail.price)}
                </Col>
              )}

              <Col
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                span={screens.md ? 3 : 8}
              >
                <InputNumber
                  min={1}
                  max={item.detail.quantity}
                  value={item.quantity}
                  onChange={(value) => changeInputNumber(item.id, value)}
                />
              </Col>

              {!screens.md && <Col span={4}></Col>}

              {screens.md && (
                <Col
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  span={6}
                >
                  <Space>
                    <span>Tổng:</span>
                    <span style={{ fontSize: "15px", fontWeight: "500" }}>
                      {formatPrice(item.detail.price * item.quantity)}
                    </span>
                  </Space>
                </Col>
              )}

              <Col
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                span={1}
              >
                <DeleteTwoTone
                  twoToneColor="#ed183f"
                  onClick={() => deleteBookById(item.id)}
                />
              </Col>

              {!screens.md && (
                <Col
                  // style={{
                  //   display: "flex",
                  //   alignItems: "center",
                  //   justifyContent: "center",
                  // }}
                  span={24}
                >
                  <Space>
                    <span>Tổng:</span>
                    <span style={{ fontSize: "15px", fontWeight: "500" }}>
                      {formatPrice(item.detail.price * item.quantity)}
                    </span>
                  </Space>
                </Col>
              )}
            </Row>
          );
        })}
        {cart.length === 0 && (
          <Empty description="Không có sản phẩm trong giỏ hàng" />
        )}
      </Col>

      <Col
        style={{
          backgroundColor: "#fff",
          padding: "15px 15px",
          marginLeft: screens.md ? "20px" : "0px",
          borderRadius: "5px",
        }}
        span={screens.md ? 6 : 24}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Tạm tính</span>
          <span style={{ fontSize: "16px" }}>
            {formatPrice(getTotalFromCart(cart))}
          </span>
        </div>

        <Divider />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Tổng tiền</span>
          <span style={{ fontSize: "25px", color: "#EE4D2D" }}>
            {formatPrice(getTotalFromCart(cart))}
          </span>
        </div>

        <Divider />

        <div style={{ textAlign: "center" }}>
          {cart.length !== 0 && (
            <button
              style={{
                width: "95%",
                padding: "13px 15px",
                backgroundColor: "#EE4D2D",
                border: "1px solid #EE4D2D",
                borderRadius: "3px",
                color: "#fff",
                cursor: "pointer",
              }}
              onClick={() => setCurrent(1)}
            >
              Mua hàng ({cart.length})
            </button>
          )}
        </div>
      </Col>
    </>
  );
};

export default Step1;
