import React, { Component } from 'react'
import './index.less'

import { Modal } from 'antd'
import LinkButton from '../link-button'
import { reqWeather } from '../../api'
import { withRouter } from 'react-router-dom'
import menuList from '../../config/menuConfig'
import { formateDate } from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
class Header extends Component {
    state = {
        currentTime: formateDate(Date.now()), // 当前时间字符串
        dayPictureUrl: '', //天气图片
        weather: '', //天气文本
    }

    // 获取当前时间
    getTime = () => {
        this.intervalId=setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({ currentTime })
        }, 1000)
    }

    // 获取天气状态
    getWeather = async () => {
        const { dayPictureUrl, weather } = await reqWeather('福州')
        // 更新状态
        this.setState({ dayPictureUrl, weather })
    }

    // 获取title
    getTitle = () => {
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
            if (item.key === path) {
                // 如果当前item对象的key与path一样，item的title就是需要显示的key
                title = item.title
            } else if (item.children) {
                const cItem = item.children.find(cItem => cItem.key === path)
                // 如果有值才说明有匹配的
                if (cItem) {
                    title = cItem.title
                }
            }
        })

        return title
    }

    /* 退出登陆 */
    logout = () => {
        // 显示确认框
        Modal.confirm({
            content: '确定退出吗?',
            onOk: () => {
                console.log('OK', this)
                // 删除保存的user数据
                storageUtils.removeUser()
                memoryUtils.user = {}

                // 跳转到login
                this.props.history.replace('/login')
            }
        })
    }

    // 第一次render()之后执行一次,一般在此执行一步操作:发ajax请求/定时器
    componentDidMount() {
        this.getTime()
        this.getWeather()
    }

    // 当前组件卸载之前
    componentWillUnmount() {
        // 清除定时器
        clearInterval(this.intervalId)
    }

    render() {
        const username = memoryUtils.user.username
        const title = this.getTitle()

        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎,{username},</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{this.state.currentTime}</span>
                        <img src={this.state.dayPictureUrl} alt="weather" />
                        <span>{this.state.weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)
