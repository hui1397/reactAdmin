/*
要求:能根据接口文档定义接口请求
包含应用中所有接口请求接口的模块
每个函数的返回都是promise
*/
import ajax from './ajax'


const BASE = ''
    // 登录
    // export function reqLogin() {
    //     return ajax('/login', { username, password }, 'POST')
    // }
export const reqLogin = (username, password) => ajax(BASE + '/login', { username, password }, 'POST')
    // 添加用户
export const reqAddUser = (user) => ajax(BASE + '/manage/user/add', user, 'POST')