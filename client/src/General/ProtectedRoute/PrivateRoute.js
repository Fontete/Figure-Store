import React from 'react'
import {Route, Redirect} from 'react-router-dom'
import {isAuthenticated} from '../Method/Authenticate'

const PrivateRoute = ({component: Component, ...rest}) => {
	return (
		<Route
			{...rest}
			render={props =>
				isAuthenticated() && isAuthenticated().data.user.role === 1 ? (
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
}

export default PrivateRoute
