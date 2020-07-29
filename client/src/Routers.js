import React, {Fragment} from 'react'
import {BrowserRouter, Switch, Route, withRouter} from 'react-router-dom'
import Home from './Pages/Home/Home'
import Register from './Pages/User/Register'
import Login from './Pages/User/Login'
import AppBar from './Components/AppBar'

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
