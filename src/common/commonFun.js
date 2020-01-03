/**
 * 公共方法
 */
const commonFun = {
    /**
     * 处理文本中数字的字体
     * @param {String} data 转换前数据
     * @param {String} family 对应字体类名
     * @return {String} str 返回转换后的数据
     */
    toNumberFontFamily: function (data, family) {
        var str = data.replace(/[0-9]/g, function (word) {
            return `<span class="${family}">${word}</span>`;
        });
        return str
    },

    /**
     * 处理后台生日数据中数字的字体
     * @param {String} data 转换前数据
     * @param {String} family 对应字体类名
     * @return {String} str 返回转换后的数据
     */
    toBirthday: function (data, family) {
        var data1 = data.replace(/-/g, ""); //将字符串中出现的所有- 替换成 ''
        var str1 = data1.slice(0, 4);
        var str2 = data1.slice(4, 6);
        var str = str1 + '年' + str2 + '月';
        str = str.replace(/[0-9]/g, function (word) {
            return `<span class="${family}">${word}</span>` + '';
        });
        return str
    }
};

export default commonFun;