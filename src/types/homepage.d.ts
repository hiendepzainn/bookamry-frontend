declare global {
  interface IBookFilter {
    category: string[];
    from: number;
    to: number;
  }

  interface IFilterPrice {
    from: string;
    to: string;
  }

  interface IDataDashboard {
    countOrder: number;
    countUser: number;
    countBook: number;
  }
}

export {};
