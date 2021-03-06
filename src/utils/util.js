import address from '../../public/json/address';
import moment from 'moment';

let _utilTempTreeArr = [];

// 递归遍历 address
function searchName(codeArr, dataArr, deep, result) {
    if (dataArr.length <= 0) return false;
    dataArr.forEach((item) => {
        if (item.code === codeArr[deep]) {
            result[deep] = item.name;
            // 检查到值继续遍历
            deep++;
            if (!!item.children && item.children.length > 0) {
                searchName(codeArr, item.children, deep, result);
            }
        }
    });
    return result;
}

function getDPI() {
    var arrDPI = new Array();
    if (window.screen.deviceXDPI != undefined) {
        arrDPI[0] = window.screen.deviceXDPI;
        arrDPI[1] = window.screen.deviceYDPI;
    }
    else {
        var tmpNode = document.createElement("DIV");
        tmpNode.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
        document.body.appendChild(tmpNode);
        arrDPI[0] = parseInt(tmpNode.offsetWidth);
        arrDPI[1] = parseInt(tmpNode.offsetHeight);
        tmpNode.parentNode.removeChild(tmpNode);
    }
    // console.log(arrDPI)
    return arrDPI;
}

const utils = {
    // 数组去掉空
    deleteVoidFromArr: function (array, other) {
        var tempArr = [];
        array.forEach(function (item) {
            if (!!item && item !== other) {
                tempArr.push(item);
            }
        });
        return tempArr;
    },
    // 判断两个数组内容是否相等
    arrEquals: function (arr1, arr2) {
        var isEqual = true;
        if (arr1.length !== arr2.length) {
            isEqual = false;
        } else {
            arr1.forEach(function (value, index) {
                if (value !== arr2[index]) {
                    isEqual = false;
                }
            })
        }
        return isEqual;
    },

    //通过地址code查询地址name
    checkAddressName: function (code) {
        let codeArr = null;
        if(typeof(code) === 'string'){
            codeArr = code.split('.');
        }else if(code instanceof Array){
            codeArr = code;
        }   
        let result = [];
        return searchName(codeArr, address, 0, result).join('');
    },

    //根据点击table数据：添加、编辑、浏览操作；回去当前行数据填入到对应的tableFormSearch里且返回
    getNewFormSearch: function (dataObj, currForm) {
        let tempForm = currForm;
        for (let i in dataObj) {
            tempForm.formInputs.forEach(item => {
                for (let j in item) {
                    if (i === item[j]) {
                        if (
                            !item.type &&
                            (item.otherType === "date" ||
                                item.otherType === "month" ||
                                item.otherType === "daterange")
                        ) {
                            if (dataObj[i]) {
                                item.val = moment(dataObj[i], "YYYY-MM-DD");
                            } else {
                                item.val = moment(new Date(), "YYYY-MM-DD");
                            }
                        } else if (
                            !item.type &&
                            (item.otherType === "searchSelect" ||
                                item.otherType === "select")
                        ) {
                            if (dataObj[i]) {
                                item.val = dataObj[i];
                            } else {
                                if(item.children.length > 0){
                                    item.val = item.children[0].itemCode;
                                } else{
                                    item.val = void 0;
                                }
                            }
                        } else if (!item.type && item.otherType === "addressSelect") {
                            if (dataObj[i]) {
                                item.val = dataObj[i].split(".");
                            } else {
                                item.val = ["11", "1101", "110101"];
                            }
                        } else {
                            item.val = dataObj[i];
                        }
                    }
                }
            });
        }
        return tempForm;
    },
    
    //tableFormSearch返回的数据；再转换成提交给服务器的对象数据
    transferFormToObj(currFormData){
        let submitFormData = {};
        currFormData.forEach(element => {
            if (element.val) {
            submitFormData[element.name] = element.val;
            } else {
            submitFormData[element.name] = "";
            }
        });
        return submitFormData;
    },
    
    borrowFun(dataArr, keyVal){
        /**
         * 功能：根据需要的字段名重组数据为字符串返回
         * 参数：dataArr：当前table数据； keyVal：当前需要组为字符串得字段名
         */
        let currStr = '';
        dataArr.forEach(el => {
          for(let key in el){
            if(key === keyVal){
              currStr += el[key] + ','
            }
          }
        });
        return currStr.substr(0, currStr.length - 1);
      },

    js_getDPI() {
        return getDPI();
    },

    // 监听浏览器缩放比例
    detectZoom (){
        var ratio = 0,
            screen = window.screen,
            ua = navigator.userAgent.toLowerCase();
        
        if (window.devicePixelRatio !== undefined) {
            ratio = window.devicePixelRatio;
        }
        else if (~ua.indexOf('msie')) { 
          if (screen.deviceXDPI && screen.logicalXDPI) {
            ratio = screen.deviceXDPI / screen.logicalXDPI;
          }
        }
        else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
          ratio = window.outerWidth / window.innerWidth;
        }
          
         if (ratio){
          ratio = Math.round(ratio * 100);
        }
          
         return ratio;
    },

    // 打印modal的宽度
    printModalWidth:Math.ceil(getDPI()[0] * 8.27 * 1.2 + 300),

    // 递归树寻找到树下的节点
    searchPid:function(treeObj,arrData){
        treeObj.forEach(item => {
            arrData.forEach((value,j) => {
                if(item.id === value.pId){
                    if(!item.children){
                        item.children = [];
                    }
                    item.children.push(value);
                }
            });
            if(item.children && item.children.length > 0){
                this.searchPid(item.children,arrData);
            }
        })
    }, 

    // 一维数组树数据 -> 树结构数组数据 
    one2MultiDimensional:function(rootPid,dataArr){
        let result = null;
        dataArr.forEach((item) => {
            if(rootPid && rootPid === item.pId){
                _utilTempTreeArr.push(item);
            }
        });

        this.searchPid(_utilTempTreeArr,dataArr);
        result = JSON.parse(JSON.stringify(_utilTempTreeArr));
        _utilTempTreeArr = [];
        return result;
    },

    isInwareStatusFun(archiveStatus, isInware){
        /**
         * 功能：判断档案的在库状态---全局页面
         * 参数：archiveStatus：archiveStatus; isInware: isInware
         */
        let resultVal = '';
        if(archiveStatus && isInware){
            if(Number(archiveStatus) === 0 && Number(isInware) === 0){
                resultVal = '待入库';
            } else if(Number(archiveStatus) === 1 && Number(isInware) === 0){
                resultVal = '在库';
            } else if(Number(archiveStatus) === 1 && Number(isInware) === 1){
                resultVal = '已借出';
            } else if(Number(archiveStatus) === 7 && Number(isInware) === 2){
                resultVal = '已转出';
            }
        } else{
            resultVal = '';
        }
        return resultVal;
    },

    getImageUrl(currPath, pathLen){
        /**
         * 功能：获取图片地址：linux和windows都匹配
         * 参数：currPath：当前后台给的路径； pathLen：要从当前路径截取后几位
         */
        let tempPathArr = currPath.split('/'), resultPath = '';
        for(let i = Number(pathLen) - 1; i >= 0; i --){
            resultPath += tempPathArr[tempPathArr.length - i - 1] + '/';
        }
        return resultPath.substring(0, resultPath.length - 1);
    }
}
export default utils;