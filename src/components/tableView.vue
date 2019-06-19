<template>
  <div class="viewContainer">
    <div class="organ_tree" v-if="treeFlag">
      <OrganTree @sendTreeValue="acceptTreeValue"></OrganTree>
    </div>
    <div :class="treeFlag ? 'viewContent' : 'noviewContent'">
      <TableFromSearch :formDataArr="formData" @searchForm="searchFormFun" @bundleChange="bundleChangeFun">
        <slot name="formAction"></slot>
      </TableFromSearch>

      <div class="tableCon" v-if="!isHasNotTable" ref="tableCon">


        <!-- checkbox -->
        <a-table
          :columns="columns"
          :dataSource="tabledata"
          :rowSelection="tablecheck ? {onSelect:onSelect, onSelectAll:onSelectAll,getCheckboxProps:getCheckboxProps} : null"
          :scroll="isEditAndAdd ? {x:tableWidth} :{ x: tableWidth,y:tableHeight}"
          :pagination="false"
          :bordered="bordered"
        >

          <!-- 表格页脚 (添加时候显示) -->
          <template v-if="isEditAndAdd" slot="footer" slot-scope="currentPageData">
            <div class="addBtn" @click="addList">
              <a-icon type="plus" style="color:#666"/>
            </div>
          </template>
          <!-- ####################################### 此处是自定义列 ############################### -->

          <!-- 操作按钮 -->
          <span slot="action" slot-scope="text, record">
            <slot name="tableAction" :currRowdata="record" :currTableData="tabledata">table操作按钮</slot>
          </span>

          <!-- 鼠标放上去显示当前行数据 -->
          <span slot="cursorTitle" slot-scope="text, record">
            <a-tooltip :currRowdata="record" placement="bottom">
              <template slot='title'>
                {{text}}
              </template>
              {{text}}
            </a-tooltip>
          </span>

          <!-- 连接 -->
          <span slot="nameLink" slot-scope="text, record">
            <a
              href="javascript:void(false);"
              class="tableLink"
              :currRowdata="record"
            >{{record.name}}</a>
          </span>

          <!-- 图片 -->
          <div slot="img" slot-scope="text, record" class="tableImg">
            <img :src="record.photo" alt="">
          </div>
          <!-- { "key": 0, "index": 0, "inEdit": { "e0105": false, "e0106": true }, "e0105": "aaa", "e0106": "bbb", "e0106a": "ccc", "e0114": "ddd" } aaa -->


          <!-- 普通输入框可编辑列 -->
          <!-- <div slot="editInput" slot-scope="text, record ,index" v-if='columns && (record.index || record.index === 0)' @click='changeEdit($event)'>
            {{$event}}
            <a-input v-model="text"></a-input>
            <span>{{text}}</span>
          </div> -->

          <template slot="editInput" slot-scope="text, record">
          <EditInput :text="text" @change="onCellChange(record.key, 'name', $event)"/>
        </template>

          <!-- 日期可编辑列 -->
          <div slot="editDateInput" slot-scope="text, record">

          </div>

          <!-- 下拉框入框可编辑列 -->
          <div slot="editSelectInput" slot-scope="text, record">

          </div>

          <!-- 可搜索下拉框可编辑列 -->
          <div slot="editSearchSelectInput" slot-scope="text, record">

          </div>
          <!-- ####################################### 此处是自定义列 ############################### -->
        </a-table>
        
      </div>
      <div class="pagination_view" v-if="!isHasNotTable && !noPagination">
        <a-pagination
          v-model="currentPageNum"
          :total="tableTotalCount"
          :showTotal="total => `共 ${total} 条`"
          @change="changePagination"
        />
      </div>
    </div>
  </div>
</template>

<script>
import OrganTree from "@/components/organTree";
import TableFromSearch from "@/components/tableFormSearch";
import { isMoment } from 'moment';
import { setTimeout } from 'timers';
import utils from '../utils/util';

export default {
  name: "TableView",
  components: {
    OrganTree,
    TableFromSearch,
  },
  props: ["initArrData", "totalCount","filterTableCheck"],
  data() {
    return {
      formData: [], //表格上方form
      organData: [], //左侧树tree数据
      treeFlag: Boolean, //左侧树是否存在
      isHasNotTable: Boolean, //table是否存在： true：不存在， false：存在
      columns: [], //table表头
      tabledata: [], //table数据
      tablecheck: Boolean, //table是否可以选择
      tableTotalCount: 0,
      currentPageNum: 1,
      condition:{},  //子组件的查询结果
      tableWidth:"100%",
      tableHeight:450, // 设置table滚动的高度
      timer:null, //监听器
      bordered:false, // 边框默认 false
    };
  },
  watch: {
    initArrData: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (newVal) {
          this.treeFlag = newVal.treeflag;
          this.noPagination = newVal.noPagination;
          this.bordered = newVal.bordered ? newVal.bordered : false;
          this.isEditAndAdd = newVal.isEditAndAdd ? newVal.isEditAndAdd : false;
          this.superimposeWidth = newVal.superimposeWidth ? newVal.superimposeWidth : false;
          this.formData = newVal.formData;
          this.columns = newVal.columnsArr;
          this.tabledata = newVal.tabledataArr;
          this.tablecheck = newVal.tableCheck;
          this.isHasNotTable = newVal.isHasNotTable;
          sessionStorage.setItem(
            "hctabledata",
            JSON.stringify(newVal.tabledataArr)
          );

          // 宽度溢出
          this.$nextTick(function(){
            
            let theadWidthArr = [];
            let fixedLeftNum = 0;
            newVal.columnsArr.forEach((col,i) => {
              // 不固定且有宽度的 push
              if(col.width && col.width > 0 && !col.fixed){
                theadWidthArr.push(col.width);
              }
              if(col.fixed === 'left'){
                fixedLeftNum += 1;
              }

            });
            if(newVal.tableCheck) fixedLeftNum += 1;
            let theadWidthArrLen = theadWidthArr.length;
            let thDom = document.querySelectorAll('.tableCon .ant-table-thead th');
            let trDom = document.querySelectorAll('.tableCon .ant-table-tbody tr');
            // console.log(theadWidthArrLen);
            [].forEach.call(trDom,(item,index) => {
              [].forEach.call(item.childNodes,(td,tdIndex) => {
                
                if(newVal.tableCheck){
                  if(tdIndex !== 0 && td.getAttribute('class') !== 'ant-table-fixed-columns-in-body' && theadWidthArr[tdIndex-fixedLeftNum]){
                    td.style.maxWidth = theadWidthArr[tdIndex-fixedLeftNum]+'px';
                  }
                }else {
                  if(td.getAttribute('class') !== 'ant-table-fixed-columns-in-body' && theadWidthArr[tdIndex-fixedLeftNum]){
                    td.style.maxWidth = theadWidthArr[tdIndex-fixedLeftNum]+'px';
                  }
                }

                // td.setAttribute('max-height',)
              })
            });

          });

        }
        
      }

    },
    totalCount: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal) {
          this.tableTotalCount = newVal;
        }
      }
    },

  },
  created() {

  },
  mounted() {
    const _this = this;
    
    // 监听窗口改变 - setTimeout 阻塞
    setTimeout(function(){
      _this.tableHeight = _this.$refs.tableCon.clientHeight - 52;
      
      let currScreenWidth = _this.treeFlag ? 1920-280-240 : 1920-280;
      let tempWidth = 0;
      
      _this.initArrData.columnsArr.forEach(el => {
        if(el.width){
          tempWidth += Number(el.width);
        }
      });
      tempWidth +=  200;
      if(tempWidth > currScreenWidth || _this.superimposeWidth){
        currScreenWidth = tempWidth
      }
      _this.tableWidth = utils.detectZoom()/100 * currScreenWidth;
    },0);

    window.onresize = function(){
      _this.$nextTick(function(){
        
        let currScreenWidth = _this.treeFlag ? 1920-280-240 : 1920-280;
        
        let tempWidth = 0;
        _this.initArrData.columnsArr.forEach(el => {
          if(el.width){
            tempWidth += Number(el.width);
          }
        });
        tempWidth +=  200;
        if(tempWidth > currScreenWidth){
          currScreenWidth = tempWidth
        }

        _this.tableHeight = _this.$refs.tableCon.clientHeight - 52;
        _this.tableWidth = utils.detectZoom()/100 * currScreenWidth;
      });
    }

  },
  destroyed(){
    window.onresize = null;
  },
  methods: {
    getCondition(){
      return this.condition;
    },
    bundleChangeFun(value){
      /**
       * 监听子组件：tableFormSearch上值是否发生变化；当发生变化则修改this.condition的值；
       */
      this.condition = value;
    },
    acceptTreeValue(value) {
      /***
       * 功能:接收子组件选择的treeNode值
       * 参数：value：子组件上选择的treeNode
       */
      this.condition = Object.assign({}, this.condition, {upUnitId: value['key'], type: value['type']});
      this.$emit("accepttreeNode", value, this.condition); //把treeNode选择得值派发给父组件：info-poll

    },
    searchFormFun(data) {
      /***
       * 功能：调用父组件的searchTable函数，重新获取tableData值
       * data:form点击查询按钮获取需要的查询结果
       */
      data.forEach(element => {

        let elName = element.name;
        if(elName.indexOf('-') >= 0 && element.val instanceof Array && elName.split('-').length === element.val.length){

          //val值为数组,name为-隔开的
          let elNameArr = elName.split('-');
          elNameArr.forEach((item,index)=>{
            if(isMoment(element.val[index])){
              this.condition[item] = element.val[index].format('YYYY-MM-DD')
            }else{
              this.condition[item] = element.val[index];
            }
          });

        }else if(elName.indexOf('-') < 0){
          if (element.val) {
            this.condition[element.name] = element.val;
          } else {
            this.condition[element.name] = "";
          }
        }
      });
      this.$emit("searchTable", this.condition, 1, 10);
      // this.tabledata = this.$parent.initArr.tabledataArr;
      this.currentPageNum = 1;
    },
    onSelect(record,selected,selectedRows) {
      /***
       * 功能：checbox-table选择表格数据
       * 参数：record:当前行； selected:true/false; selectedRows:[]选择的数据
       */
      this.$store.dispatch('getinfoTableCheckData',selectedRows);
    },
    onSelectAll(selected, selectedRows, changeRows) {
      //table全选
      this.$store.dispatch('getinfoTableCheckData',selectedRows);
    },

    getCheckboxProps(record){
      if(this.filterTableCheck && this.filterTableCheck instanceof Function){
        return this.filterTableCheck(record);
      }else{
        return record => {
          return {props:{}}
        }
      }
    },

    changeTableData() {
      //更新table
      this.tabledata = this.$parent.initArr.tabledataArr;
    },
    changePagination(page, pageSize){
      //换页：page:当前page; pageSize:当前页得显示数据数量
      this.$emit('searchTable', this.condition, page, pageSize);
    },

    changeEdit(e){
      e.inEdit = true;
    },

    // 添加数据
    addList(){

      if(this.columns.length <= 0) return;

      // 添加空行
      let emptyRow = {};
      this.columns.forEach(item => {
        if(item.dataIndex){
          emptyRow[item.dataIndex] = void 0;
          emptyRow['key'] = this.tabledata.length;
          emptyRow['index'] = this.tabledata.length;
        }
      });
      this.tabledata.push(emptyRow);
    }
  },
  computed:{
    
  }
};
</script>

<style scoped>

.viewContainer {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #fff;
}
.organ_tree {
  width: 14%;
  min-width: 170px;
  height: 100%;
  float: left;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  padding: 10px 12px;
}

.viewContent,
.noviewContent {
  height: 100%;
  float: right;
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
}

.viewContent {
  width: 86%;
  max-width: calc(100% - 170px);
}

.noviewContent {
  width: 100%;
}
.tableLink {
  color: #2d8cf0;
}
.pagination_view {
  margin: 20px;
  display: flex;
  justify-content: flex-end;
}

.tdOverflow{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  display: inline-block;
  max-width: 300px;
}

.tableCon{
  flex: 1;
  overflow-y: hidden;
}
.tableCon .ant-table-wrapper{
  height: 100%;
}
.tableImg{
  height: 50px;
}
.tableImg>img{
  height: 100%;
}
.addBtn{
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 17px;
  box-sizing: border-box;
  cursor: pointer;
}
</style>