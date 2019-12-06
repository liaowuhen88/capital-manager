<template>
  <div class="bankProduct-box">
    <el-row>
      <el-col :span="3">
        <el-select v-model="bankProduct.bank" clearable placeholder="请选择银行">
          <el-option v-for="item in bankNames" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-col>
      <el-col :span="3" :offset="1">
        <el-button type="primary" icon="el-icon-search" @click="getBankProducts()">搜索</el-button>
      </el-col>
      <el-col :span="3" :offset="14">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">新增理财产品</el-button>
        <!-- <el-button type="danger" icon="el-icon-delete" size="small" @click="mulDelete">批量删除</el-button> -->
      </el-col>
    </el-row>

    <el-table :data="bankProducts" @selection-change="selectChange" style="width: 100%">
      <el-table-column prop="bank" label="银行"></el-table-column>
      <el-table-column prop="productType" label="产品类型"></el-table-column>
      <el-table-column prop="bankProduct" label="产品"></el-table-column>
      <el-table-column prop="expectedinterestRate" label="预期利率"></el-table-column>
      <el-table-column prop="interestPaymentMethod" label="付息方式"></el-table-column>
      <el-table-column prop="depositPeriod" label="存款期（日）"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-button
                size="mini"
                type="primary"
                plain
                @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button>
            </el-col>
            <el-col :span="8">
              <el-button
                size="mini"
                type="primary"
                plain
                @click="buying(scope.$index, scope.row)"
              >买入</el-button>
            </el-col>
            <el-col :span="8">
              <el-button
                size="mini"
                type="primary"
                plain
                @click="upload(scope.$index, scope.row)"
              >上传资料</el-button>
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
        <el-form-item label="银行:" prop="bank" label-width="100px">
          <el-select v-model="bankProduct.bank" filterable clearable placeholder="选择转入账号">
            <el-option v-for="item in bankNames" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品类型:" prop="productType" label-width="100px">
          <el-input v-model="bankProduct.productType" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="产品:" prop="bankProduct" label-width="100px">
          <el-input v-model="bankProduct.bankProduct" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="预期利率:" prop="expectedinterestRate" label-width="100px">
          <el-input v-model="bankProduct.expectedinterestRate" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="付息方式:" prop="interestPaymentMethod" label-width="100px">
          <el-input v-model="bankProduct.interestPaymentMethod" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="存款期（日）:" prop="depositPeriod" label-width="100px">
          <el-input v-model="bankProduct.depositPeriod" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注:" prop="remark" label-width="100px">
          <el-input v-model="bankProduct.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bankProductFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitBankProduct('bankProductForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="dialogTitle"
      width="600px"
      :visible.sync="buyBankProductFormVisible"
      @close="resetForm('bankMyProductForm')"
    >
      <el-form :model="bankMyProduct" :rules="rules" ref="bankMyProductForm">
        <el-form-item label="选择买入账户:" label-width="100px">
          <el-select v-model="bankMyProduct.bankCardId" filterable clearable placeholder="选择买入账号">
            <el-option
              v-for="item in banks"
              :key="item.id"
              :label="item.selectName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="投资金额:" prop="investmentAmount" label-width="100px">
          <el-input v-model="bankMyProduct.investmentAmount" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="收利日期:" prop="profitDate" label-width="100px">
          <el-date-picker
            v-model="bankMyProduct.profitDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="收利日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="买入时间:" prop="buyingTime" label-width="100px">
          <el-date-picker
            v-model="bankMyProduct.buyingTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="买入时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="到期时间:" prop="dueTime" label-width="100px">
          <el-date-picker
            v-model="bankMyProduct.dueTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="到期时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="备注:" prop="remark" label-width="100px">
          <el-input v-model="bankMyProduct.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="buyBankProductFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitMyBankProduct('bankMyProductForm')">确 定</el-button>
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
      bankNames: [],
      banks: [],
      name: "",
      bank: "",
      buyBankProductFormVisible: false,
      bankProduct: {
        id: "",
        bank: "",
        productType: "",
        bankProduct: "",
        expectedinterestRate: "",
        depositPeriod: "",
        interestPaymentMethod: 0,
        remark: ""
      },
      bankMyProduct: {
        bankCardId: "",
        bankProductId: "",
        investmentAmount: "",
        profitDate: "",
        buyingTime: "",
        dueTime: "",
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
    this.getBankNames();
    this.getBanks();
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
    getBanks(param) {
      this.loading = true;
      this.$http({
        method: "post",
        url: this.BASE_API + "/api/banks/selectAll",
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
    handleEdit(index, row) {
      this.$message({
        type: "success",
        message: "目前不支持编辑,待提供"
      });
    },
    buying(index, row) {
      this.bankMyProduct.bankProductId = row.id;
      this.dialogTitle = "买入理财";
      this.buyBankProductFormVisible = true;
    },
    upload(index, row) {
      this.$message({
        type: "success",
        message: "目前不支持上传资料,待提供"
      });
    },
    submitBankProduct(formName) {
      // 表单验证
      this.$refs[formName].validate(valid => {
        if (valid) {
          let id = this.bankProduct.id;
          if (id) {
            // id非空-修改
            this.banks.splice(this.rowIndex, 1, this.bank);
          } else {
            this.$http({
              method: "post",
              url: this.BASE_API + "/api/bankProducts/insert",
              data: this.bankProduct
            })
              .then(res => {
                if (res.data.code == 0) {
                  this.banks = res.data.data;
                  this.$message({
                    type: "success",
                    message: id ? "修改成功！" : "新增成功！"
                  });
                  this.bankProductFormVisible = false;
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
      });
    },
    submitMyBankProduct(formName) {
      // 表单验证
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http({
            method: "post",
            url: this.BASE_API + "/api/bankMyProducts/insert",
            data: this.bankMyProduct
          })
            .then(res => {
              if (res.data.code == 0) {
                this.bankMyProduct = res.data.data;
                this.$message({
                  type: "success",
                  message: id ? "修改成功！" : "新增成功！"
                });
                this.buyBankProductFormVisible = false;
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
