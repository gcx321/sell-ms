<template>
  <div class="login">
    <!-- 登录表单 -->
    <el-form class="login-form" :model="loginForm" :rules="rules" ref="loginForm">
      <!-- 标题 -->
      <div class="title">
        <h1>系统登录</h1>
      </div>

      <!-- 账号 -->
      <el-form-item prop="account">
        <el-input
          type="text"
          v-model="loginForm.account"
          auto-complete="off"
          prefix-icon="iconfont icon-icon_account"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>

      <!-- 密码 -->
      <el-form-item prop="password">
        <el-input
          :type="isShow?'text':'password'"
          auto-complete="off"
          prefix-icon="iconfont icon-mima"
          :suffix-icon=" isShow ? 'iconfont icon-yanjing-zheng' : 'iconfont icon-yanjing_bi'"
          @click.native="changeType"
          v-model="loginForm.password"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>

      <!-- 点击登录 -->
      <el-form-item>
        <el-button type="success" @click="submitLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 正则验证
import { pwdReg } from "../utils/reg";
// 验证用户身份的接口
import { checkLogin } from "@/api/account";
// 引入本地存储工具函数
import local from "@/utils/local";
export default {
  data() {
    // 自定义验证表单密码
    const checkPwd = (rule, value, callback) => {
      // rule:验证规则， value:用户输入的值  callback回调函数
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!rule.pattern.test(value)) {
        callback(new Error("请输入3-12位由字母数字混合的密码"));
      } else {
        callback();
      }
    };
    return {
      // 表单数据
      loginForm: {
        account: "",
        password: ""
      },
      isShow: false,
      // 框架自带表单验证

      rules: {
        account: [
          {
            required: true,
            message: "请填写用户名",
            trigger: "blur"
          },
          {
            min: 2,
            max: 6,
            message: "请输入3-6位的用户名",
            trigger: "blur"
          }
        ],
        // password: [{
        //   required:true ,message:"请输入密码",trigger:"blur"
        // },{
        //   min:3,max:6,message:"请输入3-6位的密码",trigger:"blur"
        // }]

        // 自定义密码验证
        password: [
          {
            validator: checkPwd,
            pattern: pwdReg(),
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    changeType(e) {
      // 睁眼闭眼图标以及密码显示切换
      if (e.target.className.includes("icon-yanjing")) {
        this.isShow = !this.isShow;
      }
    },
    // 登录
    submitLogin() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          let { code, token, role } = await checkLogin(this.loginForm);
          if (code === 0) {
            // 把登录用户的令牌存入本地
            local.set("token", token);
            // 把登录用户管理员权限存入
            local.set("role", role);
            // 跳转路由
            this.$router.push("/home");
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" >
.login {
  height: 100%;
  background: #217fbc;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-form {
    .title {
      margin-bottom: 20px;
      h1 {
        text-align: center;
        font-size: 25px;
        font-weight: 700;
        color: #e6e6e6;
      }
    }

    .el-form-item {
      .el-input {
        width: 300px;
        input {
          background: #5babe6;
          border: none;
          color: #fff;
          font-size: 16px;
        }
      }
    }
    .el-button {
      width: 100%;
      font-size: 18px;
    }
  }
}
</style>
