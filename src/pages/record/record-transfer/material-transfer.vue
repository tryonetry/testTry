<!-- template -->
<template>
<div class="outer">
      <TableView
          :initArrData="initArr"
          :totalCount="tableTotalNum"
          :filterTableCheck='filterTableCheck'
           @searchTable="getTableData"
           :loading="tableLoading"
      >

           <!-- tableFormSearch里添加其他按钮 -->
           <span slot="formAction">
               <a-button class="buttonOperate" type="primary" @click="addMaterial">添 加</a-button>
               <a-button class="buttonOperate" type="primary" @click="transfer" :loading="loading">移 交</a-button>
           </span>

      </TableView>

      <!-- addMaterial modal -->
      <div class="addMaterialModal">
        <a-modal
            centered
            title="人员新增材料接收记录"
            :visible="visible"
            @cancel="handleCancel"
            :width="'90%'"
            style="height:85%;overflow: hidden;"
            :footer="null"
            :maskClosable='false'
        >   
            <!-- modal table -->
            <TableView
                :initArrData="initArr1"
                :totalCount="tableTotalNum1"
                @searchTable="getTableData1"
                :loading="tableLoading1"
            >
                <div slot="tableAction" slot-scope="slotPropsData">
                    <a
                        href="javascript:;"
                        @click="openEdit(slotPropsData.currRowdata)"
                        data-type="浏览"
                        class="primaryBtnColor"
                    >添加</a>
                </div>
            </TableView>

            <a-modal
                centered
                title="添加人员材料"
                :visible="visible1"
                @cancel="handleCancel1"
                :width="'90%'"
                style="height:85%;overflow: hidden;"
                :maskClosable='false'
            >
                <template slot="footer">
                    <a-button key="back" @click="handleCancel1">取消</a-button>
                    <a-button key="submit" type="primary" :loading='saveConfirmLoading' @click="saveConfirm">添加</a-button>
                </template>
                <div class="editTableContainer">
                    <TableView :initArrData="initArr2" ref='editTable'>
                        <span slot="tableAction" ></span>
                        <!-- <div slot="tableAction" slot-scope="slotPropsData">
                            <a
                                href="javascript:;"
                                class="primaryBtnColor"
                            >删 除</a>
                        </div> -->
                    </TableView>
                </div>
            </a-modal>
        </a-modal>
        </div>

</div>
</template>

<script>
import TableView from "@/components/tableView";
export default {
    name:"MaterialTransfer",
    //import引入的组件需要注入到对象中才能使用
    components: {TableView},
    props:[""],

    data() {
        return {
                            
            tableTotalNum: 0,   //总页数：默认为0
            currentPage:1,
            tableLoading:false,
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
                            title: '公民身份号码/社保卡号',
                            type: "text",
                            required: false,
                            placeholder: "请输入公民身份号码/社保卡号",
                            key: "e0104",
                            name: "e0104",
                            val: void 0,
                            maxlength: 20,
                            minlength: 0,
                            reg: '',
                            tip: '',
                            postname:'e0104',
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
                            postname: "materialTransferStartDate-materialTransferEndDate",
                            status: '',
                            disabledDate: 'disabledEndDate',   //函数名：只能选今天和今天以前的
                            disabledStartDate: 'disabledStartDate',  //函数名：只能选今天和今天以后的
                        },
                        {
                            title: '经办人',
                            otherType: 'searchSelect',
                            required: false,
                            placeholder: "请选择经办人",
                            key: 'e0108',
                            name: 'e0108',
                            val: void 0,
                            children: [
                                {
                                    itemCode: '',
                                    itemName: '请选择经办人'
                                }
                            ],
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
                            postname: "e0109",
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
                        width: 60,
                        // scopedSlots: { customRender: "cursorTitle" }   //鼠标滑上去tip显示当前，不写的话则不显示
                    },
                    {
                        title: "姓名",
                        dataIndex: "e0102",
                        key: "e0102",
                        width: 150,
                        fixed: "left",
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "性别",
                        dataIndex: "e0103",
                        key: "e0103",
                        width: 80,
                    },
                    {
                        title: "身份证号",
                        dataIndex: "e0104",
                        key: "e0104",
                        width: 150,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "存档编号",
                        dataIndex: "e0101",
                        key: "e0101",
                        width: 200,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "接收日期",
                        dataIndex: "auCreateDate",
                        key: "auCreateDate",
                        width: 150,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "材料类别",
                        dataIndex: "e0105",
                        key: "e0105",
                        width: 100,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "材料名称",
                        dataIndex: "e0106",
                        key: "e0106",
                        width: 250,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "档案位置编号",
                        dataIndex: "e0107",
                        key: "e0107",
                        width: 200,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "经办人",
                        dataIndex: "e0108a",
                        key: "e0108a",
                        // width: 150,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "移交状态",
                        dataIndex: "e0109",
                        key: "e0109",
                        fixed: "right",
                        width: 150,
                        // scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "接收状态",
                        dataIndex: "e0112",
                        key: "e0112",
                        fixed: "right",
                        width: 150,
                        // scopedSlots: { customRender: "cursorTitle" }
                    },
                    
                    {
                        title: "在库状态",
                        dataIndex:'isInware',
                        key: "isInware",
                        width: 150,
                        fixed:'right'
                    }
                ],
                // table数据
                tabledataArr: [],
            },
            tableTotalNum1:0,
            tableLoading1:false,
            initArr1:{
                treeflag: false, 
                tableCheck: false, 
                superimposeWidth:true, //表格宽度叠加
                formData: {
                    //forminputs data
                    formInputs:[

                        //input
                        {
                            title: '姓名',
                            type: "text",
                            required: false,
                            placeholder: "请输入姓名",
                            key: "a0101",
                            name: "a0101",
                            val: void 0,
                            maxlength: 20,
                            minlength: 0,
                            reg: '',
                            tip: '',
                            postname:'e0102',
                            status: '',
                        },
                        {
                            title: '公民身份号码/社保卡号',
                            type: "text",
                            required: false,
                            placeholder: "请输入公民身份号码/社保卡号",
                            key: "a0184",
                            name: "a0184",
                            val: void 0,
                            maxlength: 20,
                            minlength: 0,
                            reg: '',
                            tip: '',
                            postname:'a0184',
                            status: '',
                        },
                        {
                            title: '存档编号',
                            type: "text",
                            required: false,
                            placeholder: "请输入存档编号",
                            key: "a0100a",
                            name: "a0100a",
                            val: void 0,
                            maxlength: 18,
                            minlength: 15,
                            reg: '',
                            tip: '',
                            postname:'a0100a',
                            status: '',
                        },
                    ],
                    
                    // form btns
                    formBtns: [
                        { title: "查询", htmltype: "submit", operate: "searchForm" },
                        { title: "重置", htmltype: "button", operate: "resetForm" }
                    ],
                },
                //table的表头
                columnsArr: [
                    {
                        title: "序号",
                        dataIndex: "num",
                        key: "num",
                        fixed: "left",
                        width: 150,
                        // scopedSlots: { customRender: "cursorTitle" }   //鼠标滑上去tip显示当前，不写的话则不显示
                    },
                    {
                        title: "姓名",
                        dataIndex: "a0101",
                        key: "a0101",
                        width: 300,
                        fixed: "left",
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "性别",
                        dataIndex: "a0104",
                        key: "a0104",
                        width: 200,
                    },
                    {
                        title: "身份证号",
                        dataIndex: "a0184",
                        key: "a0184",
                        width: 300,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "存档编号",
                        dataIndex: "a0100a",
                        key: "a0100a",
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "添加材料",
                        width: 300,
                        fixed:'right',
                        scopedSlots: { customRender: "action" }
                    }
                ],
                // table数据
                tabledataArr: [],
            },
            // 添加操作项
            initArr2:{
                isEditAndAdd:true,
                treeflag: false,
                tableCheck: false,
                noPagination:true, // 分页是否不显示
                bordered:true, // 表格 border 是否显示
                 
                formData:{},
                editableCol:[
                    'e0105_editSelectInput',
                    'e0106_editInput',
                    'e0106a_editDateInput',
                    'e0114_editInput',
                    "材料名称_requireTitle",
                    "材料类型_requireTitle",
                ],

                //可编辑列
                columnsArr: [
                    {
                        // title: "材料类型",
                        dataIndex: "e0105",
                        key: "e0105",
                        width: 200,
                        slots: { title: '材料类型_requireTitle' },
                        scopedSlots: { customRender: "e0105_editSelectInput" },
                        itemChildren:[]
                    },
                    {
                        // title: "材料名称",
                        dataIndex: "e0106",
                        key: "e0106",
                        width: 300,
                        slots: { title: '材料名称_requireTitle'},
                        scopedSlots: { customRender: "e0106_editInput" },
                    },
                    {
                        title: "接收日期",
                        dataIndex: "e0106a",
                        key: "e0106a",
                        width: 200,
                        scopedSlots: { customRender: "e0106a_editDateInput" },
                        dateFormat:'YYYY-MM-DD',
                    },
                    {
                        title: "备注",
                        dataIndex: "e0114",
                        key: "e0114",
                        width: 500,
                        scopedSlots: { customRender: "e0114_editInput" },
                    },
                    {
                        title: "操作",
                        scopedSlots: { customRender: "action" }
                    }
                ],
                
                tabledataArr: [
                    // {
                    //     key:0,
                    //     e0105:{code:void 0,name:''},
                    //     e0106:'bbb',
                    //     e0106a:'19950814',
                    //     e0114:'',
                    //     inEdit:false,
                    // }
                ],
            },
            visible:false,
            visible1:false,
            inEditPerson:null,
            tempCondition:{},
            tempCondition1:{},
            loading:false,
            saveConfirmLoading:false,
            
        };
    },

    //监听属性 类似于data概念
    computed: {
        checkTableData: function() {
            return this.$store.getters.getinfoTableCheckData;
        },
        directoryData:function(){
            if(this.$store.getters.getDirectoryData){
                this.splitDirectoryData(this.$store.getters.getDirectoryData);
                return this.$store.getters.getDirectoryData;
            }else{
                return null;
            }
        }
    },

    //监控data中的数据变化
    watch: {
        directoryData:{
            // 改变数据
            handler:function(newVal,oldVal){
                this.splitDirectoryData(newVal)
            },
            deep:true,//深度监听
        },
    },

    //方法集合
    methods: {
        
        // 拆分字典数据
        splitDirectoryData(data){
            if(!data) return;
            this.initArr2.columnsArr[0].itemChildren = data.catalog;
        },

        // 过滤 table 不可选择项
        filterTableCheck(record){
            return { 
                props: {
                    disabled: record.e0109  !== '待移交', // Column configuration not to be checked
                }
            }
        },

        // 获取数据
        getTableData(condition, pageNum, limitNum) {
            const _this = this;
            /***
             * 功能：点击查询按钮，根据子组件返回的结果重新获取table数据
             * 参数：condition:form查询结果：{}
             **/
            this.tempCondition = condition;
            this.tableLoading = true;
            this.currentPage = pageNum;
            this.$http.fetchPost('fileConnect@getConnectList.action',{
                page: pageNum,
                limit: limitNum,
                e0100:'1',
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
                            e0112:element.e0112 === "1" ? "待接收" : "已接收",
                            e0109:element.e0109 === "1" ? "待移交" : "已移交",
                            isInware:element.isInware === "2" ? "已转出" : "在库", 
                        });
                    });
                }else{
                    _this.$message.warning("抱歉,暂时未查到数据!");
                }
            }).catch(err => {
                _this.$message.error('抱歉,网络异常,请稍后重试');
            }).finally(end => {
                _this.tableLoading = false;
            })
        },

        // 移交
        transfer(){
            const _this = this;
            let strArr = "";
            // 抽取 id
            this.checkTableData.forEach(person => {
                strArr += person.e01000 + ","
            });
            // 提交 id 数组
            if(strArr.length > 0){
                this.loading = true;
                this.$http.fetchPost('fileConnect@turnTakeOver.action',{
                    strArr:strArr
                }).then(res => {
                    if(Number(res.code) === 0){
                        _this.$message.success("移交成功");
                        _this.getTableData(_this.tempCondition,this.currentPage,10)
                    }else{
                        _this.$message.warning("抱歉,移交失败,请重试")
                    }
                }).catch(err => {
                    _this.$message.error("抱歉,网络异常,请稍后重试")
                }).finally(end => {
                    // console.log(end);
                    _this.loading = false;
                })
            }else{
                _this.$message.warning("请至少选择一条数据进行操作");
            }
        },

        // 获取需选择的人员数据
        getTableData1(condition, pageNum, limitNum) {
            const _this = this;
            /***
             * 功能：点击查询按钮，根据子组件返回的结果重新获取table数据
             * 参数：condition:form查询结果：{}
             **/
            this.tempCondition1 = condition;
            this.tableLoading1 = true;
            this.$http.fetchPost('fileConnect@getPersonalList.action',{
                page: pageNum,
                limit: limitNum,
                e0100:'1',
                ...condition
            }).then((res)=>{
                if(Number(res.code) === 0){
                    this.tableTotalNum1 = res.count;
                    this.initArr1.tabledataArr = res.data;
                    this.initArr1.tabledataArr.forEach((element, index) => {
                        let tempState = String(element.transferOutState);
                        Object.assign(element,{
                            key:element.a01000,
                            num: (pageNum - 1) * limitNum + index + 1,
                            a0104:element.a0104 === '1' ? '男' : element.a0104 === '2' ? '女' : element.a0104 === '0' ? '未知的性别' : element.a0104 === '9' ? '未说明性别' : '',
                        });
                    });
                }else{
                    _this.$message.warning("抱歉,暂时未查到数据!");
                }
            }).catch(err => {
                _this.$message.error('抱歉,网络异常,请稍后重试');
            }).finally(end => {
                _this.tableLoading1 = false;
            })
        },

        addMaterial(){
            this.visible = true;
            this.initArr1.tabledataArr = [];
        },

        // 取消选择人员新增材料接收记录
        handleCancel(){
            this.visible = false;
        },

        // 添加
        openEdit(rowData){
            this.visible1 = true;
            this.inEditPerson = rowData;
        },

        // 关闭
        handleCancel1(){
            this.visible1 = false;
        },

        saveConfirm(){
            // console.log(this.inEditPerson)
            let postObjIsRight = true;
            let tablePostArr = [];
            this.$refs.editTable.getTableData().forEach(item => {
                let tempObj = {};
                for (let i in item){
                    if(typeof item[i] === "object"){
                        tempObj[i] = item[i].code
                    }else{
                        tempObj[i] = item[i];
                    }
                    if((i === "e0105" && !item[i].code && item[i].code !== 0) || (i === "e0106" && !item[i] && item[i] !== 0)){
                        postObjIsRight = false;
                    }
                }
                delete tempObj.inEdit;
                delete tempObj.key;
                tablePostArr.push(tempObj);
            });
            // 必填项不为空
            if(postObjIsRight && tablePostArr.length > 0){
                this.saveConfirmLoading = true;
                this.$http.fetchPost("fileConnect@saveCatalogList.action",{
                    personId:this.inEditPerson.a01000,
                    dataArr:JSON.stringify(tablePostArr)
                }).then(res => {
                    if(Number(res.code) === 0){
                        this.$message.success("添加成功");
                        this.getTableData(this.tempCondition,this.currentPage,10)
                        this.handleCancel1();
                    }else{
                        this.$message.warning("添加失败,请重试");
                    }
                }).catch(err => {
                    this.$message.error("抱歉,网络异常,请稍后重试");
                }).finally(end => {
                    this.saveConfirmLoading = false;
                })
            }else if(tablePostArr.length <= 0){
                this.$message.warning("请填写材料内容");
            }else{
                this.$message.warning("必填项不能为空");
            }
        },
    },

    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        const _this = this;

        // 初始化数据
        // this.getTableData(null,this.currentPage,10);

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
.editTableContainer{
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
}
</style>