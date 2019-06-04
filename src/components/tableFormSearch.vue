<template>
  <div class="outerContainer">
    <!-- form -->
    <!-- <a-row> -->
    <a-form :form="form" class="formInputsContainer ant-row">
      <!-- form items -->
      <!-- :validate-status = 'item.status ? item.status : "" ' -->
      <!-- :help = 'item.tip ? item.tip : false ' -->
      <!-- hasFeedback -->
      <!-- :label="!item.required?null:item.title" -->
      <a-col 
        :xl="item.otherType !== 'textarea' && item.otherType !== 'segementTitle' ? 12 : 24" 
        :xxl="item.otherType !== 'textarea' && item.otherType !== 'segementTitle' ? 8 : 24" 
        :xs="24" 
        v-for="(item, index) in formData.formInputs" 
        :key="index">

        <!-- common formItem -->
        <a-form-item
          v-if="item.otherType !== 'textarea' && item.otherType !== 'segementTitle'"
          :labelCol="defaultCon.labelCol"
          :wrapperCol="defaultCon.wrapperCol"
          :validate-status = 'item.status ? item.status : "" '
          :help = 'item.status === "error" ? (item.tip ? item.tip : false):"" '
          hasFeedback
        >
        <!-- label -->
        <span slot="label" v-if="item.required"><i class="redDot">*</i> {{item.title}}</span>
        <span slot="label" v-else>{{item.title}}</span>
        <!-- v-decorator="[ item.name,{rules: [{ required: item.required}]}]"  -->
        <a-input
          v-if="!!item.type && !item.otherType"
          :type="item.type"
          :placeholder="item.placeholder"
          :maxlength ="item.maxlength || String(item.maxlength) === '0' ? item.maxlength : false"
          :minlength ="item.minlength || String(item.minlength) === '0' ? item.minlength : false"
          @blur="inputBlur(item,index)"
          v-model="item.val"
          :disabled = "item.disabled ? item.disabled : false"
          @change="listeningChange"
          class='inputClearContainer'
        >
          <!-- 后缀图标 -->
          <!-- <a-icon class='inputClear' v-if="item.val || String(item.val) === '0'" slot="suffix" type="close-circle" @click="emptyInput(item)" /> -->
        </a-input>
        
       <!-- v-decorator="[ item.name]" -->
        <a-tree-select
          v-if="!item.type && item.otherType === 'treeselect'"
          :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
          :treeData="item.children"
          :placeholder="item.placeholder"
          :treeDefaultExpandedKeys="['01']"
          @change="treeSelect"
          @blur="commonRequiredBlur(item,index)"
          v-model="item.val"
          allowClear
        ></a-tree-select>

        <!-- v-decorator="[ item.name,{rules: [{ required: item.required}]}]" -->
        <a-select
          v-if="!item.type && item.otherType==='select'"
          v-model="item.val"
          :placeholder="item.placeholder"
          :disabled = "item.disabled ? item.disabled : false"
          @change='selectChange(item.val)'
          @blur="commonRequiredBlur(item,index)"
          allowClear
        >
          <a-select-option
            v-for="(el, index) in item.children"
            :key="index"
            :value="el.itemCode"
            :disabled="el.isdisabled"
          >{{el.itemName}}</a-select-option>
        </a-select>

         <!-- v-decorator="[ item.name, {rules: [{required: item.required}]}]" -->
         <!-- :readonly = "item.readonly ? item.readonly : false" -->
        <a-select
          v-if="!item.type && item.otherType==='searchSelect'"
          :disabled = "item.disabled ? item.disabled : false"
          showSearch
          :placeholder="item.placeholder"
          v-model="item.val"
          optionFilterProp="children"
          @focus="searchSelectFocus"
          @blur="commonRequiredBlur(item,index)"
          @change="searchSelectChange(item)"
          :filterOption="filterOption"
          allowClear
        >
          <a-select-option
            v-for="(el, index) in item.children"
            :key="index"
            :value="el.itemCode"
            :disabled="el.isdisabled">
            {{el.itemName}}
          </a-select-option>
        </a-select>

          <!-- v-decorator="[ item.name,{rules: [{ required: item.required}]}]"        -->
        <a-cascader
          v-if="!item.type && item.otherType==='addressSelect'"
          :options="address"
          :placeholder="item.placeholder"
          v-model="item.val"
          :fieldNames="{label:'name',value:'code',children:'children'}"
          :disabled = "item.disabled ? item.disabled : false"
          allowClear
        />
        
        <!-- v-decorator="[ item.name,{rules: [{ required: item.required}]}]" -->
        <a-date-picker
          class="formSearchDate"
          v-if="!item.type && item.otherType === 'date'"
          v-model="item.val"
          :disabled = "item.disabled ? item.disabled : false"
          @change="commonRequiredBlur(item,index)"
          @openChange="dateOpenChange(arguments,item,index)"
          allowClear
        />

        <a-month-picker 
          class="formSearchDate"
          v-if="!item.type && item.otherType === 'month'"
          v-model="item.val"
          :disabled = "item.disabled ? item.disabled : false"
          @change="commonRequiredBlur(item,index)"
          @openChange="dateOpenChange(arguments,item,index)"
          allowClear
        />

        <a-range-picker 
          class="formSearchDate"
          v-if="!item.type && item.otherType === 'daterange'"
          v-model="item.val"
          :disabled = "item.disabled ? item.disabled : false"
          @change="commonRequiredBlur(item,index)"
          allowClear
        />

        <a-upload
          name="file"
          v-if="!item.type && item.otherType === 'upload'"
          v-model="item.val"
          :multiple="item.multiple"
          :action='item.action'
          :list-type="item.listType"
           @change="uploadChange"
           allowClear
        >
          <a-button> <a-icon type="upload" />选择</a-button>
        </a-upload>
        </a-form-item>

        <!-- other formItem -->
        <a-form-item
          v-if="!item.type && item.otherType === 'textarea'"
          :label="item.title"
          :labelCol="textareaCon.labelCol"
          :wrapperCol="textareaCon.wrapperCol"
        >
          <!-- v-decorator="[ item.name, {rules: [{ required: item.required}]}]" -->
          <a-textarea 
            :placeholder="item.placeholder" 
            v-model="item.val"
            :autosize="{ minRows: 3, maxRows: 6 }" 
            allowClear
          />
          
        </a-form-item>
        <!-- inputs分割 title -->
        <h2 v-if="!item.type && item.otherType === 'segementTitle'" class="segementTitle">{{item.title}}</h2>
      </a-col>


    </a-form>
    <!-- </a-row> -->

    <!-- btns container -->
    <div class="formBtns" v-if="formData.formBtns">
      <!-- 公用 btns -->
      <a-button
        v-for="(el, index) in formData.formBtns"
        :key="index"
        class="buttonOperate"
        type="primary"
        :html-type="el.htmltype"
        @click="operate($event, el.operate)"
      >{{el.title}}</a-button>
      <!-- other Btns -->
      <slot></slot>
    </div>
    <!-- 非tableFormSearch表单下面的按钮 -->
    <slot name="otherForm"></slot>
  </div>
</template>
<script>
import moment from "moment";
import address from '../../public/json/address.js';
import regs from '../../src/utils/regexp';

export default {
  name: "TableFromSearch",
  props: ["formDataArr"],
  data() {
    return {
      regs,
      formData: [],
      treeSelectObj: {},
      defaultCon: {
        labelCol: {
          sm: { span: 6 },
          xl: { span: 6 },
          xxl: { span: 6 }
        },
        wrapperCol: {
          sm: { span: 18 },
          xl: { span: 16 },
          xxl: { span: 16 }
        }
      },
      textareaCon: {
        labelCol: {
          sm: { span: 6 },
          xl: { span: 3 },
          xxl: { span: 2 }
        },
        wrapperCol: {
          sm: { span: 18 },
          xl: { span: 20 },
          xxl: { span: 14}
        }
      },
    };
  },
  watch:{
    formDataArr: {
      immediate:true,
      deep: true,
      handler(newVal){
        this.formData = newVal;
      }
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  created() {
    this.formData = this.formDataArr;
  },
  computed:{
    address(){
      return address;
    }
  },
  methods: {
    operate(e, data) {
      this[data](e);
    },
    // 清除input框
    emptyInput(item){
      console.log(item)
    },
    searchForm(event) {
      //table上面Form查询
      event.preventDefault();
      this.$emit("searchForm", this.formData.formInputs);
    },
    listeningChange(){
      //监听input值得变化
      let newData = this.formData.formInputs;
      let newCondition = {};
      newData.forEach(element => {
        if (element.val) {
          newCondition[element.name] = element.val;
        } else {
          newCondition[element.name] = "";
        }
      });
      this.$emit('bundleChange', newCondition);
    },
    getFormData(){
      //添加、编辑表单提交
      return this.formData.formInputs;
    },

    resetForm() {
      //重置按钮操作
      this.formData.formInputs.forEach((item)=>{
        item.val = void 0;
      })
      // this.form.resetFields();
    },


    treeSelect(value) {
      this.treeSelectObj.value = value;
    },

    // 联动处理
    bundleLinkage(itemData){
      const _this = this;
      // 如果对应的项有关联到其他项
      if(itemData.connectTo && itemData.connectToFun && itemData.connectTo.length > 0 && itemData.connectTo.length && itemData.connectToFun.length){

        let connectToArr = itemData.connectTo;
        let connectToFunArr = itemData.connectToFun;
        // 遍历关联函数和关联项
        connectToArr.forEach((item,i)=>{
          _this.formData.formInputs.forEach((input,index)=>{
            if(input.key === item){
              let resultObjArr = connectToFunArr[i](itemData.val);
              if(resultObjArr.length > 0){
              // console.log(resultObjArr)

                resultObjArr.forEach((resultObj) => {
                  // 当为时间格式的时候
                  if(!input.type && (input.otherType === 'date' || input.otherType === 'month' || input.otherType === 'daterange')){
                    _this.formData.formInputs[index][resultObj.name] = resultObj.data ? moment(resultObj.data) : void 0;
                  }else if(!input.type && (input.otherType === 'select' || input.otherType === 'searchSelect' )){
                    // 为 select 选项
                    // 默认其他规则 *_*
                    if(typeof(resultObj.data) === 'string' && resultObj.data.indexOf('@_@') > -1 && resultObj.name !== 'disabled'){
                      let hasMatched = false;
                      input.children.forEach((row,j) => {
                        if('_'+resultObj.data.substr(resultObj.data.indexOf('@_@')+3) === row.itemCode.substr(row.itemCode.indexOf('_'))){
                          _this.formData.formInputs[index][resultObj.name] = row.itemCode ? row.itemCode : void 0; 
                          hasMatched = true;
                        }
                      });
                      // 扔尚未匹配到
                      if(!hasMatched){
                        _this.$set(_this.formData.formInputs[index],'status','error');
                      }else{
                        _this.$set(_this.formData.formInputs[index],'status','success');
                      }
                    }else if(resultObj.operate && resultObj.operate == 'whIdTowhdArea'){
                      let resultArr = [];
                      this.$http.fetchPost('wareHouse@getWareHouseList.action', {
                        page: 1,
                        limit: 10,
                      }).then(res => {
                        if(Number(res.code) === 0){
                          res.data.forEach(item => {
                            if(item.whId == resultObj.data){
                              for(let i = item.whAreaStartNum; i <= item.whAreaNum; i++){
                                resultArr.push({
                                  itemCode: i,
                                  itemName: '第' + i + '区'
                                })
                              }
                            }
                          });
                          _this.formData.formInputs[index][resultObj.name] = resultArr;
                          if(resultArr.length > 0){
                            _this.formData.formInputs[index]['val'] = resultArr[0].itemCode;
                          }
                        }
                      })
                      
                      
                    } else{
                      _this.formData.formInputs[index][resultObj.name] = resultObj.data ? resultObj.data : void 0;

                    }
                  }else{
                    _this.formData.formInputs[index][resultObj.name] = resultObj.data ? resultObj.data : void 0;
                  }
                });

              }
            }
          })
        });

      }
    },

    // 输入表单blur事件
    inputBlur(inputItem,inputIndex){
      const _this = this;
      // 验证正确/错误状态值
      let isRight = true;
      let currInput = this.formData.formInputs[inputIndex];

      //存在正则时候直接使用正则验证
      if(currInput.reg && this.regs[currInput.reg] && currInput.required){
        let regFun = this.regs[currInput.reg];
        if(regFun(currInput.val) === 0){
          isRight = false;
        }
      }
      // 不存在正则时,判断最大长度和最小长度
      else if(!currInput.reg && currInput.required){
        // 判断值是否存在
        if(!currInput.val && String(currInput.val) !== '0'){
          isRight = false;
        }
        // 存在最小长度
        if(isRight && (!!currInput.minlength || currInput.minlength === 0) && currInput.val.length < currInput.minlength){
          isRight = false;
        }
        // 存在最大长度
        if(isRight && (!!currInput.maxlength || currInput.maxlength === 0) && currInput.val.length > currInput.maxlength){
          isRight = false;
        }
      }

      // 正确或失败后的操作
      if(!isRight){
        // this.formData.formInputs[inputIndex].status = 'error';
        this.$set(this.formData.formInputs[inputIndex],'status','error');

      }else{
        if(currInput.required){
          // this.formData.formInputs[inputIndex].status = 'success';
          this.$set(this.formData.formInputs[inputIndex],'status','success');
        }
      }
      this.bundleLinkage(inputItem)
    },
    selectChange(value){
      console.log(value)
    },
    // 搜索选择框
    searchSelectChange (select) {
      this.bundleLinkage(select)
    },
    // 普通的表单项
    commonRequiredBlur(item,index) {
      if(item.required){
        if(item.val || String(item.val) === '0'){
          this.$set(this.formData.formInputs[index],'status','success');
        }else{
          this.$set(this.formData.formInputs[index],'status','error');
        }
      }
    },
    // 日期表单项面板打开或关闭
    dateOpenChange(args,item,index){
      console.log(args)
      if(!args[0]){
        this.commonRequiredBlur(item,index)
      }
    },
    searchSelectFocus() {
      // console.log('focus');
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    uploadChange(info){
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} 上传成功！`);
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 上传失败.`);
      }
    }
  }
};
</script>
<style scoped>
.redDot{
  color: red;
}
.buttonOperate {
  margin-right: 15px;
}
.formInputsContainer {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
}
.segementTitle{
  font-size: 18px;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding-left: 20px;
  margin-bottom: 20px;
  background: #FAFAFA;
}
.formBtns {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 20px;
  padding-top: 0;
  box-sizing: border-box;
  align-items: center;
}
/* .inputClearContainer{
  position:'relative';
}
.inputClear{
  position:absolute;
  right:30px;
} */
.inputClearContainer .anticon-close-circle {
  cursor: pointer;
  color: #ccc;
  transition: color 0.3s;
  font-size: 16px;
  margin-right:20px;
}
.inputClearContainer .anticon-close-circle:hover {
  color: #999;
}
.inputClearContainer .anticon-close-circle:active {
  color: #666;
}
</style>
