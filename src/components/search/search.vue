<template>
  <el-row>
    <el-col :span="3">
      <el-select v-model="param.name" clearable placeholder="请选择姓名">
        <el-option v-for="item in names" :key="item.key" :label="item.lable" :value="item.key"></el-option>
      </el-select>
    </el-col>
    <el-col :span="3">
      <el-select v-model="param.bank" clearable placeholder="请选择银行">
        <el-option v-for="item in banks" :key="item.key" :label="item.lable" :value="item.key"></el-option>
      </el-select>
    </el-col>
    <el-col :span="3">
      <el-select v-model="param.bankCard" clearable placeholder="请选择银行卡">
        <el-option v-for="item in bankCards" :key="item.key" :label="item.lable" :value="item.key"></el-option>
      </el-select>
    </el-col>
    <el-col :span="3">
      <el-date-picker
        v-model="param.times"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
    </el-col>
    <el-col :span="2" :offset="4">
      <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
    </el-col>
    <el-col :span="2" :offset="4">
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
      names: [
        { key: "", lable: "全部" },
        { key: "李杰", lable: "李杰" },
        { key: "李艳", lable: "李艳" },
        { key: "李凭跃", lable: "李凭跃" }
      ],
      banks: [
        { key: "", lable: "全部" },
        { key: "中国工商银行", lable: "中国工商银行" },
        { key: "招商银行", lable: "招商银行" },
        { key: "交通银行", lable: "交通银行" },
        { key: "天津银行", lable: "天津银行" }
      ],
      bankCards: [
        { key: "", lable: "全部" },
        { key: "622100", lable: "622100" },
        { key: "65554", lable: "65554" },
        { key: "6333", lable: "6333" }
      ],
      param: { name: "", bank: "", bankCard: "", times: "" }
    };
  },
  methods: {
    search() {
      //console.log("search"+JSON.stringify(this.param) );
      this.$emit("search", this.param);
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
