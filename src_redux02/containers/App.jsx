import {connect} from 'react-redux'

import Counter from '../componerts/Counter'
import { increment, decrement ,incrementAsync} from '../redux/actions'


export default connect(
    state=>(state), //指定一般属性
    {increment,decrement,incrementAsync}
)(Counter)