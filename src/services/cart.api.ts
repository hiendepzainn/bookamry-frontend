import instance1 from "./axios.customize";

const createOrder = (
  name: string,
  address: string,
  phone: string,
  totalPrice: number,
  type: string,
  detail: IOrderDetail[],
) => {
  const url = `/api/v1/order`;
  const data = {
    name,
    address,
    phone,
    totalPrice,
    type,
    detail,
  };

  return instance1.post<unknown, IBackendResponse<string>>(url, data);
};

const getOrderList = () => {
  const url = "/api/v1/history";
  return instance1.get<unknown, IBackendResponse<IOrderTable[]>>(url);
};

const getOrdersPaginate = (current: number, pageSize: number) => {
  const url = `/api/v1/order?current=${current}&pageSize=${pageSize}`;
  return instance1.get<
    unknown,
    IBackendResponse<IDataPaginate<IOrderManaging>>
  >(url);
};

export { createOrder, getOrderList, getOrdersPaginate };
