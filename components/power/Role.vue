<template>
  <div>
    <!--权限列表,面包屑导航-->
    <el-breadcrumb class="el-icon-arrow-right" separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区-->
    <el-card>
      <el-row style="marginBottom:15px;">
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!--角色列表区域-->
      <el-table :data="rolesList" style="width: 100%" border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :gutter="10"
              :class="['bdbottom',id==0?'bdtop':'','vcenter']"
              v-for="(item,id) in scope.row.children"
              :key="item.id"
            >
              <!--渲染一级权限-->
              <el-col :span="5">
                <el-tag closable @close="removeRightsById(scope.row,item.id)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--渲染二三级权限-->
              <el-col :span="19">
                <el-row
                  :gutter="10"
                  :class="[id2==0?'':'bdtop','vcenter']"
                  v-for="(it,id2) in item.children"
                  :key="it.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightsById(scope.row,it.id)"
                    >{{it.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="(it2) in it.children"
                      :key="it2.id"
                      type="warning"
                      closable
                      @close="removeRightsById(scope.row,it2.id)"
                    >{{it2.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <pre>
              {{scope.row}}
            </pre>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index" width="width"></el-table-column>
        <el-table-column label="角色名称" prop="roleName" width="width"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc" width="width"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              class="el-icon-edit"
              @click="editRole(scope.row.id)"
            >编辑</el-button>
            <el-button type="danger" size="mini" class="el-icon-delete">删除</el-button>
            <el-button
              type="warning"
              size="mini"
              class="el-icon-setting"
              @click="showRightsDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--弹出的权限分配的对话框-->
    <el-dialog title="权限分配" :visible.sync="setdialogVisible" width="50%" @close="resetDialog">
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="refTree"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rolesList: [],
      setdialogVisible: false,
      rightsList: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      defKeys: [],
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: ret } = await this.$http.get('roles')
      if (ret.meta.status !== 200) return this.$message.error('获取失败')
      this.rolesList = ret.data
      console.log(ret)
    },
    editRole (roleid) {
      console.log(roleid)
    },
    removeRightsById (role, rightsid) {
      this.$confirm('此操作将永久删除该权限,请确认?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightsid}`)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        role.children = res.data
        // console.log(res)
        // console.log(roleid + '\t' + rightsid)
        this.$message.success('删除成功')
      }).catch(() => {
        this.$message.info('取消删除')
      })
    },
    async showRightsDialog (role) {
      this.roleId = role.id
      const { data: ret } = await this.$http.get('rights/tree')
      if (ret.meta.status !== 200) return this.$message.error('获取失败')
      this.rightsList = ret.data
      // 获取该节点的三级权限,并把ID存储到defKeys数组
      // console.log(role)
      this.getLeafKeys(role, this.defKeys)
      this.setdialogVisible = true
    },
    // 通过递归把要默认勾选的三级权限的ID赋值给defKeys数组
    getLeafKeys (node, arr) {
      // 若当前节点没有children属性,则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr)
      })
    },
    // 权限分配对话框关闭事件(close)触发的函数
    resetDialog () {
      this.defKeys = []
      this.setdialogVisible = false
    },
    // 分配权限函数
    async allotRights () {
      const keys = [
        ...this.$refs.refTree.getCheckedKeys(),
        ...this.$refs.refTree.getHalfCheckedKeys()
      ]
      // console.log(keys)
      const idsStr = keys.join(',')
      const { data: ret } = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: idsStr
      })
      if (ret.meta.status !== 200) return this.$message.error('权限授权失败')
      console.log(ret)
      this.getRolesList()
      this.setdialogVisible = false
      this.$message.success('授权成功')
    }
  }
}
</script>
<style lang="less" scoped>
.el-tag {
    margin: 7px 0;
}
.bdtop {
    border-top: 1px solid #eee;
}
.bdbottom {
    border-bottom: 1px solid #eee;
}
.vcenter {
    display: flex;
    align-items: center;
}
</style>
