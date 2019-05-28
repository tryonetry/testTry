# talent-backend

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


### tableFormSearch  类型区分
input            type              "text"
下拉框           otherType         "select"
可搜索下拉框      otherType         "searchSelect"
树状下拉框        otherType         "treeselect"
省市区三级联动    otherType         "addressSelect"
时间(年月日)      otherType         "date"
时间(月)          otherType         "month"
时间(范围)        otherType         "daterange"
多行文本          otherType         "textarea"

### tableView  DOM结构
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
            >编辑</a>
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




### tableView传值方式
data(){
    return{
        tableTotalNum: 0,   //总页数：默认为0
        <!-- tableView传值方式 -->
        initArr:{
            treeflag: true,   //左侧tree是否存在
            tableCheck: true, //table是否可以check
            <!-- formInputs 传值方式 -->
            formData: {
                <!-- forminputs -->
                formInputs:[
                <!-- input: -->
                    {
                        title: '',
                        type: "text",
                        required: true,
                        placeholder: "",
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
                    <!-- date: -->
                    {
                        title: '',
                        otherType: '',  
                        required: false,
                        placeholder: '',
                        key: "",
                        name: "",
                        val: void 0,
                        postname: "",
                        status: '',
                        disabledDate: 'disabledEndDate',   //函数名：只能选今天和今天以前的
                        disabledStartDate: 'disabledStartDate',  //函数名：只能选今天和今天以后的
                    },
                    <!-- select/searchSelect: -->
                    {
                        title: '',
                        otherType: 'searchSelect',
                        required: true,
                        placeholder: "",
                        key: '',
                        name: '',
                        val: void 0,
                        children: [
                            {
                                itemCode: '',
                                itemName: ''
                            }
                        ],  
                        status: '',
                    },
                ],
                <!-- form btns -->
                formBtns: [
                    { title: "查询", htmltype: "submit", operate: "searchForm" },
                    { title: "重置", htmltype: "button", operate: "resetForm" }
                ]
            },
            <!-- table的表头 -->
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
                    title: "",
                    dataIndex: "",
                    key: "",
                    width: ,
                    scopedSlots: { customRender: "cursorTitle" }
                },
            ],   
            <!-- table数据 -->
            tabledataArr: [], 
        }
    }
}

### tableView  获取tableData数据

getTableData(condition, pageNum, limitNum) {
   /***
    * 功能：点击查询按钮，根据子组件返回的结果重新获取table数据
    * 参数：condition:form查询结果：{}
    *  */

}