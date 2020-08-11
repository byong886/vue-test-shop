import Vue from 'vue'
import { Button, Form, Input, FormItem, Message } from 'element-ui'
// Message是弹窗提示组件,要求全局挂载在Vue实例上
Vue.use(Button)
Vue.use(Form)
Vue.use(Input)
Vue.use(FormItem)
Vue.prototype.$message = Message
