import dayjs from "dayjs";

export const sortByDate = (array, field) => {
  return array.sort((a, b) => dayjs(b[field]).toDate().getTime() - dayjs(a[field]).toDate().getTime())
}
