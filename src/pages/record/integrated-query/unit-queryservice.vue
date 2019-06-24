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
    name:"UnitQueryservice",
    //import引入的组件需要注入到对象中才能使用
    components: {TableView},
    props:[""],

    data() {
        return {
                            
            tableTotalNum: 0,   //总页数：默认为0
            tableLoading:false,
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
                            title: '单位编号',
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
                        width: 60,
                        scopedSlots: { customRender: "cursorTitle" }   //鼠标滑上去tip显示当前，不写的话则不显示
                    },
                    {
                        title: "单位名称",
                        dataIndex: "companyName",
                        key: "companyName",
                        width: 350,
                        scopedSlots: { customRender: "cursorTitle" }
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
                    {
                        title: "统一社会信用代码",
                        dataIndex: "businessLicense",
                        key: "businessLicense",
                        width: 400,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "立户日期",
                        dataIndex: "registrationDate",
                        key: "registrationDate",
                        width: 200,
                        scopedSlots: { customRender: "cursorTitle" }
                    },
                    {
                        title: "单位状况",
                        dataIndex: "status",
                        key: "status",
                        //width: 60,
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
            }

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
            const _this =this;
            /***
             * 功能：点击查询按钮，根据子组件返回的结果重新获取table数据
             * 参数：condition:form查询结果：{}
            **/
            this.tableLoading = true;
            this.$http.fetchPost('multipleQuery@getCompanyInfoMultipleQueryList.action',{
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
                            key: element.id, //主键值
                            num: (pageNum - 1) * limitNum + index + 1, //序号
                            id: element.id, //id
                            companyName: element.companyName, //单位名称
                            companyContact: element.companyContact, //联系人
                            contactPhone: element.contactPhone, //联系电话
                            businessLicense: element.businessLicense, //统一社会信用代码
                            registrationDate: element.registrationDate, //立户日期
                            status: element.status, //单位状况
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