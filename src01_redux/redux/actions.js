// 包含n个用来创建action的工厂函数(action creator)
import { INCREMENT, DECREMENT } from './action-types'
// 增加action
export const increment = number => ({ type: INCREMENT, data: number })
    // 减少action
export const decrement = number => ({ type: DECREMENT, data: number })