<template>
  <el-container class="home-container">
    <el-header>
      <div class="home-header">
        <img src="../assets/heima.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse?'64px':'200px'">
          <div class="toggle-button" @click="collapseMenu">|||</div>
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="skyblue"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition=false
          :router=true
          :default-active="activePath"
        >
          <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
              <!--一级菜单-->
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item :index="'/'+it.path" v-for="it in item.children" :key="it.id"
                @click="saveNavState('/'+it.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{it.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist: [],
      iconObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('navPath')
  },
  methods: {
    // 退出登录后,清空token数据,并路由到根路径 '/'
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/')
    },
    // 获取所有的菜单
    async getMenuList() {
      const { data: ret } = await this.$http.get('menus')
      if (ret.meta.status !== 200) return this.$message.error('获取菜单失败')
      this.menulist = ret.data
    },
    // 折叠菜单效果实现
    collapseMenu() {
      this.isCollapse = !this.isCollapse
    },
    // 保存二级菜单的path属性值到sessionStorage,给default-active高亮属性动态绑定路径
    saveNavState(arg) {
      window.sessionStorage.setItem('navPath', arg)
      this.activePath = arg
      console.log(this.activePath)
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
      border:none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
    margin-right:10px;
}
.toggle-button {
    background-color:#4a5064;
    font-size: 10px;
    text-align: center;
    color: #fff;
    line-height: 24px;
    letter-spacing: 0.2rem;
    cursor: pointer;
}
</style>
