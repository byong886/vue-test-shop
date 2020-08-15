<template>
  <div>
    <!--用户列表,面包屑导航-->
    <el-breadcrumb class="el-icon-arrow-right" separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <!--搜索框区域-->
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryObj.query"
            clearable
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchByQuery"></el-button>
          </el-input>
        </el-col>
        <!--添加用户的弹出对话框-->
        <el-col :span="4">
          <el-button type="primary" @click="dialogFormVisible=true">添加用户</el-button>
          <el-dialog title="添加用户" :visible.sync="dialogFormVisible" @close="resetForm">
            <el-form
              :model="adduser"
              :rules="rules"
              ref="userForm"
              label-width="100px"
              class="demo-ruleForm"
              status-icon
            >
              <el-form-item label="用户名" prop="username" label-width="auto">
                <el-input v-model="adduser.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password" label-width="auto">
                <el-input v-model="adduser.password"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email" label-width="auto">
                <el-input v-model="adduser.email"></el-input>
              </el-form-item>
              <el-form-item label="电话" prop="mobile" label-width="auto">
                <el-input v-model="adduser.mobile"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="submitForm">确 定</el-button>
            </div>
          </el-dialog>
        </el-col>
        <!--编辑用户信息的弹出对话框-->
        <el-dialog
          title="编辑用户"
          :visible.sync="editDialogVisible"
          width="50%"
          @close="editFormReset"
        >
          <el-form
            :model="editForm"
            :rules="editrules"
            ref="editRuleForm"
            label-width="70px"
            class="demo-ruleForm"
          >
            <el-form-item label="用户名" prop="name">
              <el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="mobile">
              <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <!--弹出框页脚-->
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible=false">取 消</el-button>
            <el-button type="primary" @click="editSubmit">确 定</el-button>
          </span>
        </el-dialog>

        <!--分配用户角色的弹出对话框-->
        <el-dialog
          title="用户角色分配"
          :visible.sync="roleDialogVisible"
          width="50%"
          @close="resetDialog"
        >
          <div>
            <p>当前用户:{{userInfo.username}}</p>
            <p>当前角色:{{userInfo.role_name}}</p>
            <p>
              请选择:
              <el-select v-model="selectedRoleId" placeholder="请选择">
                <el-option
                  v-for="item in rolesList"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </p>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="roleDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitRole">确 定</el-button>
          </span>
        </el-dialog>
      </el-row>
      <!--用户列表表格-->
      <el-table :data="userlist" :border="true" :stripe="true">
        <el-table-column type="index" width="60px"></el-table-column>
        <el-table-column prop="username" label="用户名" width="165px"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="165px"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="165px"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="165px"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="165px">
          <!--vue的作用域插槽,可以获取改行的数据对象-->
          <template slot-scope="scope">
            {{scope.row}}
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row,scope.row.id)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button
                type="danger"
                @click="removeById(scope.row.id)"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="分配角色" placement="bottom" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showRoleDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页效果样式-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryObj.pagenum"
        :page-sizes="[1, 2, 4, 5]"
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
    var email = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入邮箱'))
      }
      var pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
      setTimeout(() => {
        if (!pattern.test(value)) {
          callback(new Error('邮箱格式不正确'))
        } else {
          callback()
        }
      }, 1000)
    }
    var mobile = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入号码'))
      }
      var pattern = /^1\d{10}$/
      setTimeout(() => {
        if (!pattern.test(value)) {
          callback(new Error('手机格式错误'))
        } else {
          callback()
        }
      }, 500)
    }
    return {
      queryObj: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 0,
      adduser: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      dialogFormVisible: false,
      formLabelWidth: '60px',
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码为6-15个字符', trigger: 'blur' }
        ],
        email: [
          { validator: email, trigger: 'blur' }
        ],
        mobile: [
          { validator: mobile, trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {},
      editrules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: email, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: mobile, trigger: 'blur' }
        ]
      },
      // 用户角色信息对话框数据
      roleDialogVisible: false,
      userInfo: {},
      rolesList: [],
      selectedRoleId: ''

    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: ret } = await this.$http.get('users', { params: this.queryObj })
      this.userlist = ret.data.users
      this.total = ret.data.total
      // console.log(ret)
    },
    handleSizeChange (newSize) {
      this.queryObj.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange (currentPage) {
      this.queryObj.pagenum = currentPage
      this.getUserList()
    },
    async userStateChange (userInfo, userId) {
      // console.log(userInfo.mg_state + '\t' + userId)
      const { data: ret } = await this.$http.put(`users/${userId}/state/${userInfo.mg_state}`)
      if (ret.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.err('更新失败')
      }
      this.$message.success('更新用户状态成功')
    },
    // 按query字段值发送请求,杀心页面,实现按条件搜索
    searchByQuery () {
      this.getUserList()
    },
    // 回调表单校验结果,如果true就添加用户到数据库,并关闭表单,刷新页面
    submitForm () {
      this.$refs.userForm.validate(async (valid) => {
        if (valid) {
          const { data: ret } = await this.$http.post('users', this.adduser)
          if (ret.meta.status !== 201) return this.$message.error('用户添加失败')
          this.resetForm()
          this.dialogFormVisible = false
          this.getUserList()
        } else {
          this.$message.error('请检查填写信息是否合法')
          return false
        }
      })
    },
    resetForm () {
      this.$refs.userForm.resetFields()
    },
    async showEditDialog (userId) {
      console.log(userId)
      const { data: ret } = await this.$http.get('users/' + userId)
      if (ret.meta.status !== 200) return this.$message.error('没有这个用户')
      this.editForm = ret.data
      this.editDialogVisible = true
    },
    editFormReset () {
      this.$refs.editRuleForm.resetFields()
    },
    editSubmit () {
      this.$refs.editRuleForm.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.put('users/' + this.editForm.id, { email: this.editForm.email, mobile: this.editForm.mobile })
          if (res.meta.status === 200) {
            this.$message.success('更新成功')
            this.editDialogVisible = false
            this.getUserList()
          } else {
            return this.$message.error('更新失败')
          }
        } else {
          return this.$message.error('格式填写非法')
        }
      })
    },
    removeById (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // console.log(id)
        const { data: ret } = await this.$http.delete(`users/${id}`)
        if (ret.meta.status !== 200) return this.$message.error('用户删除失败')
        this.getUserList()
        // console.log(ret)
        this.$message.success('删除成功')
      }).catch(() => {
        this.$message.info('放弃删除')
      })
    },
    // 显示角色分配对话框
    async showRoleDialog (userInfo) {
      const { data: ret } = await this.$http.get('roles')
      if (ret.meta.status !== 200) { return this.$message.error('获取失败') }
      this.rolesList = ret.data
      this.roleDialogVisible = true
      this.userInfo = userInfo
    },
    async submitRole () {
      if (!this.selectedRoleId) return this.$message.error('请选择角色')
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, {
        rid: this.selectedRoleId
      })
      if (res.meta.status !== 200) return this.$message.error('角色更新失败')
      this.getUserList()
      this.$message.success('角色更新成功')
      this.roleDialogVisible = false
    },
    resetDialog () {
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
    box-shadow: rgba(0, 0, 0, 0.4) !important;
}
.el-table {
    margin-top: 15px;
    font-size: 12px;
}
</style>
