<template>
  <div>
    <!--面包屑组件-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区-->
    <el-card>
      <el-row :gutter="15">
        <el-col :span="8">
          <el-input v-model="queryObj.query" placeholder="请输入">
            <el-button slot="append" class="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!--订单表格数据-->
      <el-table :data="orderList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="270px"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="90px"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="100px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status==1">已付款</el-tag>
            <el-tag type="danger" v-if="scope.row.pay_status==0">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="90px">
          <template slot-scope="scope">{{scope.row.is_send}}</template>
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="220px">
          <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
            <el-button type="success" icon="el-icon-setting" size="mini" @click="showProcessBox"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--视图底分页部分-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryObj.pagenum"
        :page-sizes="[5, 10, 20]"
        :page-size="queryObj.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!--编辑按钮的弹框,修改地址-->
    <el-dialog title="修改地址" :visible.sync="orderDialogVisible" width="40%" @close="resetForm">
      <el-form ref="addressForm" :model="addressForm" :rules="addressRules" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            :options="cityData"
            v-model="addressForm.address1"
            :props="cityProps"
            @change="selectChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="orderDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="orderDialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!--设置按钮,查看物流进程的弹框-->
    <el-dialog title="物流信息" :visible.sync="processDialogVisible" width="50%">
      <!--时间线组件-->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in processData"
          :key="index"
          :timestamp="activity.ftime"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
import cityData from './citydata.js'
export default {
  data() {
    return {
      queryObj: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      orderList: [],
      total: 0,
      orderDialogVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressRules: {
        address1: [
          { required: true, message: '选择地址', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      cityData,
      cityProps: {
        expandTrigger: 'hover',
        label: 'label',
        value: 'value',
        children: 'children'
      },
      processDialogVisible: false,
      processData: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList () {
      const { data: ret } = await this.$http.get('orders', { params: this.queryObj })
      if (ret.meta.status !== 200) return this.$message.error('获取失败')
      this.orderList = ret.data.goods
      this.total = ret.data.total
      // console.log(ret)
    },
    handleSizeChange (pageSize) {
      this.queryObj.pagesize = pageSize
      this.getOrderList()
    },
    handleCurrentChange (currPage) {
      this.queryObj.pagenum = currPage
      this.getOrderList()
    },
    search () {
      this.getOrderList()
    },
    showBox () {
      this.orderDialogVisible = true
    },
    resetForm () {
      this.$refs.addressForm.resetFields()
    },
    selectChange (val) {
      this.addressForm.address2 = ''
      console.log(val)
    },
    async showProcessBox () {
      this.processDialogVisible = true
      const { data: ret } = await this.$http.get('/kuaidi/1106975712662')
      if (ret.meta.status !== 200) return this.$message.error('获取物流信息失败')
      this.processData = ret.data
      this.$message.success(ret.meta.message)
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../plugins/timeline/timeline.css';
@import '../../plugins/timeline-item/timeline-item.css';
</style>
