<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区-->
    <el-card>
      <el-alert title="注意:只允许为第三级分类设置相关属性" type="warning" :closable="false" show-icon></el-alert>

      <!--选择商品分类区域-->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <!--选择商品分类的级联选择器-->
          <el-cascader
            v-model="selectKeys"
            :options="cateList"
            :props="paramsProps"
            @change="selectChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>

      <!--Tab页签区域-->
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="isDisabledBtn"
            @click="paramsDialogVisible= true"
          >添加参数</el-button>
          <!--动态参数表格-->
          <el-table :data="manyTabData" style="width: 100%" border>
            <!--展开行-->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  type="warning"
                  closable
                  :disable-transitions="false"
                  @close="expandItemClose(scope.row,item)"
                >>{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!--索引列-->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  class="el-icon-edit"
                  @click="editParamsBtn(scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="warning"
                  icon="el-icon-delete"
                  @click="delParams(scope.row.cat_id,scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="isDisabledBtn"
            @click="paramsDialogVisible= true"
          >添加属性</el-button>
          <!--静态属性表格-->
          <el-table :data="onlyTabData" style="width: 100%" border>
            <!--静态属性展开行-->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  type="warning"
                  closable
                  :disable-transitions="false"
                  @close="expandItemClose(scope.row,item)"
                >>{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!--静态属性索引列-->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  class="el-icon-edit"
                  @click="editParamsBtn(scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="warning"
                  icon="el-icon-delete"
                  @click="delParams(scope.row.cat_id,scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!--添加参数/属性对话框-->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="paramsDialogVisible"
      width="50%"
      @close="resetData"
    >
      <!--添加参数/属性的表格-->
      <el-form :model="addForm" :rules="addFormrules" ref="addRuleForm" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="paramsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitParams">确 定</el-button>
      </span>
    </el-dialog>

    <!--编辑参数/属性的对话框-->
    <el-dialog
      :title="'编辑'+titleText"
      :visible.sync="editdialogVisible"
      label-width="100px"
      @close="editReset"
    >
      <el-form :model="editForm" ref="editDataForm" :rules="editFormRule">
        <el-form-item label="属性名称" label-width="90px" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cateList: [],
      paramsProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectKeys: [],
      // 页签被选中项
      activeName: 'many',
      // 动态参数数据
      manyTabData: [],
      // 静态属性数据
      onlyTabData: [],
      paramsDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addFormrules: {
        attr_name: [
          { required: true, message: '请填入参数', trigger: 'blur' }
        ]
      },
      editForm: {
        attr_name: ''
      },
      editdialogVisible: false,
      editFormRule: {
        attr_name: [
          { required: true, message: '请填写属性名字', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    isDisabledBtn () {
      if (this.selectKeys.length !== 3) {
        return true
      }
      return false
    },
    cateId () {
      if (this.selectKeys.length === 3) {
        return this.selectKeys[2]
      }
      return null
    },
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  },
  methods: {
    async getCateList () {
      const { data: ret } = await this.$http.get('categories')
      if (ret.meta.status !== 200) return this.$message.error('获取失败')
      this.cateList = ret.data
    },
    async selectChange () {
      // 选中的不是三级分类
      const len = this.selectKeys.length
      if (len !== 3) {
        this.selectKeys = []
        this.manyTabData = []
        this.onlyTabData = []
        return false
      }
      // 选中三级分类,发请求获取参数列表
      const { data: ret } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      if (ret.meta.status !== 200) return this.$message.error('获取失败')
      ret.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 展开的attr_vals的tag项的动态添加输入框隐藏和显示属性
        item.inputVisible = false
        // 输入框数据的双向绑定
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyTabData = ret.data
      } else {
        this.onlyTabData = ret.data
      }
      console.log(ret.data)
    },
    tabClick () {
      this.selectChange()
      console.log(this.activeName)
    },
    resetData () {
      this.$refs.addRuleForm.resetFields()
    },
    submitParams () {
      this.$refs.addRuleForm.validate(async (valid) => {
        if (valid) {
          const catId = this.selectKeys[2]
          const { data: ret } = await this.$http.post(`categories/${catId}/attributes`, {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          })
          if (ret.meta.status !== 201) return this.$message.error('添加失败')
          this.selectChange()
          this.paramsDialogVisible = false
          console.log(ret)
        }
      })
    },
    async delParams (catId, attrId) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        if (this.selectKeys.length === 3) {
          const { data: ret } = await this.$http.delete(`categories/${catId}/attributes/${attrId}`)
          if (ret.meta.status !== 200) return this.$message.error('删除失败')
          this.selectChange()
          this.$message.success('删除成功')
        } else {
          this.$message.error('请选择要删除的商品类目')
        }
      }).catch(() => {
        this.$message.info('撤销删除')
      })
    },
    editParamsBtn (params) {
      this.editdialogVisible = true
      this.editForm = params
    },
    // 重置对话框
    editReset () {
      this.$refs.editDataForm.resetFields()
      // this.editForm = null
      this.selectChange()
    },
    // 提交编辑修改的数据
    submitEdit () {
      this.$refs.editDataForm.validate(async (valid) => {
        if (valid) {
          const catId = this.editForm.cat_id
          const attrId = this.editForm.attr_id
          if (catId === this.cateId && this.selectKeys.length === 3) {
            const { data: ret } = await this.$http.put(`categories/${catId}/attributes/${attrId}`, { attr_name: this.editForm.attr_name, attr_sel: this.editForm.attr_sel })
            console.log(ret)
            if (ret.meta.status !== 200) return this.$message.error('更新失败')
            this.selectChange()
            this.editdialogVisible = false
            this.$message.success('更新成功')
          } else {
            this.$message.error('请选择要编辑的商品类目')
          }
        } else {
          this.$message.info('更新失败')
        }
      })
    },
    // 参数列表展开项关闭触发
    async expandItemClose (row, item) {
      row.attr_vals.splice(item, 1)
      const { data: ret } = await this.$http.put(`categories/${row.cat_id}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: (row.attr_vals).join(' ')
      })
      if (ret.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
    },
    showInput (scope) {
      scope.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async handleInputConfirm (row) {
      const inputVal = row.inputValue
      if (inputVal) {
        row.attr_vals.push(inputVal.trim())
        const { data: ret } = await this.$http.put(`categories/${row.cat_id}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name, attr_sel: row.attr_sel, attr_vals: (row.attr_vals).join(' ')
        })
        if (ret.meta.status !== 200) return this.$message.error('更新失败')
        this.$message.success('更新成功')
      }
      row.inputVisible = false
      row.inputValue = ''
    }
  }
}
</script>
<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
  span {
    margin-right: 15px;
  }
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
