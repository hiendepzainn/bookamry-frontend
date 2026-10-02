declare global {
  interface IBookTable {
    _id: string;
    thumbnail: string;
    slider: string[];
    mainText: string;
    author: string;
    price: number;
    sold: number;
    quantity: number;
    category: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }

  interface IBookSearchField {
    mainText: string;
    author: string;
  }

  interface IBookCreate {
    mainText: string;
    author: string;
    price: number;
    category: string;
    quantity: number;
    thumbnail: UploadFile[];
    slider: UploadFile[];
  }

  interface IBookCategory {
    value: string;
    label: string;
  }

  interface IDataUploadImage {
    fileUploaded: string;
  }

  interface IDataCreate {
    _id: string;
    thumbnail: string;
    slider: string[];
    mainText: string;
    author: string;
    price: number;
    quantity: number;
    category: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
}

export {};
