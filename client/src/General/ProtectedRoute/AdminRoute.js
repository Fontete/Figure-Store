import React from 'react'
import {Route, Redirect} from 'react-router-dom'
import {isAuthenticated} from '../Method'

const AdminRoute = ({component: Component, ...rest}) => (
	<Route
		{...rest}
		render={props =>
			isAuthenticated() && isAuthenticated().data.user.role === 0 ? (
				<Component {...props} />
			) : (
				<Redirect
					to={{
						pathname: '/login',
						state: {from: props.location},
					}}
				/>
			)
		}
	/>
)

export default AdminRoute
