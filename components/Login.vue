<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avtar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <el-form label-width="0px" ref="login_" class="login_form" :model="loginform" :rules="loginRule">
          <!--用户名 -->
          <el-form-item prop="username">
            <el-input v-model="loginform.username" prefix-icon="iconfont icon-user"></el-input>
          </el-form-item>
          <!--密码-->
          <el-form-item prop="password">
            <el-input v-model="loginform.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
          </el-form-item>
          <!--按钮-->
          <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetform">重置</el-button>
          </el-form-item>
     </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loginform: {
        username: 'admin',
        password: '123456'
      },
      /* 表单基本校验规则对象,注意,校验名要和v-model绑定的字段名一致,校验才会生效 */
      loginRule: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码为6-15个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetform () {
      this.$refs.login_.resetFields() // 重置表单,清空表单字段
    },
    login () {
      this.$refs.login_.validate(async val => {
        if (!val) return false
        /* 对象结构,直接拿到结果对象的data属性值 */
        const { data: ret } = await this.$http.post('/login', this.loginform)
        if (ret.meta.status !== 200) { return this.$message.error('用户名或密码错误') }
        this.$message.success('登录成功')
        // 登录成功后,把用户token信息存放到sessionStroage,session断开,自动清除数据
        window.sessionStorage.setItem('token', ret.data.token)
        // 通过导航式编程跳转到后台主页,路由 /home
        this.$router.push('home')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  background-color: white;
  width: 450px;
  height: 300px;
  border-radius: 3px;
  position: absolute;
  left: 50%; //绝对定位:相对于浏览器移动
  top: 50%;
  transform: translate(
    -50%,
    -50%
  ); //transform是值该盒子本身的运动,相对于盒子尺寸来计算

  .avtar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    padding: 10px;
    border-radius: 50%;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      background-color: #eee;
      border-radius: 50%;
    }
  }
  .login_form{
      position: absolute;
      width: 100%;
      bottom:0;
      padding: 0 20px;
      box-sizing: border-box; //设置为边界表单
      .btns{
          display: flex;
          justify-content: flex-end;
      }
  }

}
</style>
