<template>
  <div class="order-manage">
    <el-form :inline="true" class="require" :model="searchForm">
      <!-- 订单状态 -->
      <el-form-item label="订单状态" label-width="100px">
        <el-select placeholder="订单状态" v-model="searchForm.orderState">
          <el-option label="已受理" value="已受理"></el-option>
          <el-option label="派送中" value="派送中"></el-option>
          <el-option label="已完成" value="已完成"></el-option>
        </el-select>
      </el-form-item>
      <!-- 订单号 -->
      <el-form-item label="订单号" label-width="100px">
        <el-input v-model="searchForm.orderNo" placeholder="订单号"></el-input>
      </el-form-item>

      <!-- 收货人 -->
      <el-form-item label="收货人" label-width="100px">
        <el-input v-model="searchForm.consignee" placeholder="收货人"></el-input>
      </el-form-item>

      <!-- 手机号 -->
      <el-form-item label="手机号" label-width="100px">
        <el-input v-model="searchForm.phone" placeholder="手机号" style="width:220px"></el-input>
      </el-form-item>
      <!-- 选择时间 -->
      <el-form-item label="选择时间" class="timeSelect" label-width="100px">
        <el-date-picker
          v-model="searchForm.date"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <!-- 查询 -->
      <el-form-item>
        <el-button type="primary" class="require-btn" @click="search">查询</el-button>
      </el-form-item>
      <!-- 重置-->
      <el-form-item>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 订单详情 -->
    <div class="detailOrder">
      <el-table border style="width: 100%" :data="order">
        <el-table-column fixed prop="orderNo" label="订单号" width="150"></el-table-column>
        <el-table-column prop="orderTime" label="下单时间" width="200"></el-table-column>
        <el-table-column prop="phone" label="手机号" width="120"></el-table-column>
        <el-table-column prop="consignee" label="收货人" width="120"></el-table-column>
        <el-table-column prop="deliverAddress" label="配送地址" width="200"></el-table-column>
        <el-table-column prop="deliveryTime" label="送达时间" width="200"></el-table-column>
        <el-table-column prop="remarks" label="用户备注" width="120"></el-table-column>
        <el-table-column prop="orderAmount" label="订单金额" width="120"></el-table-column>
        <el-table-column prop="orderState" label="订单状态" width="120"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="detailClick(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="page">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
// 订单相关接口
import { getOrderList } from "@/api/order";
// 格式化时间
import moment from "moment";
export default {
  data() {
    return {
      // 查询数据
      searchForm: {
        ordeNo: "",
        orderState: "",
        consignee: "",
        phone: "",
        date: []
      },
      // 订单数据
      order: [],
      //   分页数据
      currentPage: 1,
      pageSize: 3,
      total: 10
    };
  },
  methods: {
    // 获取订单列表
    async getOrders() {
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        orderNo: this.searchForm.ordeNo,
        consignee: this.searchForm.consignee,
        phone: this.searchForm.phone,
        orderState: this.searchForm.orderState,
        date: JSON.stringify(this.searchForm.date)
      };
      let { total, data } = await getOrderList(params);
      this.total = total;
      // 格式化时间
      data.forEach(v => {
        v.orderTime = moment(v.orderTime).format("YYYY-MM-DD hh:mm:ss");
        v.deliveryTime = moment(v.deliveryTime).format("YYYY-MM-DD hh:mm:ss");
      });
      this.order = data;
    },

    //   编辑订单
    detailClick(row) {
      window.sessionStorage.setItem("orderDetail",JSON.stringify(row))
      this.$router.push("/home/orderDetail")
    },

    // 分页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getOrders();
    },
    // 查询
    search() {
      this.currentPage = 1;
      this.getOrders();
    },
    // 重置查询
    resetForm() {
       this.searchForm = {
        ordeNo: "",
        orderState: "",
        consignee: "",
        phone: "",
        date: []
      }
      // 刷新列表
    this.getOrders()
    }
  },

  created() {
    this.getOrders();
  }
};
</script>

<style lang="less" scoped>
.order-manage {
  background: #eaeff5;
  box-shadow: 0 5px 8px #999;
  margin: 20px;
  .require {
    padding: 20px;
    padding-bottom: 0 !important ;
    .timeSelect {
      margin-left: 10px;
    }
    .require-btn {
      margin-left: 30px;
    }
  }
  .detailOrder {
    padding: 20px;
    padding-top: 0;
  }
  .page {
    padding: 20px;
    text-align: center;
  }
}
</style>