<template>
  <div class="page_head">
    <img :src="logo" alt="" @click="$router.push({name: 'backlog'})">
    <div class="menu fr">
      <div class="cancel fr" @click="logout">退出</div>
      <el-popover ref="popover1" placement="bottom" width="360" height="320" trigger="click" v-model="visible">
        <p>
          <span class="info_name">用户名：</span>
          {{userData.account}}
        </p>
        <p>
          <span class="info_name">姓名：</span>
          {{userData.name}}
        </p>
        <hr>
        <p>
          <span class="info_name">电话号码：</span>
          {{userData.mobile}}
        </p>
        <p>
          <span class="info_name">邮件：</span>
          {{userData.email}}
        </p>
        <hr>
        <el-button type="primary" class="update_ps" @click="updatePsd">修改密码</el-button>
        <div class="user fl" slot="reference">{{baseIdentity.organizeName}} - {{userData.name}}</div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import logo from "@/assets/logo.png";
export default {
  data() {
    return {
      logo,
      userData: {
        account: "test",
        name: "test",
        mobile: "110",
        email: "test@test.com"
      },
      baseIdentity: {
        organizeName: "测试公司"
      },
      visible: false
    }
  },
  methods: {
    updatePsd() {

    },
    logout() {
      alert("登出系统！");
    }
  }
}
</script>

<style lang="scss" scoped>
.fr {
  float: right;
}
.page_head {
  height: 50px;
  background: linear-gradient(90deg, #13b9fa, #2e8df0);
  img {
    height: 100%;
    width: auto;
    float: left;
    margin-left: 100px;
    cursor: pointer;
  }
  .menu.fr {
    line-height: 50px;
    height: 50px;
    color: #fff;
    margin-right: 20px;
    font-size: 14px;
    .user {
      margin-right: 50px;
    }
    .cancel {
      cursor: pointer;
    }
  }
}
</style>
