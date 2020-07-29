import React from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import Home from './Pages/Home/Home'
import Register from './Pages/Register/Register'
import Login from './Pages/Login/Login'
import AppBar from './Components/AppBar'

const Routers = () => {
	return (
		<BrowserRouter>
			<AppBar />
			<style>{'body { background-color:#0f4c75 }'}</style>
			<Switch>
				<Route path="/" exact component={Home} />
				<Route path="/login" exact component={Login} />
				<Route path="/register" exact component={Register} />
			</Switch>
		</BrowserRouter>
	)
}

export default Routers
