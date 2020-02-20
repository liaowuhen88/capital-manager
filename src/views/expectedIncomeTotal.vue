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

    <el-dialog :title="dialogTitle" :visible.sync="expectedInterestIncomeDetailShow">
      <el-table
        :data="expectedIncomePlan"
        show-summary
        :summary-method="getSummaries"
        stripe
        @row-click="getMyProduct"
        height="600px"
      >
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

    <!--查看详情 -->
    <el-dialog :title="dialogTitle" width="600px" :visible.sync="showMyProductFormVisible">
      <el-form :model="myProduct" ref="editMyProductForm">
        <el-form-item label="姓名:" label-width="150px">
          <el-input v-model="myProduct.bank.name" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="银行:" label-width="150px">
          <el-input v-model="myProduct.bank.bankName" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="银行卡号:" label-width="150px">
          <el-input v-model="myProduct.bank.bankCard" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="产品类型:" label-width="150px">
          <el-input v-model="myProduct.productType" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="投资金额:" label-width="150px">
          <font size="4" face="arial">{{this.Utils.toMoney(myProduct.investmentAmount) }}</font>
          <el-input v-model="myProduct.investmentAmount" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="买入时间:" prop="buyingTime" label-width="150px">
          <el-date-picker
            v-model="myProduct.buyingTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="买入时间"
            :disabled="true"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="起息日期:" prop="interestStartTime" label-width="150px">
          <el-date-picker
            v-model="myProduct.interestStartTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="起息日期"
            :disabled="true"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="收利日期:" prop="profitDate" label-width="150px">
          <el-date-picker
            v-model="myProduct.profitDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="收利日期"
            :disabled="true"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="到期时间:" prop="dueTime" label-width="150px">
          <el-date-picker
            v-model="myProduct.dueTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="到期时间"
            :disabled="true"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="预期利率:" label-width="150px">
          <el-input v-model="myProduct.expectedInterestRate" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="付息方式:" label-width="150px">
          <el-input v-model="myProduct.interestPaymentMethod" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="收利日利息预期收益:" label-width="150px">
          <font size="4" face="arial">{{this.Utils.toMoney(myProduct.expectedInterestIncomeMonth) }}</font>
          <el-input
            v-model="myProduct.expectedInterestIncomeMonth"
            :disabled="true"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="产品状态:" label-width="150px">
          <el-select v-model="myProduct.state" :disabled="true">
            <el-option
              v-for="item in states"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
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
      states: [
        { value: 3, label: "作废删除" },
        { value: 2, label: "已赎回" },
        { value: 1, label: "合约中" }
      ],
      myProduct: {
        bank: {
          id: "",
          name: "",
          bankName: "",
          bankCard: ""
        },
        dueTime: "",
        buyingTime: "",
        interestStartTime: "",
        profitDate: ""
      },
      expectedInterestIncomeDetailShow: false,
      showMyProductFormVisible: false,
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
    getMyProduct(row) {
      this.$http({
        method: "post",
        url: this.BASE_API + "/api/bankMyProducts/selectByPrimaryKey",
        data: { id: row.id }
      })
        .then(res => {
          if (res.data.code == 0) {
            this.showMyProductFormVisible = true;
            this.myProduct = res.data.data;
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
