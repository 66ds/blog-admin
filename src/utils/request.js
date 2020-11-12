import axios from 'axios';
import { MessageBox } from 'element-ui';

axios.defaults.headers.common['Authorization'] = localStorage.getItem("token");//设置请求头token

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    baseURL: 'http://127.0.0.1:12000/',
    timeout: 5000
});

service.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        return Promise.reject("Internet Error");
    }
);

service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            if(response.data.code === 10008){
                MessageBox.alert(response.data.msg, {
                    confirmButtonText: '确定',
                    callback: action => {
                        location.href="/login"
                    }
                });
            }else{
                return response.data;
            }
        } else {
            return Promise.reject("Internet Error");
        }
    },
    error => {
        return Promise.reject("Internet Error");
    }
);

export default service;
