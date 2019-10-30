<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <h1>店铺管理</h1>
    </div>
    <div class="shop-manage">
      <el-form label-width="80px" :data="shopInfoForm" :disabled="isDisabled">
        <el-form-item label="商品名称">
          <el-input style="width:300px" v-model="shopInfoForm.shopname"></el-input>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input style="width:300px" v-model="shopInfoForm.address"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input style="width:300px" v-model="shopInfoForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="店铺简介">
          <el-input style="width:300px" v-model="shopInfoForm.shopdesc"></el-input>
        </el-form-item>
        <el-form-item label="店铺标语">
          <el-input style="width:300px" v-model="shopInfoForm.slogan"></el-input>
        </el-form-item>
        <el-form-item label="店铺分类">
          <el-select placeholder="请选择商品分类" v-model="shopInfoForm.category">
            <el-option label="热销" value="热销"></el-option>
            <el-option label="咖啡" value="咖啡"></el-option>
            <el-option label="热菜" value="热菜"></el-option>
            <el-option label="凉菜" value="凉菜"></el-option>
            <el-option label="饮品" value="饮品"></el-option>
            <el-option label="火锅" value="火锅"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="店铺特点">
          <el-checkbox-group v-model="shopInfoForm.feature">
            <el-checkbox label="品牌保证" name="type"></el-checkbox>
            <el-checkbox label="蜂鸟专送" name="type"></el-checkbox>
            <el-checkbox label="新店开铺" name="type"></el-checkbox>
            <el-checkbox label="外卖宝" name="type"></el-checkbox>
            <el-checkbox label="准时达" name="type"></el-checkbox>
            <el-checkbox label="开发票" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="配送费">
          <el-input-number :min="0" :max="10" v-model="shopInfoForm.packingexpense"></el-input-number>
        </el-form-item>
        <el-form-item label="起送价">
          <el-input-number :min="15" v-model="shopInfoForm.minprice"></el-input-number>
        </el-form-item>
        <el-form-item label="营业时间">
          <el-time-picker
            is-range
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            v-model="shopInfoForm.date"
            value-format="HH:mm:ss"
          ></el-time-picker>
        </el-form-item>

        <!-- 店铺头像-->
        <el-form-item label="店铺头像">
          <el-upload
            class="avatar-uploader"
            action="http://127.0.0.1:5000/shop/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess1"
          >
            <img
              v-if="shopInfoForm.shopAvatar"
              :src="serveApi + shopInfoForm.shopAvatar"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <!-- 营业执照-->
        <el-form-item label="营业执照">
          <el-upload
            class="avatar-uploader"
            action="http://127.0.0.1:5000/shop/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess2"
          >
            <img
              v-if="shopInfoForm.businessLicenseImg"
              :src="serveApi+shopInfoForm.businessLicenseImg"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <!-- 许可证-->
        <el-form-item label="许可证">
          <el-upload
            class="avatar-uploader"
            action="http://127.0.0.1:5000/shop/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess3"
          >
            <img
              v-if="shopInfoForm.cateringServiceLicenseImg"
              :src="serveApi+shopInfoForm.cateringServiceLicenseImg"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <!-- 优惠活动 -->
        <el-form-item label="优惠活动">
          <el-select v-model="shopInfoForm.discounts" @change="handleChange">
            <el-option label="满减优惠" value="满减优惠"></el-option>
            <el-option label="特惠大酬宾" value="特惠大酬宾"></el-option>
            <el-option label="新用户立减" value="新用户立减"></el-option>
            <el-option label="进店领券" value="进店领券"></el-option>
          </el-select>
        </el-form-item>
        <!-- 活动表格 -->
        <el-form-item>
          <el-table
            ref="singleTable"
            :data="shopInfoForm.tableData"
            highlight-current-row
            style="width:500px"
          >
            <el-table-column label="活动标题" width="120" prop="title"></el-table-column>
            <el-table-column label="活动名称" width="120" prop="name"></el-table-column>
            <el-table-column label="活动详情" width="140" prop="detail"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="handleDelete(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <!-- 提交 -->
      <div class="edit-btn">
        <el-button type="primary" @click="edit">修改</el-button>
        <el-button type="success" @click="editShopInfo">保存</el-button>
      </div>
      <!-- 模态框 -->
      <el-dialog width="400px" :title="shopInfoForm.discounts" :visible.sync="dialogFormVisible">
        <el-form :model="discountData">
          <el-form-item label="请输入活动详情">
            <el-input autofocus size="small" v-model="discountData.detail" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
import { shopInfo } from "@/api/shop";
import { editShop } from "@/api/shop";
import { fstat } from "fs";
export default {
  data() {
    return {
      // 服务器图片地址
      serveApi: "http://127.0.0.1:5000/upload/shop/",
      // 店铺信息表单
      shopInfoForm: {
        shopname: "",
        address: "",
        phone: "",
        shopdesc: "",
        slogan: "",
        category: "",
        feature: [],
        packingexpense: 0,
        minprice: 15,
        date: [],
        shopAvatar: "",
        businessLicenseImg: "",
        cateringServiceLicenseImg: "",
        // 优惠活动表格
        tableData: [
          // {
          //   title: "满",
          //   name: "渐渐",
          //   detail: "满39减4"
          // }
        ],
        discounts: "", // 优惠活动选择
        
      },
        isDisabled: true ,//修改数据控件
      // 表格数据存入
      discountData: {
        detail: ""
      },
      // 模态框控件
      dialogFormVisible: false,
      // 是否修改控件
      disabled: false
    };
  },
  methods: {
    // 上传店铺图片成功
    handleAvatarSuccess1(res) {
      let { code, imgUrl } = res;
      if (code === 0) {
        this.shopInfoForm.shopAvatar = imgUrl; //获取图片名，回填表单加载图片
      }
    },
    // 上传营业执照成功
    handleAvatarSuccess2(res) {
      let { code, imgUrl } = res;
      if (code === 0) {
        this.shopInfoForm.businessLicenseImg = imgUrl; //获取图片名，回填表单加载图片
      }
    },
    // 上传许可证
    handleAvatarSuccess3(res) {
      let { code, imgUrl } = res;
      if (code === 0) {
        this.shopInfoForm.cateringServiceLicenseImg = imgUrl; //获取图片名，回填表单加载图片
      }
    },
    // 优惠活动弹相应模态框
    handleChange() {
      this.dialogFormVisible = true;
    },
    // 删除优惠活动表格项目
    handleDelete(index) {
      this.shopInfoForm.tableData.splice(index, 1);
    },
    // 模态框添加优惠活动
    confirm() {
      // 关闭模态框
      this.dialogFormVisible = false;
      // 获取数据
      let title; //标题
      switch (this.shopInfoForm.discounts) {
        case "满减优惠":
          title = "满";
          break;
        case "特惠大酬宾":
          title = "特";
          break;
        case "新用户立减":
          title = "减";
          break;
        case "进店领券":
          title = "领";
          break;
      }
      let data = {
        title, //标题
        name: this.shopInfoForm.discounts, // 名称
        detail: this.discountData.detail
      };
      // 加入表格
      this.shopInfoForm.tableData.unshift(data);
      // 清空详情输入框与优惠选择框
      this.discountData.detail = "";
      this.shopInfoForm.discounts = "";
    },
    // 获取店铺信息
    async getShopInfo() {
      let { data } = await shopInfo();
      // 渲染页面
      for (let key in data) {
        // 格式化数据
        if (key === "feature" || key === "date" || key === "tableData") {
          data[key] = JSON.parse(data[key]);
        }
      }
      this.shopInfoForm = data; //赋值
    },
    // 保存修改信息
    async editShopInfo() {
      // 获取表单数据
      let {
        shopname,
        address,
        phone,
        shopdesc,
        slogan,
        category,
        feature,
        packingexpense,
        minprice,
        date,
        shopAvatar,
        businessLicenseImg,
        cateringServiceLicenseImg,
        tableData
      } = this.shopInfoForm;
      // 封装数据，发送后台
      let params = {
        shopname,
        address,
        phone,
        shopdesc,
        slogan,
        category,
        feature: JSON.stringify(feature),
        packingexpense,
        minprice,
        date: JSON.stringify(date),
        shopAvatar,
        businessLicenseImg,
        cateringServiceLicenseImg,
        tableData: JSON.stringify(tableData)
      };
      let { code } = await editShop(params);
      if (code === 0) {
        this.isDisabled = true;
      }
    },
    // 点击修改信息
    edit() {
      this.isDisabled = false;
    }
  },
  created() {
    // 进入页面获取信息
    this.getShopInfo();
  }
};
</script>

<style lang="less" >
.box-card {
  margin: 20px;
  border-radius: 5px;
  box-shadow: 0 5px 8px #999;
  .edit-btn{
    margin-left: 80px;
  }
  h1 {
    color: #999;
    font-size: 20px;
    font-weight: 600;
    height: 100%;
  }
  .el-form {
    .avatar-uploader .el-upload {
      border: 1px dashed #888;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      background: #ccc;
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