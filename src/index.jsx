import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Provider} from 'react-redux'
// 读取local中user
import memoryUtils from './utils/memoryUtils'
import storageUtils from './utils/storageUtils'
import store from './redux/store'
const user = storageUtils.getUser()
memoryUtils.user = user
console.log(memoryUtils.user)


ReactDOM.render((
    <Provider store={store}>
    <App />
    </Provider>
), document.getElementById('root'));
