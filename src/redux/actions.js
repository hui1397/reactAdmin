// 包含n个action creator函数的模块
// 同步action：对象 {type：'xxx',data:数据值}
// 异步action dispath=>{}
// import { composeWithDevTools } from 'redux-devtools-extension'
import storageUtils from '../utils/storageUtils'
import { reqLogin } from '../api'
import { SET_HEAD_TITLE, RECEIVE_USER, SHOW_ERROR_MSG, RESET_USER } from './action-type'
// 设置头部标题同步的action
export const setHeadTitle = (headTitle) => ({ type: SET_HEAD_TITLE, data: headTitle })

// 接收用户的同步action
export const receiveUser = (user) => ({ type: RECEIVE_USER, user })
    // 显示错误的
export const showErrorMsg = (errorMsg) => ({ type: SHOW_ERROR_MSG, errorMsg })
    // 登录的异步action
export const login = (username, password) => {
    return async dispatch => {
        // 1 执行异步ajax请求
        const response = await reqLogin(username, password)
        if (response.status === 0) {
            // 登录成功
            const user = response.data
            storageUtils.saveUser(user)

            dispatch(receiveUser(user))
        } else {
            // 登录失败
            const msg = response.msg
            dispatch(showErrorMsg(msg))
        }
    }

}

// 退出登录的同步action
export const loginOut = () => {
    storageUtils.removeUser()
        // 返回action对象
    return { type: RESET_USER }
}