import axios from 'axios'
import qs from 'qs'

// axios.defaults.timeout = 20000; 
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.baseURL = 'hasngcadrefile/';   //配置接口地址
axios.defaults.withCredentials=true; // 带cookie

axios.interceptors.request.use(
    config => {
        // Set token here
        //config.headers['TICKET'] = getToken()
        
        // transform post data to queryString
        if (config.method === 'post' && config.headers['Content-Type'] !== 'multipart/form-data') {
            config.data = qs.stringify(config.data)
        }

        // 文件上传
        // 只需要在Post请求时候将opts的headers属性设置为
        // { 'Content-Type': 'multipart/form-data' }
        // 即可。例：
        // const uploadImage = params => request('post', '/upload', params, {
        //   headers: {
        //     'Content-Type': 'multipart/form-data'
        //   }
        // })
        //
        // 下面以使用FormData的file字段名来保存文件举例。
        // 若为单图上传，则将File类型保存到字段名`file`中即可。
        // 若为多图上传，则需将File类型的数据数组保存在`file[]`形式的字段内。

        if (config.headers['Content-Type'] === 'multipart/form-data') {
            const { data } = config
            let fd = new FormData();

            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    console.log(config)
                    if (key.endsWith('[]')) {
                        data[key].forEach(item => {
                        fd.append(key, item)
                        })
                    } else {
                        fd.append(key, data[key])
                    }
                }
            }
            config.data = fd
        }
        
        return config
    },
    err => {
      return Promise.reject(err)
    }
  )


//返回状态判断(添加响应拦截器)
axios.interceptors.response.use((res) =>{
    //对响应数据做些事
    if(!res.data.success){
        return Promise.resolve(res);
    }
    return res;
}, (error) => {
    console.log('网络异常')
    return Promise.reject(error);
});

//返回一个Promise(发送post请求)
export function fetchPost(url, params, config) {
    return new Promise((resolve, reject) => {
        axios.post(url, params, config)
            .then(response => {
                // console.log(response)
                resolve(response.data);
            }, err => {
                reject(err);
            })
            .catch((error) => {
                reject(error)
            })
    })
}
////返回一个Promise(发送get请求)
export function fetchGet(url, param) {
    return new Promise((resolve, reject) => {
        axios.get(url, {params: param})
            .then(response => {
                resolve(response.data)
            }, err => {
                reject(err)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

export default {
    fetchPost,
    fetchGet,
}