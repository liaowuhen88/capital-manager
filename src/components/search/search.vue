<template>
  <el-row>
    <el-col :span="2">
      <el-select v-model="param.userName" clearable placeholder="请选择姓名">
        <el-option v-for="item in userNames" :key="item" :label="item" :value="item"></el-option>
      </el-select>
    </el-col>
    <el-col :span="2">
      <el-select v-model="param.bankName" clearable placeholder="请选择银行">
        <el-option v-for="item in bankNames" :key="item" :label="item" :value="item"></el-option>
      </el-select>
    </el-col>
    <el-col :span="3">
      <el-select v-model="param.bankCard" filterable clearable placeholder="请选择银行卡">
        <el-option v-for="item in bankCards" :key="item" :label="item" :value="item"></el-option>
      </el-select>
    </el-col>
    <el-col :span="3">
      <el-select v-model="param.transactionTypes" multiple clearable placeholder="交易类型">
        <el-option
          v-for="item in transactionType"
          :key="item.key"
          :label="item.lable"
          :value="item.key"
        ></el-option>
      </el-select>
    </el-col>
    <el-col :span="3">
      <el-date-picker
        v-model="param.times"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
      >></el-date-picker>
    </el-col>
    <el-col :span="2" :offset="4">
      <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
    </el-col>
    <el-col :span="2" :offset="3">
      <!-- <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">新增</el-button> -->
      <!-- <el-button type="danger" icon="el-icon-delete" size="small" @click="mulDelete">批量删除</el-button> -->
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: ["isCollapse"],
  data() {
    return {
      currentPath: location.pathname,
      userNames: [],
      bankNames: [],
      bankCards: [],
      transactionType: [
        { key: "", lable: "全部" },
        { key: "1", lable: "转入" },
        { key: "2", lable: "支出" },
        { key: "3", lable: "转账-转出" },
        { key: "4", lable: "活期利息收入" },
        { key: "5", lable: "买入理财" },
        { key: "6", lable: "理财利息收入" },
        { key: "7", lable: "转账-转入" }
      ],
      param: { userName: "", bankName: "", bankCard: "", transactionTypes: [] }
    };
  },
  mounted() {
    this.getBanks();
  },
  methods: {
    search() {
      //console.log("search"+JSON.stringify(this.param) );
      this.$emit("search", this.param);
    },
    getBanks(param) {
      this.loading = true;
      this.$http({
        method: "post",
        url: this.BASE_API + "/api/banks/selectUserNamesAndBankNames",
        data: param
      })
        .then(res => {
          if (res.data.code == 0) {
            this.userNames = res.data.data.userNames;
            this.bankNames = res.data.data.bankNames;
            this.bankCards = res.data.data.bankCards;
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
    handleAdd() {
      console.log("handleAdd");
      this.$emit("handleAdd", this.param);
    }
  }
};
</script>

<style lang="scss" scoped>
.el-menu {
  border: none;
}
.menu-nav:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
