declare global {
  interface IBookInCart {
    id: string;
    quantity: number;
    detail: IBookTable;
  }

  interface IOrderInfor {
    paymentMethod: string;
    name: string;
    phone: string;
    address: string;
  }

  interface IOrderDetail {
    bookName: string;
    quantity: number;
    _id: string;
  }

  interface IOrderTable {
    _id: string;
    name: string;
    type: string;
    email: string;
    phone: string;
    userId: string;
    detail: IOrderDetail[];
    totalPrice: number;
    paymentStatus: string;
    paymentRef: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }

  interface IOrderManaging {
    _id: string;
    name: string;
    address: string;
    phone: string;
    type: string;
    paymentStatus: string;
    paymentRef: string;
    detail: IOrderDetail[];
    totalPrice: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
}

export {};
