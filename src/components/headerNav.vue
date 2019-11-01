<template>
  <a-layout id="components-layout-demo-top-side-2" class="header_nav">

    <!-- 修改密码弹层 -->
    <a-modal
      centered
      title="修改密码"
      :visible="changePswVisiable"
      width="40%"
      @ok="handleChange"
      @cancel="handleCancel"
      style="height:50%;overflow: hidden;"
      :maskClosable='false'
      :confirmLoading="confirmLoading"
    >
      <div class="changePswCont">
        <div class="changePswInputCont">
          <label for="">原始密码:</label>
          <div class="inputInnerContainer">
            <a-input v-model="oldPsw" placeholder="请输入原始密码" :type="oldEye ? 'text' : 'password'" class="changePswInput" @blur="pswInputBlur(null,oldPsw)">
              <a-icon class="eyeIcon" v-show="oldPsw" slot="suffix" :type="oldEye ? 'eye' : 'eye-invisible'" @click="changeEyes('oldEye')" />
            </a-input>
          </div>
        </div>
        <p class="pswTip"><span></span>{{oldPswTip}}</p>

        <div class="changePswInputCont">
          <label for="">新密码:</label>
          <div class="inputInnerContainer">
            <a-input  v-model="newPsw"  placeholder="请输入新密码" :type="newEye ? 'text' : 'password'"  class="changePswInput" @blur="pswInputBlur(0,newPsw)">
              <a-icon class="eyeIcon" v-show="newPsw" slot="suffix" :type="newEye ? 'eye' : 'eye-invisible'"  @click="changeEyes('newEye')" />
            </a-input>
            
          </div>
        </div>
        <p class="pswTip"><span></span>{{newPswTip}}</p>
        
        <div class="changePswInputCont">
          <label for="">确认密码:</label>
          <div class="inputInnerContainer">
            <a-input  v-model="confirmPsw"  placeholder="请确认新密码" :type="confirmEye ? 'text' : 'password'" class="changePswInput" @blur="pswInputBlur(1,confirmPsw)">
              <a-icon class="eyeIcon" v-show="confirmPsw" slot="suffix" :type="confirmEye ? 'eye' : 'eye-invisible'"  @click="changeEyes('confirmEye')" />
            </a-input>
          </div>
        </div>
        <p class="pswTip"><span></span>{{confirmPswTip}}</p>

      </div>
    </a-modal>

    <!-- 系统提示弹层 -->
    <a-modal
      title="系统提示信息"
      :visible="systemTipVisiable"
      width="24%"
      @cancel="systemTipCancel"
      style="height:30%;overflow: hidden;bottom:10px;right:10px;"
      :maskClosable="false"
      :mask="false"
    >
      <template slot="footer">
          <a-button key="back" @click="systemTipCancel">知道了</a-button>
      </template>
      <div class="systemTipContainer">
        {{systemTips}}
      </div>
    </a-modal>

    <!-- 头部 -->
    <a-layout-header class="header">
      <div class="left">
        <div class="logo"/>
        <a-menu
          theme="dark"
          mode="horizontal"
          :defaultSelectedKeys="menuDefaultSelect"
          :selectedKeys="menuDefaultSelect"
          :style="{ lineHeight: '64px' }"
        >
          <a-menu-item
            v-for="(item,index) in menuArr"
            :key="'top'+item.orderno"
            v-on:click="changeMenu(item.id, 'top'+ item.orderno, item.path,index)"
          >{{item.name}}</a-menu-item>
        </a-menu>
      </div>
      <div class="right">
        
        <a-popover
          :title="null" 
          placement="bottom"
          trigger="hover"
          :visible="hovered"
          @visibleChange="handleHoverChange"
        >
          <div slot="content">
            <div class="loginText"  v-if="loginData && loginData.isLogin">
                <p @click="changePassword" class="primaryBtnColor">修改密码</p>
                <p @click="signOutSystem" class="primaryBtnColor">退出系统</p>
            </div>
            <div class="loginText" v-else>
                <p>尚未登录</p>
            </div>
          </div>

          <a-popover
            :title="null" 
            placement="bottom"
            trigger="click"
            :visible="clicked"
            @visibleChange="handleClickChange"
          >
            <div slot="content">
              <div class="loginText"  v-if="loginData && loginData.isLogin">
                <p @click="changePassword" class="primaryBtnColor">修改密码</p>
                <p @click="signOutSystem"  class="primaryBtnColor">退出系统</p>
              </div>
              <div class="loginText" v-else>
                  <p>尚未登录</p>
              </div>
            </div>

            <div class="showCont">
              <a class="userIcon" :style="loginData && loginData.isLogin ? 'background:#ffffff;margin-right:10px;':''">
                <span v-if="loginData && loginData.isLogin" class="loginedText">{{loginData && loginData.loginUser && loginData.loginUser.userName.substr(0,1).toUpperCase()}}</span>
                <a-icon type="user" v-else/>
              </a>
              <span>{{loginData && loginData.loginUser && loginData.loginUser.userName}}</span>
            </div>
            
          </a-popover>
        </a-popover>
        
      </div>
    </a-layout-header>

    <!-- 内容 -->
    <a-layout>
      <!-- 左侧栏 -->
      <!-- currentMainIndex !== 2 && currentMainIndex !== 3 -->
      
      <a-layout-sider collapsible v-if="isHasNavPath !== '/analysis' && isHasNavPath !== '/report'" v-model="collapsed" width="200" style="background: #f0f2f5;">
        <a-menu
          mode="inline"
          :defaultSelectedKeys="submenuDefaultSelect"
          :selectedKeys="submenuDefaultSelect"
          :defaultOpenKeys="defaultOpenKeys"
          :openKeys.sync="defaultOpenKeys"
          :style="{ height: '100%', borderRight: 0 }"
        >
          <a-sub-menu
            v-for="item in submenuArr"
            :key="item.id"
            v-if="menuId === item.menuId && item.children.length !== 0"
          >
            <span slot="title">
              <icon-font :type="'icon-' + item.iconName" style="font-size: 18px;"  />
              <span>{{item.name}}</span>
            </span>

            <!-- v-if="item.children" -->
            <a-menu-item
              v-for="el in item.children"
              :key="el.id"
              @click="slideIndexChange(el.pId, el.muPath, 'three')"
            >
              <router-link :to="el.muPath">{{el.name}}</router-link>
            </a-menu-item>
          </a-sub-menu>

          <a-menu-item
            v-for="item in submenuArr"
            :key="item.id"
            v-if="menuId === item.menuId && item.children.length === 0 && item.path"
            @click="slideIndexChange(item.menuId,item.path, 'two')"
          >
            <router-link :to="item.path">
              <icon-font :type="'icon-' + item.iconName" style="font-size: 18px;" />
              <span class="nav-text">{{item.name}}</span>
            </router-link>
          </a-menu-item>

        </a-menu>
      </a-layout-sider>
      <!-- 内容栏 -->
      <a-layout :style="isHasNavPath !== '/analysis' && isHasNavPath !== '/report' ? 'padding: 0 5px 24px' : ''">
        <!-- 面包屑 -->
        <a-breadcrumb style="padding: 0 12px;height: 40px;line-height: 40px;background: #fff;" v-if="currentMainIndex !== 2 && currentMainIndex !== 3">
          <a-breadcrumb-item>{{this.$route.meta.title}}</a-breadcrumb-item>
          <a-breadcrumb-item v-for="(item, index) in breadcrumb" :key="index">{{item.name}}</a-breadcrumb-item>
        </a-breadcrumb>
        <!-- head nav 的 路由跳转 -->
        <router-view></router-view>
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script>
let timer = null;
const tipKey = "tipKey";

import utils from "../utils/util";
import reg from "../utils/regexp";
import { setInterval, clearInterval } from 'timers';
import { Icon } from 'ant-design-vue';
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1341319_j25y2s6sdi.js',
})

export default {
  name: "HeaderNav",
  data() {
    return {
      currentPath: null,
      // 默认选中的 menu key
      menuDefaultSelect: ["top1"],
      menuArr: [], //一级菜单
      submenuArr: [], //二级菜单
      submenuDefaultSelect: [], //默认选择
      defaultOpenKeys: [],  //默认展开
      collapsed: false,  
      menuId: "",
      currentMainIndex:0, //当前顶部 index
      isHasNavPath: null,  //有无左侧导航栏--path--大数据分析，流动人才报告
      clicked: false,
      hovered: false,
      changePswVisiable:false, //修改密码弹层显示
      confirmLoading:false,
      oldPsw:"",
      oldPswTip:"",
      newPsw:"",
      oldEye:false,
      newEye:false,
      confirmEye:false,
      newPswTip:"",
      confirmPsw:"",
      confirmPswTip:"",
      systemTipVisiable:false, //系统提示弹层显示
      systemTips:null, //系统提示
      systemTipTime:0,
      navData: [],  
    };
  },
  components: {
    IconFont
  },
  computed: {
    // navData(){
    //   return this.$store.getters.getNavData;
    // },
    loginData(){
      let loginData = JSON.parse(sessionStorage.getItem("loginData"));
      return loginData;
    },
    breadcrumb() {
      return this.$route.meta.breadcrumbList;
    },
    globalCount: function() {
      // console.log(this.$store.getters.getCount);
      return this.$store.getters.getCount;
    }
  },

  created() {
    // 改变导航
    this.getNavData();
    this.getTreeData();
    this.getMenuData();
    this.currentPath = this.$route.path;
    // this.routeChange(this.currentPath);
    this.isHasNavPath = this.$route.path;
    
    
  },

  updated() {
    this.currentPath = this.$route.path;
  },

  mounted() {
    const _this = this;

    _this.systemTip();
    this.routerData = this.$route.meta.breadcrumb ? this.$route.meta.breadcrumb : "";
    timer = setInterval(function(){

        _this.systemTipTime ++;
        if(_this.systemTipTime >= 1 ){
          _this.systemTip();
          _this.systemTipTime = 0;
        }

    },3*60*1000);
  },

  beforeDestroy(){
    clearInterval(timer);
    timer = null;
    this.$notification.close(tipKey);
  },

  methods: {
    getNavData(){
      // 获取导航栏的数据(保证最先加载)
      this.$http.fetchGet("login@getUserModule.action", {})
        .then(res => {
          if(Number(res.code) === 999){
            this.$router.push({path:'/login'});
          }
          if(Number(res.code) === 0){
            //dispatch
            // this.$store.dispatch("getNavData", res.data);
            this.navData = res.data;
          }
        })
        .catch(err => {
          this.$message.error('抱歉,网络异常,请刷新重试');
        })
    },

    
    getTreeData() {
      /***
       * 功能：获取tree数据
       */
      this.$http.fetchGet("informationPool@getParentId.action", {})
      .then(res => {
        if(Number(res.code) === 0){
          // console.log(res.data)
          this.getNewTreeData(res.data);
        }
      });
    },
    getNewTreeData(dataArr) {
      /***
       * 功能：根据ant-design-vue格式重组tree数据:替换原来的id为key; name为title
       */
      dataArr.forEach(el => {
        el.title = el.name;
        el.key = el.id;
        el.value = el.id;
        el.isLeaf = el.isParent === "false" && el.key.length > 10 ? true:null;
        delete el.name;
        delete el.id;
        if (el.children) {
          this.getNewTreeData(el.children);
        }
      });
      this.$store.dispatch("getinfoPollTreeData", dataArr);
    },

    // password blur
    pswInputBlur(status,val){
      if(status === 0){
        // 新密码
        if(!reg.testPassword(val)){
          this.newPswTip = "* 请输入6-16位(只可包含数字、字母、下划线)的密码"
        }else{
          this.newPswTip = "";
        }
      }else if(status === 1){
        // 确认密码
        if(val !== this.newPsw){
          this.confirmPswTip = "* 两次密码不一致";
        }else{
          this.confirmPswTip = "";
        }
      }else{
        // 原始密码
        if(!val){
          this.oldPswTip = "* 请输入原始密码"
        }else{
          this.oldPswTip = "";
        }
      }
    },

    // changeEyes open
    changeEyes(str){
      this[str] = !this[str];
    },

    // 系统提示
    systemTip(){
      this.$http.fetchPost("sysNotice@sysNoniceLists.action")
      .then(res => {
        if(Number(res.code) === 0){
          
          this.systemTips = res.data;

          if(this.systemTips.length > 0){
            // 提示弹框
            this.$notification.open({
              message: '系统提示信息',
              description:(h) => {
                return h(
                  "div",
                  {
                    style: {
                      maxHeight: '300px',
                      overflowY: 'auto'
                    },
                  },
                  [
                    h("p",this.systemTips.map(function(item,index){
                      return (index+1) + "、" +item.message;
                    }))
                  ],
                );
              },
              duration: null,
              placement:"bottomRight",
              icon: <a-icon type="smile" style="color: #108ee9" />,
              btn: (h)=>{
                return h('a-button', {
                  props: {
                    type: 'primary',
                    size: 'default',
                  },
                  on: {
                    click: () => {this.$notification.close(tipKey);this.systemTipTime = 0;}
                  }
                }, '知道了')
              },
              key:tipKey,
              onClose: close,
            });
          }

        }
      })
      .catch(err => {

      })
    },

    hide () {
      this.clicked = false
      this.hovered = false
    },

    // 鼠标hover样式
    handleHoverChange (visible) {
      this.clicked = false
      this.hovered = visible
    },

    // 点击样式
    handleClickChange (visible) {
      this.clicked = visible
      this.hovered = false
    },

    // 清空 input
    emptyInput(str){
      this[str] = "";
    },

    // 修改密码
    changePassword(){
      const {loginData} = this;
      if(!loginData.isLogin || !loginData.loginUser) return ;
      this.changePswVisiable = true;
      this.hide();
    },

    
    // 确认修改密码
    handleChange(){
      const { oldPswTip, newPswTip, confirmPswTip, oldPsw, newPsw,confirmPsw} = this;
      let isRight = true;

      if(!oldPsw){
        isRight = false;
        this.oldPswTip = "* 请输入原始密码"
      }

      // 新密码
      if(!reg.testPassword(newPsw)){
        isRight = false;
        this.newPswTip = "* 请输入6-16位(只可包含数字、字母、下划线)的密码"
      }
        
      // 确认密码
      if(confirmPsw !== newPsw){
        isRight = false;
        this.confirmPswTip = "* 两次密码不一致";
      }

      if(isRight){
        this.oldPswTip = "";
        this.confirmPswTip = "";
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

    handleCancel(){
      this.changePswVisiable = false;
    },

    systemTipCancel(){
      this.systemTipTime = 0;
      this.systemTipVisiable = false;
    },

    // 退出系统
    signOutSystem(){
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
    getMenuData() {
      /***
       * 功能：获取菜单总数据； 然后拆分出一级菜单数据以及二级菜单(包含子)数据
       */
      if(!this.navData || this.navData.length <= 0) return;
      this.navData.forEach(item => {
        // console.log(item.orderno)
        this.menuArr.push({
          id: item.id,
          name: item.name,
          path: item.muPath,
          orderno: item.orderno
        });
        if (item.children) {
          item.children.forEach(el => {
            this.submenuArr.push({
              id: el.id,
              menuId: el.pId,
              name: el.name,
              orderno: el.orderno,
              path: el.muPath,
              children: el.children,
              iconName: el.iconName
            });
          });
        }
      });
      this.menuId = this.menuArr[0].id;
      this.routeChange(this.currentPath);
    },
    changeMenu(currId, key, path,index) {
      /***
       * 功能：一级菜单点击函数：获取当前的key值和name值，同时更改面包屑一级目录；
       */
      if(this.currentMainIndex === index) return;
      this.menuId = currId;
      this.menuDefaultSelect = [key];
      // this.menuId = key;
      this.currentMainIndex = index;
      this.isHasNavPath = path;

      // 获取sessionStorage中的值
      if (sessionStorage.getItem(currId)) {
        this.$router.push(sessionStorage.getItem(currId));
      } else {
        this.$router.push(path);
      }
      
    },

    slideIndexChange(currId, path, menuLevel) {
      sessionStorage.setItem("", "");
      if (menuLevel === "three") {
        //点击为三级子菜单
        this.submenuArr.forEach((el, index) => {
          if (el.id === currId) {
            let twoMenuId = el.menuId;
            this.menuArr.forEach((item, index) => {
              if (item.id === twoMenuId) {
                this.menuArr[index].path = path;
              }
            });
          }
        });
      } else {
        //点击为二级子菜单
        this.menuArr.forEach((item, index) => {
          if (item.id === currId) {
            this.menuArr[index].path = path;
          }
        });
      }
    },

    // 获取路由 change 导航列表
    routeChange(currentRoutePath) {
      if(!currentRoutePath) return;
      const _this = this;
      let routeLevelArr = currentRoutePath.split("/");
      let tempArr = utils.deleteVoidFromArr(routeLevelArr);
      let hasSearchedmenu = false;
      let hasSearchedSubmenu = false;

      if (!tempArr) {
        this.menuDefaultSelect = ["top1"];
        return;
      }

      // 改变一级导航 index
      
      [].forEach.call(this.menuArr,(item,index)=>{
        if (item.path) {
          let pathArr = item.path.split("/");
          
          if (tempArr[0] === utils.deleteVoidFromArr(pathArr)[0]) {
            _this.menuDefaultSelect = ["top" + item.orderno];
            // console.log(item.id)
            _this.menuId = item.id;
            hasSearchedmenu = true;
            _this.currentMainIndex = index;
          } else {
            if(!hasSearchedmenu){
              _this.menuDefaultSelect = ["top1"];
            }
          }
        }
      });

      // 改变二级导航和三级导航
      // change submenuDefaultSelect

      this.submenuArr.forEach(subItem => {
        
        if (!hasSearchedSubmenu && subItem.menuId === _this.menuId) {
          // 尚未遍历到二级或三级导航
          if (
            !!subItem.children &&
            subItem.children.length > 0
          ) {
            // 遍历二级下的三级导航
            subItem.children.forEach(nextSubmenu => {
              if (
                !!nextSubmenu.muPath 
                && (!nextSubmenu.children || nextSubmenu.children.length <= 0)
                && !hasSearchedSubmenu
              ) {
                let nextPathArr = nextSubmenu.muPath.split("/");
                if (
                  utils.arrEquals(
                    utils.deleteVoidFromArr(nextPathArr),
                    utils.deleteVoidFromArr(tempArr)
                  )
                ) {
                  // console.log(nextSubmenu)
                  // console.log(subItem)
                  _this.submenuDefaultSelect = ["" + nextSubmenu.id];
                  _this.defaultOpenKeys = ["" + subItem.id];
                  hasSearchedSubmenu = true;
                }
              }
            });

          }else if(!subItem.children || subItem.children.length <= 0){

            let pathArr = subItem.path.split("/");
            if (
              utils.arrEquals(
                utils.deleteVoidFromArr(pathArr),
                utils.deleteVoidFromArr(tempArr)
              )
            ) {
              _this.submenuDefaultSelect = [subItem.id];
              hasSearchedSubmenu = true;
            }

          }

        }
      });


    },

  },

  watch: {
    currentPath: {
      handler: function(newVal) {
        if(!newVal) return;
        this.routeChange(newVal);
        const { menuId, currentPath } = this;
        // // // --------change sessionStorage---------
        if (menuId) {
          sessionStorage.setItem(menuId, currentPath);
        }
      }
    },
    navData:{
      handler: function(newVal) {
        this.getMenuData();
      }
    },
  }
};
</script>

<style scoped>
.ant-layout-sider {
  overflow-y: auto;
  overflow-x: hidden;
}
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background-color: #eeeeee;
}
::-webkit-scrollbar-thumb {
  background: #aaaaaa;
}
.header{
  display: flex;
}
.header .left{
  flex: 1;
}
.header .right{
  padding: 0 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
}
.right .showCont{
  display: flex;
  justify-content: center;
  align-items: center;
}
.right .showCont>span{
  color: #ffffff;
}
.loginText{
  display: flex;
  width: 90px;
  cursor: pointer;
  flex-wrap: wrap
}
.loginText p{
  width: 100%;
  text-align: center;
  padding: 5px 0;
}
.header .right .userIcon{
  display: flex;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  background: #eeeeee;
}
.header .right .userIcon:hover{
  color: #666666;
  opacity: .95;
}
.header .right i{
  font-size: 20px;
}
.loginedText{
  font-size: 18px;
}
.changePswCont{
  height: 100%;
  overflow-y: auto;
}
.changePswInputCont{
  display: flex;
  justify-content:space-around;
  align-items: center;
}
.changePswInputCont label{
  width: 20%;
  text-align: right;
  padding-right: 20px;
}
.inputInnerContainer{
  flex: 1;
}
.pswTip{
  color: red;
  font-size: 14px;
  height: 30px;
  line-height: 30px;
}
.pswTip span{
  display: inline-block;
  width: 20%;
}
.changePswInput{
  width: 100%;
}
.changePswInput i{
  cursor: pointer;
}
.tipContainer{
  overflow: auto;
  max-height: 300px;
}
.eyeIcon{
  color:#999999;
}
.eyeIcon:hover{
  color: #333333;
}
</style>

