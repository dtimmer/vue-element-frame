<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
    <el-form-item prop="name" class="inputAfter">
      <img class="clearImg" src="../../assets/images/login/delete.png" alt @click="clearText('ruleForm', 'name')">
      <el-input class="loginInput nameInput" v-model="ruleForm.name" placeholder="请输入用户名"></el-input>
    </el-form-item>
    <el-form-item prop="psd" class="inputAfter psd">
      <img class="clearImg" src="../../assets/images/login/delete.png" alt @click="clearText('ruleForm', 'psd')">
      <img v-if="psdType == 'password'" class="showPsdImg" @click="showPsd" src="../../assets/images/login/hide.png" alt>
      <img v-if="psdType == 'text'" class="showPsdImg" @click="showPsd" src="../../assets/images/login/show.png" alt>
      <el-input :type="psdType" class="loginInput psdInput" v-model="ruleForm.psd" placeholder="请输入密码"></el-input>
    </el-form-item>
    <el-form-item class="remName">
      <el-checkbox v-model="remName">记住用户名</el-checkbox>
    </el-form-item>
    <el-button class="loginSubmit" type="primary" @click="submitForm()">登录</el-button>
    <div class="changeMethod">
      <span @click="loginToPhone">手机号登录</span>
    </div>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      remName: false, // 是否记住用户名
      psdType: "password",
      ruleForm: {
        // 用户名登录
        name: this.$store.state.account || "", //smartadmin
        psd: "", //123456
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        psd: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    clearText(a, b) {
      // 清除当前输入框的值
      this[a][b] = "";
    },
    /**
     * 控制是否显示密码
     */
    showPsd() {
      if (this.psdType === "password") {
        this.psdType = "text";
      } else {
        this.psdType = "password";
      }
    },
    /**
     * 切换为手机号登录
     */
    loginToPhone() {
      this.$emit("update:active", 2);
    },
    submitForm(formName) {
      const fullObj = this.ruleForm;
      let submitObj = {
        userName: fullObj.name,
        password: fullObj.psd,
      };
      this.$refs.ruleForm.validate(a => {
        if (a) {
          this.$http
            .get("/base/account/login.json", {
              params: submitObj
            })
            .then(
              () => {
                // 登录成功，由父组件进行菜单请求等操作
                this.$emit("loginSuccess");
              }
            );
        } else {
          return false;
        }
      });
    },
  }
}
</script>

<style lang="scss">
.phoneInput {
  input.el-input__inner {
    background: url(../../assets/images/login/phone.png) no-repeat;
    background-position: 10px center;
    background-size: 24px 24px;
  }
}
</style>
