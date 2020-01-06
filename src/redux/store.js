// redux 最核心管理对象 store
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk' //用来实现redux异步的redux中间件 (支持异步插件,redux本身不支持异步)
import { composeWithDevTools } from 'redux-devtools-extension'
import reducer from './reducer'

export default createStore(reducer, composeWithDevTools(applyMiddleware(thunk))) //创建store对象，内部会第一次调用reducer()得到初始状态值