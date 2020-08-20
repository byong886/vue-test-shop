import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/Login.vue'
import home from '../components/Home.vue'
import welcome from '../components/Welcome.vue'
import users from '../components/user/Users.vue'
import rights from '../components/power/Rights.vue'
import roles from '../components/power/Role.vue'
import category from '../components/goods/Category.vue'
import cateParams from '../components/goods/Params.vue'
import goodsList from '../components/goods/List.vue'
import goodsAdd from '../components/goods/Add.vue'
import orderList from '../components/orders/OrderList.vue'
import report from '../components/reports/Report.vue'
Vue.use(VueRouter)

const routes = [{
  path: '/login',
  component: login
},
{
  path: '/',
  redirect: '/login'
},
{
  path: '/home',
  component: home,
  redirect: '/welcome',
  children: [{
    path: '/welcome',
    component: welcome
  },
  {
    path: '/users',
    component: users
  },
  {
    path: '/rights',
    component: rights
  },
  {
    path: '/roles',
    component: roles
  },
  {
    path: '/categories',
    component: category
  },
  {
    path: '/params',
    component: cateParams
  },
  {
    path: '/goods',
    component: goodsList
  },
  {
    path: '/goods/add',
    component: goodsAdd
  },
  {
    path: '/orders',
    component: orderList
  },
  {
    path: '/reports',
    component: report
  }
  ]
}
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
// to将要访问的页面 from从哪里过来的访问 next-是否回调放行
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
