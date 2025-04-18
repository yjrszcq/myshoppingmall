import request from "@/utils/http";

// 获取销售趋势数据
export const getSalesTrendData = ({ year, month, detail = false }) => {
  return request({
    url: "/api/seller/reports/monthly",
    method: "GET",
    params: {
      year,
      month,
      detail
    },
  });
};
