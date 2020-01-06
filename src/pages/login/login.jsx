import React, { Component } from 'react'
import logo from '../../assets/images/logo.png'
import { Form, Icon, Input, Button } from 'antd';
import './login.less'
import {Redirect } from 'react-router-dom'

// import memoryUtils from '../../utils/memoryUtils'
// import storageUtils from '../../utils/storageUtils'

// import { reqLogin } from '../../api'

import {connect} from 'react-redux'
import {login} from '../../redux/actions'
 // 登录路由组件
class Login extends Component {
  

    handleSubmit = (event) => {
        event.preventDefault()
        // 获取表单项的输入数据
        this.props.form.validateFields(async (err, values) => {
            // 校验成功
            if (!err) {
                const { username, password } = values
                this.props.login(username, password)
                // const response = await reqLogin(username, password)
                // if(response.status ===0 ){
                //     // 登录成功
                //     message.success('登录成功')

                //     const user=response.data
                //     memoryUtils.user=user
                //     storageUtils.saveUser(user) //保存到缓存中

                //     //跳到管理界面(不需要回退)(需要回退用push)
                //     this.props.history.replace('/home')
                // }else{
                //     // 登录失败
                //     message.error(response.msg)
                // }

            } else {
                console.log(1)
            }
        })
        // // 得到form对象
        // const form = this.props.form
        // const values = form.getFieldsValue()
        // console.log(form)
        // console.log(values)
    }
    validatePwd = (rule, value, callback) => {
        if (!value) {
            callback('密码必须输入')
        } else if (value.length < 4) {
            callback('密码长度不能小于4位')
        } else if (value.length > 12) {
            callback('密码长度不能大于12位')
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            callback('密码必须是英文、数字或下划线组成')
        } else {
            callback() // 验证通过
        }
        // callback('xxxx') // 验证失败, 并指定提示的文本
    }
    render() {
        // const user = memoryUtils.user
        const user = this.props.user
        if( user  && user._id){
            // 自动跳转到登录界面
            return <Redirect to='/home'></Redirect>
        }

        // 得到具有强大功能的对象
        const form = this.props.form;
        const { getFieldDecorator } = form;
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo" />
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className="login-content">
                <div className={user.errorMsg ? 'error-msg show' : 'error-msg'}>{user.errorMsg}</div>
                    <h2>用户登录</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {
                                getFieldDecorator('username', {
                                    // 配置对象:属性名是特定的名称
                                    // 声明式验证：直接使用别人定义好的验证规则进行验证
                                    rules: [
                                        { required: true, whitespace: true, message: '用户名必须输入' },
                                        { min: 4, message: '用户名至少4位' },
                                        { max: 12, message: '用户名最多12位' },
                                        { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文，数字或下划线组成的' }
                                    ],
                                    initialValue: 'admin' //初始值
                                })(
                                    <Input
                                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder="用户名"
                                    />
                                )
                            }

                        </Form.Item>
                        <Form.Item>
                            {
                                getFieldDecorator('password', {
                                    rules: [{ validator: this.validatePwd }]
                                })(
                                    <Input
                                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        type="password"
                                        placeholder="密码"
                                    />
                                )
                            }
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Log in
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}

/*
 1. 高阶函数
    1).一类特别的函数
        a. 接受函数类型的参数
        b. 返回值是函数
    2).常见
        a. 定时器
        b. Promise: Promise(()=>{}) then(value=>{},reason=>{})
        c. 数组遍历相关的方法： forEach()/filter()/map()/reduce()/find()/findIndex()
        d. 函数对象fn.bind()
        e. Form.create()()
    3).高阶函数更新动态,更加具有扩展性

 2. 高阶组件
    1). 本质就是一个函数
    2). 结束一个组件(被包装组件),返回一个新的组件(包装组件),包装组件会向被包装组件传入特点属性
    3). 作用:扩展组件的功能
    4). 高阶组件也是高阶函数: 接受一个组件函数,返回是一个新的组件函数

*/


/*
    包装Form组件生成一个新的组件:Form(Login)
    新组件会想Form组件传递一个强大的对象:Form
*/
const WrappedNormalLoginForm = Form.create()(Login);
export default connect(
    state=>({user:state.user}),
    {login}
)(WrappedNormalLoginForm) 
// ReactDOM.render(<WrappedNormalLoginForm />, mountNode);