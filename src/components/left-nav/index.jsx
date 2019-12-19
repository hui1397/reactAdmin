import React, { Component } from 'react'
import './index.less'

import { Link, withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd';
import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'
const SubMenu = Menu.SubMenu;

class LeftNav extends Component {
    // 方法一：map处理+递归调用
    getMenuList_map = (menuList) => {
        // 根据数据数组生成对应的标签数组
        return menuList.map((item) => {
            if (!item.children) {
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            } else {
                return (
                    <SubMenu
                        key={item.key}
                        title={<span>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </span>}
                    >
                        {
                            // 递归调用
                            this.getMenuList(item.children)
                        }
                    </SubMenu>
                )
            }

        })
    }
    // 方法二: reduce()+递归调用
    getMenuNodes = (menuList) => {
        let path = this.props.location.pathname
        return menuList.reduce((pre, item) => {
            // 想pre添加标签
            if (!item.children) {
                pre.push((
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                ))
            } else {
                // 查找改子模块是否有与当前路由匹配的key
                const cItem = item.children.find(cItem => cItem.key === path)
                // 如果存在，说明当前item的子列表需要打开
                if(cItem){
                    this.openKey = item.key
                }
                


                pre.push((
                    <SubMenu
                        key={item.key}
                        title={<span>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </span>}
                    >
                        {
                            // 递归调用
                            this.getMenuNodes(item.children)
                        }
                    </SubMenu>
                ))
            }
            return pre
        }, [])
    }

    // 为第一次render()装备数据(必须同步)
    componentWillMount(){
        this.menuNodes = this.getMenuNodes(menuList)
    }
    render() {
        // 得到当前请求路由
        let path = this.props.location.pathname
        return (
            <div className="left-nav">
                <Link to='/' className="left-nav-header">
                    <img src={logo} alt="logo" />
                    <h1>react后台</h1>
                </Link>
                <Menu theme="dark" selectedKeys={[path]} defaultOpenKeys={[this.openKey]} mode="inline">
                    {this.menuNodes}
                </Menu>
            </div>
        )
    }
}

/*
withRouter高阶组件:
包装非路由组件, 返回一个新的组件
新的组件向非路由组件传递3个属性: history/location/match
 */

export default withRouter(LeftNav)