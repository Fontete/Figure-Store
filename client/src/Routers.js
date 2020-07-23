import React from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import Home from './Pages/Home/Home'
import Register from './Pages/Register/Register'
import Login from './Pages/Login/Login'
import AppBar from './Pages/Home/AppBar'

const Routers = () => {
	return (
		<BrowserRouter>
		<AppBar/>
			<Switch>
				<Route path="/" exact component={Home} />
				<Route path="/login" exact component={Register} />
				<Route path="/register" exact component={Login} />
			</Switch>
		</BrowserRouter>
	)
}

export default Routers
