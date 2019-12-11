<template>
  <div class="bank-box">
    <searchsVue ref="searchsVue" @search="getBanks" @handleAdd="handleAdd" />

    <el-table
      :stripe="true"
      :data="banks"
      show-summary
      :summary-method="getSummaries"
      style="width: 100%"
    >
      <el-table-column prop="id" label="编号"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="bankName" label="银行"></el-table-column>
      <el-table-column prop="bankCard" label="银行卡号" width="150"></el-table-column>
      <el-table-column prop="cashAmount" label="现金金额/元" :formatter="formatter"></el-table-column>
      <el-table-column prop="investmentAmount" label="投资金额/元" :formatter="formatter"></el-table-column>
      <el-table-column prop="accountBalance" label="总金额/元" :formatter="formatter"></el-table-column>
      <el-table-column prop="updateTime" label="最近更新时间" width="180"></el-table-column>
      <!-- <el-table-column label="当前时间" width="180">{{ Utils.getTime() }}</el-table-column> -->
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
    <el-pagination
      @next-click="nextClick"
      @prev-click="prevClick"
      @current-change="currentChange"
      background
      :page-sizes="[10, 20, 30, 50]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
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
          <el-select v-model="bank.bankName" filterable clearable placeholder="银行">
            <el-option
              v-for="item in bankNames"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
          <el-button size="mini" type="primary" plain @click="addBankName">新增银行</el-button>
        </el-form-item>
        <el-form-item label="卡号:" prop="bankCard" label-width="100px">
          <el-input v-model="bank.bankCard" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="现金金额:" prop="cashAmount" label-width="100px">
          <font size="4" face="arial">{{this.Utils.transform(bank.cashAmount) }}</font>
          <el-input v-model="bank.cashAmount"></el-input>
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
      :visible.sync="bankTransactionFormVisible"
      @close="resetForm('bankTransactionForm')"
    >
      <el-form :model="bankTransaction" :rules="bankTransactionRules" ref="bankTransactionForm">
        <el-form-item v-if="bankOut.show" label="付款方姓名:" prop="name" label-width="100px">
          <el-input v-model="bankOut.name" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="bankOut.show" label="付款银行:" prop="bankName" label-width="100px">
          <el-input v-model="bankOut.bankName" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="bankOut.show" label="付款卡号:" prop="bankCard" label-width="100px">
          <el-input v-model="bankOut.bankCard" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="bankIn.show" label="收款方姓名:" prop="name" label-width="100px">
          <el-input v-model="bankIn.name" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="bankIn.show" label="收款方银行:" prop="bankName" label-width="100px">
          <el-input v-model="bankIn.bankName" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="bankIn.show" label="收款方卡号:" prop="bankCard" label-width="100px">
          <el-input v-model="bankIn.bankCard" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="bankTransaction_transferCard" label="转入账号:" label-width="100px">
          <el-select
            v-model="bankTransaction.transferCard"
            filterable
            clearable
            placeholder="选择转入账号"
            @change="transferCard"
          >
            <el-option
              v-for="item in banks"
              :key="item.id"
              :label="item.selectName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交易日期:" prop="transactionTime" label-width="100px">
          <el-date-picker
            v-model="bankTransaction.transactionTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="交易金额:" prop="transactionAmount" label-width="100px">
          <font size="4" face="arial">{{this.Utils.transform(bankTransaction.transactionAmount) }}</font>
          <el-input v-model="bankTransaction.transactionAmount" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="备注:" label-width="100px">
          <el-input v-model="bankTransaction.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bankTransactionFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitBankTransaction('bankTransactionForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="dialogTitle"
      width="600px"
      :visible.sync="addBankNameFormVisible"
      @close="resetForm('addBankNameForm')"
    >
      <el-form :model="bankName" :rules="addBankNameRules" ref="addBankNameForm">
        <el-form-item label="银行名称:" prop="name" label-width="100px">
          <el-input v-model="bankName.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addBankNameFormVisible= false">取 消</el-button>
        <el-button type="primary" @click="submitAddBankName('addBankNameForm')">确 定</el-button>
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
      pagination: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      bankLogs: [],
      bankNames: [],
      bankName: {
        name: ""
      },
      bankTransaction_bankProduct: false,
      bankTransaction_transferCard: false,
      addBankNameFormVisible: false,
      bank: {
        id: "",
        name: "",
        bankName: "",
        bankCard: "",
        cashAmount: "",
        investmentAmount: "",
        accountBalance: ""
      },
      bankIn: {
        id: "",
        name: "",
        bankName: "",
        bankCard: "",
        cashAmount: "",
        investmentAmount: "",
        show: false,
        accountBalance: ""
      },
      bankOut: {
        id: "",
        name: "",
        bankName: "",
        bankCard: "",
        cashAmount: "",
        show: false,
        investmentAmount: "",
        accountBalance: ""
      },
      bankBackup: Object.assign({}, this.bank),
      bankTransaction: {
        bankCardId: "",
        transactionTime: "",
        transactionType: "",
        transactionAmount: "",
        transferCard: "",
        remark: ""
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
        bankCard: [{ required: true, message: "请输入卡号", trigger: "blur" }],
        cashAmount: [{ required: true, message: "请输入金额", trigger: "blur" }]
      },
      bankTransactionRules: {
        transactionTime: [
          { required: true, message: "请选择时间", trigger: "blur" }
        ],
        transactionAmount: [
          { required: true, message: "请输入金额", trigger: "blur" }
        ]
      },
      addBankNameRules: {
        name: [{ required: true, message: "请输入银行名称", trigger: "blur" }]
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
      param = param ? param : this.$refs.searchsVue.param;
      param.page = this.pagination.currentPage;
      param.pageSize = this.pagination.pageSize;

      this.loading = true;
      this.$http({
        method: "post",
        url: this.BASE_API + "/api/banks/select",
        data: param
      })
        .then(res => {
          if (res.data.code == 0) {
            this.banks = res.data.data;
            this.pagination.total = res.data.total;
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
        url: this.BASE_API + "/api/bankNames/getBankName",
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
          this.$http({
            method: "post",
            url: this.BASE_API + "/api/banks/insert",
            data: this.bank
          })
            .then(res => {
              if (res.data.code == 0) {
                this.banks = res.data.data;
                this.bankFormVisible = false;
                this.$message({
                  type: "success",
                  message: id ? "修改成功！" : "新增成功！"
                });
                this.getBanks();
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
                this.resetForm(bankTransactionForm);
                this.getBanks();
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
      this.$refs[formName].resetFields();
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
    },
    nextClick() {
      this.pagination.currentPage = this.pagination.currentPage + 1;
      this.getBanks();
    },
    prevClick() {
      if (this.pagination.currentPage < 1) {
        return;
      }
      this.pagination.currentPage = this.pagination.currentPage - 1;
      this.getBanks();
    },
    currentChange(page) {
      this.pagination.currentPage = page;
      this.getBanks();
    },
    addBankName() {
      this.addBankNameFormVisible = true;
    },
    formatter(row, column) {
      return this.Utils.toMoney(row[column.property]) + "元";
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总价";
          return;
        }
        if (index === 2 || index === 1) {
          sums[index] = "";
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
    submitAddBankName(addBankNameForm) {
      // 表单验证
      this.$refs[addBankNameForm].validate(valid => {
        if (valid) {
          this.$http({
            method: "post",
            url: this.BASE_API + "/api/bankNames/addBankName",
            data: this.bankName
          })
            .then(res => {
              if (res.data.code == 0) {
                this.$message({
                  type: "success",
                  message: "新增成功！"
                });
                this.addBankNameFormVisible = false;
                this.getBankNames();
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
