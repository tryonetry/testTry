<!-- template -->
<template>
<div class="outer">
      <TableView
          :initArrData="initArr"
          :totalCount="tableTotalNum"
           @searchTable="getTableData"
      >

           <!-- tableFormSearch里添加其他按钮 -->
           <span slot="formAction">
           </span>

           <!-- table操作列：操作按钮[备注：列的链接（slot='nameLink'）和图片参考['img']] -->
           <div slot="tableAction" slot-scope="slotPropsData">
               <a
                   href="javascript:;"
                   @click="operateFun(currentData=slotPropsData.currRowdata, 2)"
                   data-type="浏览"
                   class="primaryBtnColor"
               >浏览</a>
               <a
                   href="javascript:;"
                   @click="operateFun(currentData=slotPropsData.currRowdata, 3)"
                   data-type="编辑"
               >编辑</a>"
               <a-popconfirm
                   title="确定删除吗?"
                   okText="确定"
                   cancelText="取消"
                   @confirm="deleteFun(slotPropsData.currRowdata, slotPropsData.currTableData)"
               >
                   <a href="javascript:;" class="errorBtnColor">删除</a>
               </a-popconfirm>
            </div>
      </TableView>
</div>
</template>

<script>
import TableView from "@/components/tableView";
export default {
    name:"RolloutApply",
    //import引入的组件需要注入到对象中才能使用
    components: {TableView},
    props:[""],

    data() {
        return {
                            
            tableTotalNum: 0,   //总页数：默认为0
            // tableView传值方式
            initArr:{
                treeflag: false,   //左侧tree是否存在
                tableCheck: false, //table是否可以check
                // formInputs 传值方式
                formData: {
                    //forminputs data
                    formInputs:[

                        //input
                        {
                            title: '姓名',
                            type: "text",
                            required: false,
                            placeholder: "请输入申请人姓名",
                            key: "",
                            name: "",
                            val: void 0,
                            maxlength: 20,
                            minlength: 0,
                            reg: '',
                            tip: '',
                            postname:'',
                            status: '',
                        },
                        {
                            title: '存档编号',
                            type: "text",
                            required: false,
                            placeholder: "请输入存档编号",
                            key: "",
                            name: "",
                            val: void 0,
                            maxlength: 20,
                            minlength: 0,
                            reg: '',
                            tip: '',
                            postname:'',
                            status: '',
                        },
                        {
                            title: '单位名称',
                            type: "text",
                            required: false,
                            placeholder: "请输入单位名称",
                            key: "",
                            name: "",
                            val: void 0,
                            maxlength: 20,
                            minlength: 0,
                            reg: '',
                            tip: '',
                            postname:'',
                            status: '',
                        },

                        // date
                        {
                            title: '接收日期',
                            otherType: 'daterange',
                            required: false,
                            placeholder: '请选择接收日期',
                            key: "",
                            name: "",
                            val: void 0,
                            postname: "",
                            status: '',
                            disabledDate: 'disabledEndDate',   //函数名：只能选今天和今天以前的
                            disabledStartDate: 'disabledStartDate',  //函数名：只能选今天和今天以后的
                        },
                        
                    ],

                    // form btns
                    formBtns: [
                        { title: "查询", htmltype: "submit", operate: "searchForm" },
                        { title: "重置", htmltype: "button", operate: "resetForm" }
                    ]
                },
                //table的表头
                columnsArr: [
                    {
                        title: "序号",
                        dataIndex: "num",
                        key: "num",
                        fixed: "left",
                        width: 60,
                        scopedSlots: { customRender: "cursorTitle" }   //鼠标滑上去tip显示当前，不写的话则不显示
                    },
                    {
                        title: "姓名",
                        dataIndex: "",
                        key: "",
                        // width: 60,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "身份证号",
                        dataIndex: "",
                        key: "",
                        // width: 60,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "申请日期",
                        dataIndex: "",
                        key: "",
                        // width: 60,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "档案转往机构",
                        dataIndex: "",
                        key: "",
                        // width: 60,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "转往机构地址",
                        dataIndex: "",
                        key: "",
                        // width: 60,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "操作",
                        key: "action",
                        scopedSlots: { customRender: "action" }
                    }
                ],
                // table数据
                tabledataArr: [],
            }

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

        getTableData(condition, pageNum, limitNum) {
          /***
           * 功能：点击查询按钮，根据子组件返回的结果重新获取table数据
           * 参数：condition:form查询结果：{}
*         */

        }
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

</style>