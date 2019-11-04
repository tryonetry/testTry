var  ApiUrl = {};
ApiUrl.targetHost = 'http://192.168.1.215:8181/';
ApiUrl.readAddress = '192.168.1.215';   //阅读器主机
ApiUrl.proxyAddress = '192.168.1.215:8181';  //解决代理跨域地址--目前解决不了
//在http.js 当对象用
export {
    ApiUrl
}
//在main.js里当模块用
export default{ 
    ApiUrl 
}
