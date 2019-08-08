<!-- template -->
<template>
  <div class="outer modifyPswCon">
    <div class="modifyPswDetail">
      <div class="changePswCont">
        <div class="changePswInputCont">
          <label for>原始密码:</label>
          <div class="inputInnerContainer">
            <a-input
              v-model="oldPsw"
              placeholder="请输入原始密码"
              :type="oldEye ? 'text' : 'password'"
              class="changePswInput"
              @blur="pswInputBlur(null,oldPsw)"
            >
              <a-icon
                class="eyeIcon"
                v-show="oldPsw"
                slot="suffix"
                :type="oldEye ? 'eye' : 'eye-invisible'"
                @click="changeEyes('oldEye')"
              />
            </a-input>
          </div>
        </div>
        <p class="pswTip">
          <span></span>
          {{oldPswTip}}
        </p>

        <div class="changePswInputCont">
          <label for>新密码:</label>
          <div class="inputInnerContainer">
            <a-input
              v-model="newPsw"
              placeholder="请输入新密码"
              :type="newEye ? 'text' : 'password'"
              class="changePswInput"
              @blur="pswInputBlur(0,newPsw)"
            >
              <a-icon
                class="eyeIcon"
                v-show="newPsw"
                slot="suffix"
                :type="newEye ? 'eye' : 'eye-invisible'"
                @click="changeEyes('newEye')"
              />
            </a-input>
          </div>
        </div>
        <p class="pswTip">
          <span></span>
          {{newPswTip}}
        </p>

        <div class="changePswInputCont">
          <label for>确认密码:</label>
          <div class="inputInnerContainer">
            <a-input
              v-model="confirmPsw"
              placeholder="请确认新密码"
              :type="confirmEye ? 'text' : 'password'"
              class="changePswInput"
              @blur="pswInputBlur(1,confirmPsw)"
            >
              <a-icon
                class="eyeIcon"
                v-show="confirmPsw"
                slot="suffix"
                :type="confirmEye ? 'eye' : 'eye-invisible'"
                @click="changeEyes('confirmEye')"
              />
            </a-input>
          </div>
        </div>
        <p class="pswTip">
          <span></span>
          {{confirmPswTip}}
        </p>
        <button type="button" class="savePswOperate ant-btn ant-btn-primary" @click="handleChange">确认修改</button>
      </div>
    </div>
  </div>
</template>

<script>
import reg from "../../utils/regexp";
export default {
  name: "Password",
  //import引入的组件需要注入到对象中才能使用
  components: {},
  props: [""],

  data() {
    return {
      oldPsw: "",
      oldPswTip: "",
      newPsw: "",
      oldEye: false,
      newEye: false,
      confirmEye: false,
      newPswTip: "",
      confirmPsw: "",
      confirmPswTip: ""
    };
  },

  //监听属性 类似于data概念
  computed: {},

  //监控data中的数据变化
  watch: {
    //obj:{
    //    handler:function(val,oldval){
    //
    //    },
    //    deep:true,//深度监听
    //}
  },

  //方法集合
  methods: {
    pswInputBlur(status, val) {
      // password blur
      if (status === 0) {
        // 新密码
        if (!reg.testPassword(val)) {
          this.newPswTip = "* 请输入6-16位(只可包含数字、字母、下划线)的密码";
        } else {
          this.newPswTip = "";
        }
      } else if (status === 1) {
        // 确认密码
        if (val !== this.newPsw) {
          this.confirmPswTip = "* 两次密码不一致";
        } else {
          this.confirmPswTip = "";
        }
      } else {
        // 原始密码
        if (!val) {
          this.oldPswTip = "* 请输入原始密码";
        } else {
          this.oldPswTip = "";
        }
      }
    },

    changeEyes(str) {
      // changeEyes open
      this[str] = !this[str];
    },

    // 确认修改密码
    handleChange(){
      const { oldPswTip, newPswTip, confirmPswTip, oldPsw, newPsw } = this;
      if(!oldPswTip && !newPswTip && !confirmPswTip){
        this.$http.fetchPost("user@updateSysUserPwd.action",{
          originalPassword:oldPsw,
          newPassword:newPsw,
        }).then(res => {
          if(Number(res.code) === 0){
              this.$message.success('密码修改成功，请重新登陆!');
              this.signOutSystem();
          } else{
              this.$message.warning('密码修改失败！');
          }
        }).catch(err => {
            this.$message.error('抱歉，网络异常，请稍后重试！');
        })
      }
    },
    
    signOutSystem(){
      // 退出系统
      this.$http.fetchPost("login@logout.action",null)
      .then(res => {
        if(Number(res.code) === 0){
          this.$router.push('/login');
        }else{
          // this.$message.warning("抱歉,退出失败,请重试!");
          this.$router.push('/login');
        }
      })
      .catch(err => {
        this.$message.console.error("抱歉,网络错误,请稍后重试!");
      })
    },
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},

  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},

  beforeCreate() {}, //生命周期 - 创建之前

  beforeMount() {}, //生命周期 - 挂载之前

  beforeUpdate() {}, //生命周期 - 更新之前

  updated() {}, //生命周期 - 更新之后

  beforeDestroy() {}, //生命周期 - 销毁之前

  destroyed() {}, //生命周期 - 销毁完成

  activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>

<style scoped>
.modifyPswCon {
  display: flex;
  justify-content: center;
}
.modifyPswDetail {
  margin-top: 5%;
  width: 500px;
}

.changePswCont {
  height: 100%;
  overflow-y: auto;
}
.changePswInputCont {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.changePswInputCont label {
  width: 20%;
  text-align: right;
  padding-right: 20px;
}
.inputInnerContainer {
  flex: 1;
}
.pswTip {
  color: red;
  font-size: 14px;
  height: 30px;
  line-height: 30px;
}
.pswTip span {
  display: inline-block;
  width: 20%;
}
.changePswInput {
  width: 100%;
}
.changePswInput i {
  cursor: pointer;
}
.tipContainer {
  overflow: auto;
  max-height: 300px;
}
.eyeIcon {
  color: #999999;
}
.eyeIcon:hover {
  color: #333333;
}

.savePswOperate{
    width: 20%;
    margin-left: 20%;
}
</style>