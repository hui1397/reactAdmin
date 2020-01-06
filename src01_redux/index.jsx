import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import store from './redux/store'

ReactDOM.render(<App store={store}/>, document.getElementById('root'));
// 给store 绑定状态更新的监听
store.subscribe(()=>{
    // store内部的状态数据发生改变回调 
    // 重新渲染app组件标签
    ReactDOM.render(<App store={store}/>, document.getElementById('root'));
})
