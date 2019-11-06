var  ApiUrl = {};
ApiUrl.targetHost = 'http://192.168.1.215:8181/';
ApiUrl.readAddress = '192.168.1.215';   //阅读器主机
//在http.js 当对象用
export {
    ApiUrl
}
//在main.js里当模块用
export default{ 
    ApiUrl 
}
