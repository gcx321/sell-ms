<template>
  <div class="add-user">
    <h1>添加账号</h1>
    <el-form ref="addAccountForm" label-width="80px" status-icon :model="formData" :rules="rules">
      <!-- 账号 -->
      <el-form-item label="账号" prop="account">
        <el-input v-model="formData.account"></el-input>
      </el-form-item>

      <!-- 密码 -->
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="formData.password"></el-input>
      </el-form-item>

      <!-- 确认密码 -->
      <el-form-item label="确认密码" prop="checkPwd">
        <el-input type="password" v-model="formData.checkPwd"></el-input>
      </el-form-item>

      <!-- 用户组 -->
      <el-form-item label="用户组" prop="groups">
        <el-select placeholder="请选择用户组" v-model="formData.groups" style="width:300px">
          <el-option label="超级管理员" value="超级管理员"></el-option>
          <el-option label="普通管理员" value="普通管理员"></el-option>
        </el-select>
      </el-form-item>

      <!-- 操作 -->
      <el-form-item>
        <el-button type="primary" @click="addAccount">添加</el-button>
        <el-button @click="resetAccount">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 引入正则工具函数
import { pwdReg } from "@/utils/reg";
// 引入接口工具方法
import { accountAdd } from "@/api/account";
import { async } from "q";
export default {
  data() {
    // 自定义验证密码
    const validatePwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!rule.pattern.test(value)) {
        callback(new Error("请输入3-12位由数字字母组成的密码"));
      } else {
        callback();
      }
    };
    // 自定义验证密码是否一致
    const validatePwdEqual = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value !== this.formData.password) {
        callback(new Error("两次输入密码不一致，请再次确认"));
      } else {
        callback();
      }
    };
    return {
      formData: {
        account: "",
        password: "",
        checkPwd: "",
        groups: ""
      },
      // 验证规则
      rules: {
        account: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          },
          {
            min:2,max:8,message:"请输入2-8位的用户名",trigger:"blur"
          }
        ],
        // 自定义验证密码
        password: [
          {
            required: true,
            validator: validatePwd,
            pattern: pwdReg(),
            trigger: "blur"
          }
        ],
        // 自定义密码是否一致
        checkPwd: [
          {
            required: true,
            validator: validatePwdEqual,
            trigger: "blur"
          }
        ],
        groups: [
          {
            required: true,
            message: "请选择用户组",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    // 提交表单
    addAccount() {
      // 调取内置方法验证所有表单
      this.$refs.addAccountForm.validate(async valid => {
        if (valid) {
          // 发送请求
          let { code, msg } = await accountAdd(this.formData);
          // 请求成功
          if (code === 0) {
            // 路由跳转
            this.$router.push("/home/usersList")              
          }
        } else {
          return 
        }
      });
    },
    resetAccount() {
      // 重置表单
      this.$refs.addAccountForm.resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
.add-user {
  box-shadow: 0px 4px 8px #999;

  margin: 20px;
  h1 {
    background: #eaeff5;
    color: #999;
    font-size: 20px;
    height: 50px;
    line-height: 50px;
    font-weight: 600;
    text-indent: 20px;
    border-bottom: 1px solid #e6e6e6;
  }
  .el-form {
    padding-top: 30px;
    padding-bottom: 30px;
    background: #fff;
    .el-form-item {
      margin-left: 50px;
      .el-input {
        width: 300px;
      }
    }
  }
}
</style>