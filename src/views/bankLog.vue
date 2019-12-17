<template>
  <div class="bankLog-box">
    <searchs ref="searchs" @search="getBankLogs" />
    <el-table :data="bankLogs" @selection-change="selectChange" style="width: 100%">
      <el-table-column prop="id" label="编号"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="bankName" label="银行"></el-table-column>
      <el-table-column prop="bankCard" width="200px" label="银行卡号"></el-table-column>
      <el-table-column prop="realTransactionAmount" :formatter="formatter" label="交易金额"></el-table-column>
      <el-table-column prop="transactionTypeMsg" label="交易类型"></el-table-column>
      <el-table-column prop="myProductId" label="理财产品编号"></el-table-column>
      <el-table-column prop="transactionCard" label="交易卡号"></el-table-column>
      <el-table-column prop="transactionTime" label="交易日期" width="180"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
    </el-table>
    <el-pagination
      @next-click="nextClick"
      @prev-click="prevClick"
      @current-change="currentChange"
      background
      :page-sizes="[10, 20, 30, 50]"
      :page-size="10"
      layout="total, sizes, prev, pager, next"
      :total="pagination.total"
    ></el-pagination>
  </div>
</template>
 
<script>
import searchs from "@/components/search/search";
export default {
  data() {
    return {
      bankLogs: [],
      param:{},
      pagination: {
        pageSize: 10,
        currentPage: 1,
        total:0,
      },
      bankLog: {
        id: "",
        date: "",
        name: "",
        phone: "",
        address: "",
        status: 0
      },
      bankLogBackup: Object.assign({}, this.bankLog),
      multipleSelection: [],
      bankLogFormVisible: false,
      dialogTitle: "",
      rowIndex: 9999,
      rules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.getBankLogs();
  },
  components: {
    searchs
  },
  methods: {
    getBankLogs(param) {
      this.param = param ? param : this.$refs.searchs.param;
      this.param.page = this.pagination.currentPage;
      this.param.pageSize = this.pagination.pageSize;
      this.$http({
        method: "post",
        url: this.BASE_API + "/api/bankBill/query",
        data: this.param
      })
        .then(res => {
          if (res.data.code == 0) {
            this.bankLogs = res.data.data;
            this.pagination.total=res.data.total;
          } else {
            this.$message({
              showClose: true,
              message: res.data.msg
            });
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    resetForm(formName) {
      this.$refs[formName].clearValidate();
    },
    formatter(row, column) {
      return this.Utils.toMoney(row[column.property]) + "元";
    },
    selectChange(val) {
      this.multipleSelection = val;
    },
    nextClick() {
      this.pagination.currentPage = this.pagination.currentPage + 1;
      this.getBankLogs();
    },
    prevClick() {
      if (this.pagination.currentPage < 1) {
        return;
      }
      this.pagination.currentPage = this.pagination.currentPage - 1;
      this.getBankLogs();
    },
    currentChange(page) {
      this.pagination.currentPage =page;
      this.getBankLogs();
    }
  }
};
</script>

<style lang="scss" scoped>
.bankLog-box {
  width: 100%;
  .tool-box {
    padding: 10px 10px;
    border-bottom: 1px solid #eee;
  }
  .el-pagination {
    margin-top: 20px;
  }
}
</style>
