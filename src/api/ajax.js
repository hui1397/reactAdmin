/*
能发送异步ajax请求函数模块
封装axios库
函数的返回值是promise对象
1  优化：统一处理异常?
    在外层包一个自己创建的promise对象
    在请求出错时显示错误提示
*/

import axios from 'axios'
import { message } from 'antd'

export default function ajax(url, data = {}, type = 'GET') {
    return new Promise((resolve, reject) => {
        let promise
            //1. 执行一步ajax请求
        if (type === 'GET') {
            promise = axios.get(url, {
                params: data
            })
        } else {
            promise = axios.post(url, data)
        }
        //2. 如果成功调用resolve
        promise.then(response => {
            resolve(response.data)
        }).catch(error => {
            //3. 如果失败不调用reject,而是现实异常信息
            message.error('请求出错了:' + error.message)
        })

    })

}