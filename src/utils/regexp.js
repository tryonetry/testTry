const regs = {

    // 1 "验证通过!", 0 //校验不通过 // id为身份证号码
    testid:function (idCard) {
      if(!idCard){
        return 0;
      }
      var tip = '';
      //1.传入15位或者18位身份证号码，18位号码末位可以为数字或X
      idCard = idCard.toUpperCase();
      //2.去掉身份证的左右空格
      idCard = trim(idCard);
      //3.判断输入的身份证长度
      if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(idCard))) {
        tip = "身份证号长度不正确或不符合规定！";
        return 0;
      }
      //4.验证前两位城市编码是否正确 
      var aCity = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" };
      if (aCity[parseInt(idCard.substr(0, 2))] == null) {
        tip = "身份证号不正确或不符合规定！";
        return 0;
      }
      //5.验证出生日期和校验位
      if (validId15(idCard) || validId18(idCard)) {
        return 1;
      } else {
        return 0;
      }
      //身份证18位号码验证
      function validId18(str) {
        if (str.length != 18) return false;//长度验证
        //1. 出生日期验证
        var re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
        //also re = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
        var arrSplit = str.match(re); //检查生日日期是否正确 
        if (arrSplit != null) {
          if (!YearMonthDayValidate(arrSplit[2], arrSplit[3], arrSplit[4])) {
            tip = "出生日期不正确";
            return false;
          }
        }
        else {
          return false;
        }
        //2. 校验位验证
        var iW = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1);//加权因子
        var iSum = 0;
        for (var i = 0; i < 17; i++) {
          var iC = str.charAt(i);
          var iVal = parseInt(iC);
          iSum += iVal * iW[i];
        }
        var iJYM = iSum % 11;//取模
        var sJYM = '';
        //获取的模查找对应的校验码字符值
        if (iJYM == 0) sJYM = "1";
        else if (iJYM == 1) sJYM = "0";
        else if (iJYM == 2) sJYM = "x";
        else if (iJYM == 3) sJYM = "9";
        else if (iJYM == 4) sJYM = "8";
        else if (iJYM == 5) sJYM = "7";
        else if (iJYM == 6) sJYM = "6";
        else if (iJYM == 7) sJYM = "5";
        else if (iJYM == 8) sJYM = "4";
        else if (iJYM == 9) sJYM = "3";
        else if (iJYM == 10) sJYM = "2";
        var cCheck = str.charAt(17).toLowerCase();
        if (cCheck != sJYM) {
          return false;
        }
        return true;
      }
  
      //身份证15位(1984-2004)身份验证 
      function validId15(str) {
        if (str.length != 15) return false;
        //1. 出生日期验证
        var re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
        var arrSplit = str.match(re); //检查生日日期是否正确 
        if (arrSplit != null) {
          if (parseInt(arrSplit[2].substr(1)) > 0) {
            arrSplit[2] = "19" + arrSplit[2];
          } else {
            arrSplit[2] = "20" + arrSplit[2]
          }
          if (!YearMonthDayValidate(arrSplit[2], arrSplit[3], arrSplit[4])) {
            tip = "出生日期不正确";
            return false;
          }
        } else {
          return false;
        }
        return true;
      }
  
      //出生日期的年月日验证
      function YearMonthDayValidate(year, month, day) {
        year = parseInt(year); //年
        month = parseInt(month);//月
        day = parseInt(day);//日
        //判断年，月,日是否为空
        if (isNaN(year) || isNaN(month) || isNaN(day)) return false;
        //判断月是否是在1-12月之间
        if (month < 1 || month > 12) return false;
        //返回当月的最后一天
        var date = new Date(year, month, 0);
        //判断是否超过天数范围
        if (day < 1 || day > date.getDate()) return false;
        return true;
      }
  
      //去掉字符串两端左右空格
      function trim(strs) {
        return strs.replace(/(^\s*)|(\s*$)/g, ""); //使用js正则表达式方法
      }
    },

    // 验证身份证 
    // 1 "验证通过!", 0 //校验不通过 // id为身份证号码
    // testId:function(id){
       
    //     console.log(id);
    //     var format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
    //     //号码规则校验
    //     if(!format.test(id)){
    //         // callback('warning')
    //         // callback(new Error());
    //         // return  0; 
    //       // return {'status':0,'msg':'身份证号码不合规'};
    //       return  {'status': 0, 'msg': '请输入正确的身份证号码'}; 
    //     }
    //     //区位码校验
    //     //出生年月日校验  前正则限制起始年份为1900;
    //     var year = id.substr(6,4),//身份证年
    //       month = id.substr(10,2),//身份证月
    //       date = id.substr(12,2),//身份证日
    //       time = Date.parse(month+'-'+date+'-'+year),//身份证日期时间戳date
    //       now_time = Date.parse(new Date()),//当前时间戳
    //       dates = (new Date(year,month,0)).getDate();//身份证当月天数
    //     if(time>now_time||date>dates){
    //         // callback(new Error('请输入正确的身份证号码'));
    //         // return 0;
    //       // return {'status':0,'msg':'出生日期不合规'}
    //       return  {'status': 0, 'msg': '请输入正确的身份证号码'}; 
    //     }
    //     //校验码判断
    //     var c = new Array(7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2);  //系数
    //     var b = new Array('1','0','X','9','8','7','6','5','4','3','2'); //校验码对照表
    //     var id_array = id.split("");
    //     var sum = 0;
    //     for(var k=0;k<17;k++){
    //       sum+=parseInt(id_array[k])*parseInt(c[k]);
    //     }
    //     if(id_array[17].toUpperCase() != b[sum%11].toUpperCase()){
    //         // callback(new Error('请输入正确的身份证号码'));
    //         // return 0;
    //       // return {'status':0,'msg':'身份证校验码不合规'}
    //       return  {'status': 0, 'msg': '请输入正确的身份证号码'}; 
    //     }
    //     // callback();
    //     // return 1;
    //     // return {'status':1,'msg':'校验通过'}
    //     return  {'status': 1, 'msg': ''}; 
    // },

    // 验证邮箱
    testEmail:function(rule,email,callback){
        let reg = new RegExp('^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+\\.[a-zA-Z]{2,3}$','ig');
        if(reg.test(email)){
            callback();
            return 1;
        }else{
            callback(new Error('请输入正确的邮箱'))
            return 0;
        }
    },

    // 验证电话号
    testMobile:function(rule,mobile,callback){
        let reg = new RegExp('^1\\d{10,10}$');
        if(reg.test(mobile)){
            callback();
            return 1;
        }else{
            callback(new Error('请输入正确的电话号码'));
            return 0;
        }
    },
}

export default regs;