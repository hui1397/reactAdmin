import {connect} from 'react-redux'

import Counter from '../componerts/Counter'
import { increment, decrement } from '../redux/actions'


// 容器逐渐：通过connect包装ui组件产生组件
// connect():高阶函数
// connect():返回的函数是一个高阶组件:接受一个ui组件,生成一个容器组件
// 容器组件的责任:想ui组件传入特定的属性

// 用来将redux管理的state数据映射成UI组件的(一般属性)的函数
function mapStateToProps(state){
    return {
        count:state
    }
}
// 用来将redux管理的state数据映射成UI组件的(函数属性)的函数
function mapDispathchToprops(dispatch){
    return {
        increment:(number)=>dispatch(increment(number)),
        decrement:(number)=>dispatch(decrement(number))
    }
}


export default connect(
    mapStateToProps, //指定一般属性
    mapDispathchToprops //指定函数属性
)(Counter)