<template>
  <div>
    <!--面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区-->
    <el-card>
      <el-row :gutter="15">
        <el-col :span="8">
          <el-input placeholder="请输入" v-model="queryObj.query" clearable @clear="getGoodsList">
            <el-button slot="append" class="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!--table表格区域-->
      <el-table :data="goodsList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="90px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80px"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="160px">
          <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <!--按钮操作区-->
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button type="primary" class="el-icon-edit">编辑</el-button>
            <el-button type="danger" class="el-icon-delete" @click="delGoods(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryObj.pagenum"
        :page-sizes="[10, 20, 30]"
        :page-size="queryObj.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      goodsList: [],
      queryObj: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList () {
      const { data: ret } = await this.$http.get('goods', { params: this.queryObj })
      if (ret.meta.status !== 200) return this.$message.error('获取失败')
      this.goodsList = ret.data.goods
      this.total = ret.data.total
      // console.log(ret.data)
    },
    handleSizeChange (pageSize) {
      this.queryObj.pagesize = pageSize
      this.getGoodsList()
      // console.log(pageSize)
    },
    handleCurrentChange (currPage) {
      this.queryObj.pagenum = currPage
      this.getGoodsList()
      // console.log(currPage)
    },
    delGoods (row) {
      this.$confirm('确认永久删除该文件吗?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(async () => {
        const { data: ret } = await this.$http.delete(`goods/${row.goods_id}`)
        if (ret.meta.status !== 200) return this.$message.error('删除失败')
        this.$message.success('删除成功')
        this.getGoodsList()
      }).catch(() => {
        this.$message.info('撤销删除')
      })
    },
    goAddPage () {
      this.$router.push('/goods/add')
    }
  }
}
</script>
<style lang="less" scope>
.el-row {
  margin-bottom: 15px;
}
</style>
