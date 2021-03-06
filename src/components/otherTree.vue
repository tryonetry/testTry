<!-- template -->
<template>
  <!-- 其他类型的Tree：  以及对树的操作 -->

  <div class="otherTreeContainer">

    <!-- tree上面得操作按钮 -->
    <slot name="treeOperate"></slot>

    <a-input-search
      v-if="treeDataObj.isSearch"
      style="margin-bottom: 8px"
      :placeholder="treeDataObj.searchPlaceholder"
      @change="onChange"
    />

    <a-directory-tree
      :class="!treeDataObj.isSearch ? 'treeView' : 'treeViewIsSearch'"
      @expand="onExpand"
      :checkable="treeDataObj.isChecked ? treeDataObj.isChecked : false"
      :expandedKeys="expandedKeys"
      :autoExpandParent="autoExpandParent"
      :treeData="treeDataObj.dataArr"
      :expandAction="treeDataObj && treeDataObj.expandAction === 1 ? false : 'click'"
      @select="onSelect"
      @check="onCheck"
      :checkedKeys="checkedKeys"
      :checkStrictly="checkStrictly"
    >
      <template slot="title" slot-scope="{title}">
        <span v-if="title.indexOf(searchValue) > -1">
          {{title.substr(0, title.indexOf(searchValue))}}
          <span style="color:red">{{searchValue}}</span>
          {{title.substr(title.indexOf(searchValue) + searchValue.length)}}
        </span>
        <span v-else>{{title}}</span>
      </template>
    </a-directory-tree>
  </div>
</template>

<script>
export default {
  name: "OtherTree",
  //import引入的组件需要注入到对象中才能使用
  components: {},
  props: ["treeDataObj"],

  data() {
    return {
      expandedKeys: [],
      checkedKeys:[],
      searchValue: "",
      autoExpandParent: true,
      dataList: [], //gData重组完新数组
      selectTreeValue: null,
      checkStrictly:false,
    };
  },

  //监听属性 类似于data概念
  computed: {},

  //监控data中的数据变化
  watch: {
    treeDataObj:{
       immediate: true,
       deep: true,
       handler:function(newVal){
          this.treeDataObj = newVal;
          this.checkStrictly = newVal.checkStrictly;
          if(newVal.dataArr.length > 0){
            this.generateList(this.treeDataObj.dataArr);
          }
          //  checkedKeys
          if(newVal.checkedKeys instanceof Array){
            this.checkedKeys = [...newVal.checkedKeys];
          }
       },
    }
  },

  //方法集合
  methods: {
    onExpand(expandedKeys) {
      /***
       * 功能：tree是否展开
       */
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    generateList(data) {
      /***
       * 功能：重组
       * 参数：data:this.treeDataObj.dataArr;
       */
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        this.dataList.push({
          key: node.key,
          title: node.title,
          pId: node.pId,
          isLeaf:node.isLeaf,
          type:node.type,
        });
        if (node.children) {
          this.generateList(node.children, node.key);
        }
      }
      this.expandedKeys.push(this.dataList[0].key);
    },
    getParentKey(key, tree) {
      /***
       * 功能：过滤,返回与key值相同的数量
       * 参数：key:input输入的名称与里title匹配的key；tree:tree-data
       */
      let parentKey;
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
          if (node.children.some(item => item.key === key)) {
            parentKey = node.key;
          } else if (this.getParentKey(key, node.children)) {
            parentKey = this.getParentKey(key, node.children);
          }
        }
      }
      return parentKey;
    },
    onChange(e) {
      /**
       * 功能：input输入名称查询tree，若有查询结果，返回匹配数量
       * 参数:input输入值
       */
      const value = e.target.value;
      const expandedKeys = this.dataList
        .map(item => {
          if (item.title.indexOf(value) > -1) {
            return this.getParentKey(item.key, this.treeDataObj.dataArr); //若输入名称与tree--Data名称匹配的，传入匹配值的key，以及tree--Data；
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true
      });
    },
    
    onSelect(selectedKeys) {
      /***
       * 功能：tree的点击函数，并且把当前点击node传送给父组件
       * 参数：selectedKeys：key(当前点击的treeNode)
       */
      this.dataList.forEach(item => {
        if (item.key == selectedKeys) {
          this.selectTreeValue = item;
          this.$emit("accepttreeNode", this.selectTreeValue);
        }
      });
    },  
    onCheck (checkedKeys, info) {
      this.checkedKeys = checkedKeys;
      this.$emit('acceptCheckNode', checkedKeys);
    },
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},

  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    //   this.generateList(this.treeDataObj.dataArr);
  },

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
.otherTreeContainer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.otherTreeContainer>ul{
  flex: 1;
  overflow: auto;
}
.treeView,
.treeViewIsSearch {
  overflow-y: auto;
  overflow-x: auto;
}

.treeView{
  height: 100%;
}
.treeViewIsSearch{
  height: calc(100% - 50px);
}
.treeView::-webkit-scrollbar,
.treeViewIsSearch::-webkit-scrollbar {
  /* 轨道 */
  width: 2px;
  background: transparent;
}
.treeView::-webkit-scrollbar-thumb,
.treeViewIsSearch::-webkit-scrollbar-thumb {
  /* 滑块部分 */
  width: 2px;
  height: 8px;
  background: #dddddd;
}
</style>