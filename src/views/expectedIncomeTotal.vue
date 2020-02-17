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

    <el-table :data="analysisTotalVos" show-summary :summary-method="getSummaries" stripe>
      <el-table-column prop="time" label="时间"></el-table-column>
      <el-table-column prop="expectedInterestIncome" label="预期利息收入"></el-table-column>
      <el-table-column prop="investmentIncome" :formatter="formatter" label="实际利息收入"></el-table-column>
      <el-table-column prop="investmentAmount" :formatter="formatter" label="预期赎回本金"></el-table-column>
      <el-table-column prop="investmentRedeemPrincipal" :formatter="formatter" label="实际赎回本金"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import option from "./../common/option";
export default {
  data() {
    return {
      totalByMonthVo: {},
      totalByMonthTableVo: {},
      analysisTotalVos: {},
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
