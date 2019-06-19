<!-- template -->
<template>
<div class="outer">
      <TableView
          :initArrData="initArr"
          :totalCount="tableTotalNum"
          :filterTableCheck='filterTableCheck'
           @searchTable="getTableData"
      >

           <!-- tableFormSearch里添加其他按钮 -->
           <span slot="formAction">
               <a-button class="buttonOperate" type="primary" @click="transfer" :loading='loading'>移交</a-button>
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
    name:"RecordTransfer",
    //import引入的组件需要注入到对象中才能使用
    components: {TableView},
    props:[""],

    data() {
        return {
                            
            tableTotalNum: 0,   //总页数：默认为0
            // tableView传值方式
            initArr:{
                treeflag: false,   //左侧tree是否存在
                tableCheck: true, //table是否可以check
                // formInputs 传值方式
                formData: {
                    //forminputs data
                    formInputs:[

                        //input
                        {
                            title: '姓名',
                            type: "text",
                            required: false,
                            placeholder: "请输入姓名",
                            key: "e0102",
                            name: "e0102",
                            val: void 0,
                            maxlength: 20,
                            minlength: 0,
                            reg: '',
                            tip: '',
                            postname:'e0102',
                            status: '',
                        },
                        {
                            title: '身份证号/社保卡号',
                            type: "text",
                            required: false,
                            placeholder: "请输入身份证号/社保卡号",
                            key: "e0104",
                            name: "e0104",
                            val: void 0,
                            maxlength: 20,
                            minlength: 0,
                            reg: 'e0104',
                            tip: '',
                            postname:'',
                            status: '',
                        },
                        {
                            title: '存档编号',
                            type: "text",
                            required: false,
                            placeholder: "请输入存档编号",
                            key: "e0101",
                            name: "e0101",
                            val: void 0,
                            maxlength: 18,
                            minlength: 15,
                            reg: '',
                            tip: '',
                            postname:'e0101',
                            status: '',
                        },
                        // date
                        {
                            title: '接收日期',
                            otherType: 'daterange',
                            required: false,
                            placeholder: '选择接受日期',
                            key: "materialTransferStartDate-materialTransferEndDate",
                            name: "materialTransferStartDate-materialTransferEndDate",
                            val: [void 0 , void 0],
                            postname: "",
                            status: '',
                            disabledDate: 'disabledEndDate',   //函数名：只能选今天和今天以前的
                            disabledStartDate: 'disabledStartDate',  //函数名：只能选今天和今天以后的
                        },
                        {
                            title: '经办人名称',
                            otherType: 'searchSelect',
                            required: false,
                            placeholder: "请选择经办人",
                            key: 'e0108',
                            name: 'e0108',
                            postname: "e0108",
                            val: void 0,
                            children: [],
                            status: '',
                        },
                        // select/searchSelect
                        {
                            title: '移交状态',
                            otherType: 'select',
                            required: false,
                            placeholder: "请选择移交状态",
                            key: 'e0109',
                            name: 'e0109',
                            val: void 0,
                            children: [
                                {
                                    itemCode: '1',
                                    itemName: '未移交'
                                },
                                {
                                    itemCode: '0',
                                    itemName: '已移交'
                                },
                            ],
                            status: '',
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
                        width: 100,
                        // scopedSlots: { customRender: "cursorTitle" }   //鼠标滑上去tip显示当前，不写的话则不显示
                    },
                    {
                        title: "姓名",
                        dataIndex: "e0102",
                        key: "e0102",
                        fixed: "left",
                        width: 200,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "身份证号",
                        dataIndex: "e0104",
                        key: "e0104",
                        width: 250,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "性别",
                        dataIndex: "e0103",
                        key: "e0103",
                        width: 100,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "存档编号",
                        dataIndex: "e0101",
                        key: "e0101",
                        width: 250,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "经办人",
                        dataIndex: "e0108a",
                        key: "e0108a",
                        width: 200,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "状态",
                        dataIndex: "e0112",
                        key: "e0112",
                        // scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "在库状态",
                        dataIndex: "isInware",
                        key: "isInware",
                        fixed: "right",
                        width: 150,
                    },
                    // {
                    //     title: "操作",
                    //     key: "action",
                    //     scopedSlots: { customRender: "action" }
                    // }
                ],
                // table数据
                tabledataArr: [],
            },
            tempCondition:{},
            loading:false,
        };
    },

    //监听属性 类似于data概念
    computed: {
        checkTableData: function() {
            return this.$store.getters.getinfoTableCheckData;
        }
    },

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
        
        // 过滤 table 不可选择项
        filterTableCheck(record){
            return { 
                props: {
                    disabled: record.e0112  !== '待移交', // Column configuration not to be checked
                }
            }
        },
        getTableData(condition, pageNum, limitNum) {
            const _this = this;
            /***
             * 功能：点击查询按钮，根据子组件返回的结果重新获取table数据
             * 参数：condition:form查询结果：{}
             **/
            this.tempCondition = condition;
            this.$http.fetchPost('fileConnect@getConnectList.action',{
                page: pageNum,
                limit: limitNum,
                ...condition
            }).then((res)=>{
                if(Number(res.code) === 0){
                    this.tableTotalNum = res.count;
                    this.initArr.tabledataArr = res.data;
                    this.initArr.tabledataArr.forEach((element, index) => {
                        let tempState = String(element.transferOutState);
                        Object.assign(element,{
                            key:element.e01000,
                            num: (pageNum - 1) * limitNum + index + 1,
                            e0112:element.e0112 === "1" ? "待接收" : element.e0112 === "0" ? "已接收" : "待移交",
                            isInware:element.isInware === "2" ? "已转出" : "在库", 
                        });
                    });
                }else{
                    _this.$message.warning("抱歉,暂时未查到数据!");
                }
            })
        },

        transfer(){
            const _this = this;
            let strArr = [];
            // 抽取 id
            this.checkTableData.forEach(person => {
                strArr.push(person.e01000)
            });
            // 提交 id 数组
            if(strArr.length > 0){
                this.loading = true;
                this.$http.fetchPost('fileConnect@turnTakeOver.action',{
                    strArr:JSON.stringify(strArr)
                }).then(res => {
                    if(Number(res.code) === 0){
                        _this.message.success("移交成功");
                        _this.getTableData(_this.tempCondition,1,10)
                    }else{
                        _this.$message.warning("抱歉,移交失败,请重试")
                    }
                }).catch(err => {
                    _this.$message.error("抱歉,网络错误,请稍后重试")
                }).finally(end => {
                    console.log(end);
                    _this.loading = false;
                })
            }
            

        },
    },

    //生命周期 - 创建完成（可以访问当前this实例）
    created() {

        const _this = this;

        // 初始化数据
        this.getTableData(null,1,10);

        // 查询经办人
        this.$http.fetchGet('fileConnect@archTurnOverList.action',{})
            .then(res => {
                if(Number(res.code) === 0){
                    let personArr = [];
                    res.data.forEach(item => {
                        personArr.push({itemCode:item.e0108,itemName:item.e0108a})
                    });
                    _this.$set(_this.initArr.formData.formInputs[4],'children',personArr);
                }
            })
            .catch(err => {
                //...
            })
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