<template>
  <div class="add-goods">
    <h1>添加商品</h1>
    <div class="add">
      <el-form label-width="80px" :data="formData">
        <el-form-item label="商品名称">
          <el-input style="width:300px" v-model="formData.goodsname"></el-input>
        </el-form-item>
        <el-form-item label="商品分类">
          <el-select placeholder="请选择商品分类" v-model="formData.goodscategory">
            <el-option label="火锅" value="火锅"></el-option>
            <el-option label="饮品" value="饮品"></el-option>
            <el-option label="凉菜" value="凉菜"></el-option>
            <el-option label="快餐" value="快餐"></el-option>
            <el-option label="面食" value="面食"></el-option>
            <el-option label="主食" value="主食"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品特色">
          <el-checkbox-group v-model="formData.goodsfeature">
            <el-checkbox label="新品上市" name="type"></el-checkbox>
            <el-checkbox label="第二杯半价" name="type"></el-checkbox>
            <el-checkbox label="主打产品" name="type"></el-checkbox>
            <el-checkbox label="火爆产品" name="type"></el-checkbox>
            <el-checkbox label="祖传手艺" name="type"></el-checkbox>
            <el-checkbox label="源自四川" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <!-- 商品图片 -->
        <el-form-item label="商品图片">
          <el-upload
            class="avatar-uploader"
            action="http://127.0.0.1:5000/goods/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="formData.imgUrl" :src="serverApi+formData.imgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <!-- 促销与否 -->
        <el-form-item label="是否促销">
          <el-radio-group v-model="formData.isPromotion">
            <el-radio label="促销"></el-radio>
            <el-radio label="不促销"></el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 选择规格 -->
        <el-form-item label="食品规格">
          <el-radio-group v-model="formData.goodsstandard">
            <el-radio label="单规格"></el-radio>
            <el-radio label="多规格"></el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 单规格的选择 -->
        <el-form-item label="包装费" v-show="!flag">
          <el-input-number
            :min="0"
            :max="10"
            v-model="formData.packingexpense"
            @change="headerChange"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="价格" v-show="!flag">
          <el-input-number :min="15" :max="100" v-model="formData.goodsPrice"></el-input-number>
        </el-form-item>
        <!-- 多规格的 添加规格选择 与 表格-->
        <div v-show="flag" class="mulitiple">
          <!-- 添加规格按钮 （控制模态框）-->
          <el-button
            size="small"
            v-show="flag"
            style="margin-left:100px"
            type="primary"
            @click="dialogFormVisible = true"
          >添加规格</el-button>
          <!-- 添加规格表格 -->
          <el-table
            :data="formData.mulitipleDataTab"
            style="width: 50%"
            class="mulTab"
            size="small"
          >
            <el-table-column prop="goodsstandard" label="规格" width="100"></el-table-column>
            <el-table-column prop="packingexpense" label="包装费" width="100"></el-table-column>
            <el-table-column prop="goodsPrice" label="价格"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="delStandard(scope.$index)" type="danger">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <el-form-item label="商品描述">
          <el-input type="textarea" style="width:300px;" rows="5" v-model="formData.goodsdesc"></el-input>
        </el-form-item>

        <!-- 提交与取消按钮 -->
        <el-form-item>
          <el-button type="primary" @click="submitAddGoodsForm">立即添加</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>

      <!-- 多规格模态框 -->
      <el-dialog title="选择规格" :visible.sync="dialogFormVisible" width="500px;">
        <el-form :model="mulitipleData">
          <el-form-item label="规格" label-width="200px">
            <el-input
              v-model="mulitipleData.goodsstandard"
              auto-complete="off"
              style="width:180px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="包装费" label-width="200px">
            <el-input-number v-model="mulitipleData.packingexpense" :min="0" :max="20" label="包装费"></el-input-number>
          </el-form-item>
          <el-form-item label="价格" label-width="200px">
            <el-input-number v-model="mulitipleData.goodsPrice" :min="20" label="价格"></el-input-number>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveStandard">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { goodsAdd } from "@/api/goods";
export default {
  data() {
    return {
      // 服务器图片地址
      serverApi: "http://127.0.0.1:5000/upload/goods/",
      // 表单数据
      formData: {
        goodsname: "",
        goodscategory: "",
        goodsfeature: [],
        imgUrl: "",
        isPromotion: "不促销",
        goodsstandard: "单规格",
        packingexpense: "", //包装费
        goodsPrice: "", //价格
        goodsdesc: "", //配送费
        // 多规格表格的数据
        mulitipleDataTab: []
      },
      // 多规格数据
      mulitipleData: {
        goodsstandard: "", // 规格
        packingexpense: "", // 包装费
        goodsPrice: "" // 价格
      },

      // 模态框是否显示
      dialogFormVisible: false
    };
  },
  methods: {
    // 添加多规格
    saveStandard() {
      this.dialogFormVisible = false; //关闭模态框
      this.formData.mulitipleDataTab.unshift(this.mulitipleData);
    },
    // 删除表格所选多规格
    delStandard(index) {
      this.formData.mulitipleDataTab.splice(index, 1);
    },
    // 配送费包装费
    headerChange(value) {
      console.log(value);
    },
    // 上传图片成功
    handleAvatarSuccess(res, file) {
      let { code, imgUrl } = res;
      this.formData.imgUrl = imgUrl;
    },
    // 上传图片之前
    beforeAvatarUpload(file) {
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
    // 提交添加表单
    async submitAddGoodsForm() {
      // 准备参数
      let {
        goodsname,
        goodscategory,
        goodsfeature,
        imgUrl,
        isPromotion,
        goodsstandard,
        packingexpense,
        goodsPrice,
        goodsdesc,
        mulitipleDataTab
      } = this.formData;
      // 封装格式化数据
      let params = {
        goodsname,
        goodscategory,
        goodsfeature: JSON.stringify(goodsfeature),
        imgUrl,
        isPromotion,
        standard:
          goodsstandard === "单规格"
            ? JSON.stringify([{goodsstandard, packingexpense, goodsPrice }])
            : JSON.stringify(mulitipleDataTab),
        mulitipleDataTab: JSON.stringify(mulitipleDataTab),
        goodsdesc,
      };
      let {code} = await goodsAdd(params);
      if(code === 0){
        this.$router.push("/home/goodsList")
      }
    }
  },
  computed: {
    // 计算规格显示与隐藏
    flag() {
      return this.formData.goodsstandard === "单规格" ? false : true;
    }
  }
};
</script>

<style lang="less">
.add-goods {
  margin: 20px;
  border-radius: 5px;
  box-shadow: 0 5px 8px #999;
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
  .add {
    padding: 30px;
    background: #fff;
    .mulTab {
      margin-top: 30px;
      margin-bottom: 30px;
    }
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
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
</style>