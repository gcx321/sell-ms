// 订单列表

// 引入封装的发axios函数
import req from "@/utils/request"
// 查询订单
export const getOrderList = params => req.get("/order/orderlist",params)
//保存修改
export const saveEdit = params => req.post("/order/orderedit",params)
//订单报表统计
export const orderEchatrs = params => req.get("/order/ordertotal",params)
//首页报表统计
export const indexCharts = () => req.get("/order/indexcharts")