import { MyContext } from "@/components/context/app.context";
import { formatPrice } from "@/services/helpers";
import { getBookDetailsByID } from "@/services/homepage.api";
import {
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import {
  App,
  Breadcrumb,
  Col,
  Divider,
  Grid,
  Rate,
  Row,
  Skeleton,
  Space,
} from "antd";
import { useContext, useEffect, useState } from "react";
import ImageGallery, { GalleryItem } from "react-image-gallery";
import "react-image-gallery/styles/image-gallery.css";
import { Link, useNavigate, useParams } from "react-router-dom";

const BookDetails = () => {
  const { setCart, authenticated } = useContext(MyContext);

  const navigate = useNavigate();

  const { message } = App.useApp();

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const params = useParams();

  const [book, setBook] = useState<IBookTable>({
    __v: 0,
    _id: "",
    author: "",
    category: "",
    createdAt: "",
    mainText: "",
    price: 0,
    quantity: 0,
    slider: [],
    sold: 0,
    thumbnail: "",
    updatedAt: "",
  });

  const [imageList, setImageList] = useState<GalleryItem[]>([]);

  const [countQuantity, setCountQuantity] = useState<number>(1);

  const [isLoading, setIsLoading] = useState(true);

  const decreaseQuantity = () => {
    if (countQuantity === 1) return;
    setCountQuantity(countQuantity - 1);
  };

  const increaseQuantity = () => {
    if (countQuantity === book.quantity) return;
    setCountQuantity(countQuantity + 1);
  };

  const addBookToCart = () => {
    const cart = localStorage.getItem("cart");
    if (!cart) {
      //create cart
      const newCart: IBookInCart[] = [];

      //insert
      newCart.push({
        id: book._id,
        quantity: countQuantity,
        detail: book,
      });

      //storage
      localStorage.setItem("cart", JSON.stringify(newCart));

      //sync React Context
      setCart(newCart);

      //return
      return;
    }
    //get Cart from localStorage
    const newCart: IBookInCart[] = JSON.parse(cart);

    // find Book in cart?
    const foundIndex = newCart.findIndex((item) => item.id === book._id);

    // if yes, update
    if (foundIndex !== -1) {
      newCart[foundIndex].quantity += countQuantity;
    } else {
      // if no, insert
      newCart.push({
        id: book._id,
        quantity: countQuantity,
        detail: book,
      });
    }

    // storage
    localStorage.setItem("cart", JSON.stringify(newCart));

    //sync React Context
    setCart(newCart);
  };

  const fetchBookInfo = async (id: string) => {
    const res = await getBookDetailsByID(id);
    if (res.data) {
      setBook(res.data);
      const listImage: GalleryItem[] = [];

      listImage.push({
        original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${res.data.thumbnail}`,
        thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${res.data.thumbnail}`,
      });

      res.data.slider.forEach((item) => {
        listImage.push({
          original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
        });
      });

      setImageList(listImage);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) fetchBookInfo(params.id);
  }, []);

  return (
    <>
      {screens.md ? (
        <Breadcrumb
          style={{ margin: "20px 30px" }}
          items={[
            {
              title: <Link to="/">Trang chủ</Link>,
            },
            {
              title: "Xem chi tiết Sách",
            },
          ]}
        />
      ) : (
        <></>
      )}

      <div
        style={{
          margin: screens.md ? "15px 30px" : "10px 10px",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          padding: "20px 20px",
        }}
      >
        <Row gutter={24}>
          <Col xs={24} sm={24} md={10}>
            {isLoading ? (
              <Skeleton.Input
                block
                active
                style={{ width: "100%", height: 350 }}
              />
            ) : (
              <ImageGallery
                items={imageList}
                showPlayButton={false}
                showFullscreenButton={false}
                showNav={false}
              />
            )}
          </Col>

          {screens.md ? <></> : <Divider style={{ margin: "15px 0px" }} />}

          <Col xs={24} sm={24} md={14}>
            {isLoading ? (
              <>
                <Skeleton active />
                <br />
                <Skeleton active />
                <br />
                <Space>
                  <Skeleton.Input active size={"default"} />
                  <Skeleton.Input active size={"default"} />
                </Space>
              </>
            ) : (
              <div>
                <div>
                  Tác giả: <a>{book.author}</a>
                </div>

                <div style={{ fontSize: "20px", margin: "5px 0px" }}>
                  {book.mainText}
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                  <Rate
                    style={{ fontSize: "15px" }}
                    disabled
                    defaultValue={5}
                  />

                  <Divider type="vertical" />

                  <div>{book.sold ? `${book.sold}` : "0"} đã bán</div>
                </div>

                <div
                  style={{
                    fontSize: screens.md ? "28px" : "24px",
                    fontWeight: "600",
                    color: "#EE4D2D",
                    padding: screens.md ? "20px 16px" : "10px 14px",
                    backgroundColor: "#F9F9F9",
                    margin: screens.md ? "10px 0px 20px" : "10px 0px 10px",
                  }}
                >
                  {formatPrice(book.price)}
                </div>

                <div>
                  <Row>
                    <Col lg={4} sm={6} xs={8}>
                      <span>Vận chuyển</span>
                    </Col>
                    <Col lg={20} sm={18} xs={16}>
                      <span>Miễn phí vận chuyển</span>
                    </Col>
                  </Row>

                  <Row
                    style={{
                      display: "flex",
                      alignItems: "center",
                      margin: "20px 0px",
                    }}
                  >
                    <Col lg={4} sm={6} xs={8}>
                      <span>Số lượng</span>
                    </Col>

                    <Col lg={20} sm={18} xs={16}>
                      <button
                        style={{
                          width: "30px",
                          height: "30px",
                          backgroundColor: "#fff",
                          border: "1px solid #ddd",
                          cursor: "pointer",
                        }}
                        onClick={decreaseQuantity}
                      >
                        <MinusOutlined />
                      </button>
                      <button
                        style={{
                          width: "45px",
                          height: "30px",
                          backgroundColor: "#fff",
                          border: "1px solid #ddd",
                        }}
                      >
                        {countQuantity}
                      </button>
                      <button
                        style={{
                          width: "30px",
                          height: "30px",
                          backgroundColor: "#fff",
                          border: "1px solid #ddd",
                          cursor: "pointer",
                        }}
                        onClick={increaseQuantity}
                      >
                        <PlusOutlined />
                      </button>
                    </Col>
                  </Row>

                  <div>
                    <Space size={"middle"}>
                      <button
                        style={{
                          padding: "10px 15px",
                          backgroundColor: "#FFEDEB",
                          border: "1px solid #EE4D2D",
                          borderRadius: "3px",
                          color: "#EE4D2D",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          if (!authenticated) {
                            navigate("/login");
                          } else {
                            addBookToCart();
                            message.success("Đã thêm sản phẩm vào Giỏ hàng");
                          }
                        }}
                      >
                        <ShoppingCartOutlined />
                        <span> Thêm vào giỏ hàng</span>
                      </button>

                      <button
                        style={{
                          padding: "10px 15px",
                          backgroundColor: "#EE4D2D",
                          border: "1px solid #EE4D2D",
                          borderRadius: "3px",
                          color: "#fff",
                        }}
                        onClick={() => {
                          if (!authenticated) {
                            navigate("/login");
                          } else {
                            addBookToCart();
                            navigate("/cart");
                          }
                        }}
                      >
                        Mua ngay
                      </button>
                    </Space>
                  </div>
                </div>
              </div>
            )}
          </Col>
        </Row>
      </div>
    </>
  );
};

export default BookDetails;
