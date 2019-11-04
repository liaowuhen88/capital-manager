<template>
  <div class="bank-box">
    <el-row>
      <el-col :span="3">
        <el-input v-model="bank.name" placeholder="请输入文件名称"></el-input>
      </el-col>
      <el-col :span="3">
        <el-date-picker
          v-model="bank.times"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-col>
      <el-col :span="2" :offset="4">
        <el-button type="primary" icon="el-icon-search" @click="getBanks()"
          >搜索</el-button
        >
      </el-col>
      <el-col :span="2" :offset="4">
        <el-button
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="handleAdd"
          >上传文件</el-button
        >
        <!-- <el-button type="danger" icon="el-icon-delete" size="small" @click="mulDelete">批量删除</el-button> -->
      </el-col>
    </el-row>

    <el-table
      :data="banks"
      show-summary
      @selection-change="selectChange"
      style="width: 100%"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="name" label="文件名称"></el-table-column>
      <el-table-column prop="bank" label="文件描述"></el-table-column>
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
    >
      <el-upload
        class="upload-demo"
        drag
        action="https://jsonplaceholder.typicode.com/posts/"
        multiple
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      banks: [],
      bank: {
        id: '',
        date: '',
        name: '',
        phone: '',
        address: '',
        times: '',
        status: 0
      },
      bankBackup: Object.assign({}, this.bank),
      multipleSelection: [],
      bankFormVisible: false,
      dialogTitle: '',
      rowIndex: 9999,
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getBanks()
  },
  props: ['param'],
  methods: {
    getBanks(param) {
      this.loading = true
      this.$http('/api/banks')
        .then(res => {
          this.banks = res.data.filter(item => {
            if (param) {
              if ('' != param.name && '' != param.bank) {
                return item.name == param.name && item.bank == param.bank
              }
              if ('' != param.name) {
                return item.name == param.name
              }
              if ('' != param.bank) {
                return item.bank == param.bank
              }
              return true
            } else {
              return true
            }
          })
        })
        .catch(err => {
          console.error(err)
        })
    },
    submitBank(formName) {
      // 表单验证
      this.$refs[formName].validate(valid => {
        console.log(formName, valid)
      })
    },
    selectChange(val) {
      this.multipleSelection = val
    },
    handleAdd() {
      this.dialogTitle = '新增'
      this.bank = Object.assign({}, this.bankBackup)
      this.bankFormVisible = true
    }
  }
}
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
