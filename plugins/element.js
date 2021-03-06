import Vue from 'vue'
import {
  Button,
  Form,
  Input,
  FormItem,
  Message,
  Container,
  Header,
  Main,
  Aside,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  BreadcrumbItem,
  Breadcrumb,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Select,
  Option,
  Cascader,
  Alert,
  Tabs,
  TabPane,
  Step,
  Steps,
  CheckboxGroup,
  Checkbox,
  Upload
} from 'element-ui'

// 手动导入TimeLine相关组件,vue-cli没有加入该组件
import TimeLine from './timeline/index'
import TimeLineItem from './timeline-item/index'

// Message是弹窗提示组件,要求全局挂载在Vue实例上
Vue.use(Button)
Vue.use(Form)
Vue.use(Input)
Vue.use(FormItem)
Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Aside)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Step)
Vue.use(Steps)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)
Vue.use(TimeLine)
Vue.use(TimeLineItem)
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message
