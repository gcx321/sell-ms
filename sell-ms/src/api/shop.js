// 获取店铺数据

// 引入封装的发axios函数
import req from "@/utils/request";
// 店铺信息
export const shopInfo = () => req.get("/shop/shopinfo")
// 保存修改
export const editShop = params => req.post("/shop/shopedit",params)
