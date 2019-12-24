import React, { Component } from 'react'

import {
    Card,
    // Select,
    // Input,
    Button,
    Icon,
    Table,
    message,
    Modal
} from 'antd'
import LinkButton from '../../components/link-button'
import { reqCategorys, reqAddCategory, reqUpdateCategory } from '../../api/index'
import AddForm from './add-form'
import UpdateForm from './update-form'

// 品 类路由
export default class Category extends Component {

    state = {
        loading: false, //是否正在获取数据中
        categorys: [], //一级分类列表
        parentId: '0',//当前分类列表id
        parentName: '', // 当前分类列表的分类名称
        subCategorys: [],//子分类列表
        showStatus: 0,//表示添加/更新的确认框是否显示,0:都不显示,1显示添加,2显示更新
    }

    // 初始化table所有列的数组
    initColumns = () => {
        this.columns = [
            {
                title: '类名',
                dataIndex: 'name',
                key: 'name',
            }, {
                title: '操作',
                width: 300,
                render: (category) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(category)}>修改名称</LinkButton>
                        {this.state.parentId === '0' ? <LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton> : null}
                    </span>
                )
            }
        ]
    }

    // 异步获取一级/二级分类列表
    getCategorys = async (parentId) => {
        this.setState({ loading: true })
        parentId = parentId || this.state.parentId
        const result = await reqCategorys(parentId)
        this.setState({ loading: false })
        if (result.status === 0) {
            const categorys = result.data
            // 更新一级分类状态
            if (parentId === '0') {
                this.setState({ categorys })
            } else {
                this.setState({ subCategorys: categorys })
            }
        } else {
            message.error('获取分类列表失败')
        }
    }
    // 显示指定一级分类对象的二级子列表
    showSubCategorys = (category) => {
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => {
            // 修改状态是异步，所有传一个回调函数执行后面的方法
            console.log(this.setState.parentId)
            this.getCategorys()
        })
    }
    // 更新为显示一级列表状态
    showCategorys = () => {

        this.setState({
            parentId: '0',
            subCategorys: [],
            parentName: ''
        })
    }

    // 为第一次render准备数据
    componentWillMount() {
        this.initColumns()
    }

    // 获取异步
    componentDidMount() {
        this.getCategorys()
    }

    // 响应点击取消
    handleCancel = () => {
        // 清除输入数据
        this.form.resetFields()
        this.setState({
            showStatus: 0
        })
    }

    // 显示添加确认框
    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    }

    // 添加分类
    addCategory = () => {
        this.form.validateFields(async (err, valuer) => {
            if (!err) {
                // 隐藏确认框
                this.setState({
                    showStatus: 0
                })

                // 收集数据并提交添加分类请求
                const { parentId, categoryName } = valuer
                // 清除输入数据
                this.form.resetFields()
                const result = await reqAddCategory(categoryName, parentId)
                if (result.status === 0) {
                    if (parentId === this.state.parentId) {
                        // 重新获取分类列表显示
                        this.getCategorys()
                    } else if (parentId === '0') {
                        // 在二级分类列表下添加一级分类列表
                        this.getCategorys('0')
                    }
                }
            }
        })
    }

    // 显示添加确认框
    showUpdate = (category) => {
        this.category = category
        // 保存分类对象
        this.setState({
            showStatus: 2
        })
    }

    // 更新分类
    updateCategory = () => {
        this.form.validateFields(async (err, valuer) => {
            if (!err) {
                // 隐藏确认框
                this.setState({
                    showStatus: 0
                })

                // 准备数据
                const categoryId = this.category._id
                const { categoryName } = valuer
                // 清除输入数据
                this.form.resetFields()

                // 发请求更新分类
                const result = await reqUpdateCategory({ categoryId, categoryName })
                if (result.status === 0) {
                    // 重新显示列表
                    this.getCategorys()
                }

            }
        })

    }

    render() {
        const { categorys, loading, parentId, subCategorys, parentName, showStatus } = this.state
        // 读取指定分类
        const category = this.category || {} // 如果还没有指定一个空对象

        // card的左侧
        const title = parentId === '0' ? '一级分类列表' : (
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <Icon type='arrow-right' style={{ marginRight: 5 }} />
                <span>{parentName}</span>
            </span>
        )

        // card 的右侧
        const extra = (
            <Button type="primary" onClick={this.showAdd}>
                <Icon type='plus'></Icon>
                添加
            </Button>
        )

        return (
            <div>
                <Card title={title} extra={extra} >
                    <Table
                        bordered
                        rowKey='_id'
                        dataSource={parentId === '0' ? categorys : subCategorys}
                        columns={this.columns}
                        pagination={{ defaultPageSize: 5, showQuickJumper: true }}
                        loading={loading}
                    ></Table>

                    <Modal
                        title="添加分类"
                        visible={showStatus === 1}
                        onOk={this.addCategory}
                        onCancel={this.handleCancel}
                    >
                        <AddForm
                            categorys={categorys}
                            parentId={parentId}
                            setForm={(form) => { this.form = form }}
                        />
                    </Modal>

                    <Modal
                        title="更新分类"
                        visible={showStatus === 2}
                        onOk={this.updateCategory}
                        onCancel={this.handleCancel}
                    >
                        <UpdateForm
                            categoryName={category.name}
                            setForm={(form) => { this.form = form }}
                        />
                    </Modal>
                </Card>
            </div>
        )

    }
}