<template>
  <div class="index">
    <!-- 订单详情 -->
    <div class="detail-order">
      <ul>
        <li class="sumOrder">
          <i class="iconfont icon-dingdan2" style="color:#007acc"></i>
          <div>
            <h1>总订单</h1>
            <h2>102,200</h2>
          </div>
        </li>
        <!-- 总销售额 -->
        <li class="sumSales">
          <i class="iconfont icon-ico_home_obligation" style="color:#FFDC40"></i>
          <div>
            <h1>总销售额</h1>
            <h2>102,200</h2>
          </div>
        </li>
        <li class="todayOrder">
          <i class="iconfont icon-dingdan" style="color:#40B9ED"></i>
          <div>
            <h1>今日订单数</h1>
            <h2>102,200</h2>
          </div>
        </li>

        <li class="sumTotal">
          <i class="iconfont icon-jinqian" style="color:#42E80F"></i>
          <div>
            <h1>今日销售额</h1>
            <h2>102,200</h2>
          </div>
        </li>
      </ul>
    </div>

    <!-- 报表 -->
    <div id="myChart" :style="{width: '100%', height: '400px'}"></div>
  </div>
</template>

<script>
import { indexCharts } from "@/api/order";
export default {
  data() {
    return {};
  },
  mounted() {
    this.getIndex();
  },
  methods: {
    drawLine(xArr, yArr) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      // 获取数据
      let option = {
        title: {
          text: "数据统计"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["订单", "销售额"]
        },
        toolbox: {
          show: false,
          feature: {
            dataZoom: {
              yAxisIndex: "none"
            },
            dataView: { readOnly: false },
            magicType: { type: ["line", "bar"] },
            restore: {},
            saveAsImage: {}
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
            formatter: "{value}"
          }
        },
        series: [
          {
            name: "订单",
            type: "line",
            data: yArr.orderNum
          },
          {
            name: "销售额",
            type: "line",
            data: yArr.amount
          }
        ]
      };
      // 绘制图表
      myChart.setOption(option);
    },
    // 获取数据，渲染报表
    async getIndex() {
      let { date, data } = await indexCharts();
      this.drawLine(date, data);
    }
  }
};
</script>

<style lang="less" scoped>
.index {
  padding: 20px;
  .detail-order {
    ul {
      display: flex;
      justify-content: space-between;
      li {
        width: 220px;
        height: 80px;
        background: white;
        display: flex;
        .iconfont {
          flex: 0 0 80px;
          font-size: 50px !important;
          text-align: center;
          margin-top: 16px;
        }

        div {
          flex: 1;
          text-align: center;
          padding-top: 16px;
          h1,
          h2 {
            font-size: 20px;
            font-weight: 600;
            color: #e7e5df;
            margin-right: 30px;
          }
          h2 {
            color: #333;
            margin-top: 10px;
          }
        }
      }
    }
  }
  #myChart {
    box-shadow: 0px 5px 10px #999;
    border-radius: 4px;
    margin-top: 50px;
    background: #eaeff5;
    color: #888;
    padding-top: 20px;
  }
}
</style>