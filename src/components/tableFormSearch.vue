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
        :xl="item.colWidth && item.colWidth[1] ? item.colWidth[1] : item.otherType !== 'textarea' && item.otherType !== 'segementTitle' ? 12 : 24" 
        :xxl="item.colWidth && item.colWidth[0] ? item.colWidth[0] : item.otherType !== 'textarea' && item.otherType !== 'segementTitle' ? 8 : 24" 
        :xs="24" 
        v-for="(item, index) in formData.formInputs"
        v-if="!item.isHide"
        :key="index">

        <!-- common formItem -->
        <a-form-item
          v-if="item.otherType !== 'textarea' && item.otherType !== 'segementTitle'"
          :labelCol="layout && layout.defaultCon && layout.defaultCon.labelCol ? layout.defaultCon.labelCol : defaultCon.labelCol"
          :wrapperCol="layout && layout.defaultCon && layout.defaultCon.wrapperCol ? layout.defaultCon.wrapperCol : defaultCon.wrapperCol"
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
          @change='selectChange(item)'
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
          :mode="item.mode ? item.mode : ''"
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
          @blur="commonRequiredBlur(item,index)"
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
          :accept="!item.accept ? '': item.accept"
           @change="uploadChange"
           allowClear
        >
          <a-button> <a-icon type="upload" />选择</a-button>
        </a-upload>
        </a-form-item>

        <!-- other formItem -->
        <!-- :label="item.title" -->
        <a-form-item
          v-if="!item.type && item.otherType === 'textarea'"
          :labelCol="layout && layout.textareaCon && layout.textareaCon.labelCol ? layout.textareaCon.labelCol : textareaCon.labelCol"
          :wrapperCol="layout && layout.textareaCon && layout.textareaCon.wrapperCol ? layout.textareaCon.wrapperCol : textareaCon.wrapperCol"
          :validate-status = 'item.status ? item.status : "" '
          :help = 'item.status === "error" ? (item.tip ? item.tip : false):"" '
          hasFeedback
        >
          <!-- label -->
          <span slot="label" v-if="item.required"><i class="redDot">*</i> {{item.title}}</span>
          <span slot="label" v-else>{{item.title}}</span> 

          <!-- v-decorator="[ item.name, {rules: [{ required: item.required}]}]" -->
          <a-textarea
            :placeholder="item.placeholder" 
            v-model="item.val"
            :disabled='item.disabled'
            :autosize="{ minRows: 3, maxRows: 6 }" 
            allowClear
            :required="item.required"
            @blur="inputBlur(item,index)"
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
import {isMoment} from "moment";
import moment from 'moment';
import address from '../../public/json/address.js';
import regs from '../../src/utils/regexp';

export default {
  name: "TableFromSearch",
  props: ["formDataArr", 'getCapacityDataFun','layout'],
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
    // 默认表单绑定数据
    this.form = this.$form.createForm(this);
  },

  created() {
    // 接收父组件的数据
    this.formData = {...this.formDataArr};
  },

  computed:{
    address(){
      return address;
    }
  },
  methods: {
    moment,
    // 操作项  data:操作的函数名称
    operate(e, data) {
      this[data](e);
    },

    // 清除input框
    emptyInput(item){
      console.log(item)
    },

    //table上面Form查询
    searchForm(event) {
      event.preventDefault();
      this.$emit("searchForm", this.formData.formInputs);
    },

    //监听input值得变化
    listeningChange(){
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

    // 父组件获取数据并验证数据准确性
    getFormData(){
      console.log('传递数据....')
      const _this = this;
      // 必填项的 status 值是否都为 success 以及已填写的非必填项数据是否准确
      let requiredFiledsRight = true;
      let notRequiredHasDataRight = true;
      let postResultObj = {};
      this.formData.formInputs.forEach((item,index) => {
        
        // 忽略已隐藏的项
        if(!item.isHide){

            // 判断必填项的数据是否准确
            if(item.required && !item.disabled && item.status === 'error'){
              requiredFiledsRight = false;
            }

            // 必填项或者已填写的非必填项
            if(item.required || (!item.required && (item.val || String(item.val) === '0'))){
              
              if(item.required && !item.val){
                requiredFiledsRight = false;
                _this.$set(_this.formData.formInputs[index],'status','error');
              }

              //存在正则时候直接使用正则验证
              if(item.reg && this.regs[item.reg]){
                let regFun = this.regs[item.reg];
                if(regFun(item.val) === 0){
                  if(item.required){
                    requiredFiledsRight = false;
                  }else{
                    notRequiredHasDataRight = false;
                  }
                  _this.$set(this.formData.formInputs[index],'status','error');
                }
              }

              // 不存在正则时,判断最大长度和最小长度
              else if(!item.reg ){
                // 存在最小长度
                if((item.minlength || item.minlength === 0) && item.val && item.val.length && item.val.length < item.minlength){
                  if(item.required){
                    requiredFiledsRight = false;
                  }else{
                    notRequiredHasDataRight = false;
                  }
                  _this.$set(this.formData.formInputs[index],'status','error');
                }
                // 存在最大长度
                if((item.maxlength || item.maxlength === 0) && item.val && item.val.length && item.val.length > item.maxlength){
                  if(item.required){
                    requiredFiledsRight = false;
                  }else{
                    notRequiredHasDataRight = false;
                  }
                  _this.$set(this.formData.formInputs[index],'status','error');
                }
              }

            }
              
            
            //把当前的formIputs修改成http提交数据的格式
            if(isMoment(item.val)){
              //val为moment格式
              postResultObj[item.key] = _this.moment(item.val).format('YYYY-MM-DD');
            } else if(item.otherType === 'addressSelect'){
              postResultObj[item.key] = item.val ? item.val.join('.') : void 0;
            } else if(item.otherType === 'searchSelect' && item.mode){
              //可输入搜索多选
              postResultObj[item.key] = item.val ? item.val.join(',') : void 0;
            } else{
              postResultObj[item.key] = item.val;
            }
        }

      });

      // 返回需要的数据
      return { 
        requiredFiledsRight, 
        notRequiredHasDataRight, 
        resultData:this.formData.formInputs, 
        postObj: postResultObj ,
        isRight:requiredFiledsRight && notRequiredHasDataRight,
      };

    },

    //重置按钮操作
    resetForm() {
      this.formData.formInputs.forEach((item)=>{
        if(!item.disabled){
          item.val = void 0;
          item.status = void 0;
        }
        
      })
      // this.form.resetFields();
    },

    treeSelect(value) {
      this.treeSelectObj.value = value;
      this.listeningChange();
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
                  }

                  // 特殊处理项 name : companyId -> recordInfo 且关联项为 companyNum
                  else if(
                    (itemData.name === 'transferCompanyId' || 
                    itemData.name === 'companyId') && 
                    (input.name === 'transferCompanyNum' || 
                    input.name === 'companyNum') && 
                    resultObj.name === 'val'
                  ){
                    _this.formData.formInputs[index][resultObj.name] = void 0;
                    // 将匹配的下拉框的 itemCode 赋值
                    itemData.children.forEach(cr => {
                      if(cr.itemCode === resultObj.data){
                        _this.formData.formInputs[index][resultObj.name] = cr.itemId ? cr.itemId : void 0;
                      }
                    });
                  }
                  // 特殊项处理 name : companyNum -> recordInfo 且关联项为 companyId
                  else if(
                    (itemData.name === 'companyNum' ||
                    itemData.name === 'transferCompanyNum') && 
                    (input.name === 'companyId' || 
                    input.name === 'transferCompanyId') && 
                    resultObj.name === 'val'
                  ){
                    // 将输入的值 匹配下拉框
                    let hasMatched = false;
                    input.children.forEach((row,j) => {
                      if(resultObj.data === row.itemId && resultObj.data){
                        _this.formData.formInputs[index][resultObj.name] = row.itemCode ? row.itemCode : void 0; 
                        hasMatched = true;
                      }
                    });
                    // 尚未匹配到
                    if(!hasMatched){
                      _this.formData.formInputs[index]['val'] = void 0;
                      _this.$set(_this.formData.formInputs[index],'status','warning');
                    }else{
                      _this.$set(_this.formData.formInputs[index],'status','success');
                    }
                  }

                  // 特殊处理项 [停用]
                  else if(!input.type && (input.otherType === 'select' || input.otherType === 'searchSelect' )){
                    // 为 select 选项
                    // *_* 规则
                    if(typeof(resultObj.data) === 'string' && resultObj.data.indexOf('@_@') > -1 && resultObj.name !== 'disabled'){
                      // console.log(1)
                      let hasMatched = false;
                      input.children.forEach((row,j) => {
                        if('_'+resultObj.data.substr(resultObj.data.indexOf('@_@')+3) === row.itemCode.substr(row.itemCode.indexOf('_'))){
                          _this.formData.formInputs[index][resultObj.name] = row.itemCode ? row.itemCode : void 0; 
                          hasMatched = true;
                        }
                      });
                      // 扔尚未匹配到
                      if(!hasMatched){
                        _this.formData.formInputs[index]['val'] = void 0;
                        _this.$set(_this.formData.formInputs[index],'status','error');
                      }else{
                        _this.$set(_this.formData.formInputs[index],'status','success');
                      }
                    }


                    // whIdTowhdArea:通过库房找分区
                    else if(resultObj.operate && resultObj.operate === 'whIdTowhdArea'){
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
                                  itemCode: '' + i,
                                  itemName: '第' + i + '区'
                                })
                              }

                              //查询容量：空闲容量和总容量
                              let currCapacity = Object.assign({}, currCapacity, {'whId': item.whId});
                              _this.getCapacityDataFun(currCapacity);
                            }
                          });
                          _this.formData.formInputs[index][resultObj.name] = resultArr;    //resultArr赋值给分区的children
                          _this.formData.formInputs[index]['val'] = void 0;                //默认把分区的val赋值为void 0 
                          _this.formData.formInputs.forEach(item => {                      //当库房一更改，同时把密集架，层号，列号全清空，且把val赋值为void 0 
                            if(item.key === 'whdCode' || item.key === 'waColumnCode' || item.key === 'waLayerCode'){
                              item.children = [];
                              item.val = void 0;
                            }
                            if(item.key === 'orderNo'){
                              _this.$set(item, 'disabled', true);
                              item.val = void 0;
                            }
                          });
                        } else{
                          this.$message.error('抱歉，暂未获取到分区数据；请刷新后重试！')
                        }
                      }).catch(error => {
                        this.$message.error('抱歉，网络异常！')
                      })
                    }

                    //whdAreaTowhdCode：通过库房的id和分区数找密集架
                    else if(resultObj.operate && resultObj.operate === 'whdAreaTowhdCode'){
                      console.log(resultObj);
                      let currWhId = _this.formData.formInputs[0]['val'];  //当前库房的id值
                      let tempResultArr = [];
                      this.$http.fetchPost('archDocument@getWhdList.action',{
                        whId: currWhId,
                        whdArea: resultObj.data
                      }).then(res => {
                        if(Number(res.code) === 0){
                          res.data.forEach(element => {
                            tempResultArr.push({
                              itemCode: element.whdId,
                              itemName: '第' +  element.whdCode + '号密集架'
                            })
                          });
                          _this.formData.formInputs[index][resultObj.name] = tempResultArr;   //tempResultArr赋值给密集架的children
                          _this.formData.formInputs[index]['val'] = void 0;                   //默认密集架的val值为void 0
                          _this.formData.formInputs.forEach(item => {                         //同时把层号和列号children赋为[];val为void0
                            if(item.key === 'waColumnCode' || item.key === 'waLayerCode'){
                              item.children = [];
                              item.val = void 0;
                            }
                            if(item.key === 'orderNo'){
                              _this.$set(item, 'disabled', true);
                              item.val = void 0;
                            }
                          });
                        } else{
                          this.$message.error('抱歉，暂未获取到密集架数据；请刷新后重试！')
                        }
                      }).catch(error => {
                        this.$message.error('抱歉，网络异常！')
                      })
                    }

                    // whdCodeTowanCode 根据密集架获取列号和层号
                    else if(resultObj.operate && resultObj.operate === 'whdCodeTowanCode'){
                      let currWhId = _this.formData.formInputs[0]['val'];  //当前库房的id值
                      let currWhArea = _this.formData.formInputs[1]['val'];

                      //查询容量：空闲容量和总容量
                      let currWhdCodeName = '';
                      _this.formData.formInputs[2].children.forEach(el => {
                        if(el.itemCode === resultObj.data){
                          currWhdCodeName = el['itemName'].substr(el['itemName'].indexOf('第') + 1, el['itemName'].indexOf('号密集架') - 1)
                        }
                      })
                      let currCapacity = Object.assign({}, currCapacity, {'whId': currWhId, 'whdArea': currWhArea, 'whdId': resultObj.data, 'whdCode': currWhdCodeName});
                      _this.getCapacityDataFun(currCapacity);
                      

                      _this.$http.fetchPost('archDocument@getWhdList.action',{
                        whId: currWhId,
                        whdArea: currWhArea
                      }).then(res => {
                        if(Number(res.code) === 0){
                          let currCloumnArr = [], currLayerArr = [];
                          res.data.forEach(element => {
                            if(element.whdId === resultObj.data){
                              for(let i = 1; i <= element.whdColumnNum; i++){
                                currCloumnArr.push({
                                  itemCode: '' + i,
                                  itemName: '第' + i + '列'
                                })
                              }
                              for(let j = 1; j <= element.whdLayerNum; j++){
                                currLayerArr.push({
                                  itemCode: '' + j,
                                  itemName: '第' + j + '层'
                                })
                              }
                            }

                            _this.formData.formInputs.forEach(item => {
                              if(item.key === 'waColumnCode'){
                                //列号
                                item.children = currCloumnArr;
                                item.val = void 0;
                              } else if(item.key === 'waLayerCode'){
                                //层号
                                item.children = currLayerArr;
                                item.val = void 0;
                              } else if(item.key === 'orderNo'){
                                _this.$set(item, 'disabled', true);
                                item.val = void 0;
                              }
                            });
                          });
                        } else{
                          this.$message.error('抱歉，暂未获取到列号和层号数据；请刷新后重试！')
                        }
                      }).catch(error => {
                        this.$message.error('抱歉，网络异常！')
                      })
                    }

                    // select或searchSelect的其他情况
                    else if(!resultObj.operate){
                      let hasMatched = false;
                      if(resultObj.name === 'val'){
                        // console.log(resultObj.data)
                        input.children.forEach((row,j) => {
                          // console.log(row.itemCode === resultObj.data);
                          if((resultObj.data === row.itemCode) && !hasMatched){
                            _this.formData.formInputs[index][resultObj.name] = row.itemCode ? row.itemCode : void 0;
                            hasMatched = true;
                          }
                        });
                        // 扔尚未匹配到
                        if(!hasMatched){
                          _this.formData.formInputs[index]['val'] = void 0;
                          _this.$set(_this.formData.formInputs[index],'status','error');
                        }else{
                          _this.$set(_this.formData.formInputs[index],'status','success');
                        }
                      }else{
                        _this.formData.formInputs[index][resultObj.name] = resultObj.data ? resultObj.data : void 0;
                      }
                    }
                  }

                  // 当关联的数据为 是否隐藏
                  else if(resultObj && resultObj.name === 'isHide'){
                    _this.$set(_this.formData.formInputs[index],'isHide',resultObj.data)
                    // console.log(_this.formData.formInputs[index])
                  }

                  // 特殊处理 record-info 页面的单独操作 -> recordInfoIdCard
                  else if(resultObj && resultObj.operate === 'recordInfoIdCard'){
                    if(input.status === 'success'){
                      _this.formData.formInputs[index]['tip'] = '* 请输入正确的身份证号';
                      _this.$http.fetchPost('personalArch@checkRepeat.action',{a0184:resultObj.data})
                          .then(res => {
                            if(Number(res.code) === 0){
                              //弹出确认退档操作
                              if(res.isInware === '2' && res.archiveStatus === '7'){
                                _this.formData.formInputs[index]['tip'] = '* 抱歉,此身份证号/社保卡号重复';
                                _this.$set(_this.formData.formInputs[index],'status','error');
                                _this.$confirm({
                                  title: '是否进行退档操作 ?',
                                  content: '由于您的档案已转出,点击确定可进行退档操作,进行退档操作后可前往信息变更页面修改信息.',
                                  onOk() {
                                    _this.$http.fetchPost('personalArch@sendBackArch.action',{personId:res.personId})
                                      .then(res => {
                                        if(Number(res.code) === 0){
                                          _this.formData.formInputs[index][resultObj.name] = '';
                                          _this.$set(_this.formData.formInputs[index],'status',void 0);
                                          _this.$message.success('退档操作成功,可前往信息变更页查询信息');
                                        }else{
                                          // _this.formData.formInputs[index][resultObj.name] = '';
                                          _this.$message.error('退档操作失败,请稍后重试');
                                          return false;
                                        }
                                      })
                                      .catch(err => {
                                        _this.$message.error('抱歉,网络出错了,请稍后重试')
                                      })
                                  },
                                  onCancel() {},
                                })
                              }else{
                                _this.formData.formInputs[index][resultObj.name] = '';
                                _this.formData.formInputs[index]['tip'] = '* 抱歉,此身份证号/社保卡号重复';
                                _this.$set(_this.formData.formInputs[index],'status','error');
                              }
                            }else{
                              //
                            }
                          })
                          .catch(err => {
                            _this.$message.error('抱歉,网络出错了,请重试')
                          })
                    }
                  }

                  //waLayerCodeToOrderNo 根据选择的层号拿顺序
                  else if(input.type && resultObj && resultObj.operate === 'waLayerCodeToOrderNo'){
                    let currWhId = _this.formData.formInputs[0]['val'];  //当前库房的id值
                    let currWhArea = _this.formData.formInputs[1]['val'];   //当前分区的itemCode
                    let currWhdCode = _this.formData.formInputs[2]['val'];   //当前密集架的itemCode
                    let currCloumn = _this.formData.formInputs[3]['val'];  //当前列号的itemCode
                    
                    //查询容量：空闲容量和总容量
                    let currWhdCodeName = '';
                    _this.formData.formInputs[2].children.forEach(el => {
                      if(el.itemCode === currWhdCode){
                        currWhdCodeName = el['itemName'].substr(el['itemName'].indexOf('第') + 1, el['itemName'].indexOf('号密集架') - 1)
                      }
                    });
                    let currCapacity = Object.assign({}, currCapacity, {'whId': currWhId, 'whdArea': currWhArea, 'whdId': currWhdCode, 'whdCode': currWhdCodeName, 'waColumnCode': currCloumn, 'waLayerCode': resultObj.data});
                    _this.getCapacityDataFun(currCapacity);

                    //查询顺序号
                    _this.$http.fetchPost('archDocument@getFillOrderNo.action',{
                      whId: currWhId,
                      whdArea: currWhArea,
                      whdId: currWhdCode,
                      whdCode: currWhdCodeName,
                      waColumnCode: currCloumn,
                      waLayerCode: resultObj.data
                    }).then(res => {
                      if(Number(res.code) === 0){
                        _this.formData.formInputs.forEach(el => {
                          if(el.key === 'orderNo'){
                            el.val = res.orderNo;
                            _this.$set(el, 'disabled', false);
                          }
                        });
                      } else{
                        _this.$message.error('抱歉，获取顺序数据失败，请刷新后重试！')
                      }
                    }).catch(error => {
                      _this.$message.error('抱歉，网络异常！')
                    })
                  }

                 //expectReturnDate 根据materialId即：a10000检索当前输入材料名称是否重复
                 else if(input.type && resultObj && resultObj.operate === 'expectReturnDate'){
                   if(resultObj['materialId']){
                     _this.$http.fetchPost('materialBorrow@checkExpectReturnDate.action', {
                       expectReturnDate: resultObj['data'],
                       materialId: resultObj['materialId']
                     }).then(res => {
                       if(Number(res.code) === 0){
                         //此材料可借出
                         _this.formData.formInputs[index][resultObj.name] = resultObj.data ? resultObj.data : void 0;
                       } else if(Number(res.code) === 5){
                         //此材料已借出
                        _this.formData.formInputs[index][resultObj.name] = void 0;
                        _this.formData.formInputs[index]['status'] = 'error';
                        _this.formData.formInputs[index]['tip'] = '此材料已借出，请勿重复借出！';
                       } else{
                         //异常
                         _this.$message.error('抱歉，验证失败，请刷新后重试！')
                       }
                     }).catch(error => {
                       _this.$message.error('抱歉，网络异常！')
                     })
                   }
                 }

                  // 其他项
                  else if(!resultObj.operate){
                    console.log(resultObj.data)
                    _this.formData.formInputs[index][resultObj.name] = resultObj.data ? resultObj.data : void 0;
                    console.log(_this.formData.formInputs[index])
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

      // 不为空验证
      if(currInput.required && !currInput.val && String(currInput.val) !== '0'){
        isRight = false;
      } 

      //存在正则时候直接使用正则验证
      if(currInput.reg && this.regs[currInput.reg]){
        let regFun = this.regs[currInput.reg];
        if(regFun(currInput.val) === 0){
          isRight = false;
        }
      }
      // 不存在正则时,判断最大长度和最小长度
      else if(!currInput.reg ){
        
        // 存在最小长度
        if(isRight && currInput.val && (!!currInput.minlength || currInput.minlength === 0) && currInput.val.length < currInput.minlength){
          isRight = false;
        }
        // 存在最大长度
        if(isRight && currInput.val && (!!currInput.maxlength || currInput.maxlength === 0) && currInput.val.length > currInput.maxlength){
          isRight = false;
        }
      }

      // 正确或失败后的操作
      if(!isRight && currInput.required ){
        // this.formData.formInputs[inputIndex].status = 'error';
        this.$set(this.formData.formInputs[inputIndex],'status','error');
      }else if(isRight){
        if(currInput.required){
          // this.formData.formInputs[inputIndex].status = 'success';
          this.$set(this.formData.formInputs[inputIndex],'status','success');
        }else{
          this.$set(this.formData.formInputs[inputIndex],'status',void 0);
        }
      }
      this.bundleLinkage(inputItem)
    },

    // 选择框改变
    selectChange(value){
      this.bundleLinkage(value);
      this.listeningChange();
    },

    // 搜索选择框改变
    searchSelectChange (select) {
      this.bundleLinkage(select);
      this.listeningChange();
    },

    // 普通的必填表单项失去焦点
    commonRequiredBlur(item,index) {
      let isRight = true;
      if(item.val || String(item.val) === '0'){
        isRight = true;
      }else{
        isRight = false;
      }
      if(item.required && !isRight){
        this.$set(this.formData.formInputs[index],'status','error');
      }else{
        if(item.required){
          this.$set(this.formData.formInputs[index],'status','success');
        }else{
          this.$set(this.formData.formInputs[index],'status',void 0);
        }
      }
    },

    // 日期表单项面板打开或关闭
    dateOpenChange(args,item,index){
      // console.log(args)
      if(!args[0]){
        this.commonRequiredBlur(item,index)
      }
    },

    // searchSlect失去焦点
    searchSelectFocus() {
      // console.log('focus');
    },

    // searchSelect搜索过滤
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },

    // 上传提示
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
