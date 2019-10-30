/* 商品管理接口 */

// 引入封装的发axios函数
import req from "@/utils/request"

// 商品添加接口
export const goodsAdd = params => req.post("/goods/goodsadd",params)
// 获取商品列表接口
export const getGoods = params => req.get("/goods/goodslist",params)
// 删除商品列表接口
export const delGoods = params => req.get("/goods/goodsdel",params)
//编辑商品列表接口
export const editGoods = params => req.post("/goods/goodsedit",params)