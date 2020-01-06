// 包含n个用来创建action的工厂函数(action creator)
import { INCREMENT, DECREMENT } from './action-types'
// 增加action
export const increment = number => ({ type: INCREMENT, data: number })
    // 减少action
export const decrement = number => ({ type: DECREMENT, data: number })


// 增加的异步action ： 返回的是函数
export const incrementAsync = number => {
    return dispath => {
        // 1 执行异步（当前设置为定时器, ajax)
        setTimeout(() => {
            // 当前异步执行完成是,分发同步acton
            dispath(increment(number))
        }, 1000);
    }
}