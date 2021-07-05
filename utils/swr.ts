import {sortByDate} from "./sort";

export const getUrlByTime = (url, param_name) => {
  return (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.length) return null // reached the end
    if (pageIndex === 0) {
      return url
    }
    let temp = sortByDate(previousPageData, param_name);
    let time = temp[temp.length-1].time;
    return `${url}?${param_name}=${time}`
  }
}
