<template>
<a-locale-provider :locale="zh_CN">
  <div id="app">
    <router-view></router-view>
  </div>
</a-locale-provider>
</template>

<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
export default {
  data() {
    return {
      zh_CN,
    }
  },
  name: "app",
  created(){
    this.getNavData();
    this.getTreeData();
    this.getCompanyData();
  },
  mounted(){
    this.getDirectoryData();
  },
  methods:{
    // 获取导航栏的数据(保证最先加载)
    getNavData(){
      this.$http.fetchGet("login@getUserModule.action", {})
        .then(res => {
          if(Number(res.code) === 0){
            //dispatch
            this.$store.dispatch("getNavData", res.data);
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

    // 获取公司数据
    getCompanyData(){
      this.$http.fetchGet("companyInfo@getCompanyList.action", {})
      .then(res => {
        if(Number(res.code) === 0){
          this.$store.dispatch("updateCompanyData", res.data);
        }
      });
    },
    
    // 获取字典数据
    getDirectoryData(){
      this.$http.fetchPost("personalArch@personalArchAddSysDictItem.action", {})
      .then(res => {
        if(Number(res.code) === 0){
          this.$store.dispatch("getDirectoryData", res.data);
        }
      });
    }

  },
  components: {
  }
};
</script>

<style scoped>

</style>
