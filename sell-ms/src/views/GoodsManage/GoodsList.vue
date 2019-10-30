<template>
  <div class="goods-list">
    <div class="list">
      <el-table :data="goodsList" style="width: 100%">
        <!-- 折叠详情 -->

        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <!-- 商品Id -->
              <div>
                <el-form-item label="商品 ID:" >
                  <span>{{ props.row.id }}</span>
                </el-form-item>
                <el-divider></el-divider>
              </div>
              <!-- 商品名称 -->
              <div>
                <el-form-item label="商品名称:" >
                  <span>{{ props.row.goodsname }}</span>
                </el-form-item>
                <el-divider></el-divider>
              </div>

              <!-- 商品图片 -->
              <div>
                <el-form-item label="商品图片：">
                  <span>
                    <img
                      width="100"
                      height="100"
                      style="border-radius: 4px;margin-top:15px"
                      :src="serverApi + props.row.imgUrl"
                    />
                  </span>
                </el-form-item>
                <el-divider></el-divider>
              </div>

              <!-- 商品分类 -->
              <div>
                <el-form-item label="商品分类：">
                  <span>{{ props.row.goodscategory }}</span>
                </el-form-item>
                <el-divider></el-divider>
              </div>

              <!-- 商品特色 -->
              <div>
                <el-form-item label="商品特色：">
                  <span>{{ props.row.goodsfeature | filterFeature}}</span>
                </el-form-item>
                <el-divider></el-divider>
              </div>

              <!-- 是否促销 -->
              <div>
                <el-form-item label="是否促销：">
                  <span>{{ props.row.isPromotion }}</span>
                </el-form-item>
                <el-divider></el-divider>
              </div>

              <!-- 商品规格 -->
              <div>
                <el-form-item label="商品规格：">
                  <span>{{ props.row.standard | filterStandard }}</span>
                </el-form-item>
                <el-divider></el-divider>
              </div>

              <!-- 商品描述 -->
              <div>
                <el-form-item label="商品描述：">
                  <span>{{ props.row.goodsdesc }}</span>
                </el-form-item>
              </div>
            </el-form>
          </template>
        </el-table-column>

        <!-- 显示的详情 -->
        <el-table-column label="商品 ID" prop="id"></el-table-column>
        <el-table-column label="商品名称" prop="goodsname"></el-table-column>
        <el-table-column label="描述" prop="goodsdesc"></el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
// 接口
import { getGoods, delGoods } from "@/api/goods";
export default {
  data() {
    return {
      // 服务器图片地址
      serverApi: "http://127.0.0.1:5000/upload/goods/",
      // 数据列表
      goodsList: [],
      //   分页数据
      currentPage: 1,
      pageSize: 3,
      total: 0
    };
  },
  methods: {
    // 获取商品列表
    async getGoodsList() {
      let { total, data } = await getGoods({
        currentPage: this.currentPage,
        pageSize: this.pageSize
      });
      this.total = total;
      this.goodsList = data;
    },

    //   编辑
    handleEdit(index, row) {
      // 存入
      window.sessionStorage.setItem("goodsdetail", JSON.stringify(row));
      // 跳转
      this.$router.push("/home/editgoods");
    },
    // 删除
    async handleDelete(index, row) {
      let { id } = row;
      this.$confirm("是否删除该商品？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let { code } = await delGoods({ id });
          // 删除成功刷新页面
          if (code === 0) {
            // 刷新页面
            this.getGoodsList();
          }
        })
        // 取消删除
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除QwQ",
            duration: 1000
          });
        });
    },
    // 翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getGoodsList();
    }
  },
  created() {
    this.getGoodsList();
  },
  filters: {
    filterFeature(f) {
      return JSON.parse(f).join("/");
    },
    filterStandard(s) {
      let arr = JSON.parse(s);
      return arr
        .map(v => `${v.goodsstandard} ${v.goodsPrice} ${v.packingexpense}`)
        .join("|");
    }
  }
};
</script>

<style lang="less">
.goods-list {
  margin: 20px;
  background: #eaeff5;
  border-radius: 5px;
  box-shadow: 0 5px 8px #999;
  padding-bottom: 20px;
  .el-divider {
    margin: 0;
  }
  .el-form-item {
    margin-bottom: 0;
  }
  .demo-table-expand label {
    color: #99a9bf;
  }
  .el-table__expanded-cell {
    padding-top: 0;
    padding-bottom: 0;
  }
  .page {
    padding: 20px;
    text-align: center;
  }
}
</style>