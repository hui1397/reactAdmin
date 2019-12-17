import React, { Component } from 'react'
import logo from './images/logo.png'
import './login.less'
// 登录路由组件
export default class Login extends Component {
    render() {
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo"/>
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                </section>
            </div>
        )
    }
}