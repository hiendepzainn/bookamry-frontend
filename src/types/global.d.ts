declare global {
  //--------CONTEXT---------
  interface IContext {
    authenticated: boolean;
    user: IDataLoginUser;
    loadingApp: boolean;
    setAuthenticated: (value: boolean) => void;
    setUser: (user: IDataLoginUser) => void;
    setLoadingApp: (value: boolean) => void;
    cart: IBookInCart[];
    setCart: (value: IBookInCart[]) => void;
  }
  //--------CONTEXT---------

  interface IFieldRegister {
    fullName: string;
    email: string;
    password: string;
    phone: string;
  }

  interface IFieldLogin {
    username: string;
    password: string;
  }

  //type Axios Response
  interface IBackendResponse<T> {
    statusCode: number;
    message: string;
    error?: string;
    author?: string;
    data?: T;
  }

  //--------REGISTER---------
  interface IDataRegister {
    email: string;
    fullName: string;
    _id: string;
  }
  //--------REGISTER---------

  //--------LOGIN--------------------------------------------------
  interface IDataLogin<T> {
    access_token: string;
    user: T;
  }

  interface IDataLoginUser {
    avatar: string;
    email: string;
    fullName: string;
    id: string;
    phone: string;
    role: string;
  }
  //--------LOGIN--------------------------------------------------

  //--------FETCH ACCOUNT-------------------
  interface IDataFetchAccount<T> {
    user: T;
  }
  //--------FETCH ACCOUNT-------------------

  //type Axios Response
}

export {};
