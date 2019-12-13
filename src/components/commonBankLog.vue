<template>
  <div class="bankLog-box">
    <el-row>
      <el-col :span="3" >
       <p>
          <font
            size="4"
            face="arial"
          >产品类型:{{bankMyProduct.productType}}</font>
        </p>
      </el-col>

      <el-col :span="3" :offset="1">
        <el-select v-model="param.transactionTypes" multiple clearable placeholder="交易类型">
          <el-option
            v-for="item in transactionType"
            :key="item.key"
            :label="item.lable"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-date-picker
          v-model="param.times"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-col>
      <el-col :span="5" :offset="4">
        <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
      </el-col>
    </el-row>
    <el-table :data="bankLogs" @selection-change="selectChange" height="600px" style="width: 100%">
      <el-table-column prop="id" label="编号"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="bankName" label="银行"></el-table-column>
      <el-table-column prop="bankCard" width="200px" label="银行卡号"></el-table-column>
      <el-table-column prop="realTransactionAmount" :formatter="formatter" label="交易金额"></el-table-column>
      <el-table-column prop="transactionTypeMsg" label="交易类型"></el-table-column>
      <el-table-column prop="transactionParty" label="交易方"></el-table-column>
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
export default {
  data() {
    return {
      bankLogs: [],
      bankMyProduct: {
        bank: {
          id: "",
          name: "",
          bankName: "",
          bankCard: ""
        },
        productType: "",
        bankProduct: "",
        interestPaymentMethod: "",
        expectedInterestIncomeMonth: "",
        expectedInterestIncomeTotal: "",
        expectedinterestRate: "",
        state: 0
      },
      param: { transactionTypes: [], myProductId: "" },
      pagination: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      transactionType: [
        { key: "", lable: "全部" },
        { key: "1", lable: "转入" },
        { key: "2", lable: "支出" },
        { key: "3", lable: "转账-转出" },
        { key: "4", lable: "活期利息收入" },
        { key: "5", lable: "买入理财" },
        { key: "6", lable: "理财利息收入" },
        { key: "7", lable: "转账-转入" }
      ],
      dialogTitle: "",
      rowIndex: 9999
    };
  },
  methods: {
    getBankLogs() {
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
            this.pagination.total = res.data.total;
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
    search() {
      //console.log("search"+JSON.stringify(this.param) );
      this.getBankLogs();
    },
    searchMyProductId(bankMyProduct) {
      this.bankMyProduct = bankMyProduct;
      this.param.myProductId = bankMyProduct.id;
      this.getBankLogs();
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
      this.pagination.currentPage = page;
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
