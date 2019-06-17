<template>
  <div>
    <p>{{x}}</p>
    <el-button @click="a">+1</el-button>
  </div>
</template>

<script>
export default {
  name: "backlog",
  data() {
    return {
      x: 1
    }
  },
  mounted() {
    this.x++;
  },
  activated() {
  },
  methods: {
    a() {
      this.x++;
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
