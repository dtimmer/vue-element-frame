<template>
  <el-submenu :key="item[routeName]" :index="item.uid" v-if="item.child && item.child.length">
    <template slot="title">
      <span>{{item.name}}</span>
    </template>
    <loop-menu v-for="val in item.child" :key="val[routeName]" :item="val" :route-name="routeName"></loop-menu>
  </el-submenu>
  <el-menu-item :index="item[routeName]" :key="item[routeName]" v-else :route="item[routeName]">
    <span slot="title">{{item.name}}</span>
  </el-menu-item>
</template>

<script>
import { setTimeout } from 'timers';
export default {
  name: "loopMenu",
  props: {
    item: {
      type: Object,
      default() {
        return {};
      }
    },
    routeName: {
      type: String,
      default: ""
    },
    props: {
      default: ""
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
