<template>
  <div>
      <el-button type="primary" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
