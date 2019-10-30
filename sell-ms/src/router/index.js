import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: '/login',
    component: () => import("../views/Login.vue")
  },
  {
    path: '/home',
    component: () => import("../views/Home.vue"),
    children: [{
      // 后台首页
      meta: {
        breadArr: [
          { path: "/home", title: "首页" },
          { path: "/home", title: "后台首页" },
        ]
      },
      path: "",
      name: "home",
      component: () => import("../views/Index.vue"),

    },
    {
      // 订单管理
      meta: {
        breadArr: [
          { path: "/home", title: "首页" },
          { path: "/home/orderManage", title: "订单管理" },
        ]
      },
      path: "/home/orderManage",
      component: () => import("../views/Order/OrderManage.vue"),
    },
    {
      // 订单详情
      meta: {
        breadArr: [
          { path: "/home", title: "首页" },
          { path: "/home/orderDetail", title: "订单详情" },
        ]
      },
      path: "/home/orderDetail",
      component: () => import("../views/Order/OrderDetail.vue"),
    },

    // 商品管理

    // 商品列表
    {
      meta: {
        breadArr: [
          { path: "/home", title: "首页" },
          { path: "/home/goodsList", title: "商品管理" },
          { path: "/home/goodsList", title: "商品列表" },
        ]
      },
      path: "/home/goodsList",
      component: () => import("../views/GoodsManage/GoodsList.vue")
    },
    // 添加商品
    {
      meta: {
        breadArr: [
          { path: "/home", title: "首页" },
          { path: "/home/goodsList", title: "商品管理" },
          { path: "/home/orderAdd", title: "添加商品" },
        ]
      },
      path: "/home/orderAdd",
      component: () => import("../views/GoodsManage/GoodsAdd.vue")
    },
    // 编辑商品
    {
      meta: {
        breadArr: [
          { path: "/home", title: "首页" },
          { path: "/home/goodsList", title: "商品管理" },
          { path: "/home/editgoods", title: "添加商品" },
        ]
      },
      path: "/home/editgoods",
      component: () => import("../views/GoodsManage/GoodsEdit.vue")
    },
    // 店铺管理
    {
      meta: {
        breadArr: [
          { path: "/home", title: "首页" },
          { path: "/home/shopManage", title: "店铺管理" },
        ]
      },
      path: "/home/shopManage",
      component: () => import("../views/ShopManage.vue")
    },
    // 账号管理
    {
      // 账号列表
      meta: {
        breadArr: [
          { path: "/home", title: "首页" },
          { path: "/home/usersList", title: "账号管理" },
          { path: "/home/usersList", title: "账号列表" },
        ]
      },
      path: "/home/usersList",
      component: () => import("../views/AccountManage/UsersList.vue")
    },
    {
      // 添加账号
      meta: {
        breadArr: [
          { path: "/home", title: "首页" },
          { path: "/home/usersList", title: "账号管理" },
          { path: "/home/usersAdd", title: "添加账号" },
        ]
      },
      path: "/home/usersAdd",
      component: () => import("../views/AccountManage/UsersAdd.vue")
    },
    {
      // 修改密码
      meta: {
        breadArr: [
          { path: "/home", title: "首页" },
          { path: "/home/usersList", title: "账号管理" },
          { path: "/home/passwordModify", title: "修改密码" },
        ]
      },
      path: "/home/passwordModify",
      component: () => import("../views/AccountManage/passwordModify.vue")
    },
    {
      
      // 个人中心
      meta: {
        breadArr: [
          { path: "/home", title: "首页" },
          { path: "/home/personal", title: "个人中心" },
        ]
      },
      path: "/home/personal",
      component: () => import("../views/Personal.vue")
    },
    // 销售管理
    {
      // 商品统计
      meta: {
        breadArr: [
          { path: "/home", title: "首页" },
          { path: "/home/salesTotal", title: "销售统计" },
          { path: "/home/salesTotal", title: "商品统计" },
        ]
      },
      path: "/home/salesTotal",
      component: () => import("../views/SalesTotal/ShopTotal.vue")
    },
    {
      // 订单统计
      meta: {
        breadArr: [
          { path: "/home", title: "首页" },
          { path: "/home/salesTotal", title: "销售统计" },
          { path: "/home/listTotal", title: "商品统计" },
        ]
      },
      path: "/home/listTotal",
      component: () => import("../views/SalesTotal/ListTotal.vue")

    }
    ]
  },

]

const router = new VueRouter({
  routes
})

export default router
