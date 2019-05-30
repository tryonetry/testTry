import address from '../../public/json/address';

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
        let codeArr = code.split('.');
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
                                item.val = this.moment(dataObj[i], "YYYY-MM-DD");
                            } else {
                                item.val = this.moment(new Date(), "YYYY-MM-DD");
                            }
                        } else if (
                            !item.type &&
                            (item.otherType === "searchSelect" ||
                                item.otherType === "select")
                        ) {
                            if (dataObj[i]) {
                                item.val = dataObj[i];
                            } else {
                                item.val = item.children[0].itemCode;
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

    js_getDPI() {
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
        return arrDPI;
   } 

}
export default utils;