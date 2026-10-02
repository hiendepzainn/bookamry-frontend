import instance1 from "./axios.customize";

const getUserPaginate = (
  current: number,
  pageSize: number,
  fullName: string = "",
  email: string = "",
  createdAt: string[] = [],
  sort: ISort = { name: "", type: "" },
) => {
  const url = `/api/v1/user?current=${current}&pageSize=${pageSize}${fullName == "" ? "" : `&fullName=/${fullName}/i`}${email == "" ? "" : `&email=/${email}/i`}${createdAt.length == 0 ? "" : `&createdAt>=${createdAt[0]}&createdAt<=${createdAt[1]}`}${sort.name === "" ? `` : `&sort=${sort.type === "ascend" ? `` : `-`}${sort.name}`}`;
  return instance1.get<unknown, IBackendResponse<IDataPaginate<IUserTable>>>(
    url,
  );
};

const createNewUser = (data: IFieldRegister) => {
  const url = "/api/v1/user";
  return instance1.post<unknown, IBackendResponse<IUserTable>>(url, data);
};

const importUsers = (data: IUserImport[]) => {
  const url = "/api/v1/user/bulk-create";
  return instance1.post<unknown, IBackendResponse<IDataImportResponse>>(
    url,
    data,
  );
};

const updateUser = (data: IFieldUpdate) => {
  const url = "/api/v1/user";
  const dataUpdate = {
    _id: data.id,
    fullName: data.fullName,
    phone: data.phone,
  };
  return instance1.put<unknown, IBackendResponse<string>>(url, dataUpdate);
};

const deleteUser = (id: string) => {
  const url = `/api/v1/user/${id}`;
  return instance1.delete<unknown, IBackendResponse<string>>(url);
};

const uploadFileAvatar = (file: File) => {
  const url = "/api/v1/file/upload";
  const formData = new FormData();
  formData.append("fileImg", file);

  return instance1.post<unknown, IBackendResponse<IDataUploadImage>>(
    url,
    formData,
    {
      headers: {
        "upload-type": "avatar",
      },
    },
  );
};

const updateInfoUser = (
  _id: string,
  fullName: string,
  phone: string,
  avatar: string,
) => {
  const url = "/api/v1/user";
  const data = {
    _id,
    fullName,
    phone,
    avatar,
  };

  return instance1.put<unknown, IBackendResponse<string>>(url, data);
};

const changePassword = (email: string, oldpass: string, newpass: string) => {
  const url = "/api/v1/user/change-password";
  const data = {
    email,
    oldpass,
    newpass,
  };

  return instance1.post<unknown, IBackendResponse<string>>(url, data);
};

export {
  getUserPaginate,
  createNewUser,
  importUsers,
  updateUser,
  deleteUser,
  uploadFileAvatar,
  updateInfoUser,
  changePassword,
};
