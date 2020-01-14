import React, { Component } from 'react'
import {
  Card,
  Form,
  Input,
  Cascader,
  Button,
  Icon,
  message
} from 'antd'
import LinkButton from '../../components/link-button'
import { reqCategorys, reqAddOrUpdateProduct } from '../../api'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'
import memoryUtils from "../../utils/memoryUtils";
const { Item } = Form
const { TextArea } = Input




// Product的添加和更新子路由组件
class ProductAdUpdate extends Component {

  constructor(props) {
    super(props)

    // 创建用来保存ref标识的标签
    this.pw = React.createRef()
    this.editor = React.createRef()
  }
  state = {
    options: []
  }
  submit = () => {
    // 进行表单验证
    this.props.form.validateFields(async (error, values) => {
      if (!error) {
        // 1收集数据  并封装凤product对象
        const { name, desc, price, categoryIds } = values
        let pCategoryId, categoryId
        console.log(values)
        if (categoryIds.length === 1) {
          pCategoryId = '0'
          categoryId = categoryIds[0]
        } else {
          pCategoryId = categoryIds[0]
          categoryId = categoryIds[1]
        }

        const imgs = this.pw.current.getImgs()
        const detail = this.editor.current.getDetail()

        const product = { name, desc, price, imgs, detail, pCategoryId, categoryId }
        // 如果是更新,需要添加_id
        if (this.isUpdate) {
          product._id = this.product._id
        }

        // 2调用接口请求函数
        const result = await reqAddOrUpdateProduct(product)

        // 3根据结果提升
        if (result.status === 0) {
          message.success(`${this.isUpdate ? '更新' : '添加'}商品成功!`)
          this.props.history.goBack()
        } else {
          message.error(`${this.isUpdate ? '更新' : '添加'}商品失败!`)
        }

        console.log(imgs)
      }
    })
  }

  // 用于加载下一级列表的回调函数
  loadData = async selectedOptions => {
    // 得到选择的options对象
    const targetOption = selectedOptions[0];
    targetOption.loading = true;
    // 根据选择的分类，请求获取二级分类列表
    const subCategotys = await this.getCategorys(targetOption.value)
    targetOption.loading = false;
    if (subCategotys && subCategotys.length > 0) {
      const childOptions = subCategotys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))
      targetOption.children = childOptions
    } else {
      // 没有子分类 
      targetOption.isLeaf = true
    }

    // 更新options状态
    this.setState({
      options: [...this.state.options]
    })
  };

  // 获取分类列表
  getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId)
    if (result.status === 0) {
      const categorys = result.data
      if (parentId === '0') {
        this.initOptions(categorys)
      } else {
        return categorys //返回二级列表
      }

    }
  }

  // 初始化options数组
  initOptions = async (categorys) => {
    const options = categorys.map(c => ({
      value: c._id,
      label: c.name,
      isLeaf: false
    }))

    // 如果是一个二级分类商品的更新
    const { isUpdate, product } = this
    const { pCategoryId } = product
    if (isUpdate && pCategoryId !== '0') {
      // 获取对应的二级分类列表
      const subCategorys = await this.getCategorys(pCategoryId)
      // 生成二级下拉列表的options
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))

      // 找到当前商品对应的一级option对象
      const targetOption = options.find(option => option.value === pCategoryId)

      // 关联对应的一级option上
      targetOption.children = childOptions
    }

    this.setState({ options })
  }

  // 验证价格的函数
  validatorPrice = (rule, value, callback) => {
    if (value * 1 > 0) {
      callback() //验证通过
    } else {
      callback('价格必须大于0')
    }
  }


  componentDidMount() {
    this.getCategorys('0')
  }

  // componentWillMount() {
  //   // 取出携带的state
  //   const product = this.props.location.state //如果是添加则没值
  //   this.isUpdate = !!product  // 保存一个是否是更新的标识
  //   this.product = product || {} //保存商品初始值 指定{}防止报错
  // }
  componentWillMount () {
    // 取出携带的state
    const product = memoryUtils.product  // 如果是添加没值, 否则有值
    console.log(product)
    // 保存是否是更新的标识
    this.isUpdate = !!product._id
    // 保存商品(如果没有, 保存是{})
    this.product = product || {}
  }

  render() {
    const { isUpdate, product } = this
    console.log(isUpdate)
    const { pCategoryId, categoryId, imgs, detail } = product
    const categoryIds = [] //结束级联分类id的数组
    if (isUpdate) {
      if (pCategoryId === '0') {
        categoryIds.push(categoryId)
      } else {
        // 商品是一个二级分类的商品
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
    }

    // 指定item布局配置对象
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 8 }
    }
    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type="arrow-left" ></Icon>
          <span>{isUpdate ? '修改商品' : '添加商品'}</span>
        </LinkButton>
      </span>
    )

    const { getFieldDecorator } = this.props.form
    return (
      <Card title={title}>
        <Form {...formItemLayout}>
          <Item label='商品名称'>
            {getFieldDecorator('name', {
              initialValue: product.name,
              rules: [{
                required: true, message: '必须输入商品名称'
              }]
            })(<Input placeholder="请输入商品名称"></Input>)}
          </Item>
          <Item label='商品描述'>
            {getFieldDecorator('desc', {
              initialValue: product.desc,
              rules: [{
                required: true, message: '必须输入商品描述'
              }]
            })(<TextArea autoSize={{ minRows: 2, maxRows: 6 }} placeholder="请输入商品描述"></TextArea>)}
          </Item>
          <Item label='商品价格'>
            {getFieldDecorator('price', {
              initialValue: product.price,
              rules: [
                { required: true, message: '必须输入商品价格' },
                { validator: this.validatorPrice }
              ]
            })(<Input placeholder="请输入商品价格" type='number' addonAfter='元'></Input>)}

          </Item>
          <Item label='商品分类'>
            {getFieldDecorator('categoryIds', {
              initialValue: categoryIds,
              rules: [
                { required: true, message: '必须输入商品分类' },
              ]
            })(
              <Cascader
                options={this.state.options} //需要显示的列表数据
                loadData={this.loadData}  //当选择某个列表项,加载下一级列表的监听回调
              // onChange={this.onChange}
              // changeOnSelect
              />,
            )}
          </Item>
          <Item label='商品图片'>
            <PicturesWall ref={this.pw} imgs={imgs}></PicturesWall>
          </Item>
          <Item label='商品详情' labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
            <RichTextEditor ref={this.editor} detail={detail} ></RichTextEditor>
          </Item>
          <Item>
            <Button type='primary' onClick={this.submit}>提交</Button>
          </Item>
        </Form>

      </Card>
    )

  }
}

export default Form.create()(ProductAdUpdate)