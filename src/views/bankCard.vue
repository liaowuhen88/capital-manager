<template>
  <div class="bank-box">
    <searchsVue @search="getBanks" @handleAdd="handleAdd" />

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
              >转入</el-button>
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
            <el-col :span="12">
              <el-button
                size="mini"
                type="primary"
                plain
                @click="investment(scope.$index, scope.row)"
              >买入理财</el-button>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :page-sizes="[10, 20, 30, 50]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
    ></el-pagination>
    <el-dialog
      :title="dialogTitle"
      width="600px"
      :visible.sync="bankFormVisible"
      @close="resetForm('bankForm')"
    >
      <el-form :model="bank" :rules="rules" ref="bankForm">
        <el-form-item label="姓名:" prop="name" label-width="100px">
          <el-input v-model="bank.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="银行:" prop="bankName" label-width="100px">
          <el-input v-model="bank.bankName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="卡号:" prop="bankCard" label-width="100px">
          <el-input v-model="bank.bankCard" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="现金金额:" label-width="100px">
          <el-input v-model="bank.cashAmount" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bankFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitBank('bankForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="dialogTitle"
      width="600px"
      :visible.sync="bankIncomeFormVisible"
      @close="resetForm('bankIncomeForm')"
    >
      <el-form :model="bankInCome" :rules="bankInComeRules" ref="bankIncomeForm">
        <el-form-item label="姓名:" prop="name" label-width="100px">
          <el-input v-model="bank.name" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="银行:" prop="bankName" label-width="100px">
          <el-input v-model="bank.bankName" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="卡号:" prop="bankCard" label-width="100px">
          <el-input v-model="bank.bankCard" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="选择日期:" prop="bankCard" label-width="100px">
          <el-date-picker v-model="bankInCome.transactionTime" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>

        <el-form-item v-if="bankInCome_amount" label="交易金额:" label-width="100px">
          <el-input v-model="bankInCome.transactionAmount" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item v-if="bankInCome_bankProduct" label="选择理财产品:" label-width="100px">
          <el-select v-model="bankInCome.bankProduct" clearable placeholder="选择理财产品">
            <el-option value></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="bankInCome_transferCard" label="选择转入账号:" label-width="100px">
          <el-select v-model="bankInCome.transferCar" clearable placeholder="选择转入账号">
            <el-option value></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bankIncomeFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitBankIncome('bankIncomeForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import searchsVue from "@/components/search/search_common.vue";
export default {
  data() {
    return {
      banks: [],
      bankLogs: [],
      bankInCome_amount: true,
      bankInCome_bankProduct: false,
      bankInCome_transferCard: false,
      bank: {
        id: "",
        name: "",
        bankName: "",
        bankCard: "",
        cashAmount: "",
        investmentAmount: "",
        accountBalance: ""
      },
      bankBackup: Object.assign({}, this.bank),
      bankInCome: {
        bankCardId: "",
        transactionTime: "",
        transactionAmount: ""
      },
      multipleSelection: [],
      bankFormVisible: false,
      bankIncomeFormVisible: false,
      bankLogsFormVisible: false,
      dialogTitle: "",
      rowIndex: 9999,
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        bankName: [{ required: true, message: "请输入银行", trigger: "blur" }],
        bankCard: [{ required: true, message: "请输入卡号", trigger: "blur" }]
      },
      bankInComeRules: {
        transactionTime: [
          { required: true, message: "请选择时间", trigger: "blur" }
        ],
        accountBalance: [
          { required: true, message: "请输入金额", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.getBanks();
  },
  components: {
    searchsVue
  },
  props: ["param"],
  methods: {
    getBanks(param) {
      this.loading = true;
      this.$http({
        method: "post",
        url: "http://localhost:8086/api/banks/selectAll",
        data: param
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
    },
    submitBank(formName) {
      // 表单验证
      this.$refs[formName].validate(valid => {
        if (valid) {
          let id = this.bank.id;
          if (id) {
            // id非空-修改
            this.banks.splice(this.rowIndex, 1, this.bank);
          } else {
            this.$http({
              method: "post",
              url: "http://localhost:8086/api/banks/insert",
              data: this.bank
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
          this.bankFormVisible = false;
          this.$message({
            type: "success",
            message: id ? "修改成功！" : "新增成功！"
          });
        }
      });
    },
    submitBankIncome(bankIncomeForm) {
      // 表单验证
      this.$refs[bankIncomeForm].validate(valid => {
        if (valid) {
          this.$http({
            method: "post",
            url: "http://localhost:8086/api/bankBill/transaction",
            data: this.bankInCome
          })
            .then(res => {
              if (res.data.code == 0) {
                this.$message({
                  type: "success",
                  message: "新增成功！"
                });
                this.bankIncomeFormVisible = false;
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
      });
    },
    resetForm(formName) {
      this.$refs[formName].clearValidate();
    },
    handleAdd() {
      this.dialogTitle = "新增";
      this.bank = Object.assign({}, this.bankBackup);
      this.bankFormVisible = true;
    },
    income(index, row) {
      this.bankInCome_amount = true;
      this.bankInCome_bankProduct = false;
      this.bankInCome_transferCard = false;
      this.dialogTitle = "收入";
      this.bank = Object.assign({}, row);
      this.bankInCome.bankCardId = row.id;
      this.bankIncomeFormVisible = true;
    },
    transfer(index, row) {
      this.bankInCome_amount = true;
      this.bankInCome_bankProduct = false;
      this.bankInCome_transferCard = true;
      this.dialogTitle = "转账";
      this.bank = Object.assign({}, row);

      this.bankInCome.bankCardId = row.id;
      this.bankIncomeFormVisible = true;
    },
    pay(index, row) {
      this.bankInCome_amount = true;
      this.bankInCome_bankProduct = false;
      this.bankInCome_transferCard = false;
      this.dialogTitle = "支出";
      this.bank = Object.assign({}, row);

      this.bankInCome.bankCardId = row.id;
      this.bankIncomeFormVisible = true;
    },
    cashInterestIncome(index, row) {
      this.bankInCome_amount = true;
      this.bankInCome_bankProduct = false;
      this.bankInCome_transferCard = false;
      this.dialogTitle = "活期利息收入";
      this.bank = Object.assign({}, row);

      this.bankInCome.bankCardId = row.id;
      this.bankIncomeFormVisible = true;
    },
    investment(index, row) {
      this.bankInCome_amount = false;
      this.bankInCome_bankProduct = true;
      this.bankInCome_transferCard = false;
      this.dialogTitle = "购买理财";
      this.bank = Object.assign({}, row);

      this.bankInCome.bankCardId = row.id;
      this.bankIncomeFormVisible = true;
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
