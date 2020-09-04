import React, {useState, useEffect, Fragment} from 'react'
import axios from 'axios'
import {isAuthenticated} from '../../General/Method/Authenticate'
import {Link} from 'react-router-dom'
import {
	Typography,
	Grid,
	Paper,
	MenuList,
	MenuItem,
	Divider,
} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import moment from 'moment'

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
	},
	paper: {
		[theme.breakpoints.up('xs')]: {
			width: 'auto',
		},
		[theme.breakpoints.up('sm')]: {
			width: 'auto',
		},
		[theme.breakpoints.up('md')]: {
			width: 'auto',
			marginLeft: '5em',
			marginRight: '5em',
		},
		[theme.breakpoints.up('lg')]: {
			marginLeft: '20em',
			marginRight: '20em',
		},
		padding: theme.spacing(2),
		textAlign: 'center',
		color: theme.palette.text.secondary,
	},
	typography: {
		[theme.breakpoints.up('xs')]: {
			fontSize: 25,
		},
		[theme.breakpoints.up('sm')]: {
			fontSize: 'auto',
		},
		[theme.breakpoints.up('md')]: {
			fontSize: 'auto',
		},
		[theme.breakpoints.up('lg')]: {
			fontSize: 'auto',
		},
	},
}))

const Orders = () => {
	const classes = useStyles()
	const [orders, setOrders] = useState([])
	const userID = isAuthenticated().data.user._id
	const token = isAuthenticated().data.token

	const fetchOrdersList = () => {
		axios
			.get(process.env.REACT_APP_BASE_URL + `orders/${userID}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then(data => {
				setOrders(data.data)
			})
			.catch(err => {
				console.log(err.response.data.err)
			})
	}

	console.log(orders)

	const length = () => {
		if (orders.length > 0) {
			return (
				<Typography
					variant="h4"
					align="center"
					color="secondary"
				>{`Total: ${orders.length} orders`}</Typography>
			)
		} else {
			return (
				<Typography color="secondary" variant="h4" align="center">
					Empty
				</Typography>
			)
		}
	}

	useEffect(() => {
		fetchOrdersList()
	}, [])

	return (
		<div className={classes.root} style={{padding: '8em 0.5em 3em 0.5em'}}>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Paper className={classes.paper} style={{backgroundColor: '#3282b8'}}>
						{length()}
						<Divider style={{marginBottom: '2em'}} />
						{orders &&
							orders.map(o => {
								return (
									<Fragment key={o._id}>
										<strong>
											<Typography
												className={classes.typography}
												variant="h4"
												align="center"
											>
												OrderID: {o._id}
											</Typography>
										</strong>

										<Divider />
										<MenuList style={{margin: '0 0 2em 0'}}>
											<div style={{border: '1px solid indigo'}}>
												<MenuItem style={{justifyContent: 'flex-start'}}>
													<Typography variant="inherit" align="center">
														{o.status}
													</Typography>
												</MenuItem>
												<Divider />
												<MenuItem style={{justifyContent: 'flex-start'}}>
													<Typography variant="inherit" align="center">
														Transaction ID: {o.transaction_id}
													</Typography>
												</MenuItem>
												<Divider />
												<MenuItem style={{justifyContent: 'flex-start'}}>
													<Typography variant="inherit" align="center">
														Amount: ${o.amount}
													</Typography>
												</MenuItem>
												<Divider />
												<MenuItem style={{justifyContent: 'flex-start'}}>
													<Typography variant="inherit" align="center">
														Order By: {`${o.user.firstName} ${o.user.lastName}`}
													</Typography>
												</MenuItem>
												<Divider />
												<MenuItem style={{justifyContent: 'flex-start'}}>
													<Typography variant="inherit" align="center">
														Ordered on: {moment(o.createdAt).fromNow()}
													</Typography>
												</MenuItem>
												<Divider />
												<MenuItem style={{justifyContent: 'flex-start'}}>
													<Typography variant="inherit" align="center">
														Shipping address: {o.address}
													</Typography>
												</MenuItem>
												<Divider />
												<MenuItem style={{justifyContent: 'flex-start'}}>
													<strong>
														<Typography variant="h5" align="center">
															Total items in the orders: {o.products.length}
														</Typography>
													</strong>
												</MenuItem>
												<Divider />
											</div>
										</MenuList>
									</Fragment>
								)
							})}
					</Paper>
				</Grid>
			</Grid>
		</div>
	)
}

export default Orders
