import { createOrder } from "@/services/cart.api";
import { formatPrice } from "@/services/helpers";
import {
  App,
  Button,
  Col,
  Divider,
  Form,
  FormProps,
  Grid,
  Input,
  Radio,
  Row,
  Space,
} from "antd";
import { useState } from "react";

interface IProps {
  getTotalFromCart: (cart: IBookInCart[]) => number;
  cart: IBookInCart[];
  setCurrent: (value: number) => void;
  setCart: (value: IBookInCart[]) => void;
}

const Step2 = (props: IProps) => {
  const { getTotalFromCart, cart, setCurrent, setCart } = props;

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const [form] = Form.useForm();

  const { TextArea } = Input;

  const { message } = App.useApp();

  const [isLoading, setIsLoading] = useState(false);

  const optionsRadio = [
    { value: "COD", label: "Thanh toán khi nhận hàng" },
    { value: "BANKING", label: "Chuyển khoản ngân hàng" },
  ];

  const onFinish: FormProps<IOrderInfor>["onFinish"] = async (values) => {
    setIsLoading(true);

    const totalPrice = getTotalFromCart(cart);

    const detail: IOrderDetail[] = cart.map((item) => {
      return {
        bookName: item.detail.mainText,
        _id: item.id,
        quantity: item.quantity,
      };
    });

    const res = await createOrder(
      values.name,
      values.address,
      values.phone,
      totalPrice,
      values.paymentMethod,
      detail,
    );

    if (res.data) {
      //clear cart localStorage
      localStorage.removeItem("cart");

      //clear cart React Context
      setCart([]);

      //setCurrent -> 2
      setCurrent(2);

      //notification
      message.success("Đặt hàng thành công!");
    } else {
      message.error("Có lỗi xảy ra!");
    }
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
                <div>
                  Số lượng: <b>{item.quantity}</b>
                </div>
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

              {!screens.md && (
                <Col span={24}>
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

        {screens.md && (
          <Button type="primary" onClick={() => setCurrent(0)}>
            Quay lại
          </Button>
        )}
      </Col>

      <Col
        style={{
          backgroundColor: "#fff",
          padding: "15px 15px",
          marginLeft: screens.md ? "20px" : "0px",
          marginTop: !screens.md ? "10px" : "0px",
          borderRadius: "5px",
        }}
        span={screens.md ? 6 : 24}
      >
        {!screens.md && (
          <>
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
          </>
        )}

        <Form onFinish={onFinish} form={form} layout="vertical">
          <Form.Item<IOrderInfor>
            name={"paymentMethod"}
            label="Hình thức thanh toán"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn hình thức thanh toán",
              },
            ]}
          >
            <Radio.Group options={optionsRadio} />
          </Form.Item>

          <Form.Item<IOrderInfor>
            name={"name"}
            label="Họ tên"
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

          <Form.Item<IOrderInfor>
            name={"phone"}
            label="Số điện thoại"
            rules={[
              {
                validator: (_, value) => {
                  if (!value || value.trim() === "") {
                    return Promise.reject(
                      new Error("Vui lòng không bỏ trống số điện thoại!"),
                    );
                  }

                  if (!/^\d+$/.test(value)) {
                    return Promise.reject(
                      new Error("Số điện thoại chỉ được phép chứa các chữ số!"),
                    );
                  }

                  if (value.length !== 10) {
                    return Promise.reject(
                      new Error("Số điện thoại phải có đúng 10 chữ số!"),
                    );
                  }

                  const validPrefixes = ["03", "05", "07", "08", "09"];
                  const prefix = value.substring(0, 2);
                  if (!validPrefixes.includes(prefix)) {
                    return Promise.reject(
                      new Error(
                        "Đầu số điện thoại phải bắt đầu bằng 03, 05, 07, 08, 09!",
                      ),
                    );
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<IOrderInfor>
            name={"address"}
            label="Địa chỉ nhận hàng"
            rules={[
              {
                required: true,
                message: "Vui lòng không bỏ trống email!",
              },
            ]}
          >
            <TextArea rows={3} />
          </Form.Item>
        </Form>

        {screens.md && (
          <>
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
          </>
        )}

        <div style={{ textAlign: "center" }}>
          <Button
            loading={isLoading}
            style={{
              width: "95%",
              padding: "20px",
            }}
            color="danger"
            variant="solid"
            onClick={() => form.submit()}
          >
            Đặt hàng ({cart.length})
          </Button>
        </div>
      </Col>
    </>
  );
};

export default Step2;
