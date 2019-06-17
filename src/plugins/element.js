import Vue from "vue";

import {
  Button,
  Input,
  Menu,
  MenuItem,
  Submenu,
  Form,
  FormItem,
  Popover,
  Row,
  Col,
  Tabs,
  TabPane,
  Checkbox,
  Loading
} from "element-ui";

Vue.use(Button);
Vue.use(Input);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Submenu);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Popover);
Vue.use(Row);
Vue.use(Col);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Checkbox);
Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;
