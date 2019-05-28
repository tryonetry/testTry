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
      <a-col :xl="12" :xxl="8" :xs="24" v-for="(item, index) in formData.formInputs" :key="index">
        <a-form-item
          v-if="item.otherType !== 'textarea'"
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
          v-model="item.val"
          allowClear
        ></a-tree-select>

        <!-- v-decorator="[ item.name,{rules: [{ required: item.required}]}]" -->
        <a-select
          v-if="!item.type && item.otherType==='select'"
          v-model="item.val"
          :placeholder="item.placeholder"
          :disabled = "item.disabled ? item.disabled : false"
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
          @blur="searchSelectBlur(item,index)"
          @change="searchSelectChange"
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
          @change="dateChange"
          allowClear
        />
          

        <a-month-picker 
          class="formSearchDate"
          v-if="!item.type && item.otherType === 'month'"
          v-model="item.val"
          :disabled = "item.disabled ? item.disabled : false"
          @change="dateChange" 
          allowClear
        />

        <a-range-picker 
          class="formSearchDate"
          v-if="!item.type && item.otherType === 'daterange'"
          v-model="item.val"
          :disabled = "item.disabled ? item.disabled : false"
          @change="dateChange"
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
      </a-col>

       <!-- 多行文本 -->
       <a-col :xl="24" :xxl="16" :xs="24" v-for="(item, index) in formData.formInputs" :key="'_'+index">
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
          xxl: { span: 3 }
        },
        wrapperCol: {
          sm: { span: 18 },
          xl: { span: 20 },
          xxl: { span: 20}
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
    dateChange(date, dateString){
      console.log(date, dateString)
    },
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

      // 正确货失败后的操作
      if(!isRight){
        this.formData.formInputs[inputIndex].status = 'error';
      
      }else{
        if(currInput.required){
          this.formData.formInputs[inputIndex].status = 'success';
        }

        // 如果对应的项有关联到其他项
        if(inputItem.connectTo && inputItem.connectToFun && inputItem.connectTo.length > 0 && inputItem.connectTo.length && inputItem.connectToFun.length){

          let connectToArr = inputItem.connectTo;
          let connectToFunArr = inputItem.connectToFun;

          // 以下几行代码需放在success中
          connectToArr.forEach((item,i)=>{
            _this.formData.formInputs.forEach((input,index)=>{
              if(input.key === item){
                // 当为时间格式的时候
                if(!input.type && (input.otherType === 'date' || input.otherType === 'month' || input.otherType === 'daterange')){
                  // console.log(connectToFunArr[i](inputItem.val))
                  _this.formData.formInputs[index].val = moment(connectToFunArr[i](inputItem.val))
                }else{
                  _this.formData.formInputs[index].val = connectToFunArr[i](inputItem.val);
                }
                
              }
            })
          });

        }

      }


    },
    searchSelectChange (value) {
      console.log(`selected ${value}`);
    },
    searchSelectBlur(select,index) {
      console.log((!select.val && String(select.val) !== '0'))
      if(select.required){
        if(!select.val && String(select.val) !== '0'){
          this.formData.formInputs[index].status = 'error';
        }else{
          this.formData.formInputs[index].status = 'success';
        }
      }
    },
    searchSelectFocus() {
      console.log('focus');
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
