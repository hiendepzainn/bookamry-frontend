import { useContext, useState } from "react";
import { MyContext } from "../components/context/app.context";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { App, Avatar, Button, Dropdown, Layout, Menu } from "antd";
import type { MenuProps } from "antd";
import {
  AppstoreOutlined,
  BookOutlined,
  DollarOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { logout } from "@/services/auth.api";

const { Header, Sider, Content } = Layout;

const siderItems = [
  {
    key: "dashboard",
    icon: <AppstoreOutlined />,
    label: <Link to="/admin">Dashboard</Link>,
  },
  {
    key: "users",
    icon: <UserOutlined />,
    label: <Link to="/admin/users">Manage Users</Link>,
  },
  {
    key: "books",
    icon: <BookOutlined />,
    label: <Link to="/admin/books">Manage Books</Link>,
  },
  {
    key: "orders",
    icon: <DollarOutlined />,
    label: <Link to="/admin/orders">Manage Orders</Link>,
  },
];

const LayoutAdmin = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();

  const location = useLocation();
  let defaultSelectedKey = "";
  switch (location.pathname) {
    case "/admin":
      defaultSelectedKey = "dashboard";
      break;
    case "/admin/users":
      defaultSelectedKey = "users";
      break;
    case "/admin/books":
      defaultSelectedKey = "books";
      break;
    case "/admin/orders":
      defaultSelectedKey = "orders";
      break;
  }

  const { user, authenticated, setAuthenticated, setUser } =
    useContext(MyContext);

  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    const res = await logout();

    if (res.data) {
      localStorage.removeItem("access_token");

      setAuthenticated(false);
      setUser({
        avatar: "",
        email: "",
        fullName: "",
        id: "",
        phone: "",
        role: "",
      });

      message.success("Logout successful!");

      navigate("/");
    }
  };

  const adminMenuItems: MenuProps["items"] = [
    {
      key: "homepage",
      label: <Link to="/">Trang chủ</Link>,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: (
        <div style={{ width: "100%" }} onClick={handleLogout}>
          Đăng xuất
        </div>
      ),
      danger: true,
    },
  ];

  return (
    <>
      {!authenticated || (authenticated && user.role !== "ADMIN") ? (
        <Outlet />
      ) : (
        <Layout style={{ minHeight: "100vh" }}>
          <Sider collapsed={collapsed}>
            <div
              style={{
                textAlign: "center",
                color: "#FFF",
                padding: "16px 0px",
              }}
            >
              {" "}
              ADMIN
            </div>
            <Menu
              theme="dark"
              items={siderItems}
              defaultSelectedKeys={[defaultSelectedKey]}
            />
          </Sider>
          <Layout>
            <Header
              style={{
                background: "#FFFFFF",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
              ></Button>
              <Dropdown
                menu={{ items: adminMenuItems }}
                placement="bottomRight"
                arrow
              >
                <Button style={{ padding: "20px 15px" }} type="text">
                  <Avatar
                    icon={<UserOutlined />}
                    src={`${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user.avatar}`}
                  />
                  <span>{user.fullName}</span>
                </Button>
              </Dropdown>
            </Header>
            <Content
              style={{
                backgroundColor: "red",
                margin: "24px 16px",
                padding: 24,
                background: "#FFFFFF",
                borderRadius: "8px",
              }}
            >
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      )}
    </>
  );
};

export default LayoutAdmin;
