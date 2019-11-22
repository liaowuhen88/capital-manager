<template >
  <div class="console">
    <el-row>
      <el-col :span="4">
        <p>
          <font size="4" face="arial">总金额：</font>
        </p>
      </el-col>
      <el-col :span="4">
        <p>
          <font size="4" face="arial">1000000元</font>
        </p>
      </el-col>
      <el-col :span="16"></el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row>
      <el-col :span="4">
        <p>
          <font size="4" face="arial">卡内余额：</font>
        </p>
      </el-col>
      <el-col :span="4">
        <p>
          <font size="4" face="arial">5000元</font>
        </p>
      </el-col>
      <el-col :span="16"></el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row>
      <el-col :span="4">
        <p>
          <font size="4" face="arial">本年度利息收入：</font>
        </p>
      </el-col>
      <el-col :span="4">
        <p>
          <font size="4" face="arial">500元</font>
        </p>
      </el-col>
      <el-col :span="4">
        <p>
          <font size="4" face="arial"></font>
        </p>
      </el-col>
      <el-col :span="12"></el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row>
      <el-col :span="4">
        <p>
          <font size="4" face="arial">本年度支出：</font>
        </p>
      </el-col>
      <el-col :span="4">
        <p>
          <font size="4" face="arial">500元</font>
        </p>
      </el-col>
      <el-col :span="4">
        <p>
          <font size="4" face="arial"></font>
        </p>
      </el-col>
      <el-col :span="12"></el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row>
      <el-col :span="4">
        <p>
          <font size="4" face="arial">到期产品:</font>
        </p>
      </el-col>
      <el-col :span="20">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="date" label="姓名" width="180"></el-table-column>
          <el-table-column prop="name" label="银行" width="180"></el-table-column>
          <el-table-column prop="address" label="到账金额"></el-table-column>
          <el-table-column prop="address" label="日期"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row>
      <el-col :span="4">
        <p>
          <font size="4" face="arial">未到账利息:</font>
        </p>
      </el-col>
      <el-col :span="20">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="date" label="姓名" width="180"></el-table-column>
          <el-table-column prop="name" label="银行" width="180"></el-table-column>
          <el-table-column prop="address" label="到账金额"></el-table-column>
          <el-table-column prop="address" label="日期"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row>
      <el-col :span="24">
        <div></div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div></div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return { param: { userName: "", bankName: "", bankCard: "" } };
  },
  mounted() {},
  methods: {
    getBanks(param) {
      this.loading = true;
      this.$http({
        method: "post",
        url: this.BASE_API + "/api/banks/select",
        data: param ? param : {}
      })
        .then(res => {
          if (res.data.code == 0) {
            this.banks = res.data.data;
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

<style>
.console {
  font-size: 30px;
  text-align: center;
  margin-top: 50px;
}
</style>
