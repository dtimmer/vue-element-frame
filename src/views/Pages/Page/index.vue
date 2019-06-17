<template>
  <div class="common_page">
    <page-head></page-head>
    <el-row>
      <el-col :span="4">
        <el-menu class="el-menu-vertical-demo" router unique-opened :default-active="routerName" @select="menuSelect">
          <loop-menu v-for="(item, index) in menus" :key="index+''" :item="item" route-name="targetUri"></loop-menu>
        </el-menu>
      </el-col>
      <el-col :span="20">
        <!-- 标签页 -->
        <el-tabs class="header-tabs" v-model="currentView" type="card" closable @tab-click="choose" @tab-remove="removeTab">
          <el-tab-pane v-for="item in tabs" :key="item.name" :label="item.name" :name="item.targetUri">
          </el-tab-pane>
        </el-tabs>
        <!-- 视图    被缓存(ps:为了保证路由组件的缓存，要求愿意被缓存的组件提供name属性，并且与路由名称保持一致)-->
        <keep-alive :include="includeNameList">
          <router-view class="view_main" />
        </keep-alive>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations } from "vuex";
import loopMenu from "@/components/loopMenu";
import PageHead from "./PageHead";
export default {
  components: {
    loopMenu,
    PageHead
  },
  data() {
    return {
      currentView: null,
      tabs: [],
    }
  },
  mounted() {
    // 初始化增加tabs
    this.menuSelect(this.routerName, []);
  },
  computed: {
    ...mapGetters(["menus"]),
    ...mapState({
      includeNameList: state => state.tab.includeNameList
    }),
    routerName() {
      return this.$route.name;
    }
  },
  watch: {
    routerName(val) {
      this.menuSelect(val);
    }
  },
  methods: {
    ...mapMutations("tab", ["addInclude", "delInclude"]),
    // 选中菜单，尽量与indexPath不进行挂钩，方便页面刷新进行初始化
    menuSelect(index) {
      let findMenu = (menus, menu) => {
        for (let i = 0; i < menus.length; i++) {
          if (menus[i].targetUri === menu) {
            return menus[i];
          }
          if (menus[i].child && menus[i].child.length) {
            let _result = findMenu(menus[i].child, menu);
            if (_result) {
              return _result;
            }
          }
        }
        return false;
      }
      let _menu = findMenu(this.menus, index);
      if (!this.tabs.includes(_menu)) {
        this.tabs.push(_menu);
      }
      this.currentView = _menu.targetUri;
      // 缓存页面
      this.addInclude(this.currentView);
    },
    // 删除点击标签页
    removeTab(tabName) {
      if (this.tabs.length == 1) {
        this.$message({
          message: "至少保留一个窗口",
          type: "warning"
        });
        return false;
      }
      // 清除缓存页
      this.delInclude(tabName);
      let findIndex = this.tabs.findIndex(el => el.targetUri == tabName);
      // // 清除标签页
      if (findIndex >= 0) {
        this.tabs.splice(findIndex, 1);
      }
      // // 跳转前一页
      let routerName = this.tabs[this.tabs.length - 1].targetUri;
      this.$router.push({ name: routerName });
      // // 高亮当前页
      this.currentView = routerName;
    },
    // 选中标签页进行跳转
    choose(tab) {
      this.$router.push({ name: tab.name });
    }
  }
}
</script>

<style lang="scss" scoped>
.common_page {
  height: 100%;
}
.el-row {
  height: calc(100% - 50px);
  > .el-col {
    height: 100%;
  }
  .el-menu {
    height: 100%;
    overflow: auto;
  }
  .view_main {
    height: calc(100% - 56px);
  }
}
</style>

<style lang="scss">
.el-menu-item.is-active {
  background: #ecf5ff;
}
</style>
