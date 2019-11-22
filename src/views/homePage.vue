<template >
  <div class="console">
    <el-row>
      <el-col :span="24">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="date" label="日期" ></el-table-column>
          <el-table-column prop="name" label="姓名"></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
         <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="date" label="日期"></el-table-column>
          <el-table-column prop="name" label="姓名" ></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12">
         <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="date" label="日期" ></el-table-column>
          <el-table-column prop="name" label="姓名"></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
         <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="date" label="日期" ></el-table-column>
          <el-table-column prop="name" label="姓名" ></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
        </el-table>
      </el-col>
      <el-col :span="8">
         <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="date" label="日期" width="180"></el-table-column>
          <el-table-column prop="name" label="姓名" width="180"></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
        </el-table>
      </el-col>
      <el-col :span="8">
         <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="date" label="日期" width="180"></el-table-column>
          <el-table-column prop="name" label="姓名" width="180"></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {}
};
</script>

<style>
.console {
  font-size: 30px;
  text-align: center;
  margin-top: 350px;
}
</style>
