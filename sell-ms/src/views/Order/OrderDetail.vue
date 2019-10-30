<template>
  <div class="order-detail">
    <el-card class="box-card">
      <div slot="header" class="clearfix header">
        <span>订单详情</span>
        <el-button
          :type= '!flag ? "success":"primary"'
          @click="saveList"
        >{{editBtn}}</el-button>
      </div>
      <!-- 内容 -->
      <div>
        订单号：
        <span v-show="flag">{{orderDetail.orderNo}}</span>
        <el-input type="text" v-model="orderDetail.orderNo" v-show="isShow" ></el-input>
        <el-divider></el-divider>
      </div>
      <div>
        下单时间：
        <span v-show="flag">{{orderDetail.orderTime}}</span>
        <el-input type="text" v-model="orderDetail.orderTime" v-show="isShow"></el-input>

        <el-divider></el-divider>
      </div>
      <div>
        手机号：
        <span v-show="flag">{{orderDetail.phone}}</span>
        <el-input type="text" v-model="orderDetail.phone" v-show="isShow"></el-input>

        <el-divider></el-divider>
      </div>
      <div>
        收货人：
        <span v-show="flag">{{orderDetail.consignee}}</span>
        <el-input type="text" v-model="orderDetail.consignee" v-show="isShow"></el-input>

        <el-divider></el-divider>
      </div>
      <div>
        配送地址：
        <span v-show="flag">{{orderDetail.deliverAddress}}</span>
        <el-input type="text" v-model="orderDetail.deliverAddress" v-show="isShow"></el-input>

        <el-divider></el-divider>
      </div>
      <div>
        送达时间：
        <span v-show="flag">{{orderDetail.deliveryTime}}</span>
        <el-input type="text" v-model="orderDetail.deliveryTime" v-show="isShow"></el-input>

        <el-divider></el-divider>
      </div>
      <div>
        用户备注：
        <span v-show="flag">{{orderDetail.remarks}}</span>
        <el-input type="text" v-model="orderDetail.remarks" v-show="isShow"></el-input>

        <el-divider></el-divider>
      </div>
      <div>
        订单金额：
        <span v-show="flag">{{orderDetail.orderAmount}}</span>
        <el-input type="text" v-model="orderDetail.orderAmount" v-show="isShow"></el-input>

        <el-divider></el-divider>
      </div>
      <div>
        订单状态：
        <span v-show="flag">{{orderDetail.orderState}}</span>
        <el-select v-model="orderDetail.orderState" v-show="isShow">
          <el-option label="已受理" value="已受理"></el-option>
          <el-option label="派送中" value="派送中"></el-option>
          <el-option label="已完成" value="已完成"></el-option>
        </el-select>
        <el-divider></el-divider>
      </div>
    </el-card>
  </div>
</template>

<script>
import { saveEdit } from "@/api/order";
export default {
  data() {
    return {
      orderDetail: {},
      // 编辑按钮
      editBtn: "编辑",
      // 切换控件
      flag: true,
      isShow:false
    };
  },
  created() {
    this.orderDetail = JSON.parse(sessionStorage.getItem("orderDetail"));
  },
  methods: {
    async saveList(){
      this.flag = !this.flag;
      this.isShow = ! this.flag
      if(this.flag){
        this.editBtn ="编辑"
        let {code} = await saveEdit(this.orderDetail) ;
        if(code === 0 ){
          this.$router.push("/home/orderManage")
        }
      }else{
        this.editBtn ="保存"
        
      }
      
    }
  }
};
</script>

<style lang="less" scoped>
.order-detail {
  font-size: 14px;
  .header {
    color: #999;
    font-size: 20px;
    font-weight: 600;
    display: flex;
    justify-content: space-between;
    align-items: center;
   
  }
  .el-input{
    width: 400px;
  }
}
</style>