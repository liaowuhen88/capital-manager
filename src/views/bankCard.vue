<template>
  <div class="bank-box">
    <searchs @search="getBanks" @handleAdd="handleAdd" />

    <el-table :stripe="true" :data="banks" show-summary style="width: 100%">
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="bankName" label="银行"></el-table-column>
      <el-table-column prop="bankCard" label="银行卡号"  width="150"></el-table-column>
      <el-table-column prop="cashAamount" label="现金金额"></el-table-column>
      <el-table-column prop="investmentAmount" label="投资金额"></el-table-column>
      <el-table-column prop="accountBalance" label="总金额"></el-table-column>
      <el-table-column prop="updateTime" label="最近更新时间"  width="180"></el-table-column>
      <el-table-column label="当前时间"  width="180">{{ Utils.getTime() }}</el-table-column>
      <el-table-column label="操作" fixed="right" width="350">
        <template slot-scope="scope">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-button
                size="mini"
                type="primary"
                plain
                @click="investmentDetails(scope.$index, scope.row)"
              >转入</el-button>
            </el-col>
            <el-col :span="6">
              <el-button
                size="mini"
                type="primary"
                plain
                @click="investmentDetails(scope.$index, scope.row)"
              >转出</el-button>
            </el-col>
            <el-col :span="6">
              <el-button
                size="mini"
                type="primary"
                plain
                @click="investmentDetails(scope.$index, scope.row)"
              >转账</el-button>
            </el-col>
            <el-col :span="6">
              <el-button
                size="mini"
                type="primary"
                plain
                @click="operationLog(scope.$index, scope.row)"
              >账单</el-button>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-button
                size="mini"
                type="primary"
                plain
                @click="investmentDetails(scope.$index, scope.row)"
              >活期利息收入</el-button>
            </el-col>
            <el-col :span="8">
              <el-button
                size="mini"
                type="primary"
                plain
                @click="investmentDetails(scope.$index, scope.row)"
              >查询投资明细</el-button>
            </el-col>
            <el-col :span="8">
              <el-button
                size="mini"
                type="primary"
                plain
                @click="investmentDetails(scope.$index, scope.row)"
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
  </div>
</template>

<script>
import searchs from "@/components/search/search_common.vue";
export default {
  data() {
    return {
      banks: [],
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
      multipleSelection: [],
      bankFormVisible: false,
      dialogTitle: "",
      rowIndex: 9999,
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        bankName: [{ required: true, message: "请输入银行", trigger: "blur" }],
        bankCard: [{ required: true, message: "请输入卡号", trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.getBanks();
  },
  components: {
    searchs
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
    investmentDetails(index, row) {
      this.$message({
        showClose: true,
        message: "将来展示投资明细"
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
    operationLog(index, row) {
      this.$message({
        showClose: true,
        message: "将来展示交易流水"
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
    handleAdd() {
      this.dialogTitle = "新增";
      this.bank = Object.assign({}, this.bankBackup);
      this.bankFormVisible = true;
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
