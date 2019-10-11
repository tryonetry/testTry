module.exports = {
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            // 为生产环境修改配置...
        } else {
            // 为开发环境修改配置...
        }
    },
    //axios域代理，解决axios跨域问题
    publicPath: './',
    devServer: {
        open: false, //浏览器自动打开页面
        host: "localhost", //如果是真机测试，就使用这个IP
        port: 8088,
        https: false,
        hotOnly: false, //热更新（webpack已实现了，这里false即可）
        hot:true,
        inline:true,
        proxy: {
            //配置跨域
            '/': {
                target: "192.168.1.222:8181",
                ws: false,
                changOrigin: true,
                pathRewrite: {
                    '^/': '/'
                }
            }
        }

    }
}