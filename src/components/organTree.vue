<template>
  <div class="treeContainer">
    <a-input-search style="margin-bottom: 8px" placeholder="请输入搜索机构名称" @change="onChange"/>
    <a-directory-tree
      class="treeView"
      @expand="onExpand"
      :expandedKeys="expandedKeys"
      :autoExpandParent="autoExpandParent"
      :treeData="gData"
      @select="onSelect"
      treeNodeFilterProp="title"
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
  name: "OrganTree",
  props: [],
  data() {
    return {
      expandedKeys: ['01'],
      searchValue: "",
      autoExpandParent: true,
      dataList: [], //gData重组完新数组
      selectTreeValue: null,
      // filterDataArr: []
    };
  },
  watch: {},
  computed: {
    gData: {
      get() {
        this.generateList(this.$store.getters.getInfoPollTreeData);
        return this.$store.getters.getInfoPollTreeData;
      },
      set(val) {
        this.$store.state.infoPollTreeData = val;
      }
    }
  },
  created() {},
  mounted() {},
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
       * 功能：gData重组
       * 参数：data:gData;
       */
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        // if(node.isParent === "false")
        this.dataList.push({
          key: node.key,
          title: node.title,
          pId: node.pId,
          type: node.type,
          isLeaf:node.isParent === "false" && node.key.length > 10 ? true:null,
        });
        
        if (node.children) {
          this.generateList(node.children, node.key);
        }
      }
    },

    getParentKey(key, tree) {
      /***
       * 功能：过滤gData,返回与key值相同的数量
       * 参数：key:input输入的名称与gData里title匹配的key；tree:gData
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
       * 功能：input输入名称查询gData，若有查询结果，返回匹配数量
       * 参数:input输入值
       */
      const value = e.target.value;
      const expandedKeys = this.dataList
        .map(item => {
          if (item.title.indexOf(value) > -1) {
            return this.getParentKey(item.key, this.gData); //若输入名称与gData名称匹配的，传入匹配值的key，以及gData；
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
          this.$emit("sendTreeValue", this.selectTreeValue);
        }
      });
    },

    // filterData(keyVal, treeDatalist) {
    //   //tree:过滤出本身以及所有的父结点
    //   treeDatalist.forEach(item => {
    //     if (item.key == keyVal) {
    //       this.filterDataArr.push(item);
    //       this.filterData(item.pId, treeDatalist);
    //     }
    //   });

    //   // let newArr = new Set([...this.filterDataArr]);
    //   this.recontrucData(this.uniqueData(this.filterDataArr));
    // },
    // uniqueData(dataArr) {
    //   //数组去重
    //   let temp = [];
    //   dataArr.forEach(item => {
    //     if (temp.indexOf(item) == -1) {
    //       temp.push(item);
    //     }
    //   });
    //   return temp;
    // },
    // recontrucData(uniqdata) {
    //   //重组treeData
    //   let newTreeData = [];
    //   if (!Array.isArray(uniqdata)) {
    //     return newTreeData;
    //   }
    //   uniqdata.forEach(item => {
    //     delete item.children;
    //   });
    //   let map = {};
    //   uniqdata.forEach(item => {
    //     map[item.key] = item;
    //   });
    //   uniqdata.forEach(item => {
    //     let parent = map[item.pId];
    //     if (parent) {
    //       (parent.children || (parent.children = [])).push(item);
    //     } else {
    //       newTreeData.push(item);
    //     }
    //   });
    //   this.gData = newTreeData;
    // }
  }
};
</script>
<style scoped>
.treeContainer{
  height: 100%;
}
.treeView{
  overflow-y:auto;
  overflow-x: auto;
  height:calc(100% - 50px);
}
.treeView::-webkit-scrollbar{
  /* 轨道 */
  width: 2px;
  background: transparent;
}
.treeView::-webkit-scrollbar-thumb{
  /* 滑块部分 */
  width: 2px;
  height: 8px;
  background: #dddddd;
}
</style>
