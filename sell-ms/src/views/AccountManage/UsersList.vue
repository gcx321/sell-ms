<template>
  <div class="account-list">
    <h1>账号列表</h1>
    <el-table
      ref="userList"
      tooltip-effect="dark"
      style="width: 100%"
      :data="userList"
      @selection-change="handleSelectionChange"
    >
      <!-- 选择框 -->
      <el-table-column type="selection" width="60"></el-table-column>
      <!-- 账号 -->
      <el-table-column prop="account" label="账号" width="250"></el-table-column>
      <!-- 用户组 -->
      <el-table-column prop="groups" label="用户组" width="250"></el-table-column>
      <!-- 创建时间 -->
      <el-table-column prop="ctime" label="创建时间" show-overflow-tooltip></el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="editAccount(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- "编辑模态框 -->
    <el-dialog title="编辑信息" :visible.sync="dialogFormVisible" width="500px;">
      <el-form :model="editForm">
        <el-form-item label="活动名称" label-width="130px">
          <el-input v-model="editForm.account" auto-complete="off" style="width:230px;"></el-input>
        </el-form-item>
        <el-form-item label="用户组" label-width="130px">
          <el-select v-model="editForm.groups" placeholder="请选择用户组" style="width:230px;">
            <el-option label="超级管理员" value="超级管理员"></el-option>
            <el-option label="普通管理员" value="普通管理员"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAccount">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分页 -->
    <div class="page">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <!-- 批量操作 -->
    <div class="operation">
      <el-button type="danger" @click="batchDel">批量删除</el-button>
      <el-button type="primary" @click="cancelSelect">取消选择</el-button>
    </div>
  </div>
</template>

<script>
// 引入接口方法
import { accountList, accountDel, batchDelAcc, editAcc } from "@/api/account";
import moment from "moment";
export default {
  data() {
    return {
      userList: [
        //   用户数据
      ],
      // 分页数据
      currentPage: 1,
      pageSize: 3,
      total: 0,

      // 被选择的用户id
      onSelection: [],
      // 编辑用户信息
      editForm: {
        account: "",
        group: ""
      },
      // 是否显示模态框
      dialogFormVisible: false
    };
  },
  methods: {
    // 取消选择
    cancelSelect() {
      this.$refs.userList.clearSelection();
    },
    // 请求账号列表
    async getAccounts() {
      let { total, data } = await accountList({
        currentPage: this.currentPage,
        pageSize: this.pageSize
      });

      // 格式化时间
      data.forEach(
        v => (v.ctime = moment(v.ctime).format("YYYY/MM/DD hh:mm:ss"))
      );
      // 解决删除完非第一页数据当页数据为空的bug
      if (!data.length && this.currentPage !== 1) {
        this.currentPage -= 1; //当前没有数据了请求上一页数据
        this.getAccounts(); // 再次请求数据
      }
      // 渲染数据
      this.userList = data;
      this.total = total;
    },
    // 设置页面数据条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.getAccounts();
    },

    // 翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getAccounts();
    },

    // 删除单个用户
    handDel(row) {
      this.$confirm("是否删除该用户？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        // 确定删除
        .then(async () => {
          let { code } = await accountDel({ id: row.id });
          // 删除成功刷新页面
          if (code === 0) {
            // 刷新页面
            this.getAccounts();
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
    // 获取所有选中用户的id
    handleSelectionChange(rows) {
      this.onSelection = rows.map(v => v.id);
    },
    // 批量删除
    batchDel() {
      // 如果没有选不中用户，就不发送请求
      if (!this.onSelection.length) {
        this.$message({
          showClose: true,
          message: "你还没有选择喔~",
          type: "warning",
          duration: 1000
        });
        return;
      }
      this.$confirm("你确定要删除选中用户吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        // 确认删除
        .then(async () => {
          // 把选中的id发给后端删除
          let { code } = await batchDelAcc({
            onSelection: JSON.stringify(this.onSelection)
          });
          if (code === 0) {
            // 刷新页面
            this.getAccounts();
          }
        })
        // 取消删除
        .catch(() => {
          this.$message({
            type: "info",
            message: "以取消删除QaQ",
            duration: 1000
          });
        });
    },
    // 编辑用户信息
    editAccount(row) {
      this.dialogFormVisible = true; //开启模态框
      // 数据回填
      this.editForm = { ...row };
    },
    // 保存修改
    async saveAccount() {
      let { account, id, groups } = this.editForm;
      // 调用接口，保存数据
      let { code } = await editAcc({ account, id, groups });
      // 关闭模态框
      this.dialogFormVisible = false;
      if (code === 0) {
        // 刷新页面
        this.getAccounts();
      }
    }
  },
  created() {
    this.getAccounts(); //进入页面调用这个获取列表请求函数
  }
};
</script>

<style lang="less" scoped>
.account-list {
  padding-bottom: 30px;
  box-shadow: 0px 4px 8px #999;
  background: #eaeff5;
  margin: 20px;
  h1 {
    color: #999;
    font-size: 20px;
    height: 50px;
    line-height: 50px;
    font-weight: 600;
    text-indent: 20px;
    border-bottom: 1px solid #e6e6e6;
  }
  .el-table {
    padding: 30px;
  }
  .page {
    text-align: center;
    margin-top: 50px;
  }
  .operation {
    margin-left: 50px;
    margin-top: 10px;
  }
}
</style>