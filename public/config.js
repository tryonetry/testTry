var  ApiUrl = {};
ApiUrl.targetHost = 'http://192.168.1.215:8181/';
ApiUrl.readAddress = '192.168.1.215';   //阅读器主机
// ApiUrl.targetHost = 'http://10.4.105.7:8080/';
// ApiUrl.readAddress = '10.4.105.7';   //阅读器主机
//在http.js 当对象用
export {
    ApiUrl
}
//在main.js里当模块用
export default{ 
    ApiUrl 
}
