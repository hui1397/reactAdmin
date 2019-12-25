import React, { Component } from 'react'
import {
    Card,
    Select,
    Input,
    Button,
    Icon,
    Table,
    message,
} from 'antd'
import LinkButton from '../../components/link-button'
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'

const Option = Select.Option

// Product默认子路由组件
export default class ProductHome extends Component {
    state = {
        total: 0,//商品总数量
        product: [],//商品数组
        loading: false, // 是否正在加载中
        searchName: '', // 搜索的关键字
        searchType: 'productName', // 根据哪个字段搜索
    }
    // 初始化列
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
                key: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => '￥' + price
            },
            {
                title: '状态',
                render: (product) => {
                    const { status, _id } = product
                    const newStatus = status === 1 ? 2 : 1
                    return (<span>
                        <Button type='primary' onClick={() => this.updateStatus(_id, newStatus)}>{status === 1 ? '下架' : '上架'}</Button>
                        <LinkButton >{status === 1 ? '在售' : '下架'} </LinkButton>
                    </span>)
                }
            },
            {
                title: '操作',
                dataIndex: '',
                render: (product) => (
                    <span>
                        <LinkButton onClick={() => this.props.history.push('/product/detail', { product })}>详情</LinkButton>
                        <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
                    </span>
                )
            }
        ]
    }

    //   更新指定商品的状态
    updateStatus = async (productId, status) => {
        console.log(222)
        const result = await reqUpdateStatus(productId, status)
        if (result.status === 0) {
            message.success('更新商品成功')
            this.getProducts(this.pageNum)
        }
    }

    // 获取指定页码的列表数据显示
    getProducts = async (pageNum) => {
        this.pageNum = pageNum //储存当前页码
        this.setState({ loading: true }) // 显示loading

        const { searchName, searchType } = this.state
        let result
        // 如果搜索关键字有值，说明我们要做搜索分页

        if (searchName) {
            result = await reqSearchProducts({ pageNum, pageSize: PAGE_SIZE, searchName, searchType })
        } else { // 一般分页请求
            result = await reqProducts(pageNum, PAGE_SIZE)
        }

        this.setState({ loading: false })

        if (result.status === 0) {
            const { total, list } = result.data
            this.setState({
                total,
                products: list
            })
        }
    }

    // 即将挂载
    componentWillMount() {
        this.initColumns()
    }

    // 挂载完成
    componentDidMount() {
        this.getProducts(1)
    }

    render() {
        // 取出状态数据
        const { products, total, loading, searchType, searchName } = this.state

        // 取出状态数据
        const title = (
            <span>
                <Select value={searchType} style={{ width: 150 }}
                    onChange={value => this.setState({ searchType: value })}>
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input value={searchName} placeholder="关键字"
                    onChange={e => this.setState({ searchName: e.target.value })}
                    style={{ width: 150, margin: '0 15px' }}></Input>
                <Button onClick={() => this.getProducts(1)} type='primary' >搜索</Button>
            </span>
        )
        const extra = (
            <Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}>
                <Icon type="plus" />
                添加商品
            </Button>
        )
        const columns = this.columns
        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    rowKey='_id'
                    loading={loading}
                    dataSource={products}
                    columns={columns}
                    pagination={{
                        current: this.pageNum,
                        total,
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        onChange: this.getProducts
                    }}

                />
            </Card>
        )

    }
}