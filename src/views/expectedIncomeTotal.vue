<template>
  <div>
    <el-row>
      <el-col :span="5">
        <el-date-picker
          v-model="param.startTime"
          type="date"
          placeholder="开始日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-col>
      <el-col :span="1">
        <p>
          <font size="4" face="arial">至</font>
        </p>
      </el-col>
      <el-col :span="5">
        <el-date-picker
          v-model="param.endTime"
          type="date"
          placeholder="结束日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-col>
      <el-col :span="5" :offset="5">
        <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
      </el-col>
    </el-row>

    <div class="echarts-box">
      <div class="echarts" id="echarts"></div>
    </div>

    <!-- <div>
      <table>
        <tr v-for="tr in totalByMonthTableVo">
          <td v-for="td in tr">{{ td }}</td>
        </tr>
      </table>
    </div>-->

    <el-table
      :data="analysisTotalVos"
      show-summary
      :summary-method="getSummaries"
      stripe
      @row-click="showExpectedInterestIncomeDetail"
    >
      <el-table-column prop="time" label="时间"></el-table-column>
      <el-table-column prop="expectedInterestIncome" :formatter="formatter" label="预期利息收入"></el-table-column>
      <el-table-column prop="investmentIncome" :formatter="formatter" label="实际利息收入"></el-table-column>
      <el-table-column prop="investmentAmount" :formatter="formatter" label="预期赎回本金"></el-table-column>
      <el-table-column prop="investmentRedeemPrincipal" :formatter="formatter" label="实际赎回本金"></el-table-column>
    </el-table>

    <el-dialog :title="dialogTitle" :visible.sync="expectedInterestIncomeDetailShow"  >
      <el-table :data="expectedIncomePlan" show-summary :summary-method="getSummaries" stripe height="600px">
        <el-table-column prop="id" label="产品id"></el-table-column>
        <el-table-column prop="time" label="时间"></el-table-column>
        <el-table-column prop="expectedInterestIncomeMonth" :formatter="formatter" label="预期利息收入"></el-table-column>
        <el-table-column prop="realInterestIncome" :formatter="formatter" label="利息收入"></el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog :title="dialogTitle" :visible.sync="investmentIncomeShow">
      <el-table :data="investmentIncomeData" show-summary :summary-method="getSummaries" stripe>
        <el-table-column prop="myProductId" label="理财产品编号"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="bankName" label="银行"></el-table-column>
        <el-table-column prop="realTransactionAmount" :formatter="formatter" label="交易金额"></el-table-column>
        <el-table-column prop="transactionTypeMsg" label="交易类型"></el-table-column>
        <el-table-column prop="createTime" label="创建日期"></el-table-column>
        <el-table-column prop="transactionTime" label="交易日期" width="180"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import option from "./../common/option";
export default {
  data() {
    return {
      totalByMonthVo: {},
      totalByMonthTableVo: {},
      analysisTotalVos: [],
      dialogTitle: "",
      expectedIncomePlan: [],
      investmentIncomeData: [],
      expectedInterestIncomeDetailShow: false,
      investmentIncomeShow: false,
      param: {
        startTime: this.Utils.getFirstDayOfYear(new Date()),
        endTime: this.Utils.timeFormat(new Date()),
        bankCard: "",
        transactionTypes: [],
        myProductId: ""
      }
    };
  },
  mounted() {
    this.getData();
    //this.getDataTable();
    this.getAnalysisTotalVo();
  },

  methods: {
    drawEcharts() {
      let chart = this.$echarts.init(document.getElementById("echarts"));
      // 设置配置项
      option.xAxis = this.totalByMonthVo.xaxis;
      option.series = this.totalByMonthVo.series;
      option.legend = this.totalByMonthVo.legend;

      chart.setOption(option);
    },
    formatter(row, column) {
      return this.Utils.toMoney(row[column.property]) + "元";
    },
    cellClick(row, column, cell, event) {
      if (column.property === "expectedInterestIncome") {
        this.showExpectedInterestIncomeDetail(row);
      }
      if (column.property === "investmentIncome") {
        this.showInvestmentIncome(row);
      }
    },
    showExpectedInterestIncomeDetail(row) {
      this.loading = true;
      this.$http({
        method: "post",
        url: this.BASE_API + "/api/bankMyProducts/getExpectedIncomePlanAndReal",
        data: { time: row.time }
      })
        .then(res => {
          if (res.data.code == 0) {
            this.expectedIncomePlan = res.data.data;
            this.expectedInterestIncomeDetailShow = true;
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
    showInvestmentIncome(row) {
      this.loading = true;
      this.$http({
        method: "post",
        url: this.BASE_API + "/api/bankBill/queryByTime",
        data: { time: row.time, transactionTypes: [6] }
      })
        .then(res => {
          if (res.data.code == 0) {
            this.investmentIncomeData = res.data.data;
            this.investmentIncomeShow = true;
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
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计：";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] = this.Utils.toMoney(sums[index]) + "元";
        } else {
          sums[index] = "";
        }
      });
      return sums;
    },
    getData(param) {
      this.loading = true;
      this.$http({
        method: "post",
        url: this.BASE_API + "/api/bankMyProducts/expectedIncomeTotal",
        data: param ? param : {}
      })
        .then(res => {
          if (res.data.code == 0) {
            this.totalByMonthVo = res.data.data;
            this.drawEcharts();
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
    getDataTable(param) {
      this.loading = true;
      this.$http({
        method: "post",
        url: this.BASE_API + "/api/bankMyProducts/expectedIncomeTotalTable",
        data: param ? param : {}
      })
        .then(res => {
          if (res.data.code == 0) {
            this.totalByMonthTableVo = res.data.data;
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
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总价";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] = this.Utils.toMoney(sums[index]) + "元";
        } else {
          sums[index] = "";
        }
      });

      return sums;
    },
    getAnalysisTotalVo(param) {
      this.$http({
        method: "post",
        url: this.BASE_API + "/api/bankMyProducts/getAnalysisTotalVo",
        data: param ? param : {}
      })
        .then(res => {
          if (res.data.code == 0) {
            this.analysisTotalVos = res.data.data;
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
      this.getAnalysisTotalVo(this.param);
      this.getData(this.param);
    }
  }
};
</script>

<style lang="scss" scoped>
.echarts-box {
  margin-top: 100px;
  .echarts {
    width: 98%;
    height: 500px;
  }
}

table {
  border-collapse: collapse;

  margin: 0 auto;

  text-align: center;

  margin-top: 30px;

  width: 100%;
}

table td,
table th {
  border: 1px solid #cad9ea;

  color: #666;

  height: 30px;

  word-break: keep-all;
  white-space: nowrap;
}

table thead th {
  background-color: #cce8eb;

  width: 100px;
}

table tr:nth-child(odd) {
  background: #fff;
}

table tr:nth-child(even) {
  background: #f5fafa;
}
</style>
