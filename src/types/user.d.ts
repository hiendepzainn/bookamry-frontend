declare global {
  interface IUserTable {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    avatar: string;
    isActive: boolean;
    type: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }

  interface IDataPaginate<T> {
    meta: {
      current: string;
      pageSize: string;
      pages: number;
      total: number;
    };
    result: T[];
  }

  interface IUserSearchField {
    fullName: string;
    email: string;
    createdAt: string[];
  }

  interface ISort {
    name: string;
    type: string;
  }

  interface IUserImport {
    fullName: string;
    password: string;
    email: string;
    phone: string;
  }

  interface IDataImportResponse {
    countSuccess: number;
    countError: number;
    detail: string;
  }

  interface IFieldUpdate {
    id: string;
    email: string;
    fullName: string;
    phone: string;
  }

  interface IUserUpdateInfo {
    email: string;
    fullName: string;
    phone: string;
  }

  interface IFieldChangePassword {
    email: string;
    currentPassword: string;
    newPassword: string;
  }
}

export {};
