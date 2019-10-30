<template>
  <div class="password-modify">
    <h1>修改密码</h1>
    <el-form
      ref="pwdModifyForm"
      label-width="100px"
      :model="pwdFormData"
      status-icon
      :rules="rules"
    >
      <!-- 原密码 -->
      <el-form-item label="原密码" prop="primaryPwd">
        <el-input
          v-model="pwdFormData.primaryPwd"
          :type="isShow1?'text':'password'"
          :suffix-icon="isShow1 ? 'iconfont icon-yanjing-zheng':'iconfont icon-yanjing_bi'"
          @click.native="changeType1"
        ></el-input>
      </el-form-item>

      <!-- 新密码 -->
      <el-form-item label="新密码" prop="newPwd" label-width="100px">
        <el-input
          v-model="pwdFormData.newPwd"
          :suffix-icon="isShow2 ? 'iconfont icon-yanjing-zheng':'iconfont icon-yanjing_bi'"
          :type="isShow2?'text':'password'"
          @click.native="changeType2"
        ></el-input>
      </el-form-item>

      <!-- 确认新密码 -->
      <el-form-item label="确认新密码" class="new-pwd" prop="confirmPwd" label-width="100px">
        <el-input v-model="pwdFormData.confirmPwd" type="password"></el-input>
      </el-form-item>

      <!-- 操作 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm">确定</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 引入正则验证工具函数
import { pwdReg } from "@/utils/reg";
// 引入接口
import {checkOld,editPwd} from "@/api/account"
// 引入本地存储操作方法
import local from "@/utils/local"
export default {
  data() {
    // 自定义检验密码是否一致规则
    const checkEqual = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("密码不能为空"));
      } else if (value !== this.pwdFormData.newPwd) {
        callback(new Error("两次密码不一致，请重新输入QwQ"));
      } else {
        callback();
      }
    };

    // 验证新密码
    const newPwdCheck = (rule,value,callback)=>{
      if(value ===""){
        callback(new Error("请填写你的新密码哦"));
      }else if(!rule.pattern.test(value)){
        callback(new Error("请输入3-12位由数字字母组成的密码哦QaQ"))
      }else if(value === this.pwdFormData.primaryPwd){
        callback(new Error("新密码不可以和原密码一致"))
      }else if(this.pwdFormData.confirmPwd !== ""){
        this.$refs.pwdModifyForm.validateField("confirmPwd")//触发是否与再次输入密码一致验证判断
      }{
        callback()
      } 
    }
    // 验证原密码是否正确
    const checkOldPwd = async (rule,value,callback)=>{
      let {code,msg} = await checkOld({oldPwd:value});
      if(!value){
        callback(new Error("请填写您的原密码"))
      }else if(code === "11"){
        callback(new Error(msg))
      }else{
        callback();
      }
    }
    return {
      // 表单数据
      pwdFormData: {
        primaryPwd: "",
        newPwd: "",
        confirmPwd: ""
      },
      // 是否显示密码
      isShow1: false,
      isShow2: false,
      rules: {
        // 验证原密码
        primaryPwd: [
          { required: true, validator: checkOldPwd, trigger: "blur" }
        ],
        //  验证新密码
        newPwd: [{ required: true, validator:newPwdCheck , pattern:pwdReg(), trigger: "blur" }],
        // 验证密码是否一致
        confirmPwd: [
          {
            required: true,
            validator: checkEqual,
            trigger: "blur"
          }
        ]
      }
      
    };
  },
  methods: {
    changeType1(e) {
      // 是否显示原密码
      if (e.target.className.includes("icon-yanjing")) {
        this.isShow1 = !this.isShow1;
      }
    },
    changeType2(e) {
      // 是否显示新密码
      if (e.target.className.includes("icon-yanjing")) {
        this.isShow2 = !this.isShow2;
      }
    },
    // 重置表单
    resetForm(){
      this.$refs.pwdModifyForm.resetFields()
    },
    // 提交表单
  submitForm(){
    this.$refs.pwdModifyForm.validate(async valide=>{
      if(valide){
        let {code,msg} = await editPwd({newPwd:this.pwdFormData.newPwd})
        if(code === 0){
          // 清除token
          local.remove("token");
          // 跳转登录
          this.$router.push("/login")
        }
        
      }else{
        alert("提交失败，请检查是否填写正确")
        return false;
      }
    })
  }
  }
};
</script>

<style lang="less" >
.password-modify {
  margin: 20px;
  box-shadow: 0px 4px 8px #999;

  h1 {
    color: #999;
    font-size: 20px;
    height: 50px;
    line-height: 50px;
    font-weight: 600;
    text-indent: 20px;
    border-bottom: 1px solid #e6e6e6;
    background: #eaeff5;
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