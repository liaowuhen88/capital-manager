<template>
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
      <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
    </el-col>
    <el-col :span="2" :offset="9">
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">新增</el-button>
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
      param: { userName: "", bankName: "", bankCard: "" }
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
