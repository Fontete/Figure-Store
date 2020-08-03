import React, {Fragment} from 'react'
import {BrowserRouter, Switch, Route, withRouter} from 'react-router-dom'
import Home from './Pages/Home/Home'
import Register from './Pages/User/Register'
import Login from './Pages/User/Login'
import AppBar from './Components/AppBar'
import UserDashboard from './Pages/User/UserDashboard'
import AdminDashboard from './Pages/User/AdminDashboard'

import PrivateRoute from './General/ProtectedRoute/PrivateRoute'
import AdminRoute from './General/ProtectedRoute/AdminRoute'
import AddCategory from './Pages/Product/AddCategory'
import AddProduct from './Pages/Product/AddProduct'

const App = withRouter(({location}) => {
	return (
		<Fragment>
			{location.pathname !== '/login' && location.pathname !== '/register' && (
				<AppBar />
			)}
			<style>{'body { background-color:#0f4c75 }'}</style>
			<Switch>
				<Route path="/" exact component={Home} />
				<Route path="/login" exact component={Login} />
				<Route path="/register" exact component={Register} />
				<PrivateRoute path="/user/dashboard" exact component={UserDashboard} />
				<AdminRoute path="/admin/dashboard" exact component={AdminDashboard} />
				<AdminRoute path="/admin/category/add" exact component={AddCategory} />
				<AdminRoute path="/admin/product/add" exact component={AddProduct} />
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
