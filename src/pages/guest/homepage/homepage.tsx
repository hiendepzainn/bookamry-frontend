import { getBookCategory } from "@/services/book.api";
import { formatPrice } from "@/services/helpers";
import { getBooksHomepage } from "@/services/homepage.api";
import {
  ArrowRightOutlined,
  FilterTwoTone,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  FormProps,
  Grid,
  InputNumber,
  Pagination,
  Rate,
  Row,
  Space,
  Spin,
  Tabs,
  TabsProps,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import FilterDrawer from "./filterDrawer";

interface IOutletContext {
  keyword: string;
}

const Homepage = () => {
  const { keyword } = useOutletContext<IOutletContext>();
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const [categoryList, setCategoryList] = useState<IBookCategory[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [sort, setSort] = useState<ISort>({ name: "sold", type: "dsc" });

  const [filterCategory, setFilterCategory] = useState<string[]>([]);
  const [filterPrice, setFilterPrice] = useState<IFilterPrice>({
    from: "",
    to: "",
  });

  const [hoveredId, setHoveredId] = useState<string>("");

  const items: TabsProps["items"] = [
    {
      key: "popular",
      label: "Phổ biến",
    },
    {
      key: "new",
      label: "Hàng mới",
    },
    {
      key: "lowToHigh",
      label: "Giá thấp đến cao",
    },
    {
      key: "highToLow",
      label: "Giá cao đến thấp",
    },
  ];

  const [data, setData] = useState<IBookTable[]>([]);

  const fetchCategory = async () => {
    const list: IBookCategory[] = [];

    const res = await getBookCategory();

    if (res.data) {
      res.data.forEach((value) => {
        list.push({
          label: value,
          value: value,
        });
      });

      setCategoryList(list);
    }
  };

  const fetchBooks = async (
    current: number,
    pageSize: number,
    sort: ISort,
    filterCategory: string[],
    filterPrice: IFilterPrice,
  ) => {
    setIsLoading(true);
    const res = await getBooksHomepage(
      current,
      pageSize,
      sort,
      filterCategory,
      filterPrice.from,
      filterPrice.to,
      keyword,
    );

    if (res.data) {
      setData(res.data.result);
      setTotal(res.data.meta.total);
    }
    setIsLoading(false);
  };

  const changePagination = async (newPage: number, newPageSize: number) => {
    await fetchBooks(newPage, newPageSize, sort, filterCategory, filterPrice);
    setCurrent(newPage);
    setPageSize(newPageSize);
  };

  const changeTab = async (activeKey: string) => {
    const newSort: ISort = { name: "", type: "" };

    switch (activeKey) {
      case "popular":
        newSort.name = "sold";
        newSort.type = "dsc";
        break;

      case "new":
        newSort.name = "createdAt";
        newSort.type = "dsc";
        break;

      case "lowToHigh":
        newSort.name = "price";
        newSort.type = "asc";
        break;

      case "highToLow":
        newSort.name = "price";
        newSort.type = "dsc";
        break;

      default:
        break;
    }

    setSort(newSort);
    setCurrent(1);

    await fetchBooks(1, pageSize, newSort, filterCategory, filterPrice);
  };

  const changeCheckboxGroup = async (checkedValues: string[]) => {
    await fetchBooks(1, pageSize, sort, checkedValues, filterPrice);

    setFilterCategory(checkedValues);
    setCurrent(1);
  };

  const resetFilter = async () => {
    form.resetFields();

    await fetchBooks(1, pageSize, sort, [], { from: "", to: "" });

    setFilterPrice({ from: "", to: "" });
    setFilterCategory([]);
    setCurrent(1);
  };

  const onFinish: FormProps<IBookFilter>["onFinish"] = (values) => {
    const from = values.from ? values.from.toString() : "";
    const to = values.to ? values.to.toString() : "";

    fetchBooks(1, pageSize, sort, filterCategory, { from: from, to: to });

    setFilterPrice({ from: from, to: to });
    setCurrent(1);
  };

  useEffect(() => {
    fetchCategory();
    fetchBooks(current, pageSize, sort, filterCategory, filterPrice);
  }, [keyword]);

  return (
    <>
      <Row>
        <Col
          style={{
            // border: "1px solid #ddd",
            padding: "12px",
            backgroundColor: "#ffffff",
            margin: "30px 20px 0px 20px",
            borderRadius: "8px",
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          }}
          xs={0}
          sm={4}
        >
          <Form form={form} onFinish={onFinish}>
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <FilterTwoTone />
                  <span
                    style={{
                      marginLeft: "4px",
                      fontSize: "15px",
                      fontWeight: "500",
                    }}
                  >
                    Bộ lọc tìm kiếm
                  </span>
                </div>

                <Button>
                  <ReloadOutlined onClick={resetFilter} />
                </Button>
              </div>
            </div>

            <Divider />

            <div>
              <div style={{ margin: "5px 0px 20px" }}>Danh mục sản phẩm</div>

              <Form.Item<IBookFilter> name="category">
                <Checkbox.Group onChange={changeCheckboxGroup}>
                  <Space direction="vertical">
                    {categoryList.map((item) => {
                      return (
                        <Checkbox key={item.value} value={item.value}>
                          {item.label}
                        </Checkbox>
                      );
                    })}
                  </Space>
                </Checkbox.Group>
              </Form.Item>
            </div>

            <Divider />

            <div>
              <div style={{ marginBottom: "8px" }}>Khoảng giá</div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginBottom: "20px",
                  alignItems: "center",
                }}
              >
                <Form.Item<IBookFilter>
                  style={{ marginBottom: "0" }}
                  name="from"
                >
                  <InputNumber
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) =>
                      value?.replace(/\$\s?|(,*)/g, "") as unknown as number
                    }
                  />
                </Form.Item>

                <ArrowRightOutlined />

                <Form.Item<IBookFilter> style={{ marginBottom: "0" }} name="to">
                  <InputNumber
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) =>
                      value?.replace(/\$\s?|(,*)/g, "") as unknown as number
                    }
                  />
                </Form.Item>
              </div>

              <div style={{ textAlign: "center" }}>
                <Button
                  htmlType="submit"
                  style={{ width: "80%" }}
                  type="primary"
                >
                  Áp dụng
                </Button>
              </div>
            </div>

            <Divider />

            <div>
              <div style={{ marginBottom: "10px" }}>Đánh giá</div>

              <div>
                <div>
                  <Rate disabled defaultValue={5} />
                </div>

                <div>
                  <Space>
                    <Rate disabled defaultValue={4} />
                    <span> trở lên</span>
                  </Space>
                </div>

                <div>
                  <Space>
                    <Rate disabled defaultValue={3} />
                    <span> trở lên</span>
                  </Space>
                </div>

                <div>
                  <Space>
                    <Rate disabled defaultValue={2} />
                    <span> trở lên</span>
                  </Space>
                </div>

                <div>
                  <Space>
                    <Rate disabled defaultValue={1} />
                    <span> trở lên</span>
                  </Space>
                </div>
              </div>
            </div>
          </Form>
        </Col>

        <Col
          style={{
            margin: screens.xs ? "10px 0px" : "30px 0px 10px",
            padding: screens.xs ? "8px 0px 8px 10px" : "8px 0px 8px 30px",
            boxShadow: "rgba(147, 137, 137, 0.2) 0px 7px 29px 0px",
            borderRadius: "8px",
          }}
          xs={24}
          sm={18}
          lg={19}
        >
          <div>
            <Tabs defaultActiveKey="1" items={items} onChange={changeTab} />
          </div>

          {screens.xs ? (
            <div style={{ margin: "-10px 0px 6px" }}>
              <Button onClick={() => setIsFilterDrawerOpen(true)}>
                <FilterTwoTone />
                <span> Lọc</span>
              </Button>
            </div>
          ) : (
            <></>
          )}

          <Spin spinning={isLoading}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                marginBottom: "10px",
              }}
            >
              {data.map((item) => {
                const isCurrentCardHovered = hoveredId === item._id;
                return (
                  <div
                    key={item._id}
                    style={{
                      width: screens.xs
                        ? "43.25%"
                        : `${screens.xl ? `17%` : `${screens.md ? `20%` : `27%`}`}`,
                      padding: "6px",
                      border: "1px solid #ddd",
                      borderRadius: "5px",
                      marginRight: "10px",
                      marginBottom: "6px",
                      cursor: "pointer",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      transform: isCurrentCardHovered
                        ? "translateY(-8px)"
                        : "translateY(0)",
                      boxShadow: isCurrentCardHovered
                        ? "0 12px 20px rgba(0, 0, 0, 0.15)"
                        : "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                    onClick={() => {
                      navigate(`/book/${item._id}`);
                    }}
                    onMouseEnter={() => setHoveredId(item._id)}
                    onMouseLeave={() => setHoveredId("")}
                  >
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <div
                        style={{
                          width: "90%",
                          aspectRatio: "1/1",
                        }}
                      >
                        <img
                          src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.thumbnail}`}
                          alt="image"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <p
                        style={{
                          height: "3rem",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.mainText}
                      </p>
                    </div>

                    <div
                      style={{
                        color: "#EE4D2D",
                        fontSize: "17px",
                        fontWeight: "500",
                      }}
                    >
                      {formatPrice(item.price)}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Rate
                        style={{ fontSize: screens.xs ? "0.7rem" : "0.8rem" }}
                        disabled
                        defaultValue={5}
                      />
                      <span
                        style={{
                          fontSize: screens.xs ? "0.78rem" : "0.9rem",
                        }}
                      >
                        {item.sold ? item.sold : 0} đã bán
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Spin>

          <Pagination
            align="center"
            total={total}
            current={current}
            pageSize={pageSize}
            onChange={changePagination}
          />
        </Col>
      </Row>

      {screens.xs ? (
        <FilterDrawer
          isFilterDrawerOpen={isFilterDrawerOpen}
          setIsFilterDrawerOpen={setIsFilterDrawerOpen}
          form={form}
          onFinish={onFinish}
          resetFilter={resetFilter}
          changeCheckboxGroup={changeCheckboxGroup}
          categoryList={categoryList}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default Homepage;
