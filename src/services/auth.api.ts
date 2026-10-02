import instance1 from "./axios.customize";

const register = (data: IFieldRegister) => {
  const url = "/api/v1/user/register";
  return instance1.post<unknown, IBackendResponse<IDataRegister>>(url, data);
};

const login = (data: IFieldLogin) => {
  const url = "/api/v1/auth/login";
  return instance1.post<unknown, IBackendResponse<IDataLogin<IDataLoginUser>>>(
    url,
    data,
  );
};

const fetchAccount = () => {
  const url = "/api/v1/auth/account";
  return instance1.get<
    unknown,
    IBackendResponse<IDataFetchAccount<IDataLoginUser>>
  >(url, {
    headers: {
      delay: 1000,
    },
  });
};

const logout = () => {
  const url = "/api/v1/auth/logout";
  return instance1.post<unknown, IBackendResponse<string>>(url);
};

export { register, login, fetchAccount, logout };
