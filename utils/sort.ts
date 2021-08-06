import dayjs from "dayjs";

export const sortByDate = (array, field) => {
  return array.sort(
    (a, b) =>
      dayjs(b[field]).toDate().getTime() - dayjs(a[field]).toDate().getTime()
  );
};

export const groupByDate = (array, field = "time") => {
  const ret = {};
  array.forEach((it) => {
    const date = dayjs(it[field]).format("MMM DD, YYYY");
    if (ret[date] === undefined) {
      ret[date] = [];
    }
    ret[date].push(it);
  });
  return Object.keys(ret).map((date) => [date, ret[date]]);
};
