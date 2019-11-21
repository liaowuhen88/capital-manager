<template>
  <div class="bank-box">
    <el-table :stripe="true" :data="banks" show-summary style="width: 100%">
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="bankName" label="银行"></el-table-column>
      <el-table-column prop="bankCard" label="银行卡号" width="150"></el-table-column>
      <el-table-column prop="cashAmount" label="现金金额"></el-table-column>
      <el-table-column prop="investmentAmount" label="投资金额"></el-table-column>
      <el-table-column prop="accountBalance" label="总金额"></el-table-column>
      <el-table-column prop="updateTime" label="最近更新时间" width="180"></el-table-column>
      <el-table-column label="当前时间" width="180">{{ Utils.getTime() }}</el-table-column>
      <el-table-column label="操作" fixed="right" width="250">
        <template slot-scope="scope">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-button
                size="mini"
                type="primary"
                plain
                @click="income(scope.$index, scope.row)"
              >收入</el-button>
            </el-col>
            <el-col :span="8">
              <el-button size="mini" type="primary" plain @click="pay(scope.$index, scope.row)">支出</el-button>
            </el-col>
            <el-col :span="8">
              <el-button
                size="mini"
                type="primary"
                plain
                @click="transfer(scope.$index, scope.row)"
              >转账</el-button>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-button
                size="mini"
                type="primary"
                plain
                @click="cashInterestIncome(scope.$index, scope.row)"
              >活期利息收入</el-button>
            </el-col>
            <!-- <el-col :span="12">
              <el-button
                size="mini"
                type="primary"
                plain
                @click="investment(scope.$index, scope.row)"
              >买入理财</el-button>
            </el-col>-->
          </el-row>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    this.getBanks();
  },
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

<style lang="scss" scoped>
.bank-box {
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
