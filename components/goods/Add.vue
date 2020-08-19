<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品添加</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区-->
    <el-card>
      <el-alert title="添加商品信息" type="info" show-icon :closable="false" center></el-alert>
      <!--步骤条区域-->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!--选项卡区域-->
      <el-form :model="addForm" :rules="addRules" ref="addRuleForm" label-position="'top'">
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="conditionLeave"
          @tab-click="TabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catList"
                :props="catProps"
                @change="selectChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="动态参数" name="1">
            <!--表单项渲染商品的动态参数-->
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTabData"
              :key="item.attr_id"
              label-position="'top'"
            >
              <el-checkbox-group v-model="item.attr_vals" width="160px">
                <el-checkbox
                  :label="it1"
                  v-for="(it1,i) in item.attr_vals"
                  name="it1"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="2">
            <el-form-item :label="it2.attr_name" v-for="it2 in onlyTabData" :key="it2.attr_id">
              <el-input v-model="it2.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!--富文本编辑器插件 vue-quill-editor-->
            <quill-editor
              ref="myQuillEditor"
              v-model="addForm.goods_introduce"
            ></quill-editor>
            <el-button type="primary" style="margin-top:15px;" @click="add">添加商品</el-button>
          </el-tab-pane>
          <el-tab-pane label="完成" name="5">完成</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!--上传的图片预览对话框-->
    <el-dialog title="图片预览" :visible.sync="picDialogVisible" width="50%">
      <img :src="picPreviewPath" style="width:100%;" />
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  data() {
    return {
      activeIndex: 0,
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addRules: {
        goods_name: [
          { required: true, message: '请填写名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请填写价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请填写数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请填写重量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择分类', trigger: 'blur' }
        ]
      },
      catList: [],
      catProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        checkStrictly: false
      },
      manyTabData: [],
      onlyTabData: [],
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      picDialogVisible: false,
      picPreviewPath: ''
    }
  },
  created() {
    this.getCatList()
  },
  computed: {
    catId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
  methods: {
    // 获取商品分类数据
    async getCatList () {
      const { data: ret } = await this.$http.get('categories')
      if (ret.meta.status !== 200) return this.$message.error('获取分类列表失败')
      this.catList = ret.data
      console.log(ret.data)
    },
    selectChange () {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
      console.log(this.addForm.goods_cat)
    },
    conditionLeave (to, from) {
      if (from === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
      return true
    },
    async TabClicked () {
      if (this.activeIndex === '1') {
        const { data: ret } = await this.$http.get(`categories/${this.catId}/attributes`, { params: { sel: 'many' } })
        if (ret.meta.status !== 200) return this.$message.error('获取失败')
        ret.data.forEach(item => {
          item.attr_vals = item.attr_vals === '' ? [] : item.attr_vals.split(',')
        })
        this.manyTabData = ret.data
        // console.log(ret.data)
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.catId}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) return this.$message.error('获取属性失败')
        this.onlyTabData = res.data
        // console.log(res.data)
      }
    },
    // 点击图片预览触发
    handlePreview (file) {
      // 获取图片预览的完整路径
      this.picPreviewPath = file.response.data.url
      this.picDialogVisible = true
      console.log(file)
    },
    // 删除上传的图片触发
    handleRemove (file) {
      const filePath = file.response.data.tmp_path
      const index = this.addForm.pics.findIndex((x) => {
        return x.pic === filePath
      })
      this.addForm.pics.splice(index, 1)
      // console.log(filePath)
    },
    handleSuccess (response) {
      if (response.meta.status === 200) {
        const tmpObj = { pic: response.data.tmp_path }
        this.addForm.pics.push(tmpObj)
      } else {
        this.$message.error('图片上传失败')
      }
      console.log(response)
    },
    add () {
      this.$refs.addRuleForm.validate(async (valid) => {
        if (!valid) {
          this.$message.error('请填写必填项')
        }
        // 添加商品的业务逻辑
        // lodash插件 cloneDeep(obj)对象深拷贝
        const form = _.cloneDeep(this.addForm)
        // 数组变字符串
        form.goods_cat = form.goods_cat.join(',')
        // console.log(form)
        // 处理动态商品参数
        this.manyTabData.forEach(item => {
          const manyInfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(',') }
          form.attrs.push(manyInfo)
        })
        // 处理静态属性
        this.onlyTabData.forEach(item => {
          const onlyInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          form.attrs.push(onlyInfo)
        })
        // 发送添加商品的请求
        const { data: ret } = await this.$http.post('goods', form)
        if (ret.meta.status !== 201) return this.$message.error('添加失败')
        this.$message.success('商品添加成功')
        this.$router.push('/goods')
        // console.log(ret)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.el-checkbox {
  // 上 右 下 左
  margin: 0 5px 0 0 !important;
}
</style>
