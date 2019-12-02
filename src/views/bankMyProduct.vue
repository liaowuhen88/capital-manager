<template>
  <div class="bankProduct-box">
    <el-row>
      <el-col :span="4">
        <el-select v-model="param.userName" clearable placeholder="请选择姓名">
          <el-option v-for="item in userNames" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select v-model="param.bankName" clearable placeholder="请选择银行">
          <el-option v-for="item in bankNames" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4" :offset="1">
        <el-button type="primary" icon="el-icon-search" @click="getMyBankProducts">搜索</el-button>
      </el-col>
      <el-col :span="2" :offset="9">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">买入理财</el-button>
        <!-- <el-button type="danger" icon="el-icon-delete" size="small" @click="mulDelete">批量删除</el-button> -->
      </el-col>
    </el-row>

    <el-table
      :data="bankMyProducts"
      show-summary
      stripe
      @selection-change="selectChange"
      style="width: 100%"
    >
      <el-table-column type="selection"></el-table-column>

      <el-table-column prop="bank.name" label="姓名"></el-table-column>
      <el-table-column prop="bank.bankName" label="银行"></el-table-column>
      <el-table-column prop="bank.bankCard" label="银行卡号" label-width="200px"></el-table-column>
      <el-table-column prop="productType" label="产品类型"></el-table-column>
      <el-table-column prop="investmentAmount" label="投资金额"></el-table-column>

      <el-table-column prop="buyingTime" label="买入时间"></el-table-column>
      <el-table-column prop="dueTime" label="到期时间"></el-table-column>
      <el-table-column prop="interestStartTime" label="起息日期"></el-table-column>
      <el-table-column prop="expectedInterestRate" label="预期利率"></el-table-column>
      <el-table-column prop="interestRate" label="实际利率"></el-table-column>

      <el-table-column prop="interestPaymentMethod" label="付息方式"></el-table-column>
      <el-table-column prop="profitDate" label="收利日期"></el-table-column>
      <el-table-column prop="expectedInterestIncomeMonth" label="收利日利息预期收益"></el-table-column>
      <el-table-column prop="expectedInterestIncomeTotal" label="利息预期总收益"></el-table-column>
      <el-table-column prop="totalEffectiveInterestIncome" label="实际利息总收益"></el-table-column>

      <el-table-column prop="principalAndInterestIncome" label="本息收益"></el-table-column>
      <el-table-column prop="down" label="产品说明下载"></el-table-column>
      <el-table-column prop="dueTime" label="当前时间"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope" v-if="scope.row.state == 1">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-button
                size="mini"
                type="primary"
                plain
                @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button>
            </el-col>
            <el-col :span="12">
              <el-button
                size="mini"
                type="primary"
                plain
                @click="redeem(scope.$index, scope.row)"
              >理财赎回</el-button>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-button
                size="mini"
                type="primary"
                plain
                @click="income(scope.$index, scope.row)"
              >利息收入</el-button>
            </el-col>
            <el-col :span="12">
              <el-button
                size="mini"
                type="primary"
                plain
                @click="reminderRule(scope.$index, scope.row)"
              >设置提醒规则</el-button>
            </el-col>
          </el-row>
        </template>
        <template slot-scope="scope" v-if="scope.row.state == 2">
          <el-row :gutter="20">
            <el-col :span="24">已赎回</el-col>
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
      width="700px"
      :visible.sync="buyBankProductFormVisible"
      @close="resetForm('buyMyProductForm')"
    >
      <el-form :model="buyMyProduct" :rules="buyMyProductRules" ref="buyMyProductForm">
        <el-form-item label="选择买入账户:" prop="bankCardId" label-width="100px">
          <el-select v-model="buyMyProduct.bankCardId" filterable clearable placeholder="选择买入账号">
            <el-option
              v-for="item in banks"
              :key="item.id"
              :label="item.selectName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品类型:" prop="productType" label-width="100px">
          <el-input v-model="buyMyProduct.productType" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="投资金额:" prop="investmentAmount" label-width="100px">
          <font size="4" face="arial">{{this.Amountunit}}</font>
          <el-input
            v-model="buyMyProduct.investmentAmount"
            @input="amountChange"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="买入时间:" prop="buyingTime" label-width="100px">
          <el-date-picker v-model="buyMyProduct.buyingTime" type="date" placeholder="买入时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="到期时间:" value-format="yyyy-MM-dd" prop="dueTime" label-width="100px">
          <el-date-picker v-model="buyMyProduct.dueTime" type="date" placeholder="到期时间"></el-date-picker>
        </el-form-item>
        <el-form-item
          label="起息日期:"
          value-format="yyyy-MM-dd"
          prop="interestStartTime"
          label-width="100px"
        >
          <el-date-picker v-model="buyMyProduct.interestStartTime" type="date" placeholder="起息日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="预期利率:" prop="expectedInterestRate" label-width="100px">
          <el-input v-model="buyMyProduct.expectedInterestRate" placeholder="预期利率,不需要%"></el-input>
        </el-form-item>

        <el-form-item label="付息方式:" prop="interestPaymentMethod" label-width="100px">
          <el-input v-model="buyMyProduct.interestPaymentMethod" placeholder="付息方式"></el-input>
        </el-form-item>
        <el-form-item label="收利日期:" value-format="yyyy-MM-dd" prop="profitDate" label-width="100px">
          <el-date-picker v-model="buyMyProduct.profitDate" type="date" placeholder="收利日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="收利日预期利息收益:" prop="expectedInterestIncomeMonth" label-width="100px">
          <el-input v-model="buyMyProduct.expectedInterestIncomeMonth" placeholder="收利日利息预期收益"></el-input>
        </el-form-item>
        <el-form-item label="利息预期总收益:" prop="expectedInterestIncomeTotal" label-width="100px">
          <el-input v-model="buyMyProduct.expectedInterestIncomeTotal" placeholder="利息预期收益"></el-input>
        </el-form-item>

        <el-form-item label="备注:" prop="remark" label-width="100px">
          <el-input v-model="buyMyProduct.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="buyBankProductFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitMyBankProduct('buyMyProductForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="dialogTitle"
      width="600px"
      :visible.sync="bankProductIncomeFormVisible"
      @close="resetForm('bankTransactionForm')"
    >
      <el-form :model="bankBill" :rules="bankTransactionRules" ref="bankTransactionForm">
        <el-form-item label="收款方姓名:" prop="name" label-width="100px">
          <el-input v-model="bankMyProduct.bank.name" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="收款方银行:" prop="bankName" label-width="100px">
          <el-input v-model="bankMyProduct.bank.bankName" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="收款方卡号:" prop="bankCard" label-width="100px">
          <el-input v-model="bankMyProduct.bank.bankCard" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="本次收息日期:" prop="transactionTime" label-width="100px">
          <el-date-picker
            v-model="bankBill.transactionTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="下次收息日期:" v-if="income_show" prop="nextProfitDate" label-width="100px">
          <el-date-picker
            v-model="bankBill.nextProfitDate"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="下次收息日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          label="赎回本金:"
          prop="investmentAmount"
          v-if="investmentAmount_show"
          label-width="100px"
        >
          <el-input v-model="bankMyProduct.investmentAmount" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="利息金额:" prop="transactionAmount" label-width="100px">
          <el-input v-model="bankBill.transactionAmount" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注:" label-width="100px">
          <el-input v-model="bankBill.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bankProductIncomeFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitBankTransaction('bankTransactionForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import searchs from "@/components/search/search";
export default {
  data() {
    return {
      total: 0, //默认数据总数
      currentPage: 1, //默认开始页面
      pageSize: 10,
      bankMyProducts: [],
      Amountunit: "",
      userNames: [],
      bankNames: [],
      param: { userName: "", bankName: "", bankCard: "" },
      name: "",
      bankIn: "",
      banks: [],
      income_show: false,
      investmentAmount_show: false,
      bankMyProduct: {
        bank: {
          id: "",
          name: "",
          bankName: "",
          bankCard: ""
        },
        productType: "",
        bankProduct: "",
        interestPaymentMethod: "",
        expectedInterestIncomeMonth: "",
        expectedInterestIncomeTotal: "",
        expectedinterestRate: "",
        state: 0
      },
      buyMyProduct: {
        bankCardId: "",
        productType: "",
        bankProduct: "",
        interestPaymentMethod: "",
        expectedInterestIncomeMonth: "",
        expectedInterestIncomeTotal: "",
        expectedinterestRate: "",
        state: 0
      },
      bankBill: {
        bankCardId: "",
        myProductId: "",
        transactionTime: "",
        transactionType: "",
        transactionAmount: "",
        transferCard: "",
        remark: ""
      },
      param: { name: "", bank: "", bankCard: "", times: "" },
      bankProductBackup: Object.assign({}, this.bankProduct),
      multipleSelection: [],
      buyBankProductFormVisible: false,
      bankProductIncomeFormVisible: false,
      dialogTitle: "",
      rowIndex: 9999,
      buyMyProductRules: {
        bankCardId: [{ required: true, message: "买入账号", trigger: "blur" }],
        productType: [{ required: true, message: "产品类型", trigger: "blur" }],
        investmentAmount: [
          { required: true, message: "投资金额", trigger: "blur" }
        ],
        buyingTime: [{ required: true, message: "买入时间", trigger: "blur" }],
        dueTime: [{ required: true, message: "到期时间", trigger: "blur" }],
        interestStartTime: [
          { required: true, message: "起息日期", trigger: "blur" }
        ],
        expectedInterestRate: [
          { required: true, message: "预期利率", trigger: "blur" }
        ],
        interestPaymentMethod: [
          { required: true, message: "付息方式", trigger: "blur" }
        ],
        profitDate: [{ required: true, message: "收利日期", trigger: "blur" }],
        expectedInterestIncomeMonth: [
          { required: true, message: "利息预期收益", trigger: "blur" }
        ],
        expectedInterestIncomeTotal: [
          { required: true, message: "利息预期收益", trigger: "blur" }
        ]
      },
      bankTransactionRules: {
        transactionTime: [
          { required: true, message: "交易日期", trigger: "blur" }
        ],
        nextProfitDate: [
          { required: true, message: "下次收息日期", trigger: "blur" }
        ],
        transactionAmount: [
          { required: true, message: "利息金额", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.getMyBankProducts();
    this.getBanks();
    this.initBanks();
  },
  components: {
    searchs
  },
  methods: {
    getMyBankProducts() {
      let postData = this.$qs.stringify({
        page: this.currentPage,
        rows: this.pageSize,
        name: this.name,
        bank: this.bank
      });
      this.$http({
        method: "post",
        url: this.BASE_API + "/api/bankMyProducts/select",
        data: this.param
      })
        .then(res => {
          if (res.data.code == 0) {
            this.bankMyProducts = res.data.data;
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
    initBanks() {
      this.loading = true;
      this.$http({
        method: "post",
        url: this.BASE_API + "/api/banks/selectAll"
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
    amountChange(amount) {
      this.Amountunit = this.Utils.transform(amount);
    },
    getBanks() {
      this.loading = true;
      this.$http({
        method: "post",
        url: this.BASE_API + "/api/banks/selectUserNamesAndBankNames"
      })
        .then(res => {
          if (res.data.code == 0) {
            this.userNames = res.data.data.userNames;
            this.bankNames = res.data.data.bankNames;
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
    handleEdit(index, row) {
      this.$message({
        type: "success",
        message: "目前不支持编辑,待提供"
      });
    },
    reminderRule(index, row) {
      this.$message({
        type: "success",
        message: "目前不支持设置提醒规则,待提供"
      });
    },
    redeem(index, row) {
      this.bankMyProduct = Object.assign({}, row);
      this.bankProductIncomeFormVisible = true;
      this.rowIndex = index;
      this.dialogTitle = "理财赎回";
      this.investmentAmount_show = true;
      this.bankBill.myProductId = row.id;
      this.bankBill.bankCardId = this.bankMyProduct.bank.id;
      this.bankBill.transactionType = 9;

      // this.$confirm(`确定要赎回 【${row.productType}】 吗?`, "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning"
      // })
      //   .then(() => {
      //     this.$message({
      //       type: "success",
      //       message: "赎回成功!"
      //     });
      //   })
      //   .catch(() => {
      //     console.log("赎回失败");
      //   });
    },
    income(index, row) {
      this.bankMyProduct = Object.assign({}, row);
      this.bankProductIncomeFormVisible = true;
      this.rowIndex = index;
      this.income_show = true;
      this.dialogTitle = "利息收入";
      this.bankBill.myProductId = row.id;
      this.bankBill.bankCardId = this.bankMyProduct.bank.id;
      this.bankBill.transactionType = 6;
    },
    submitBankTransaction(bankTransactionForm) {
      // 表单验证
      this.$refs[bankTransactionForm].validate(valid => {
        if (valid) {
          this.$http({
            method: "post",
            url: this.BASE_API + "/api/bankMyProducts/income",
            data: this.bankBill
          })
            .then(res => {
              if (res.data.code == 0) {
                this.$message({
                  type: "success",
                  message: "新增成功！"
                });
                this.bankProductIncomeFormVisible = false;
                this.income_show = false;
                this.investmentAmount_show = false;
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
    submitMyBankProduct(buyMyProductForm) {
      // 表单验证
      this.$refs[buyMyProductForm].validate(valid => {
        if (valid) {
          this.$http({
            method: "post",
            url: this.BASE_API + "/api/bankMyProducts/buy",
            data: this.buyMyProduct
          })
            .then(res => {
              if (res.data.code == 0) {
                this.$message({
                  type: "success",
                  message: "新增成功！"
                });
                this.buyBankProductFormVisible = false;
                this.getMyBankProducts();
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
    selectChange(val) {
      this.multipleSelection = val;
    },
    handleAdd() {
      this.dialogTitle = "买入理财";
      this.buyBankProductFormVisible = true;
    },
    resetForm(formName) {
      this.$refs[formName].clearValidate();
    }
  }
};
</script>

<style lang="scss" scoped>
.bankProduct-box {
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
