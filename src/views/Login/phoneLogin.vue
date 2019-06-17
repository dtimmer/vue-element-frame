<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
    <el-form-item prop="mobile" class="inputAfter">
      <img class="clearImg" src="../../assets/images/login/delete.png" alt @click="clearText('ruleForm', 'mobile')">
      <el-input class="loginInput phoneInput" ref="mobile" v-model="ruleForm.mobile" placeholder="请输入手机号"></el-input>
    </el-form-item>
    <el-form-item prop="msgPsd" class="shortMsgDiv inputAfter">
      <img class="clearImg" src="../../assets/images/login/delete.png" alt @click="clearText('ruleForm', 'msgPsd')">
      <el-input class="loginInput msgPsd" v-model="ruleForm.msgPsd" placeholder="请输入短信验证码"></el-input>
      <el-button class="msgButton" :class="{ msgTime: msgFlag }" @click="getMsg" :disabled="msgFlag">{{ shortMsg }}</el-button>
    </el-form-item>
    <el-button class="loginSubmit" type="primary" @click="submitForm">登录</el-button>
    <div class="changeMethod">
      <span @click="loginToName()">用户名登录</span>
    </div>
  </el-form>
</template>

<script>
export default {
  data() {
    var valiMobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else if (!/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(value)) {
        return callback(new Error("手机号格式不正确"));
      }
      callback();
    };
    return {
      ruleForm: {
        // 手机号登陆
        mobile: "", //18641168385,18641168888
        msgPsd: ""
      },
      rules: {
        mobile: [{ validator: valiMobile, trigger: "blur" }],
        msgPsd: [
          {
            required: true,
            message: "请输入短信验证码",
            trigger: "blur"
          }
        ]
      },
      shortMsg: "获取短信验证码",
      msgFlag: false,
    }
  },
  methods: {
    clearText(a, b) {
      // 清除当前输入框的值
      this[a][b] = "";
    },
    loginToName() {
      this.$emit("update:active", 1);
    },
    getMsg() {
      let newFlag = true;
      this.$refs["ruleForm"].validateField("mobile", a => {
        if (a != "") {
          newFlag = false;
          return;
        }
      });
      if (!this.msgFlag && newFlag) {
        let second = 60;
        // 获取短信验证码
        let timer = setInterval(() => {
          second--;
          if (second <= 0) {
            this.shortMsg = "获取短信验证码";
            this.msgFlag = false;
            clearInterval(timer);
          } else {
            this.shortMsg = `${second}秒后重新发送`;
            this.msgFlag = true;
          }
        }, 1000);
        this.shortMsg = `${second}秒后重新发送`;
        this.msgFlag = true;
        this.$http
          .get(`/base/message/sms.json`, {
            params: {
              mobile: this.ruleForm.mobile,
              type: `LOGIN`
            }
          });
      }
    },
    submitForm() {
      const fullObj = this.ruleForm;
      let submitObj = {
        mobile: fullObj.mobile,
        smsVerificationCode: fullObj.msgPsd
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
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
