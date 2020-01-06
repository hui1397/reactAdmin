import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import { Layout } from 'antd'
import { connect } from 'react-redux'
// import memoryUtils from '../../utils/memoryUtils'
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import NotFound from '../not-found/not-found'


const { Content, Footer, Sider } = Layout;

// 登录路由组件
class Admin extends Component {
    render() {
        // const user = memoryUtils.user
        const user = this.props.user
        if (!user || !user._id) {
            // 自动跳转到登录界面
            console.log(user)
            return <Redirect to='/login' />
        }
        return (
            <Layout style={{ minHeight: '100%' }}>
                <Sider>
                    <LeftNav />
                </Sider>
                <Layout style={{ minWidth: 760 }}>
                    <Header>Header</Header>
                    <Content style={{ margin: 20, backgroundColor: '#fff' }}>
                        <Switch>
                            <Redirect from='/' exact to='/home' />
                            <Route path='/home' component={Home} />
                            <Route path='/category' component={Category} />
                            <Route path='/product' component={Product} />
                            <Route path='/user' component={User} />
                            <Route path='/role' component={Role} />
                            <Route path="/charts/bar" component={Bar} />
                            <Route path="/charts/pie" component={Pie} />
                            <Route path="/charts/line" component={Line} />
                            <Route component={NotFound} />
                        </Switch>
                    </Content>
                    <Footer style={{ textAlign: 'center', color: '#cccccc' }}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
                </Layout>
            </Layout>
        )
    }
}

export default connect(
    state => ({ user: state.user }),
    {}
)(Admin)