<template>
  <a-layout id="components-layout-demo-top-side-2" class="header_nav">
    <!-- 头部 -->
    <a-layout-header class="header">
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
    </a-layout-header>

    <!-- 内容 -->
    <a-layout>
      <!-- 左侧栏 -->
      <a-layout-sider collapsible v-if="currentMainIndex !== 2 && currentMainIndex !== 3" v-model="collapsed" width="200" style="background: #f0f2f5;">
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
              <a-icon type="user"/>
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
            v-if="menuId === item.menuId && item.children.length === 0"
            @click="slideIndexChange(item.menuId,item.path, 'two')"
          >
            <router-link :to="item.path">
              <a-icon type="user"/>
              <span class="nav-text">{{item.name}}</span>
            </router-link>
          </a-menu-item>

        </a-menu>
      </a-layout-sider>
      <!-- 内容栏 -->
      <a-layout style="padding: 0 5px 24px;">
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
import utils from "../utils/util";

export default {
  name: "HeaderNav",
  data() {
    return {
      currentPath: null,
      // 默认选中的 menu key
      menuDefaultSelect: ["top1"],
      menuTotalArr: [],
      menuArr: [], //一级菜单
      submenuArr: [], //二级菜单
      submenuDefaultSelect: [],
      defaultOpenKeys: [],
      collapsed: false,
      menuId: "",
      currentMainIndex:0,
    };
  },
  computed: {
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
    this.getMenuData();
    this.currentPath = this.$route.path;
    // this.routeChange(this.currentPath);
  },
  updated() {
    this.currentPath = this.$route.path;
  },
  mounted() {
    this.routerData = this.$route.meta.breadcrumb
      ? this.$route.meta.breadcrumb
      : "";
  },
  methods: {
    getMenuData() {
      /***
       * 功能：获取菜单总数据； 然后拆分出一级菜单数据以及二级菜单(包含子)数据
       */
      this.$http
        .fetchGet("login@getUserModule.action", {})
        .then(res => {
          if (res.data) {
            this.menuTotalArr = res.data;
            this.menuTotalArr.forEach(item => {
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
                    children: el.children
                  });
                });
              }
            });
            this.menuId = this.menuArr[0].id;
            this.routeChange(this.currentPath);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    changeMenu(currId, key, path,index) {

      this.menuId = currId;
      this.menuDefaultSelect = [key];
      this.menuId = key;
      this.currentMainIndex = index;
      // 获取sessionStorage中的值

      if (sessionStorage.getItem(currId)) {
        this.$router.push(sessionStorage.getItem(currId));
      } else {
        this.$router.push(path);
      }
      /***
       * 功能：一级菜单点击函数：获取当前的key值和name值，同时更改面包屑一级目录；
       */
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
                  console.log(nextSubmenu)
                  console.log(subItem)
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


    }
  },

  watch: {
    currentPath: {
      handler: function(newVal) {
        this.routeChange(newVal);
        const { menuId, currentPath } = this;
        // // // --------change sessionStorage---------
        if (menuId) {
          sessionStorage.setItem(menuId, currentPath);
        }
      }
    }
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
</style>

