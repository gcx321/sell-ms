<template>
  <el-row :gutter="20">
    <el-col :span="18" :md="12" :sm="12">
      <div class="bread-crumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item
            v-for="(item,index) in breadArr"
            :key="index"
            :to="{ path:item.path }"
          >{{item.title}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </el-col>
    <el-col :span="6" class="avatar" :md="12" :sm="12">
      <div class="welcome">{{account}},欢迎您</div>
      <el-dropdown @command="handleCommand">
        <span class="avatarImg">
          <img :src="serveAPI+imgUrl" alt />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="personal">个人中心</el-dropdown-item>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<script>
import local from "@/utils/local";
import { getPersonal } from "@/api/account";
import { watch } from "fs";
export default {
  data() {
    return {
      account: "",
      imgUrl: "default.jpg",
      serveAPI: "http://127.0.0.1:5000/upload/account/",
      // 存储面包屑数组
      breadArr: []
    };
  },
  methods: {
    handleCommand(command) {
      if (command === "logout") {
        // 清除token
        local.remove("token");
        // 跳转首页
        this.$router.push("/login");
        this.$message({
          type: "success",
          message: "退出成功，欢迎下次登录"
        });
      } else if (command == "personal") {
        // 跳转个人中心
        this.$router.push("/home/personal");
      }
    },
    // 头像渲染和用户名
    async getInfo() {
      let { accountInfo } = await getPersonal();
      let { imgUrl, account } = accountInfo;
      this.imgUrl = imgUrl;
      this.account = account;
      
    },
    // 计算面包屑
    calcBreadArr() {
      // 获取meta;
      this.breadArr = this.$route.meta.breadArr;
    }
  },
  created() {
    // 获取数据
    this.getInfo();
    // 监听事件，更新头像
    this.$bus.$on("uploadAvatar", () => {
      this.getInfo(); //更新数据
    });
    
      // 加载页面，就获取面包屑一次
      this.calcBreadArr();
  },
  watch: {
    // 观察路由hash数据变化执行相关操作
    "$route.path"() {
      this.calcBreadArr();
    }
  }
};
</script>

<style lang="less">
.el-row {
  margin: 0 !important;
  .el-col {
    padding: 0 !important;
    background: #e4e9ed;
    .bread-crumb {
      background: #e4e9ed;
      line-height: 60px;
      height: 60px;
      .el-breadcrumb {
        display: flex;
        height: 60px;
        align-items: center;
        margin-left: 20px;
      }
    }
  }
  .avatar {
    display: flex;
    padding-right: 50px !important;
    .avatarImg {
      display: inline-block;
      height: 50px;
      margin-top: 5px;
      flex: 0 0 100px;
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
    }
    .welcome {
      flex: 1;
      height: 60px;
      line-height: 60px;
      padding-right: 10px;
      text-align: right;
    }
  }
}
</style>