<template>
  <div class="bankProduct-box">
    <el-row>
      <el-col :span="3">
        <el-select v-model="param.userName" clearable placeholder="请选择姓名">
          <el-option v-for="item in userNames" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select v-model="param.bankName" clearable placeholder="请选择银行">
          <el-option v-for="item in bankNames" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-input v-model="param.productType" autocomplete="off" placeholder="产品类型"></el-input>
      </el-col>
      <el-col :span="2">
        <el-select v-model="param.state" multiple placeholder="产品状态">
          <el-option
            v-for="item in states"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>

      <el-col :span="3">
        <el-select v-model="param.interestPaymentMethod" clearable placeholder="付息方式">
          <el-option v-for="item in interestPaymentMethods" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-col>

      <el-col :span="3" :offset="1">
        <el-button type="primary" icon="el-icon-search" @click="getMyBankProducts">搜索</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" icon="el-icon-download" @click="downloanMyBankProducts">下载</el-button>
      </el-col>
      <el-col :span="3" :offset="1">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">买入理财</el-button>
        <!-- <el-button type="danger" icon="el-icon-delete" size="small" @click="mulDelete">批量删除</el-button> -->
      </el-col>
    </el-row>

    <el-table
      :data="bankMyProducts"
      show-summary
      :summary-method="getSummaries"
      stripe
      height="600px"
      @selection-change="selectChange"
      @cell-dblclick="cellDblclick"
      style="width: 100%"
    >
      <el-table-column prop="id" label="编号"></el-table-column>

      <el-table-column prop="bank.name" label="姓名"></el-table-column>
      <el-table-column prop="bank.bankName" label="银行"></el-table-column>
      <el-table-column prop="bank.bankCard" label="银行卡号" label-width="200px"></el-table-column>
      <el-table-column prop="productType" label="产品类型"></el-table-column>
      <el-table-column
        prop="investmentAmount"
        sortable
        :formatter="formatter"
        width="150px"
        label="投资金额"
      ></el-table-column>

      <el-table-column prop="buyingTime" sortable label="买入时间" width="100px"></el-table-column>
      <el-table-column prop="interestStartTime" sortable width="100px" label="起息日期"></el-table-column>
      <el-table-column prop="profitDate" sortable label="收利日期" width="100px"></el-table-column>
      <el-table-column prop="dueTime" sortable label="到期时间" width="100px"></el-table-column>
      <el-table-column prop="expectedInterestRate" sortable label="预期利率"></el-table-column>
      <el-table-column prop="interestRate" sortable label="实际利率"></el-table-column>

      <el-table-column prop="interestPaymentMethod" label="付息方式"></el-table-column>

      <el-table-column
        prop="expectedInterestIncomeMonth"
        width="150px"
        :formatter="formatter"
        sortable
        label="收利日利息预期收益"
      ></el-table-column>
      <el-table-column
        prop="expectedInterestIncomeTotal"
        width="150px"
        :formatter="formatter"
        sortable
        label="利息预期总收益"
      ></el-table-column>
      <el-table-column
        prop="totalEffectiveInterestIncome"
        width="150px"
        :formatter="formatter"
        sortable
        label="实际利息总收益"
      ></el-table-column>

      <el-table-column
        prop="principalAndInterestIncome"
        :formatter="formatter"
        label="本息收益"
        sortable
        width="150px"
      ></el-table-column>
      <el-table-column prop="down" label="产品说明下载"></el-table-column>
      <!-- <el-table-column prop="dueTime" label="到期时间"></el-table-column> -->
      <!-- <el-table-column prop="remark" label="备注"></el-table-column> -->
      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-row :gutter="20" v-if="scope.row.state == 1">
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
          <el-row :gutter="20" v-if="scope.row.state == 1">
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

          <el-row :gutter="20" v-if="scope.row.state == 2">
            <el-col :span="12">已赎回</el-col>
            <el-col :span="12">
              <el-button
                size="mini"
                type="primary"
                plain
                @click="deleteBankProduct(scope.$index, scope.row)"
              >删除</el-button>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination
      background
      :page-sizes="[10, 20, 30, 50]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
    ></el-pagination>-->

    <el-dialog
      :title="dialogTitle"
      width="700px"
      :visible.sync="buyBankProductFormVisible"
      @close="resetForm('buyMyProductForm')"
      @open="submitButtonDisabled = false"
    >
      <el-form :model="buyMyProduct" :rules="buyMyProductRules" ref="buyMyProductForm">
        <el-form-item label="选择买入账户:" prop="bankCardId" label-width="150px">
          <el-select
            v-model="buyMyProduct.bankCardId"
            filterable
            clearable
            placeholder="选择买入账号"
            @change="bankChange"
          >
            <el-option
              v-for="item in banks"
              :key="item.id"
              :label="item.selectName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="卡内余额:" label-width="150px">
          <font size="4" face="arial">{{this.Utils.toMoney(bank.cashAmount) }}</font>
          <!-- <el-input v-model="bank.cashAmount" :disabled="true" autocomplete="off"></el-input> -->
        </el-form-item>
        <el-form-item label="产品类型:" prop="productType" label-width="150px">
          <el-input v-model="buyMyProduct.productType" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="投资金额:" prop="investmentAmount" label-width="150px">
          <font size="4" face="arial">{{this.Utils.toMoney(buyMyProduct.investmentAmount) }}</font>
          <el-input v-model="buyMyProduct.investmentAmount" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="买入时间:" prop="buyingTime" label-width="150px">
          <el-date-picker
            v-model="buyMyProduct.buyingTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="买入时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="起息日期:" prop="interestStartTime" label-width="150px">
          <el-date-picker
            v-model="buyMyProduct.interestStartTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="起息日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="收利日期:" prop="profitDate" label-width="150px">
          <el-date-picker
            v-model="buyMyProduct.profitDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="收利日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="到期时间:" prop="dueTime" label-width="150px">
          <el-date-picker
            v-model="buyMyProduct.dueTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="到期时间"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="预期利率:" prop="expectedInterestRate" label-width="150px">
          <el-input v-model="buyMyProduct.expectedInterestRate" placeholder="预期利率,不需要%"></el-input>
        </el-form-item>

        <el-form-item label="付息方式:" prop="interestPaymentMethod" label-width="150px">
          <el-select v-model="buyMyProduct.interestPaymentMethod" clearable placeholder="付息方式">
            <el-option
              v-for="item in interestPaymentMethodOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="收利日预期利息收益:" prop="expectedInterestIncomeMonth" label-width="150px">
          <font
            size="4"
            face="arial"
          >{{this.Utils.toMoney(buyMyProduct.expectedInterestIncomeMonth) }}</font>
          <el-input v-model="buyMyProduct.expectedInterestIncomeMonth" placeholder="收利日利息预期收益"></el-input>
          <el-button size="mini" type="primary" plain @click="calculateInterestNext">获取预估值</el-button>
        </el-form-item>
        <el-form-item label="利息预期总收益:" prop="expectedInterestIncomeTotal" label-width="150px">
          <font
            size="4"
            face="arial"
          >{{this.Utils.toMoney(buyMyProduct.expectedInterestIncomeTotal) }}</font>
          <el-input v-model="buyMyProduct.expectedInterestIncomeTotal" placeholder="利息预期收益"></el-input>
          <el-button size="mini" type="primary" plain @click="calculateInterestTotal">获取预估值</el-button>
        </el-form-item>

        <!-- <el-form-item label="备注:" prop="remark" label-width="100px">
          <el-input v-model="buyMyProduct.remark" autocomplete="off"></el-input>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="buyBankProductFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          :disabled="submitButtonDisabled"
          @click="submitMyBankProduct('buyMyProductForm')"
        >确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="dialogTitle"
      width="600px"
      :visible.sync="bankProductIncomeFormVisible"
      @close="resetForm('bankTransactionForm')"
      @open="submitButtonDisabled = false"
    >
      <el-form :model="bankBill" :rules="bankTransactionRules" ref="bankTransactionForm">
        <el-form-item label="收款方姓名:" prop="name" label-width="150px">
          <el-input v-model="bankMyProduct.bank.name" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="收款方银行:" prop="bankName" label-width="150px">
          <el-input v-model="bankMyProduct.bank.bankName" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="收款方卡号:" prop="bankCard" label-width="150px">
          <el-input v-model="bankMyProduct.bank.bankCard" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="起息日期:" prop="interestStartTime" label-width="150px">
          <el-input v-model="bankMyProduct.interestStartTime" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="本次收息日期:" prop="transactionTime" label-width="150px">
          <el-date-picker
            v-model="bankBill.transactionTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="下次收息日期:" v-if="income_show" prop="nextProfitDate" label-width="150px">
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
          label-width="150px"
        >
          <el-input v-model="bankBill.investmentAmount" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="付息方式:" label-width="150px">
          <el-input
            v-model="bankMyProduct.interestPaymentMethod"
            :disabled="true"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="预期利息金额:" prop="expectedtransactionAmount" label-width="150px">
          <font size="4" face="arial">{{this.Utils.toMoney(bankBill.expectedtransactionAmount) }}</font>
        </el-form-item>

        <el-form-item label="实收利息金额:" prop="transactionAmount" label-width="150px">
          <el-col :span="13">
            <el-input v-model="bankBill.transactionAmount" autocomplete="off"></el-input>
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :span="10">
            <font size="4" face="arial">{{this.Utils.toMoney(bankBill.transactionAmount) }}</font>
          </el-col>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item
          v-if="bankMyProduct.interestPaymentMethod == '不定期返还本金'"
          label="全年天数:"
          label-width="150px"
        >
          <el-input
            placeholder="全年天数"
            v-model="bankBill.recalculationParam.days"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item
          v-if="bankMyProduct.interestPaymentMethod == '不定期返还本金'"
          label="公式:"
          label-width="150px"
        >
          <el-input
            placeholder="公式"
            :disabled="true"
            v-model="bankBill.recalculationParam.formula"
            autocomplete="off"
          ></el-input>
          <el-button type="primary" plain @click="recalculation">重新计算利息</el-button>
        </el-form-item>

        <el-divider></el-divider>
        <el-form-item label="备注:" label-width="150px">
          <el-input v-model="bankBill.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bankProductIncomeFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          :disabled="submitButtonDisabled"
          @click="submitBankTransaction('bankTransactionForm')"
        >确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="bankLog_show" width="80%">
      <commonBankLogVue ref="commonBankLogVueRef" />
    </el-dialog>

    <!--编辑 -->
    <el-dialog
      :title="dialogTitle"
      width="600px"
      :visible.sync="editMyProductFormVisible"
      @close="resetForm('editMyProductForm')"
      @open="submitButtonDisabled = false"
    >
      <el-form :model="editMyProduct" ref="editMyProductForm">
        <el-form-item label="买入时间:" prop="buyingTime" label-width="150px">
          <el-date-picker
            v-model="editMyProduct.buyingTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="买入时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="起息日期:" prop="interestStartTime" label-width="150px">
          <el-date-picker
            v-model="editMyProduct.interestStartTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="起息日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="收利日期:" prop="profitDate" label-width="150px">
          <el-date-picker
            v-model="editMyProduct.profitDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="收利日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="到期时间:" prop="dueTime" label-width="150px">
          <el-date-picker
            v-model="editMyProduct.dueTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="到期时间"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editMyProductFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          :disabled="submitButtonDisabled"
          @click="submitEditMyProductForm('editMyProductForm')"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import commonBankLogVue from "@/components/commonBankLog";
export default {
  data() {
    return {
      total: 0, //默认数据总数
      currentPage: 1, //默认开始页面
      pageSize: 10,
      bankMyProducts: [],
      userNames: [],
      bankNames: [],
      interestPaymentMethods: [],
      states: [
        { value: 3, label: "作废删除" },
        { value: 2, label: "已赎回" },
        { value: 1, label: "合约中" }
      ],
      interestPaymentMethodOption: [
        { value: "月付", label: "月付" },
        { value: "一次性", label: "一次性" },
        { value: "半年付", label: "半年付" },
        { value: "季付", label: "季付" },
        { value: "年付", label: "年付" },
        { value: "不定期返还本金", label: "不定期返还本金" }
      ],
      param: {
        name: "",
        bank: "",
        bankCard: "",
        times: "",
        state: [1],
        productType: "",
        interestPaymentMethod: ""
      },
      name: "",
      bankIn: "",
      banks: [],
      bank: { cashAmount: "" },
      income_show: false,
      investmentAmount_show: false,
      bankLog_show: false,
      submitButtonDisabled: false,
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
      editMyProduct: {
        dueTime: "",
        buyingTime: "",
        interestStartTime: "",
        profitDate: ""
      },
      bankBill: {
        bankCardId: "",
        myProductId: "",
        transactionTime: "",
        transactionType: "",
        // 预期收入
        expectedtransactionAmount: "",
        transactionAmount: "",
        transferCard: "",
        investmentAmount: "",
        recalculationParam: {
          days: 360,
          formula: ""
        },
        remark: ""
      },
      bankProductBackup: Object.assign({}, this.bankProduct),
      multipleSelection: [],
      buyBankProductFormVisible: false,
      bankProductIncomeFormVisible: false,
      editMyProductFormVisible: false,
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
    this.getInterestPaymentMethods();
  },
  components: { commonBankLogVue },
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
    formatter(row, column) {
      return this.Utils.toMoney(row[column.property]) + "元";
    },
    recalculation(row, column) {
      //99万*0.06/360*64
      let days = this.Utils.getDaysBetween(
        this.bankMyProduct.interestStartTime,
        this.bankBill.transactionTime
      );

      this.bankBill.recalculationParam.formula =
        this.bankMyProduct.investmentAmount +
        "(投资金额)*" +
        this.bankMyProduct.expectedInterestRate / 100 +
        "(利率)/" +
        this.bankBill.recalculationParam.days +
        "(全年天数)*" +
        days +
        "(利息天数)";

      let num = (
        ((this.bankMyProduct.investmentAmount *
          this.bankMyProduct.expectedInterestRate) /
          100 /
          this.bankBill.recalculationParam.days) *
        days
      ).toFixed(2);
      this.bankBill.transactionAmount = num;
    },

    downloanMyBankProducts() {
      let a = document.createElement("a");
      let json = this.param;
      let params = Object.keys(json)
        .map(function(key) {
          // body...
          return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]);
        })
        .join("&");

      a.href = this.BASE_API + "/excel/excelExport" + "?" + params;
      a.click();
    },
    calculateInterestTotal() {
      var day = this.Utils.getDaysBetween(
        this.buyMyProduct.interestStartTime,
        this.buyMyProduct.dueTime
      );
      var money =
        ((this.buyMyProduct.expectedInterestRate * day) / 365 / 100) *
        this.buyMyProduct.investmentAmount;
      if (money.toFixed(2)) {
        this.buyMyProduct.expectedInterestIncomeTotal = money.toFixed(2);
      }
    },
    calculateInterestNext() {
      var day = this.Utils.getDaysBetween(
        this.buyMyProduct.interestStartTime,
        this.buyMyProduct.profitDate
      );
      var money =
        ((this.buyMyProduct.expectedInterestRate * day) / 365 / 100) *
        this.buyMyProduct.investmentAmount;
      if (money.toFixed(2)) {
        this.buyMyProduct.expectedInterestIncomeMonth = money.toFixed(2);
      }
    },

    bankChange(val) {
      for (var i = 0; i < this.banks.length; i++) {
        console.log(val);
        console.log(this.banks[i].id);

        if (val === this.banks[i].id) {
          this.bank = this.banks[i];
          return;
        }
      }
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
    getInterestPaymentMethods() {
      this.loading = true;
      this.$http({
        method: "post",
        url: this.BASE_API + "/api/bankMyProducts/selectInterestPaymentMethod"
      })
        .then(res => {
          // eslint-disable-next-line eqeqeq
          if (res.data.code == 0) {
            this.interestPaymentMethods = res.data.data;
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
      this.editMyProduct = Object.assign({}, row);
      this.dialogTitle = "修改";
      this.editMyProductFormVisible = true;
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总价";
          return;
        }
        if (index === 3 || index === 9 || index === 10 || index === 11) {
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
    reminderRule(index, row) {
      this.$message({
        type: "success",
        message: "目前不支持设置提醒规则,待提供"
      });
    },
    redeem(index, row) {
      this.bankMyProduct = Object.assign({}, row);
      this.rowIndex = index;
      this.dialogTitle = "理财赎回";
      this.income_show = false;
      this.investmentAmount_show = true;
      this.bankBill.myProductId = row.id;
      this.bankBill.bankCardId = this.bankMyProduct.bank.id;
      this.bankBill.transactionType = 9;
      this.bankBill.transactionTime = row.profitDate;
      this.bankBill.investmentAmount = row.investmentAmount;

      this.getExpectedIncome();
    },
    getExpectedIncome() {
      this.$http({
        method: "post",
        url: this.BASE_API + "/api/bankMyProducts/getExpectedIncome",
        data: {
          myProductId: this.bankMyProduct.id,
          time: this.bankBill.transactionTime
        }
      })
        .then(res => {
          if (res.data.code == 0) {
            if (res.data.data) {
              this.bankBill.expectedtransactionAmount = res.data.data.expectedInterestIncomeMonth.toString();
              this.bankBill.transactionAmount = res.data.data.expectedInterestIncomeMonth.toString();
            }
            this.bankProductIncomeFormVisible = true;
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
    income(index, row) {
      this.bankMyProduct = Object.assign({}, row);
      this.rowIndex = index;
      this.investmentAmount_show = false;
      this.income_show = true;
      this.dialogTitle = "利息收入";
      this.bankBill.myProductId = row.id;
      this.bankBill.bankCardId = this.bankMyProduct.bank.id;
      this.bankBill.transactionTime = row.profitDate;
      this.bankBill.transactionType = 6;
      this.getExpectedIncome();
    },
    deleteBankProduct(index, row) {
      this.bankMyProduct = Object.assign({}, row);
      this.rowIndex = index;
      this.$http({
        method: "post",
        url: this.BASE_API + "/api/bankMyProducts/delete",
        data: { id: this.bankMyProduct.id }
      })
        .then(res => {
          // eslint-disable-next-line eqeqeq
          if (res.data.code == 0) {
            alert("删除成功");
          } else {
            alert("删除失败");
          }
        })
        .catch(err => {
          console.error(err);
        });
    },

    submitBankTransaction(bankTransactionForm) {
      // 表单验证
      this.$refs[bankTransactionForm].validate(valid => {
        if (valid) {
          this.submitButtonDisabled = true;

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
                this.getMyBankProducts();
              } else {
                this.submitButtonDisabled = false;

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
          this.submitButtonDisabled = true;

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
                this.resetForm(buyMyProductForm);
              } else {
                this.submitButtonDisabled = false;

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
    submitEditMyProductForm(editMyProductForm) {
      // 表单验证
      this.$refs[editMyProductForm].validate(valid => {
        if (valid) {
          this.submitButtonDisabled = true;

          this.$http({
            method: "post",
            url: this.BASE_API + "/api/bankMyProducts/update",
            data: this.editMyProduct
          })
            .then(res => {
              if (res.data.code == 0) {
                this.$message({
                  type: "success",
                  message: "新增成功！"
                });
                this.editMyProductFormVisible = false;
                this.getMyBankProducts();
                this.resetForm(editMyProductForm);
              } else {
                this.submitButtonDisabled = false;
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
    cellDblclick(val) {
      //console.log(val.id);
      this.bankLog_show = true;
      this.$nextTick(function() {
        this.$refs.commonBankLogVueRef.searchMyProductId(val);
      });
    },

    handleAdd() {
      this.dialogTitle = "买入理财";
      //this.bank = {};
      this.buyBankProductFormVisible = true;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
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
  .el-table {
    overflow: visible !important;
  }
}
</style>
