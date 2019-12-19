import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// 读取local中user
import memoryUtils from './utils/memoryUtils'
import storageUtils from './utils/storageUtils'
const user = storageUtils.getUser()
memoryUtils.user = user
console.log(memoryUtils.user)


ReactDOM.render(<App />, document.getElementById('root'));
