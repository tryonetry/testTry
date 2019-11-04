<!-- template -->
<template>
<div class="outer">
        <TableView
            :initArrData="initArr"
            :totalCount="tableTotalNum"
            @searchTable="getTableData"
            :loading="tableLoading"
            :layout="innerModal"
        >

            <!-- tableFormSearch里添加其他按钮 -->
            <span slot="formAction">
            </span>

            <!-- 自定义列 -->
            <div slot="customizeInner" slot-scope="slotPropsData">
                <a-tooltip :title="slotPropsData.currRowdata.companyName" placement="bottom">
                    <span @click="openDetails(slotPropsData.currRowdata)" class="primaryBtnColor">{{slotPropsData.currRowdata.companyName}}</span>
                </a-tooltip>
            </div>

            <!-- table操作列：操作按钮[备注：列的链接（slot='nameLink'）和图片参考['img']] -->
            <div slot="tableAction" slot-scope="slotPropsData">
                <a
                    v-if="slotPropsData.currRowdata.status === '1'"
                    href="javascript:;"
                >正 常</a>
                <a
                    v-if="slotPropsData.currRowdata.status === '0'"
                    href="javascript:;"
                    class="warnBtnColor"
                >已销户</a>
                
                <a-popconfirm
                    title="确定恢复吗?"
                    okText="确定"
                    cancelText="取消"
                    @confirm="restore(slotPropsData.currRowdata)"
                    v-if="slotPropsData.currRowdata.status === '0'"
                >
                    <a href="javascript:;" class="primaryBtnColor">恢复</a>
                </a-popconfirm>
            </div>
        </TableView>

        <!-- 查看详情 -->
        <a-modal
            centered
            title="查看详情"
            :visible="visiable"
            @cancel="cancel"
            :width="'90%'"
            style="height:90%;overflow: hidden;"
            :maskClosable='false'
            :footer="null"
            class="detailModal"
        >
            <div class="detailModalCont">
                <a-tabs defaultActiveKey="1" :activeKey="activeKey" style="padding:10px;height:100%;" @change="tabChange">

                    <a-tab-pane tab="基础信息" key="1" forceRender>
                        <div class="infoCont">
                            <FormHeader :formTitle='"单位基本信息"'></FormHeader>
                            <ShowBasicInfo :baseData="baseInfoData" class="infoPart"></ShowBasicInfo>
                            <FormHeader :formTitle='"单位销户信息"'></FormHeader>
                            <ShowBasicInfo :baseData="destroyData" class="infoPart"></ShowBasicInfo>   
                        </div>
                    </a-tab-pane>

                    <a-tab-pane tab="代理人员" key="2" forceRender>
                        <TableView
                            :initArrData="initArr1"
                            :totalCount="tableTotalNum1"
                            @searchTable="getTableData1"
                            :loading="tableLoading1"
                            :initHeight="380"
                            ref="innerTable"
                        >
                            <span slot="formAction">
                                <JsonExcel :data="initArr1.tabledataArr" :fields="exportFiledsJson" :name='fieldsName'>
                                    <a-button class="buttonOperate" @click="exportList">导出人员列表</a-button>
                                </JsonExcel>
                            </span>
                        </TableView>
                    </a-tab-pane>

                </a-tabs>
            </div>
        </a-modal>
</div>
</template>

<script>
import FormHeader from "@/components/formHeader";
import ShowBasicInfo from '@/components/showBasicInfo';
import TableView from "@/components/tableView";
import JsonExcel from 'vue-json-excel';

export default {
    name:"UnitQueryservice",
    //import引入的组件需要注入到对象中才能使用
    components: {FormHeader, ShowBasicInfo,TableView,JsonExcel},
    props:[""],

    data() {
        return {
                            
            tableTotalNum: 0,   //总页数：默认为0
            tableTotalNum1:0,
            tableLoading:false,
            tableLoading1:false,
            tempCondition:null,
            tempCondition1:null,
            visiable:false,
            // tableView传值方式
            currRow:null,
            currIndex:0,
            activeKey:"1",
            initArr:{
                treeflag: false,   //左侧tree是否存在
                tableCheck: false, //table是否可以check
                // formInputs 传值方式
                formData: {
                    //forminputs data
                    formInputs:[
                        // select/searchSelect
                        {
                            title: '委托存档单位名称',
                            otherType: 'searchSelect',
                            required: false,
                            placeholder: "请选择(搜索)单位名称",
                            key: 'id',
                            name: 'id',
                            val: void 0,
                            children: [
                                {
                                    itemCode: '',
                                    itemName: ''
                                }
                            ],
                            postname:'id',
                            status: '',
                        },
                        //input
                        {
                            title: '委托存档单位编号',
                            type: "text",
                            required: false,
                            placeholder: "请输入单位编号",
                            key: "companyNumber",
                            name: "companyNumber",
                            val: void 0,
                            maxlength: 20,
                            minlength: 0,
                            reg: '',
                            tip: '',
                            postname:'companyNumber',
                            status: '',
                        },
                        {
                            title: '统一社会信用代码',
                            type: "text",
                            required: false,
                            placeholder: "请输入统一社会信用代码",
                            key: "businessLicense",
                            name: "businessLicense",
                            val: void 0,
                            maxlength: 20,
                            minlength: 0,
                            reg: '',
                            tip: '',
                            postname:'businessLicense',
                            status: '',
                        },

                        // date
                        {
                            title: '立户日期',
                            otherType: 'daterange',
                            required: false,
                            placeholder: '请选择立户日期',
                            key: "startDate-endDate",
                            name: "startDate-endDate",
                            val: void 0,
                            postname: "startDate-endDate",
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
                        width: 150,
                        scopedSlots: { customRender: "cursorTitle" }   //鼠标滑上去tip显示当前，不写的话则不显示
                    },
                    {
                        title: "委托存档单位编号",
                        dataIndex: "companyNumber",
                        key: "companyNumber",
                        width: 300,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "委托存档单位名称",
                        dataIndex: "companyName",
                        key: "companyName",
                        width: 350,
                        scopedSlots: { customRender: "customize" }
                    },
                    {
                        title: "联系人",
                        dataIndex: "companyContact",
                        key: "companyContact",
                        width: 200,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "联系电话",
                        dataIndex: "contactPhone",
                        key: "contactPhone",
                        width: 200,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    // {
                    //     title: "统一社会信用代码",
                    //     dataIndex: "businessLicense",
                    //     key: "businessLicense",
                    //     width: 300,
                    //     scopedSlots: { customRender: "cursorTitle" }
                    // },
                    {
                        title: "立户日期",
                        dataIndex: "tatsudoDate",
                        key: "tatsudoDate",
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "单位状况",
                        dataIndex: "status",
                        key: "status",
                        fixed:"right",
                        width: 250,
                        scopedSlots: { customRender: "action" }
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
            // 内部表格
            initArr1:{
                treeflag: false,
                tableCheck: false,
                superimposeWidth:true,
                formData: {
                    //forminputs data
                    formInputs:[
                        // select/searchSelect
                        {
                            title: '姓名',
                            type: 'text',
                            required: false,
                            placeholder: "请输入姓名",
                            maxlength: 20,
                            minlength: 0,
                            key: 'a0101',
                            name: 'a0101',
                            postname:'a0101',
                            val: void 0,
                            status: '',
                            colWidth:[12,24],
                        },
                        //input
                        {
                            title: '存档编号',
                            type: "text",
                            required: false,
                            placeholder: "请输入存档编号",
                            key: "a0100a",
                            name: "a0100a",
                            val: void 0,
                            maxlength: 20,
                            minlength: 0,
                            reg: '',
                            tip: '',
                            postname:'a0100a',
                            status: '',
                            colWidth:[12,24],
                        },
                        {
                            title: '公民身份号码/社保卡号',
                            type: "text",
                            required: false,
                            placeholder: "请输入公民身份号码/社保卡号",
                            key: "a0184",
                            name: "a0184",
                            val: void 0,
                            maxlength: 18,
                            minlength: 0,
                            reg: '',
                            tip: '',
                            postname:'a0184',
                            status: '',
                            colWidth:[12,24],
                        },
                        {
                            title: '请选择导出列',
                            otherType: 'searchSelect',
                            required: false,
                            placeholder: "请选择需要导出的列",
                            key: 'colsStr',
                            name: 'colsStr',
                            val: [],
                            children: [],  
                            status: '',
                            mode: 'multiple',
                            colWidth:[12,24],
                        },
                    ],

                    // form btns
                    formBtns: [
                        { title: "查询", htmltype: "submit", operate: "searchForm" },
                        { title: "重置", htmltype: "button", operate: "resetForm" },
                    ]
                },
                columnsArr:[
                    {
                        title: "序号",
                        dataIndex: "num",
                        key: "num",
                        fixed: "left",
                        width: 80,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "委托存档单位名称",
                        dataIndex: "a0202A",
                        key: "a0202A",
                        width: 150,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "姓名",
                        dataIndex: "a0101",
                        key: "a0101",
                        width: 150,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "性别",
                        dataIndex: "a0104",
                        key: "a0104",
                        width: 100,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "公民身份号码/社保卡号",
                        dataIndex: "a0184",
                        key: "a0184",
                        width: 200,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "出生日期",
                        dataIndex: "a0107",
                        key: "a0107",
                        width: 150,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "曾用名",
                        dataIndex: "a0139",
                        key: "a0139",
                        width: 150,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "籍贯",
                        dataIndex: "a0111",
                        key: "a0111",
                        width: 200,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "民族",
                        dataIndex: "a0117",
                        key: "a0117",
                        width: 100,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "户籍所在地",
                        dataIndex: "a0181",
                        key: "a0181",
                        width: 200,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "现居住地",
                        dataIndex: "a3711",
                        key: "a3711",
                        width: 250,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "婚姻状况",
                        dataIndex: "a0131",
                        key: "a0131",
                        width: 100,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "健康状况",
                        dataIndex: "a0127",
                        key: "a0127",
                        width: 100,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "政治面貌",
                        dataIndex: "a0141",
                        key: "a0141",
                        width: 150,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "参加工作日期",
                        dataIndex: "a0134",
                        key: "a0134",
                        width: 150,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "紧急联系人",
                        dataIndex: "partyDuties",
                        key: "partyDuties",
                        width: 150,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "电子邮箱",
                        dataIndex: "a3708",
                        key: "a3708",
                        width: 200,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "手机号码",
                        dataIndex: "a3707C",
                        key: "a3707C",
                        width: 150,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "备注",
                        dataIndex: "remarks",
                        key: "remarks",
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                ],
                tabledataArr:[],
            },
            // 展示的数据
            baseInfoData:[
                { label:"单位名称", val:void 0 ,name:'companyName'},
                { label:"单位编号", val:void 0 ,name:'companyNumber'},
                { label:"经营范围", val:void 0 ,name:'companyManagementRange'},
                { label:"单位性质", val:void 0 ,name:'companyNature'},
                { label:"单位联系人", val:void 0 ,name:'companyEmployeesNumber'},
                { label:"联系人电话", val:void 0 ,name:'companyRegisteredCapital'},
                { label:"法定代表人", val:void 0 ,name:'companyPostalAddress'},
                { label:"成立日期", val:void 0 ,name:'businessLicense'},
                { label:"立户日期", val:void 0 ,name:'companyContact'},
                { label:"代理人数", val:void 0 ,name:'enterpriseLegalPerson'},
                { label:"注册资本", val:void 0 ,name:'registrationDate'},
                { label:"单位地址", val:void 0 ,name:'tatsudoDate'},
                { label:"统一社会信用代码", val:void 0 ,name:'contactPhone'},
                { label:"邮政编码", val:void 0 ,name:'companyPostCodes'},
                { label:"传真号码", val:void 0 ,name:'contactFax'},
                { label:"电子邮箱", val:void 0 ,name:'contactEmail'},
                { label:"备注", val:void 0 ,name:'remarks',oneRow:true},
            ],
            destroyData:[
                { label:"统一社会信用代码", val:void 0 ,name:'businessLicense'},
                { label:"委托存档单位名称", val:void 0 ,name:'companyName'},
                { label:"销户时间", val:void 0 ,name:'closeDate'},
                { label:"销户原因", val:void 0 ,name:'respon'},
                { label:"经办人", val:void 0 ,name:'userId'},
            ],
            // 表单布局
            innerModal:{
                defaultCon: {
                    labelCol: {
                        sm: { span: 6 },
                        xl: { span: 6 },
                        xxl: { span: 6 }
                    },
                    wrapperCol: {
                        sm: { span: 18 },
                        xl: { span: 18 },
                        xxl: { span: 18 }
                    }
                },
            },
            // 导出列的json对象
            fieldsJson:null,
            exportFiledsJson:null,
            fieldsName:"xxxxxxxxxx",
        };
    },

    //监听属性 类似于data概念
    computed: {
        companyData:function(){
            if(this.$store.getters.getCompanyData){
                this.handlerCompanyData(this.$store.getters.getCompanyData);
                return this.$store.getters.getCompanyData
            }else{
                return null;
            }
        }
    },

    //监控data中的数据变化
    watch: {
        companyData:{
           handler:function(newVal){
               this.companyDataArr = newVal;
               this.handlerCompanyData(this.companyDataArr)
           },
           deep:true,//深度监听
        }
    },

    //方法集合
    methods: {
        handlerCompanyData(dataArr){
            this.initArr.formData.formInputs[0].children = [...dataArr].map((item)=>{
                return {itemCode:item.id,itemName:item.companyName}
            });
        },
        getTableData(condition, pageNum, limitNum) {
            const _this =this;
            /***
             * 功能：点击查询按钮，根据子组件返回的结果重新获取table数据
             * 参数：condition:form查询结果：{}
            **/
            this.tempCondition = condition;
            this.tableLoading = true;
            this.$http.fetchPost('multipleQuery@getCompanyInfoMultipleQueryList.action',{
                page: pageNum,
                limit: limitNum,
                ...condition
            }).then((res)=>{
                if(Number(res.code) === 0){
                    _this.tableTotalNum = res.count;
                    _this.initArr.tabledataArr = res.data;
                    _this.initArr.tabledataArr.forEach((element, index) => {
                        Object.assign(element,{
                            key: element.id, //主键值
                            num: (pageNum - 1) * limitNum + index + 1, //序号
                        });
                    });
                }else{
                    _this.$message.warning("抱歉,暂时未查到数据!");
                }
            }).catch(()=>{
                _this.$message.error("抱歉,网络异常,请稍后重试!");
            }).finally(end => {
                _this.tableLoading = false;
            })
        },

        getTableData1(condition, pageNum, limitNum){
            const _this =this;
            this.tempCondition1 = condition;
            this.tableLoading1 = true;
            this.$http.fetchPost('multipleQuery@queryAgentArchList.action',{
                page: pageNum,
                limit: limitNum,
                companyId:this.currRow.id,
                ...condition
            }).then((res)=>{
                if(Number(res.code) === 0){
                    _this.tableTotalNum1 = res.count;
                    _this.initArr1.tabledataArr = res.data;
                    this.initArr1.tabledataArr.forEach((element, index) => {
                        Object.assign(element,{
                            key: element.a01000, //主键值
                            num: (pageNum - 1) * limitNum + index + 1, //序号
                        });
                    });
                    _this.$refs.innerTable.tableBodyRize();
                }else{
                    _this.$message.warning("抱歉,暂时未查到数据!");
                }
            }).catch(()=>{
                _this.$message.error("抱歉,网络异常,请稍后重试!");
            }).finally(end => {
                _this.tableLoading1 = false;
            })
        },
        
        // 将数据插入到基础展示数据
        insertDataToBaseInfo(infoData,data){
            infoData.forEach(item => {
                Object.assign(item,{
                    val:data[item.name]
                });
            });
        },

        // 查看详情
        openDetails(currRowdata){
            this.currRow = currRowdata;
            this.activeKey = "1";
            const _this = this;
            // 获取数据
            if(currRowdata.id){
                this.$http.fetchPost("multipleQuery@getCompanyInfoById.action",{
                    id:currRowdata.id
                }).then(res => {
                    if(Number(res.code) === 0){
                        // console.log(res.data);
                        const {insertDataToBaseInfo,baseInfoData,destroyData} = this;
                        insertDataToBaseInfo(baseInfoData,res.data);
                        insertDataToBaseInfo(destroyData,res.data);
                        this.visiable = true;
                        
                    }else{
                        _this.$message.warning('抱歉,获取数据失败,请重试');
                    }
                }).catch(err => {
                    _this.$message.warning('抱歉,网络异常,请稍后重试');
                });
                
                this.getTableData1(this.tempCondition1,1,10);
            }
        },

        // close modal
        cancel(){
            this.visiable = false;
        },

        // change tab
        tabChange(index){
            this.activeKey = index;
            this.currIndex = Number(index);
            if(this.currIndex === 1) return;
        },
        
        // 恢复
        restore(currRow){
            this.$http.fetchPost('multipleQuery@changeCompanyStatus.action',{
                id:currRow.id
            }).then(res => {
                if(Number(res.coed) === 0){
                    this.$message.success('恢复成功!');
                    this.getTableData(this.tempCondition,1,10);
                }else{
                    this.$message.warning('抱歉,恢复失败,请重试!');
                }
            }).catch(err => {
                this.$message.error('抱歉,网络异常,请稍后重试!');
            })
        },

        // 导出列表
        exportList(){
            this.tempCondition1 = this.$refs.innerTable.getCondition();
            const {tempCondition1} = this;
            let currFiledsJsonObj = {};
            if(tempCondition1 && tempCondition1['colsStr'] && tempCondition1['colsStr'].length > 0){
                for(let key in this.fieldsJson){
                    for(let i = 0; i< tempCondition1['colsStr'].length; i++){
                        if(tempCondition1['colsStr'][i] === this.fieldsJson[key]){
                            currFiledsJsonObj[key] = this.fieldsJson[key];
                        }
                    }
                }
            } else{
                currFiledsJsonObj = this.fieldsJson;
            }
            this.exportFiledsJson = currFiledsJsonObj;
        },
    },

    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        // console.log(this.companyDataArr)
        // this.getTableData(null,1,10);
        // 生成导出列的Json对象 和 生成选择的导出列的 options
        let tempJson = {};
        let tempSelectOptions = [];
        this.initArr1.columnsArr.forEach(item => {
            tempSelectOptions.push({itemCode:item.dataIndex,itemName:item.title})
            tempJson[item.title] = item.dataIndex;
        });
        tempJson = JSON.parse(JSON.stringify(tempJson));
        this.initArr1.formData.formInputs[3].children = tempSelectOptions;
        this.fieldsJson = tempJson;
        // console.log(this.fieldsJson)
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
    .detailModalCont{
        height: 100%;
    }
    .infoCont{
        height: 100%;
        overflow-y: auto;
    }
    .infoPart{
        padding-bottom: 40px;
    }
</style>