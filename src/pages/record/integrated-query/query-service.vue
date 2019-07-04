<!-- template -->
<template>
<div class="outer">
        <TableView
            :initArrData="initArr"
            :totalCount="tableTotalNum"
            @searchTable="getTableData"
            :loading="tableLoading"
        >

            <!-- tableFormSearch里添加其他按钮 -->
            <span slot="formAction">
            </span>

            <!-- 自定义列 -->
            <div slot="customizeInner" slot-scope="slotPropsData">
                <span @click="openDetails(slotPropsData.currRowdata)" class="primaryBtnColor">{{slotPropsData.currRowdata.a0101}}</span>
            </div>

        </TableView>

        <!-- 查看详情 -->
        <a-modal
            centered
            title="查看详情"
            :visible="visiable"
            @cancel="cancel"
            :width="'96%'"
            style="height:96%;overflow: hidden;"
            :maskClosable='false'
            :footer="null"
            class="detailModal"
        >
            <div class="detailModalCont">
                <a-tabs defaultActiveKey="1" style="padding:10px;height:100%;" @change="tabChange">
                    <a-tab-pane tab="基础信息" key="1" forceRender>

                    </a-tab-pane>
                    <a-tab-pane tab="委托存档单位信息" key="2" >
                        <TableView
                            :initArrData="initArr1"
                            :totalCount="tableTotalNum1"
                            @searchTable="getTableData1"
                            :loading="tableLoading1"
                        ></TableView>
                    </a-tab-pane>
                    <a-tab-pane tab="转入信息" key="3" >
                        <TableView
                            :initArrData="initArr2"
                            :totalCount="tableTotalNum1"
                            @searchTable="getTableData1"
                            :loading="tableLoading1"
                        ></TableView>
                    </a-tab-pane>
                    <a-tab-pane tab="转出信息" key="4" >
                        <TableView
                            :initArrData="initArr3"
                            :totalCount="tableTotalNum1"
                            @searchTable="getTableData1"
                            :loading="tableLoading1"
                        ></TableView>
                    </a-tab-pane>
                </a-tabs>
            </div>
        </a-modal>
</div>
</template>

<script>
import TableView from "@/components/tableView";
export default {
    name:"QueryService",
    //import引入的组件需要注入到对象中才能使用
    components: {TableView},
    props:[""],

    data() {
        return {
                            
            tableTotalNum: 0,   //总页数：默认为0
            tableTotalNum1:0,
            tableLoading:false,
            tableLoading1:false,
            visiable:true,
            // tableView传值方式
            initArr:{
                treeflag: false,   //左侧tree是否存在
                tableCheck: false, //table是否可以check
                // formInputs 传值方式
                formData: {
                    //forminputs data
                    formInputs:[
                        // select/searchSelect
                        {
                            title: '单位名称',
                            otherType: 'searchSelect',
                            required: false,
                            placeholder: "请选择(搜索)单位名称",
                            key: 'companyId',
                            name: 'companyId',
                            val: void 0,
                            children: [],
                            status: '',
                        },
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
                            postname:'',
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
                            maxlength: 20,
                            minlength: 0,
                            reg: '',
                            tip: '',
                            postname:'',
                            status: '',
                        },
                        {
                            title: '身份证号/社保卡号',
                            type: "text",
                            required: false,
                            placeholder: "请输入身份证号/社保卡号",
                            key: "a0184",
                            name: "a0184",
                            val: void 0,
                            maxlength: 20,
                            minlength: 0,
                            reg: '',
                            tip: '',
                            postname:'',
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
                        scopedSlots: { customRender: "cursorTitle" }   //鼠标滑上去tip显示当前，不写的话则不显示
                    },
                    {
                        title: "姓名",
                        dataIndex: "a0101",
                        key: "a0101",
                        width: 150,
                        scopedSlots: { customRender: "customize" }
                    },
                    {
                        title: "身份证号",
                        dataIndex: "a0184",
                        key: "a0184",
                        width: 250,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "手机号码",
                        dataIndex: "a3707c",
                        key: "a3707c",
                        width: 150,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "存档编号",
                        dataIndex: "a3714",
                        key: "a3714",
                        width: 150,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "单位名称",
                        dataIndex: "a0888",
                        key: "a0888",
                        width: 250,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "单位编号",
                        dataIndex: "companyNumber",
                        key: "companyNumber",
                        width: 150,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "档案位置编号",
                        dataIndex: "shelvesNo",
                        key: "shelvesNo",
                        width: 150,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "存档日期",
                        dataIndex: "uCreateDate",
                        key: "uCreateDate",
                        scopedSlots: { customRender: "cursorTitle" }
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
            initArr1:{
                treeflag: false,
                tableCheck: false,
                noPagination:true,
                columnsArr:[
                    {
                        title: "序号",
                        dataIndex: "num",
                        key: "num",
                        fixed: "left",
                        width: 100,
                    },
                    {
                        title: "单位立户号",
                        dataIndex: "b0102",
                        key: "b0102",
                        width: 150,
                    },
                    {
                        title: "委托存档单位名称",
                        dataIndex: "b0101",
                        key: "b0101",
                        width: 250,
                    },
                    {
                        title: "组织机构代码",
                        dataIndex: "b0114",
                        key: "b0114",
                        width: 150,
                    },
                    {
                        title: "单位性质",
                        dataIndex: "b0103",
                        key: "b0103",
                        width: 150,
                    },
                    {
                        title: "所属行业",
                        dataIndex: "b0134",
                        key: "b0134",
                        width: 200,
                    },
                    {
                        title: "经济类型",
                        dataIndex: "b0105",
                        key: "b0105",
                        width: 200,
                    },
                    {
                        title: "行政区划",
                        dataIndex: "b0107",
                        key: "b0107",
                    },
                ],
                tabledataArr:[],
            },
            initArr2:{
                treeflag: false, 
                tableCheck: false, 
                columnsArr:[],
                tabledataArr:[],
            },
            initArr3:{
                treeflag: false, 
                tableCheck: false, 
                columnsArr:[],
                tabledataArr:[],
            },

        };
    },

    //监听属性 类似于data概念
    computed: {
        companyData:function(){
            return this.$store.getters.getCompanyData
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

        getTableData(condition, pageNum, limitNum) {
            const _this = this;
            /***
             * 功能：点击查询按钮，根据子组件返回的结果重新获取table数据
             * 参数：condition:form查询结果：{}
            **/
            this.tableLoading = true;
            this.$http.fetchPost('multipleQuery@getPersonalArchMultipleQueryList.action',{
                page: pageNum,
                limit: limitNum,
                ...condition
            }).then((res)=>{
                if(Number(res.code) === 0){
                    _this.tableTotalNum = res.count;
                    let tempTableData = res.data;
                    this.initArr.tabledataArr = [];
                    tempTableData.forEach((element, index) => {
                        this.initArr.tabledataArr.push({
                            key: element.a01000, //主键值
                            num: (pageNum - 1) * limitNum + index + 1, //序号
                            a01000: element.a01000, //id
                            a0101: element.a0101, //姓名
                            a0184: element.a0184, //身份证号
                            a3707c: element.a3707c, //联系电话
                            a3714:element.a3714, //存档编号
                            a0888: element.a0888, //单位名称
                            companyNumber: element.companyNumber, //单位编号
                            shelvesNo: element.shelvesNo, //档案位置号
                            uCreateDate: element.uCreateDate, //存档日期
                        });
                    });
                }else{
                    _this.$message.warning("抱歉,暂时未查到数据!");
                }
            }).catch(err => {
                _this.$message.warning("抱歉,网络异常,请稍后重试!");
            }).finally(end => {
                _this.tableLoading = false;
            })
        },

        getTableData1(){

        },

        // 查看详情
        openDetails(){
            this.visiable = true;
        },

        // close modal
        cancel(){
            this.visiable = false;
        }

    },

    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        this.getTableData(null,1,10);
        this.initArr.formData.formInputs[0].children = [...this.companyData].map((item)=>{
            return {itemCode:item.id,itemName:item.companyName}
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