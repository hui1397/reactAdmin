// redux 最核心管理对象 store
import { createStore } from 'redux'
import reducer from './reducer'

export default createStore(reducer) //创建store对象，内部会第一次调用reducer()得到初始状态值