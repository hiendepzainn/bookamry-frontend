import instance1 from "./axios.customize";

const getBooksHomepage = (
  current: number,
  pageSize: number,
  sort: ISort,
  categoryList: string[],
  priceFrom: string,
  priceTo: string,
  keyword: string,
) => {
  const defaultUrl = `/api/v1/book?current=${current}&pageSize=${pageSize}`;

  const querySort =
    sort.name === ""
      ? ""
      : `&sort=${sort.type === "asc" ? "" : "-"}${sort.name},_id`;

  const queryCategory =
    categoryList.length === 0 ? "" : `&category=${categoryList.join()}`;

  const queryFrom = priceFrom === "" ? "" : `&price>=${priceFrom}`;
  const queryTo = priceTo === "" ? "" : `&price<=${priceTo}`;
  const queryPrice = queryFrom + queryTo;

  const queryKeyword = keyword === "" ? "" : `&mainText=/${keyword}/i`;

  const url =
    defaultUrl + querySort + queryCategory + queryPrice + queryKeyword;

  return instance1.get<unknown, IBackendResponse<IDataPaginate<IBookTable>>>(
    url,
  );
};

const getBookDetailsByID = (id: string) => {
  const url = `/api/v1/book/${id}`;
  return instance1.get<unknown, IBackendResponse<IBookTable>>(url);
};

const getDashboard = () => {
  const url = "/api/v1/database/dashboard";
  return instance1.get<unknown, IBackendResponse<IDataDashboard>>(url);
};

export { getBooksHomepage, getBookDetailsByID, getDashboard };
