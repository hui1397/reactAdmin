import React, { Component } from 'react'
import {Switch,Route,Redirect} from 'react-router-dom'

import ProductHome from './home'
import ProductAdUpdate from './add-update'
import ProductDetail from './detail'
import './product.less'
// 商品路由
export default class Product extends Component {
    render() {
        return (
           <div>
             <Switch>
               <Route exact path='/product' component={ProductHome}></Route>
               <Route path='/product/addupdate' component={ProductAdUpdate}></Route>
               <Route path='/product/detail' component={ProductDetail}></Route>
                <Redirect to='/product'></Redirect>
             </Switch>
           </div>
        )

    }
}