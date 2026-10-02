import { Button, Col, Result } from "antd";
import { Link } from "react-router-dom";

const Step3 = () => {
  return (
    <Col
      style={{
        backgroundColor: "#fff",
        marginLeft: "10px",
        borderRadius: "8px",
        marginBottom: "250px",
      }}
      span={23}
    >
      <Result
        status="success"
        title="Đặt hàng thành công!"
        subTitle="Hệ thống đã ghi nhận đơn hàng của bạn."
        extra={[
          <Link to={"/"}>
            <Button type="primary">Trang chủ</Button>
          </Link>,
          <Link to={"/orderHistory"}>
            <Button>Lịch sử mua hàng</Button>
          </Link>,
        ]}
      />
    </Col>
  );
};

export default Step3;
