<template>
  <div class="echarts-box">
    <div class="echarts" id="echarts"></div>
  </div>
</template>

<script>
import option from "./../common/option";
export default {
  data() {
    return { totalByMonthVo: {} };
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
