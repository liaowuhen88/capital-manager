<template>
  <div class="bankProduct-box">
    <searchs @search="getBankProducts" />
    <el-table
      :data="bankProducts"
      show-summary
      @selection-change="selectChange"
      style="width: 100%"
    >
      <el-table-column prop="bank" label="银行"></el-table-column>
      <el-table-column prop="productType" label="产品类型"></el-table-column>
      <el-table-column prop="bankProduct" label="产品"></el-table-column>
      <el-table-column prop="expectedinterestRate" label="预期利率"></el-table-column>
      <el-table-column prop="interestPaymentMethod" label="付息方式"></el-table-column>
      <el-table-column prop="depositPeriod" label="存款期（日）"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-button
                size="mini"
                type="primary"
                plain
                @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button>
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
      :visible.sync="bankProductFormVisible"
      @close="resetForm('bankProductForm')"
    >
      <el-form :model="bankProduct" :rules="rules" ref="bankProductForm">
        <el-form-item label="姓名:" prop="name" label-width="100px">
          <el-input v-model="bankProduct.name" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="银行:" prop="bankName" label-width="100px">
          <el-input v-model="bankProduct.bankName" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="卡号:" prop="bankCard" label-width="100px">
          <el-input v-model="bankProduct.bankCard" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="产品类型:" prop="productType" label-width="100px">
          <el-input v-model="bankProduct.productType" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="产品:" prop="bankProduct" label-width="100px">
          <el-input v-model="bankProduct.bankProduct" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="选择日期:" prop="transactionTime" label-width="100px">
          <el-date-picker v-model="bankInCome.transactionTime" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>

        <el-form-item label="金额:" label-width="100px">
          <el-input v-model="bankInCome.transactionAmount" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注:" label-width="100px">
          <el-input v-model="bankInCome.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bankProductFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitBankProduct('bankProductForm')">确 定</el-button>
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
      bankProducts: [],
      name: "",
      bank: "",
      bankProduct: {
        id: "",
        date: "",
        name: "",
        phone: "",
        address: "",
        status: 0
      },
      bankInCome: {
        bankCardId: "",
        transactionTime: "",
        transactionType: "",
        transactionAmount: "",
        transferCard: "",
        remark: ""
      },
      bankProductBackup: Object.assign({}, this.bankProduct),
      multipleSelection: [],
      bankProductFormVisible: false,
      dialogTitle: "",
      rowIndex: 9999,
      rules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.getBankProducts();
  },
  components: {
    searchs
  },
  methods: {
    getBankProducts(param) {
      let postData = this.$qs.stringify({
        page: this.currentPage,
        rows: this.pageSize,
        name: this.name,
        bank: this.bank
      });
      this.$http({
        method: "post",
        url: this.BASE_API + "/api/bankProducts/selectAll",
        data: param
      })
        .then(res => {
          if (res.data.code == 0) {
            this.bankProducts = res.data.data;
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
      this.$confirm(`确定要赎回 【${row.bankProduct}】 吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "赎回成功!"
          });
        })
        .catch(() => {
          console.log("赎回失败");
        });
    },
    income(index, row) {
      this.bankProduct = Object.assign({}, row);
      this.bankProductFormVisible = true;
      this.rowIndex = index;
      this.dialogTitle = "利息收入";
      this.bankInCome.bankCardId = row.id;
      this.bankInCome.transactionType = 1;
      this.bankIncomeFormVisible = true;
    },
    submitbankProduct(formName) {
      // 表单验证
      this.$refs[formName].validate(valid => {
        if (valid) {
          let id = this.bankProduct.id;
          if (id) {
            // id非空-修改
            this.bankProducts.splice(this.rowIndex, 1, this.bankProduct);
          } else {
            // id为空-新增
            this.bankProducts.id = this.bankProducts.length + 1;
            this.bankProducts.unshift(this.bankProduct);
          }
          this.bankProductFormVisible = false;
          this.$message({
            type: "success",
            message: id ? "修改成功！" : "新增成功！"
          });
        }
      });
    },
    handleDelete(index, row) {
      this.$confirm(`确定删除用户 【${row.name}】 吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.bankProducts.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          console.log("取消删除");
        });
    },
    resetForm(formName) {
      this.$refs[formName].clearValidate();
    },
    mulDelete() {
      let len = this.multipleSelection.length;
      if (len === 0) {
        this.$message({
          type: "warning",
          message: "请至少选择一项！"
        });
      } else {
        this.$confirm(`确定删除选中的 ${len} 个用户吗？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$message({
              type: "success",
              message: `成功删除了${len}条数据！`
            });
          })
          .catch(() => {
            console.log("取消删除");
          });
      }
    },
    selectChange(val) {
      this.multipleSelection = val;
    },
    handleAdd() {
      this.dialogTitle = "新增";
      this.bankProduct = Object.assign({}, this.bankProductBackup);
      this.bankProductFormVisible = true;
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
