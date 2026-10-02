import { getDashboard } from "@/services/homepage.api";
import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [data, setData] = useState<IDataDashboard>({
    countBook: 0,
    countOrder: 0,
    countUser: 0,
  });

  const fetchData = async () => {
    const res = await getDashboard();
    if (res.data) {
      setData(res.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Row gutter={18}>
      <Col
        span={7}
        style={{
          backgroundColor: "#ececec",
          borderRadius: "8px",
          padding: "15px 20px",
          cursor: "pointer",
        }}
      >
        <Link to={"/admin/users"}>
          <div>Tổng Users</div>
          <h1>
            <CountUp end={data.countUser} />
          </h1>
        </Link>
      </Col>

      <Col span={1}></Col>

      <Col
        span={7}
        style={{
          backgroundColor: "#ececec",
          borderRadius: "8px",
          padding: "15px 20px",
          cursor: "pointer",
        }}
      >
        <Link to={"/admin/orders"}>
          <div>Tổng Orders</div>
          <h1>
            <CountUp end={data.countOrder} />
          </h1>
        </Link>
      </Col>

      <Col span={1}></Col>

      <Col
        span={7}
        style={{
          backgroundColor: "#ececec",
          borderRadius: "8px",
          padding: "15px 20px",
          cursor: "pointer",
        }}
      >
        <Link to={"/admin/books"}>
          <div>Tổng Books</div>
          <h1>
            <CountUp end={data.countBook} />
          </h1>
        </Link>
      </Col>
    </Row>
  );
};

export default Dashboard;
