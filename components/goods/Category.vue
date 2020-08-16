<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区-->
    <el-card>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-button type="primary" style="margin-bottom:20px;" @click="showCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!--表格-->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!--是否有效的自定义模块-->
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen;"></i>
          <i class="el-icon-error" v-else style="color:lightgreen;"></i>
        </template>
        <!--排序模块-->
        <template slot="paixu" slot-scope="scope">
          <el-tag type="success" size="mini" v-if="scope.row.cat_level==0">一级</el-tag>
          <el-tag type="warning" size="mini" v-if="scope.row.cat_level==1">二级</el-tag>
          <el-tag type="info" size="mini" v-if="scope.row.cat_level==2">三级</el-tag>
        </template>
        <!--操作模块-->
        <template slot="oper" slot-scope="scope">
          <el-button type="primary" size="mini" class="el-icon-edit">编辑</el-button>
          <el-button type="danger" size="mini" class="el-icon-delete" @click="delCate(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>
      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 7, 10, 12]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!--商品分类添加对话框-->
    <el-dialog title="添加分类" :visible.sync="cateDialogVisible" width="50%" @close="clearCateDialog">
      <el-form :model="addCateForm" :rules="addCateRules" ref="addCateRefForm" label-width="90px">
        <el-form-item label="分类名称: " prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类: ">
          <el-cascader
            v-model="selectKeys"
            :options="parentCateList"
            :props="cateProps"
            @change="cateSelectChange"
            :clearable="true"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          template: 'paixu'
        },
        {
          label: '操作',
          type: 'template',
          template: 'oper'
        }
      ],
      cateDialogVisible: false,
      addCateForm: {
        cat_name: '',
        // 父分类ID,默认是0(代表一级分类)
        cat_pid: 0,
        cat_level: 0
      },
      addCateRules: {
        cat_name: [
          { required: true, message: '请填分类名称', trigger: 'blur' }
        ]
      },
      // 查询第二层分类列表
      cateQueryInfo: {
        type: 2
      },
      parentCateList: [],
      selectKeys: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true // 各层级独立选中
      }
    }
  },
  created() {
    this.getCateList()
    this.getParentCateList()
  },
  methods: {
    async getCateList () {
      const { data: ret } = await this.$http.get('categories', { params: this.queryInfo })
      if (ret.meta.status !== 200) return this.$message.error('获取失败')
      this.cateList = ret.data.result
      this.total = ret.data.total
    },
    handleSizeChange (pagesize) {
      this.queryInfo.pagesize = pagesize
      this.getCateList()
      // console.log(pagesize)
    },
    handleCurrentChange (currpage) {
      this.queryInfo.pagenum = currpage
      this.getCateList()
      // console.log(currpage)
    },
    showCateDialog () {
      this.cateDialogVisible = true
    },
    // 获取父级分类数据列表
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.cateQueryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.parentCateList = res.data
      console.log(res)
    },
    cateSelectChange () {
      const length = this.selectKeys.length
      if (length > 0) {
        // cat_pid:(父分类id) 0-没有父分类,1级分类 1-2级 2-3级分类
        this.addCateForm.cat_pid = this.selectKeys[length - 1]
        this.addCateForm.cat_level = length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 提交添加的商品分类信息
    submitCate () {
      this.$refs.addCateRefForm.validate(async (valid) => {
        if (valid) {
          const { data: ret } = await this.$http.post('categories', this.addCateForm)
          if (ret.meta.status !== 201) return this.$message.error('添加失败')
          this.getCateList()
          this.cateDialogVisible = false
          this.getParentCateList()
          this.$message.success('添加成功')
        }
      })
      // console.log(this.addCateForm)
    },
    clearCateDialog () {
      this.$refs.addCateRefForm.resetFields()
      this.selectKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    async delCate (cateId) {
      const { data: ret } = await this.$http.delete(`categories/${cateId}`)
      if (ret.meta.status !== 200) return this.$message.error('删除失败')
      this.getCateList()
      this.getParentCateList()
      this.$message.success('删除成功')
      // console.log(catId)
    }
  }
}
</script>
<style lang="less" scoped>
.el-cascader-panel {
    height: 165px !important;
}
</style>
