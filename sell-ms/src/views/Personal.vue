<template>
  <div class="personal-center">
    <h1>个人中心</h1>
    <div class="personal-detail">
      <div>
        <span class="info">管理员ID: {{id}}</span>
        <el-divider></el-divider>
      </div>
      <div>
        <span class="info">账号: {{account}}</span>
        <el-divider></el-divider>
      </div>
      <div>
        <span class="info">用户组: {{groups}}</span>
        <el-divider></el-divider>
      </div>
      <div>
        <span class="info">创建时间: {{ctime | filtersTime}}</span>
        <el-divider></el-divider>
      </div>
      <div>
        <span class="info">管理员头像:</span>
        <el-upload
          class="avatar-uploader"
          action="http://127.0.0.1:5000/account/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imgUrl" :src="serveApi + imgUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-divider></el-divider>
      </div>
      <el-button
        @click="editAvatar"
        style="margin-left: 30px; margin-top: 15px;"
        size="small"
        type="primary"
      >修改头像</el-button>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { getPersonal,saveAvatar } from "@/api/account";
export default {
  data() {
    return {
      serveApi:"http://127.0.0.1:5000/upload/account/",
      id: "",
      account: "",
      groups: "",
      ctime: "",
      imgUrl:""
    };
  },
  methods: {
    // 上传成功
    handleAvatarSuccess(res) {
        // 回填头像
      let {imgUrl} = res;
      this.imgUrl = imgUrl;
    },
    // 上传前
    beforeAvatarUpload(file) {
      // 图片格式限制
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!(isJPG || isPNG)) {
        this.$message.error("上传头像图片只能是 JPG 或 PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return (isJPG || isPNG) && isLt2M;
    },
    // 获取用户信息
    async getPersonal() {
      let infoData = await getPersonal();
      let accountInfo = infoData.accountInfo;
      this.id = accountInfo.id;
      this.account = accountInfo.account;
      this.groups = accountInfo.groups;
      this.ctime = accountInfo.ctime;
    },
    // 保存修改头像
    async editAvatar() {
      let {code} = await saveAvatar({imgUrl:this.imgUrl});
      if(code === 0){
        // 发通知，告诉头头像更新了
        this.$bus.$emit("uploadAvatar")
        // 跳转首页
        this.$router.push("/home")
      }
    }
  },
  created() {
    //   显示用户信息
    this.getPersonal();
  },
  filters: {
    filtersTime(time) {
      return moment(time).format("YYYY/MM/DD hh:mm:ss");
    }
  }
};
</script>

<style lang="less">
.personal-center {
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
  .personal-detail {
    padding: 30px;
    font-size: 14px;
    background: #fff;
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      margin-top: 20px;
      .info {
        color: #888;
      }
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409eff;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  }
}
</style>