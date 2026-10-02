import dayjs from "dayjs";

const getStringArrayDateRange = (dateRange: string[]) => {
  const startDate = dayjs(dateRange[0], "YYYY-MM-DD").toDate();
  const endDate = dayjs(dateRange[1], "YYYY-MM-DD").toDate();
  return [startDate.toString(), endDate.toString()];
};

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-GB").format(new Date(date));
};

const formatPrice = (price: number) => {
  return `${price.toLocaleString("de-DE")} đ`;
};

export { getStringArrayDateRange, formatDate, formatPrice };
