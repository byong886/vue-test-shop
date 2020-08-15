<template>
  <div>
    <!--权限列表,面包屑导航-->
    <el-breadcrumb class="el-icon-arrow-right" separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--视图区域-->
    <el-card>
      <el-table :data="rightsList" style="width: 100%" border stripe>
        <el-table-column prop="prop" label="#" type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==0">一级</el-tag>
            <el-tag v-if="scope.row.level==1" type="success">二级</el-tag>
            <el-tag v-if="scope.row.level==2" type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rightsList: []
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    async getRightsList () {
      const { data: ret } = await this.$http.get('rights/list')
      if (ret.meta.status !== 200) return this.$message.error('获取权限列表失败')
      this.rightsList = ret.data
      console.log(ret)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
