<template>
  <div class="total-list">
    <!-- 查询表单 -->
    <el-form :inline="true">
      <el-form-item label="时间范围">
        <el-date-picker
          v-model="date"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 报表 -->
    <div id="myChart" :style="{width: '100%', height: '400px'}"></div>
  </div>
</template>

<script>
import moment from "moment";
import { orderEchatrs } from "@/api/order";
export default {
  data() {
    return {
      date: ""
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    drawLine(xArr, yArr) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));

      // 准备数据
        // 2. 准备配置
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xArr
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value} 元"
          }
        },
        series: [
          {
            data: yArr,
            type: "line",
            areaStyle: {}
          }
        ]
      };
      // 绘制图表
      myChart.setOption(option);
    },
    // 查询数据
    search(){
        this.getData()
        console.log(data);
        
    },
    // 获取数据，渲染报表
    async getData() {
      let {data} = await orderEchatrs({ date: JSON.stringify(this.date) });
      
      data.forEach(v=>{
        v.orderTime = moment(v.orderTime).format("YY/MM/DD");
        v.opderAmount = v.opderAmount
      })
      
      let obj = {}// 日期相同时间归类
      data.forEach(v=>{
        if(!obj[v.orderTime]){
          obj[v.orderTime] = v.orderAmount
        }else{
          obj[v.orderTime] += v.orderAmount
        }
      })
       let xArr = [],yArr=[];
      // 金额保留两位,
      for(let key in obj){
        obj[key] = obj[key].toFixed(2)
        xArr.push(key)
        yArr.push(obj[key])
      }
      // 画图
      this.drawLine(xArr, yArr);
    }
  }
};
</script>

<style lang="less" scoped>
.total-list {
  padding: 20px;
  #myChart {
    border-radius: 5px;
    box-shadow: 0px 5px 10px #999;
    border-radius: 4px;
    margin-top: 50px;
    background: #eaeff5;
    color: #888;
    padding-bottom: 30px;
  }
}
</style>