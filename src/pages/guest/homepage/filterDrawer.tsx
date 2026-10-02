import {
  ArrowRightOutlined,
  FilterTwoTone,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Divider,
  Drawer,
  Form,
  FormInstance,
  InputNumber,
  Rate,
  Space,
} from "antd";

interface IProps {
  isFilterDrawerOpen: boolean;
  setIsFilterDrawerOpen: (value: boolean) => void;
  form: FormInstance;
  onFinish: (values: IBookFilter) => void;
  resetFilter: () => Promise<void>;
  changeCheckboxGroup: (checkedValues: string[]) => Promise<void>;
  categoryList: IBookCategory[];
}

const FilterDrawer = (props: IProps) => {
  const {
    isFilterDrawerOpen,
    setIsFilterDrawerOpen,
    categoryList,
    changeCheckboxGroup,
    form,
    onFinish,
    resetFilter,
  } = props;

  return (
    <Drawer
      width="80vw"
      title="Bộ lọc sản phẩm"
      onClose={() => setIsFilterDrawerOpen(false)}
      open={isFilterDrawerOpen}
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
            <Form.Item<IBookFilter> style={{ marginBottom: "0" }} name="from">
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
            <Button htmlType="submit" style={{ width: "80%" }} type="primary">
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
    </Drawer>
  );
};

export default FilterDrawer;
