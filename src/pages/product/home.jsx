import React, { Component } from 'react'
import {
    Card,
    Select,
    Input,
    Button,
    Icon,
    Table,
    message
} from 'antd'
import LinkButton from '../../components/link-button'
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api'
// import {PAGE_SIZE} from '../../utils/constants'

const Option = Select.Option

// Product默认子路由组件
export default class ProductHome extends Component {
    state = {
        product: []//商品数组
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
                dataIndex: 'status',
                render: (status) => (
                    <span>
                        <Button >{status === 1 ? '下架' : '上架'}</Button>
                        <LinkButton >{status === 1 ? '在售' : '下架'} </LinkButton>
                    </span>
                )
            },
            {
                title: '操作',
                dataIndex: 'name',
                render: (product) => (
                    <span>
                        <LinkButton onClick={() => this.props.history.push('/product/detail', { product })}>详情</LinkButton>
                        <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
                    </span>
                )
            }
        ]
    }
    componentWillMount() {
        this.initColumns()
    }
    render() {
        // 取出状态数据
        const title = (
            <span>
                <Select style={{ width: 50 }}>
                    <Option value="1">1</Option>
                    <Option value="2">2</Option>
                </Select>
                <Input placeholder="关键字" style={{ width: 150, margin: '0 15px' }}></Input>
                <Button type='primary' >搜索</Button>
            </span>
        )
        const extra = (
            <Button type='primary' >
                <Icon type="plus" />
                添加商品
            </Button>
        )
        const columns = this.columns
        const dataSource = []
        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    rowKey='_id'
                    //   loading={loading}
                    dataSource={dataSource}
                    columns={columns}
                />
            </Card>
        )

    }
}