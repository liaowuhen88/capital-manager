<template>
  <div class="bank-box">
    <searchsVue @search="getBanks" @handleAdd="handleAdd" />

    <el-table :stripe="true" :data="banks" show-summary style="width: 100%">
      <el-table-column prop="name" label="银行"></el-table-column>
    </el-table>
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
          <el-select v-model="bank.bankName" filterable clearable placeholder="选择转入账号">
            <el-option v-for="item in bankNames" :key="item" :label="item" :value="item"></el-option>
          </el-select>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      banks: [],
      bankLogs: [],
      bankNames: [],
      bankTransaction_bankProduct: false,
      bankTransaction_transferCard: false,
      bank: {
        id: "",
        name: "",
        bankName: "",
        bankCard: "",
        cashAmount: "",
        investmentAmount: "",
        accountBalance: ""
      },
      multipleSelection: [],
      bankFormVisible: false,
      bankTransactionFormVisible: false,
      bankLogsFormVisible: false,
      dialogTitle: "",
      rowIndex: 9999,
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        bankName: [{ required: true, message: "请输入银行", trigger: "blur" }],
        bankCard: [{ required: true, message: "请输入卡号", trigger: "blur" }]
      },
      bankTransactionRules: {
        transactionTime: [
          { required: true, message: "请选择时间", trigger: "blur" }
        ],
        transactionAmount: [
          { required: true, message: "请输入金额", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.getBanks();
    this.getBankNames();
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
    },
    getBankNames(param) {
      this.$http({
        method: "post",
        url: this.BASE_API + "/api/banks/getBankName",
        data: param
      })
        .then(res => {
          if (res.data.code == 0) {
            this.bankNames = res.data.data;
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
              url: this.BASE_API + "/api/banks/insert",
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
    submitBankTransaction(bankTransactionForm) {
      // 表单验证
      this.$refs[bankTransactionForm].validate(valid => {
        if (valid) {
          this.$http({
            method: "post",
            url: this.BASE_API + "/api/bankBill/transaction",
            data: this.bankTransaction
          })
            .then(res => {
              if (res.data.code == 0) {
                this.$message({
                  type: "success",
                  message: "新增成功！"
                });
                this.bankTransactionFormVisible = false;
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
      this.bankTransaction_transferCard = false;
      this.dialogTitle = "收入";
      this.bankIn = Object.assign({}, row);
      this.bankIn.show = true;
      this.bankOut = {};
      this.bankTransaction.bankCardId = row.id;
      this.bankTransaction.transactionType = 1;
      this.bankTransactionFormVisible = true;
    },
    transfer(index, row) {
      this.bankTransaction_transferCard = true;
      this.dialogTitle = "转账";
      this.bankOut = Object.assign({}, row);
      this.bankOut.show = true;
      this.bankIn = {};
      this.bankIn.show = true;
      this.bankTransaction.transactionType = 3;
      this.bankTransaction.bankCardId = row.id;
      this.bankTransactionFormVisible = true;
    },
    pay(index, row) {
      this.bankTransaction_transferCard = false;
      this.dialogTitle = "支出";
      this.bankIn = {};
      this.bankOut = Object.assign({}, row);
      this.bankOut.show = true;
      this.bankTransaction.transactionType = 2;
      this.bankTransaction.bankCardId = row.id;
      this.bankTransactionFormVisible = true;
    },
    cashInterestIncome(index, row) {
      this.bankTransaction_transferCard = false;
      this.dialogTitle = "活期利息收入";
      this.bankIn = Object.assign({}, row);
      this.bankIn.show = true;
      this.bankOut = {};
      this.bankTransaction.transactionType = 4;
      this.bankTransaction.bankCardId = row.id;
      this.bankTransactionFormVisible = true;
    },
    transferCard(value) {
      this.banks.forEach(item => {
        if (item.id === value) {
          // 转账
          if (this.bankTransaction.transactionType == 3) {
            this.bankIn = Object.assign({}, item);
            this.bankIn.show = true;
          } else {
            // this.bankOut = Object.assign({}, row);
          }
        }
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
