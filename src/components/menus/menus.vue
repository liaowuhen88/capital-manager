<template>
  <el-menu
    class="menu-nav"
    router
    :default-active="currentPath"
    background-color="#20222A"
    text-color="rgba(255,255,255,.8)"
    active-text-color="#ffd04b"
    :collapse="isCollapse"
  >
    <el-menu-item index="/homePage">
      <i class="el-icon-location"></i>
      <span slot="title">主页</span>
    </el-menu-item>
    <!-- <el-menu-item index="/bankNames">
      <i class="el-icon-menu"></i>
      <span slot="title">银行维护</span>
    </el-menu-item> -->
    <el-menu-item index="/bankCard">
      <i class="el-icon-menu"></i>
      <span slot="title">银行卡</span>
    </el-menu-item>
    <el-menu-item index="/bankMyProduct">
      <i class="el-icon-menu"></i>
      <span slot="title">理财产品</span>
    </el-menu-item>
    <!-- <el-menu-item index="/bankProducts">
      <i class="el-icon-menu"></i>
      <span slot="title">理财产品列表</span>
    </el-menu-item> -->
    <el-menu-item index="/bankLog">
      <i class="el-icon-menu"></i>
      <span slot="title">账单</span>
    </el-menu-item>
    <!-- <el-menu-item index="/uploadFile">
      <i class="el-icon-menu"></i>
      <span slot="title">上传资料</span>
    </el-menu-item> -->
    <!-- <el-menu-item index="/earningsStatistics">
      <i class="el-icon-menu"></i>
      <span slot="title">盈利统计</span>
    </el-menu-item> -->
    <!-- <el-menu-item index="/articles">
      <i class="el-icon-document"></i>
      <span slot="title">文章</span>
    </el-menu-item>
    <el-menu-item index="/mailList">
      <i class="el-icon-message"></i>
      <span slot="title">邮件</span>
    </el-menu-item>-->
    <!-- <el-submenu index="4">
      <template slot="title">
        <i class="el-icon-setting"></i>
        <span>设置</span>
      </template>
      <el-menu-item index="/profile">基本资料 (空)</el-menu-item>
      <el-menu-item index="/password">修改密码 (空)</el-menu-item>
    </el-submenu>-->
    <el-menu-item index="/echarts">
      <i class="el-icon-share"></i>
      <span slot="title">图表</span>
    </el-menu-item>
     <el-menu-item index="/expectedIncomeTotal">
      <i class="el-icon-share"></i>
      <span slot="title">预期收益总计</span>
    </el-menu-item>
    <el-menu-item index="/expectedIncome">
      <i class="el-icon-share"></i>
      <span slot="title">预期收益明细</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  props: ["isCollapse"],
  data() {
    return {
      currentPath: "/homePage"
    };
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
