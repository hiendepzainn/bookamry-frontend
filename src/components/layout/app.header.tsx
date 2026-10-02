import { useContext, useState } from "react";
import { MyContext } from "@/components/context/app.context";
import type { MenuProps, TabsProps } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  App,
  Avatar,
  Badge,
  Button,
  Col,
  Dropdown,
  Grid,
  Input,
  Modal,
  Popover,
  Row,
  Space,
  Tabs,
} from "antd";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { logout } from "@/services/auth.api";
import { formatPrice } from "@/services/helpers";
import UpdateInfo from "../others/update.info";
import ChangePassword from "../others/change.password";

interface IProps {
  keyword: string;
  setKeyword: (value: string) => void;
}

const AppHeader = (props: IProps) => {
  const { keyword, setKeyword } = props;

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const navigate = useNavigate();

  const { message } = App.useApp();

  const { user, authenticated, setAuthenticated, setUser, cart, setCart } =
    useContext(MyContext);

  const [isModalUserInfoOpen, setIsModalUserInfoOpen] = useState(false);

  const [userModal, setUserModal] = useState<IDataLoginUser>({
    avatar: "",
    email: "",
    fullName: "",
    id: "",
    phone: "",
    role: "",
  });

  const handleLogout = async () => {
    const res = await logout();

    if (res.data) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("cart");
      setCart([]);

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
    }
  };

  const userMenuItems: MenuProps["items"] = [
    ...(user.role === "ADMIN"
      ? [{ key: "admin", label: <Link to="/admin">Trang quản trị</Link> }]
      : []),
    {
      key: "profile",
      label: (
        <span
          onClick={() => {
            setUserModal(user);
            setIsModalUserInfoOpen(true);
          }}
        >
          Quản lý tài khoản
        </span>
      ),
    },
    {
      key: "orders",
      label: <Link to="/orderHistory">Lịch sử mua hàng</Link>,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: (
        <div style={{ width: "100%" }} onClick={handleLogout}>
          Logout
        </div>
      ),
      danger: true,
    },
  ];

  const styles: Record<string, React.CSSProperties> = {
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: screens.xs ? "0px" : "0 24px",
      height: "72px",
      backgroundColor: "#ffffff",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
      position: "sticky",
      top: 0,
      zIndex: 1000,
    },
    leftSection: {
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      cursor: "pointer",
    },
    logo: {
      width: "36px",
      height: "36px",
      marginRight: screens.xs ? "-12px" : "12px",
      marginLeft: screens.xs ? "18px" : "0px",
    },
    brandName: {
      fontSize: "22px",
      fontWeight: 700,
      color: "#1677ff",
    },
    middleSection: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      padding: screens.xs ? "0 30px" : "0 40px",
    },
    searchInput: {
      maxWidth: "600px",
      width: "100%",
      borderRadius: "8px",
    },
    rightSection: {
      display: "flex",
      alignItems: "center",
      gap: screens.xs ? "16px" : "32px",
    },
    cartIcon: {
      fontSize: "26px",
      cursor: "pointer",
      color: "#595959",
    },
    userInfo: {
      cursor: "pointer",
      padding: "4px 8px",
      borderRadius: "6px",
      transition: "background-color 0.2s",
    },
    userName: {
      fontWeight: 500,
      color: "#262626",
    },
  };

  const contentPopover = () => {
    return (
      <div style={{ width: "25vw" }}>
        {cart.map((item) => {
          return (
            <Row
              key={item.id}
              gutter={18}
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <Col span={4}>
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "1/1",
                  }}
                >
                  <img
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                    src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.detail.thumbnail}`}
                    alt="image"
                  />
                </div>
              </Col>
              <Col
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                span={14}
              >
                {item.detail.mainText}
              </Col>
              <Col style={{ color: "#EE4D2D", fontWeight: "500" }} span={6}>
                {formatPrice(item.detail.price)}
              </Col>
            </Row>
          );
        })}
        {cart.length === 0 ? (
          <></>
        ) : (
          <div style={{ display: "flex", justifyContent: "end" }}>
            <button
              onClick={() => {
                navigate("/cart");
              }}
              style={{
                margin: "5px 0px",
                padding: "10px 15px",
                backgroundColor: "#EE4D2D",
                border: "1px solid #EE4D2D",
                borderRadius: "3px",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Xem giỏ hàng
            </button>
          </div>
        )}
      </div>
    );
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Cập nhật thông tin",
      children: (
        <UpdateInfo
          userModal={userModal}
          setIsModalUserInfoOpen={setIsModalUserInfoOpen}
        />
      ),
    },
    {
      key: "2",
      label: "Đổi mật khẩu",
      children: <ChangePassword userModal={userModal} />,
    },
  ];

  return (
    <>
      <header style={styles.header}>
        {/* LEFT: Logo & Brand Name */}
        <Link to="/" style={styles.leftSection}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
            alt="React Logo"
            style={styles.logo}
          />
          {screens.xs ? <></> : <span style={styles.brandName}>Bookamry</span>}
        </Link>

        {/* MIDDLE: Search Bar */}
        <div style={styles.middleSection}>
          <Input
            prefix={<SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
            placeholder="Bạn tìm gì hôm nay"
            size="large"
            style={styles.searchInput}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            allowClear={{
              clearIcon: (
                <span style={{ color: "rgba(0,0,0,0.45)", cursor: "pointer" }}>
                  ✕
                </span>
              ),
            }}
          />
        </div>

        {/* RIGHT: Cart & User Info */}
        <div style={styles.rightSection}>
          {/* Cart Section */}

          {screens.xs ? (
            <Link to={"/cart"}>
              <Badge count={cart.length} offset={[-2, 4]} size="small">
                <span>
                  <ShoppingCartOutlined style={styles.cartIcon} />
                </span>
              </Badge>
            </Link>
          ) : (
            <Popover
              placement="bottomRight"
              title={
                authenticated === false ? (
                  <div style={{ textAlign: "center", margin: "10px 0px 0px" }}>
                    Vui lòng đăng nhập để thêm sản phẩm
                  </div>
                ) : (
                  <>
                    {cart.length === 0 ? (
                      <div
                        style={{ textAlign: "center", margin: "10px 0px 0px" }}
                      >
                        Hiện tại Giỏ hàng đang trống
                      </div>
                    ) : (
                      "Sản phẩm mới thêm"
                    )}
                  </>
                )
              }
              content={contentPopover}
            >
              <Badge count={cart.length} offset={[-2, 4]} size="small">
                <span>
                  <ShoppingCartOutlined style={styles.cartIcon} />
                </span>
              </Badge>
            </Popover>
          )}

          {/* User Info Section (Hover Dropdown) */}
          {!authenticated ? (
            <Link to="/login">
              <Button style={{ marginRight: "10px" }} type="primary">
                Login
              </Button>{" "}
            </Link>
          ) : (
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
            >
              <div style={styles.userInfo}>
                <Space>
                  <Avatar
                    icon={<UserOutlined />}
                    src={`${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user.avatar}`}
                  />
                  {screens.xs ? (
                    <></>
                  ) : (
                    <span style={styles.userName}>{user.fullName}</span>
                  )}
                </Space>
              </div>
            </Dropdown>
          )}
        </div>
      </header>

      <Modal
        forceRender
        footer={null}
        width={screens.md ? "60vw" : "95vw"}
        title="Quản lý tài khoản"
        open={isModalUserInfoOpen}
        onCancel={() => {
          setIsModalUserInfoOpen(false);

          setUserModal({
            avatar: "",
            email: "",
            fullName: "",
            id: "",
            phone: "",
            role: "",
          });
        }}
      >
        <Tabs defaultActiveKey="1" items={items} />
      </Modal>
    </>
  );
};

export default AppHeader;
