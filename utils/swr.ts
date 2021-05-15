export const getUrlByTime = (url, param_name) => {
  return (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.length) return null // reached the end
    if (pageIndex === 0) {
      return url
    }
    return `${url}?${param_name}=${previousPageData[previousPageData.length-1].create_time}`
  }
}
