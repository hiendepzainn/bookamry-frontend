import instance1 from "./axios.customize";

const getBooksPaginate = (
  current: number,
  pageSize: number,
  mainText: string,
  author: string,
  sort: ISort,
) => {
  const url = `/api/v1/book?current=${current}&pageSize=${pageSize}${mainText === "" ? `` : `&mainText=/${mainText}/i`}${author === "" ? `` : `&author=/${author}/i`}${sort.name === "" ? "" : `&sort=${sort.type === "ascend" ? "" : "-"}${sort.name}`}`;
  return instance1.get<unknown, IBackendResponse<IDataPaginate<IBookTable>>>(
    url,
  );
};

const getBookCategory = () => {
  const url = "/api/v1/database/category";
  return instance1.get<unknown, IBackendResponse<string[]>>(url);
};

const uploadFileImage = (file: File) => {
  const url = "/api/v1/file/upload";
  const formData = new FormData();
  formData.append("fileImg", file);

  return instance1.post<unknown, IBackendResponse<IDataUploadImage>>(
    url,
    formData,
    {
      headers: {
        "upload-type": "book",
      },
    },
  );
};

const createNewBook = (
  mainText: string,
  author: string,
  price: number,
  quantity: number,
  category: string,
  thumbnail: string,
  slider: string[],
) => {
  const url = "/api/v1/book";
  const data = {
    mainText,
    author,
    price,
    category,
    quantity,
    thumbnail,
    slider,
  };

  return instance1.post<unknown, IBackendResponse<IDataCreate>>(url, data);
};

const updateBook = (
  id: string,
  category: string,
  quantity: number,
  price: number,
  author: string,
  mainText: string,
  slider: string[],
  thumbnail: string,
) => {
  const url = `/api/v1/book/${id}`;
  const data = {
    mainText,
    author,
    slider,
    thumbnail,
    price,
    quantity,
    category,
  };

  return instance1.put<IBackendResponse<string>>(url, data);
};

const deleteBook = (id: string) => {
  const url = `/api/v1/book/${id}`;
  return instance1.delete<IBackendResponse<string>>(url);
};

export {
  getBooksPaginate,
  getBookCategory,
  uploadFileImage,
  createNewBook,
  updateBook,
  deleteBook,
};
