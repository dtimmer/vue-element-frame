<template>
  <div class="login" id="login">
    <div class="blurBg" :class="{ hackBlurBg: active == 2 }">
      <div class="loginWindow" :class="{ loginPhoneW: active == 2 }">
        <h2 class="loginTitle">
          <img src="../../assets/images/login/logo.png">
        </h2>
        <div class="loginForm">
          <name-login v-if="active === 1" :active.sync="active" @loginSuccess="loginSuccess"></name-login>
          <phone-login v-if="active === 2" :active.sync="active" @loginSuccess="loginSuccess"></phone-login>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import nameLogin from "./nameLogin";
import phoneLogin from "./phoneLogin";
import { mapActions } from "vuex";
export default {
  name: "Login",
  components: {
    nameLogin,
    phoneLogin
  },
  data() {
    var t = +new Date();
    return {
      areaCode: "",
      remName: false, // 是否记住用户名
      psdType: "password",
      active: 1
    };
  },
  methods: {
    ...mapActions(["getMenus"]),
    loginSuccess() {
      // 获得登录菜单
      this.getMenus().then(res => {
        if (!res || !res.length) {
          this.$message({
            type: "warning",
            message: "没有此用户的功能,请重新登录",
            showClose: true
          });
          return false;
        }
        this.$router.push({ name: "backlog" });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.hackBlurBg.blurBg {
  margin: -250px 0 0 -240px;
}
.blurBg {
  background: rgba(255, 255, 255, 0.5);
  position: absolute;
  left: 50%;
  top: 50%; // margin: -295px 0 0 -312px;
  margin: -250px 0 0 -240px;
  border-radius: 10px;
  .code {
    position: absolute;
    right: 0;
    top: 177px;
    width: 254px;
    box-sizing: border-box;
    border-left: 1px solid rgba(255, 255, 255, 0.25);
    text-align: center;
    .qrCode {
      width: 136px;
      height: 136px;
      background: #ddd;
    }
    .text1 {
      font-size: 16px;
      color: #000;
      margin-top: 5px;
    }
    .text2 {
      font-size: 12px;
      color: #666;
    }
  }
}
</style>

<style lang="scss">
.login {
  height: 100%;
  width: 100%;
  background: url(../../assets/images/login/bg.png) no-repeat;
  background-size: 100% 100%;
}

.disNone {
  display: none;
}

.backgroundImg {
  width: 100%;
  height: 100%; // background: #ccc;
  position: relative;
}

.loginTitle {
  text-align: center;
  margin-bottom: 35px;
  img {
    width: 105px;
    height: 97px;
  }
}

.loginTab {
  li {
    margin-right: 10px;
    color: #a9a9a9;
    font-size: 18px;
    line-height: 30px;
    border-bottom: 2px solid transparent;
    cursor: pointer;
  }
  .active {
    border-bottom: 2px solid #00abeb;
    color: #00abeb;
  }
}

.loginForm {
  width: 100%;
}

.loginWindow {
  width: 480px;
  height: 500px;
  box-sizing: border-box; // padding: 57px 80px 54px 80px;
  padding: 45px 45px 40px 40px;
}

.loginWindow.loginPhoneW {
  width: 480px;
  height: 500px;
  .loginSubmit {
    margin-top: 40px;
  }
}

.loginTab {
  display: flex;
}

.inputDiv {
  border: 1px solid #ccc;
  border-radius: 3px;
  height: 50px;
  margin-bottom: 20px;
}

.loginInput {
  background: #fff;
  position: relative;
  &:before {
    content: "";
    position: absolute;
    display: block;
    border-right: 1px solid #e5e5e5;
    height: 20px;
    top: 12px;
    left: 45px;
  }
  .el-input__inner {
    padding: 10px 0 10px 55px;
    height: 45px !important;
  }
}

.inputAfter {
  position: relative;
  &:hover {
    .clearImg,
    .showPsdImg {
      display: block;
    }
  }
}

.clearImg {
  display: none;
  width: 20px;
  height: 20px;
  position: absolute;
  top: 14px;
  right: 10px;
  z-index: 100;
  cursor: pointer;
}

.psd .clearImg {
  right: 45px;
}
.shortMsgDiv .clearImg {
  right: 175px;
}

.showPsdImg {
  display: none;
  width: 20px;
  height: 24px;
  position: absolute;
  top: 13px;
  right: 10px;
  z-index: 100;
  cursor: pointer;
}

.nameInput {
  input {
    background: url(../../assets/images/login/user.png) no-repeat;
    background-position: 10px center;
    background-size: 24px 24px;
  }
}

.psdInput,
.msgPsd {
  input {
    background: url(../../assets/images/login/psd.png) no-repeat;
    background-position: 10px center;
    background-size: 24px 24px;
  }
}

.codeInput {
  input {
    background: url(../../assets/images/login/code.png) no-repeat;
    background-position: 10px center;
    background-size: 24px 24px;
  }
}

.msgPsd {
  width: 49%;
  float: left;
}

.msgButton.el-button {
  width: 49%; // margin-left: 2%;
  box-sizing: border-box;
  font-size: 16px;
  border: none;
  border: 1px solid #ccc;
  outline: none;
  color: #00abeb;
  background: #f6f6f6;
  cursor: pointer;
  padding: 13px 0;
  height: 45px;
  line-height: 15px;
  top: 0;
  &.is-disabled {
    color: #b4bccc;
    cursor: not-allowed;
    background-image: none;
    background-color: #fff;
    border-color: #e6ebf5;
  }
}

.msgTime {
  color: #c1b6b6;
  background: #fff;
}

.loginSubmit.el-button {
  width: 100%; // position: absolute;
  padding: 12px 0; // bottom: 54px;
  // left: 0;
  top: auto;
  height: auto;
  line-height: 15px;
}

// 样式覆盖

.remName {
  .el-form-item__content {
    margin-bottom: 0;
  }
  .el-checkbox__label {
    color: #fff;
    font-size: 12px;
  }
}

.changeMethod {
  text-align: center;
  margin-top: 20px;
  span {
    color: #fff;
    font-size: 12px;
    text-decoration: underline;
    cursor: pointer;
  }
}

.shortMsgDiv {
  .el-form-item__content {
    display: flex;
    & > .el-input {
      width: 58% !important;
    }
    & > .msgButton {
      width: 40%;
      margin-left: 2%;
    }
  }
}
</style>
