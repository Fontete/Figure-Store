import React, {Fragment} from 'react'
import {BrowserRouter, Switch, Route, withRouter} from 'react-router-dom'
import Home from './Pages/Shop/Home'
import Register from './Pages/User/Register'
import Login from './Pages/User/Login'
import AppBar from './Components/AppBar'
import UserDashboard from './Pages/User/UserDashboard'
import AdminDashboard from './Pages/Admin/AdminDashboard'
import AddCategory from './Pages/Admin/AddCategory'
import AddProduct from './Pages/Admin/AddProduct'
import Shop from './Pages/Shop/ListProduct'
import Detail from './Pages/Shop/ProductDetail'

import PrivateRoute from './General/ProtectedRoute/PrivateRoute'
import AdminRoute from './General/ProtectedRoute/AdminRoute'
import Checkout from './Pages/Shop/Checkout'
import Orders from './Pages/Admin/Orders'
import Profile from './Pages/User/Profile'

const App = withRouter(({location}) => {
	return (
		<Fragment>
			{location.pathname !== '/login' &&
				location.pathname !== '/register' &&
				location.pathname !== '/checkout' && <AppBar />}
			<style>{'body { background-color:	#000000 }'}</style>
			<Switch>
				<Route path="/" exact component={Home} />
				<Route path="/login" exact component={Login} />
				<Route path="/register" exact component={Register} />
				<Route path="/shop" exact component={Shop} />
				<Route path="/product/:productId" exact component={Detail} />
				<PrivateRoute path="/profile/:userId" exact component={Profile} />
				<PrivateRoute path="/checkout" exact component={Checkout} />
				<PrivateRoute path="/user/profile" exact component={UserDashboard} />
				<AdminRoute path="/admin/profile" exact component={AdminDashboard} />
				<AdminRoute path="/admin/category/add" exact component={AddCategory} />
				<AdminRoute path="/admin/product/add" exact component={AddProduct} />
				<AdminRoute path="/admin/product/orders" exact component={Orders} />
			</Switch>
		</Fragment>
	)
})

const Routers = () => {
	return (
		<BrowserRouter>
			<App />
		</BrowserRouter>
	)
}

export default Routers
