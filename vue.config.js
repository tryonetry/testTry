module.exports = {
    // configureWebpack: config => {
    //     if (process.env.NODE_ENV === 'production') {
    //         // 为生产环境修改配置...
    //     } else {
    //         // 为开发环境修改配置...
    //     }
    // },
    //axios域代理，解决axios跨域问题
    // publicPath: '/',
    devServer: {
        open: false, //浏览器自动打开页面
        host: "192.168.1.211", //如果是真机测试，就使用这个IP
        port: 8088,
        https: false,
        hotOnly: false, //热更新（webpack已实现了，这里false即可）

        proxy: {
            //配置跨域
            '/api': {
                target: "http://192.168.1.215:8180",
                ws: true,
                changOrigin: true,
                pathRewrite: {
                    '^/api': '/'
                }
            }
        }

    }
}