/* 用户账号管理接口 */

// 引入封装的发axios函数
import req from "@/utils/request"

// 添加账号模块
export const accountAdd = params => req.post("/account/accountadd",params)

// 获取列表模块
export const accountList = params => req.get("/account/accountlist",params)

// 删除单个用户
export const accountDel = params => req.get("/account/accountdel",params)

// 批量删除用户
export const batchDelAcc = params => req.get("/account/batchdel",params)

//编辑用户信息
export const editAcc = params => req.post("/account/editaccount",params);

// 验证用户身份
export const checkLogin = params => req.post("/account/checklogin",params);

// 验证旧密码是否正确
export const checkOld = params => req.get("/account/checkoldpwd",params);

// 修改密码
export const editPwd = params => req.post("/account/passwordedit",params);
// 个人中心信息获取
export const getPersonal = () => req.get("/account/accountinfo");
// 保存头像
export const saveAvatar = params => req.get("/account/avataredit",params); 