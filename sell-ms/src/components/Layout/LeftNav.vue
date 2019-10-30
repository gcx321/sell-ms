<template>
  <div class="leftNav">
    <el-row class="tac">
      <!-- 导航头 -->
      <el-col :span="12" class="items">
        <!-- 侧导航 -->
        <el-menu
          :default-active="path"
          class="el-menu-vertical-demo"
          text-color="#fff"
          background-color="#007acc"
          active-text-color="#B8ACFF"
          unique-opened
          router
          :collapse="isCollapse"
        >
           <el-menu-item @click.native="isShowMenu">
             <i :class="elIcon" ><span class="menuUp">收起菜单</span></i>
            </el-menu-item>
          <!-- 一级导航 -->
          <template v-for="(item,index) in menu">
            <el-menu-item v-if="!item.children" :index="item.path" :key="index" class="oneMenu">
              <i class="iconfont" :class="item.icon"></i>
              <span slot="title">{{item.title}}</span>
            </el-menu-item>
            <!-- 二级导航 -->
            <el-submenu v-else :index="item.path" :key="index">
              <template slot="title">
                <i class="iconfont" :class="item.icon"></i>
                <span>{{item.title}}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item
                  :index="v.path"
                  v-for="(v,index) in item.children"
                  :key="index"
                >{{v.title}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </template>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import local from "@/utils/local";
export default {
  data() {
    return {
      isCollapse: false,//是否折叠 
      menu: [],//导航
      elIcon:"el-icon-arrow-up"
    };
  },
  computed: {
    path() {
      if (this.$route.path.includes("order")) {
        return "/home/orderManage";
      }
      if (this.$route.path === "/home/goodsedit") {
        return "/home/goodsList";
      }
      return this.$route.path;
    }
  },
  methods:{
    // // 折叠控制
    isShowMenu(){
      this.isCollapse = !this.isCollapse
      this.isCollapse? this.elIcon = "el-icon-menu":this.elIcon = "el-icon-arrow-up"
    },
  
  },
  created() {
    // 分配权限
    let role = local.get("role");
    // 要分配的菜单
    let asyncMenu = [
      {
        // 首页
        path: "/home",
        icon: "icon-shouye",
        title: "后台首页",
        meta: { roles: ["super", "general"] }
      },
      {
        // 订单管理
        path: "/home/orderManage",
        icon: "icon-dingdan",
        title: "订单管理",
        meta: { roles: ["super", "general"] }
      },
      {
        // 商品管理
        path: "/home/goodsManage",
        icon: "icon-shangpin",
        title: "商品管理",
        meta: { roles: ["super", "general"] },
        children: [
          { path: "/home/goodsList", title: "商品列表" },
          { path: "/home/orderAdd", title: "添加商品" }
        ]
      },
      // 店铺管理
      {
        path: "/home/shopManage",
        icon: "icon-dianpu",
        title: "店铺管理",
        meta: { roles: ["super", "general"] }
      },
      {
        // 账号管理
        path: "/home/userManage",
        icon: "icon-zhanghaoguanli",
        title: "账号管理",
        meta: { roles: ["super"] },

        children: [
          { path: "/home/usersList", title: "账号列表" },
          { path: "/home/usersAdd", title: "添加账号" },
          { path: "/home/passwordModify", title: "修改密码" }
        ]
      },
      // 销售统计
      {
        path: "/home/salesTotal",
        icon: "icon-xiaoshoutongji",
        title: "销售统计",
        meta: { roles: ["super"] },

        children: [
          {
            path: "/home/salesTotal",
            title: "商品统计"
          },
          {
            path: "/home/listTotal",
            title: "订单统计"
          }
        ]
      }
    ];
    // 分配
    let userMenu = asyncMenu.filter(
      items => items.meta && items.meta.roles.includes(role)
    );
    this.menu = userMenu;
  }
};
</script>

<style lang="less">
.leftNav {
  border: none;
  background: #007acc;
  .tac {
    height: 100%;
  }
  .menuUp{
    font-size: 14px;
    margin-left: 2px;
  }
  .items {
  background: #007acc!important;

    width: 100%;
    height: 100%;
    .el-menu {
      border: none;
      .oneMenu{
        padding-left: 40px;
        padding-right: 40px;
      }
      .el-menu-item {
        i {
          margin-right: 5px;
          color: white;
          
        }
      }

      .el-submenu {
        background: #fff;
        i {
          margin-right: 5px;
          color: #fff;
        }
      }
    }
  }
}
</style>