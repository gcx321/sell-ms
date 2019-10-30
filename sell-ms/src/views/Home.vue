<template>
  <div class="home">
    <el-container>
      <!-- 左侧导航 -->
      <leftNav></leftNav>

      <!-- 右侧内容 -->
     <rigtContent></rigtContent>
    </el-container>
  </div>
</template>

<script>
// 引入组件
import leftNav from "../components/Layout/LeftNav.vue"
import rigtContent from "../components/Layout/RightContent.vue"
export default {
  // 注册组件
  components:{
    leftNav,
    rigtContent
  }
};
</script>

<style lang="less" >
.home{
  height: 100%;
  .el-container{
    height: 100%;
  }
}
</style>