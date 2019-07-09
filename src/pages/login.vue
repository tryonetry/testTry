<!-- template -->
<template>
<div class="loginOut">
    <vue-particles color="#dedede" :clickEffect="false"></vue-particles>
    <div class="loginInputContainer">
        <a-input type="text" class="loginInput" placeholder="请输入用户名" v-model="user"></a-input>
        <a-input type="password" class="loginInput" placeholder="请输入密码" v-model="password"></a-input>
        <a-button type="primary" class="loginBtn" @click="handleLogin" :loading="loading">{{loginBtnText}}</a-button>
    </div>
</div>
</template>

<script>

export default {
    name:"Login",
    //import引入的组件需要注入到对象中才能使用
    components: {},
    props:[""],

    data() {
        return {
            user:"",
            password:"",
            loginBtnText:"登 录",
            loading:false,
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
        handleLogin(){
            console.log(1)
            const {user,password} = this;
            this.loading = true;
            this.loginBtnText = "登陆中...";
            this.$http.fetchPost("login@checkLogin.action",{
                userCode:user,
                userPassword:password,
            },{withCredentials:true}).then(res => {
                if(res.bo){
                    this.$message.success("登录成功");
                    this.loginBtnText = "跳转中...";
                    this.$router.push('/');
                }else{
                    this.$message.warning("登录失败,请重试");
                }
            }).catch(err => {
                this.$message.error("抱歉,网络错误,请稍后重试!");
            }).finally(end => {
                this.loading = false;
                this.loginBtnText = "登 录";
            })
        },
    },

    //生命周期 - 创建完成（可以访问当前this实例）
    created() {

    },

    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    },

    beforeCreate() {}, //生命周期 - 创建之前

    beforeMount() {}, //生命周期 - 挂载之前

    beforeUpdate() {}, //生命周期 - 更新之前

    updated() {}, //生命周期 - 更新之后

    beforeDestroy() {}, //生命周期 - 销毁之前

    destroyed() {}, //生命周期 - 销毁完成

    activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发

}

</script>

<style scoped>
    .loginOut{
        height: 100%;
        background: url('../assets/image/loginbg.jpg');
        position: relative;
        overflow: hidden;
    }
    .loginInputContainer{
        background: #ffffff;
        width: 500px;
        height: 300px;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -250px;
        margin-top: -150px;
        border-radius: 5px;
        opacity: .8;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        align-content: center;
    }
    .loginInput{
        width: 80%;
        height: 45px;
        margin-bottom: 30px;
        background: #ffffff;
    }
    .loginBtn{
        width: 80%;
        height: 45px;
    }
</style>