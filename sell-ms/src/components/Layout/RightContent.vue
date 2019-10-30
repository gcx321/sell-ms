<template>
  <el-container class="right">
    <rightHeader></rightHeader>

    <!-- 右下内容主题 -->
    <el-main class="content">
      <!-- 路由出口 -->
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import rightHeader from "./RightHeader"
export default {
  components:{
    rightHeader
  }
};
</script>
    
<style lang="less" scoped>
.right {
  background: #e6e6e6;
  display: flex;
  flex-direction: column;
  .content {
    background: #D6E4F2;
    padding: 0;
  }
}
</style>