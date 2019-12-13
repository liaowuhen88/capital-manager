<template >
  <div class="console">
    <el-row>
      <el-col :span="8">
        <p>
          <font
            size="4"
            face="arial"
          >总金额：{{pageHomeVo.bankTotalVo?this.Utils.toMoney(pageHomeVo.bankTotalVo.totalAccountBalance):0}}</font>
        </p>
      </el-col>
      <el-col :span="8">
        <p>
          <font
            size="4"
            face="arial"
          >卡内金额：{{pageHomeVo.bankTotalVo?this.Utils.toMoney(pageHomeVo.bankTotalVo.totalCashAmount):0}}</font>
        </p>
      </el-col>
      <el-col :span="8">
        <p>
          <font
            size="4"
            face="arial"
          >投资金额：{{pageHomeVo.bankTotalVo?this.Utils.toMoney(pageHomeVo.bankTotalVo.totalInvestmentAmount):0}}</font>
        </p>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row>
      <el-col :span="8">
        <p>
          <font
            size="4"
            face="arial"
          >本年度活期利息收入：{{pageHomeVo.integerBankBillTotalVoMap.cashInterestIncome?this.Utils.toMoney(pageHomeVo.integerBankBillTotalVoMap.cashInterestIncome.totalTransactionAmount):0 }}</font>
        </p>
      </el-col>
      <el-col :span="8">
        <p>
          <font
            size="4"
            face="arial"
          >本年度理财利息收入：{{pageHomeVo.integerBankBillTotalVoMap.investmentIncome?this.Utils.toMoney(pageHomeVo.integerBankBillTotalVoMap.investmentIncome.totalTransactionAmount):0}}</font>
        </p>
      </el-col>
      <el-col :span="8">
        <p>
          <font
            size="4"
            face="arial"
          >本年度支出：{{pageHomeVo.integerBankBillTotalVoMap.pay?this.Utils.toMoney(pageHomeVo.integerBankBillTotalVoMap.pay.totalTransactionAmount):0 }}</font>
        </p>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row>
      <el-col :span="4">
        <p>
          <font size="4" face="arial">到期产品:</font>
        </p>
      </el-col>
      <el-col :span="20">
        <el-table
          :data="pageHomeVo.expireProduct"
          @cell-dblclick="cellDblclick"
          style="width: 100%"
        >
          <el-table-column prop="id" label="编号"></el-table-column>
          <el-table-column prop="bank.name" label="姓名" width="180"></el-table-column>
          <el-table-column prop="bank.bankName" label="银行" width="180"></el-table-column>
          <el-table-column prop="productType" label="产品类别" width="180"></el-table-column>
          <el-table-column prop="buyingTime" label="买入时间" width="180"></el-table-column>
          <el-table-column prop="investmentAmount" :formatter="formatter" label="到账金额"></el-table-column>

          <el-table-column prop="dueTime" label="产品到期时间"></el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
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
        <el-table
          :data="pageHomeVo.expireInterest"
          @cell-dblclick="cellDblclick"
          style="width: 100%"
        >
          <el-table-column prop="id" label="编号"></el-table-column>
          <el-table-column prop="bank.name" label="姓名" width="180"></el-table-column>
          <el-table-column prop="bank.bankName" label="银行" width="180"></el-table-column>
          <el-table-column prop="productType" label="产品类别" width="180"></el-table-column>
          <el-table-column prop="buyingTime" label="买入时间" width="180"></el-table-column>
          <el-table-column
            prop="expectedInterestIncomeMonth"
            :formatter="formatter"
            label="利息预计到账金额"
          ></el-table-column>
          <el-table-column prop="profitDate" label="利息到期时间"></el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
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

    <el-dialog :visible.sync="bankLog_show" width="80%">
      <commonBankLogVue ref="commonBankLogVueRef" />
    </el-dialog>
  </div>
</template>
<script>
import commonBankLogVue from "@/components/commonBankLog";
export default {
  data() {
    return {
      bankLog_show: false,
      param: { userName: "", bankName: "", bankCard: "" },
      pageHomeVo: {
        integerBankBillTotalVoMap: {
          cashInterestIncome: {},
          investmentIncome: {},
          pay: {}
        }
      }
    };
  },
  mounted() {
    this.getPageHome();
  },
  components: { commonBankLogVue },
  methods: {
    getPageHome(param) {
      this.loading = true;
      this.$http({
        method: "post",
        url: this.BASE_API + "/api/pageHome/getTotal",
        data: param ? param : {}
      })
        .then(res => {
          if (res.data.code == 0) {
            this.pageHomeVo = res.data.data;
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
    formatter(row, column) {
      return this.Utils.toMoney(row[column.property]) + "元";
    },
    cellDblclick(val) {
      console.log(val);
      this.bankLog_show = true;
      this.$nextTick(function() {
        this.$refs.commonBankLogVueRef.searchMyProductId(val);
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
