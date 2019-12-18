<template>
  <div>
    <el-row>
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
      <el-col :span="5" :offset="1">
        <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
      </el-col>
    </el-row>
    <div class="echarts-box">
      <div class="echarts" id="echarts"></div>
    </div>
  </div>
</template>

<script>
import option from "./../common/option";
export default {
  data() {
    return {
      totalByMonthVo: {},
      param: {
        userName: "",
        bankName: "",
        bankCard: "",
        transactionTypes: [],
        myProductId: ""
      }
    };
  },
  mounted() {
    this.getData();
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
    getData(param) {
      this.loading = true;
      this.$http({
        method: "post",
        url: this.BASE_API + "/api/bankBill/totalByMonth",
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
    search() {
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
</style>
