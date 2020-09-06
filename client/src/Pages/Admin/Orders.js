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
	FormControl,
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
			fontSize: 22,
		},
	},
	typography2: {
		[theme.breakpoints.up('xs')]: {
			fontSize: 20,
		},
	},
	typography3: {
		[theme.breakpoints.up('xs')]: {
			fontSize: 12,
		},
		[theme.breakpoints.up('sm')]: {
			fontSize: 14,
		},
		[theme.breakpoints.up('md')]: {
			fontSize: 16,
		},
		[theme.breakpoints.up('lg')]: {
			fontSize: 18,
		},
	},
}))

const Orders = () => {
	const classes = useStyles()
	const [orders, setOrders] = useState([])
	const [status, setStatus] = useState([])
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

	const fetchListStatus = () => {
		axios
			.get(process.env.REACT_APP_BASE_URL + `orders/status/${userID}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then(data => {
				setStatus(data.data)
			})
			.catch(err => {
				console.log(err.response.data.err)
			})
	}

	const fetchUpdateStatus = (orderID, body) => {
		axios
			.put(
				process.env.REACT_APP_BASE_URL + `orders/${orderID}/status/${userID}`,
				body,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
			.then(() => {
				fetchOrdersList()
			})
			.catch(err => {
				console.log(err.response.data.err)
			})
	}

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

	const showProducts = (key, value) => {
		return (
			<Typography className={classes.typography3} variant="inherit">
				{key}
				{value}
			</Typography>
		)
	}

	const handleStatusChange = (e, orderId) => {
		fetchUpdateStatus(orderId, {status: e.target.value})
	}

	const listStatus = o => (
		<Fragment style={{justifyContent: 'flex-start'}}>
			<Typography variant="inherit" align="center">
				{o.status}
			</Typography>
			<FormControl style={{marginLeft: '5px'}}>
				<select onChange={e => handleStatusChange(e, o._id)}>
					<option>Update Status</option>
					{status &&
						status.map((s, i) => {
							return (
								<option key={i} value={s}>
									{s}
								</option>
							)
						})}
				</select>
			</FormControl>
		</Fragment>
	)

	useEffect(() => {
		fetchOrdersList()
		fetchListStatus()
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
													{listStatus(o)}
												</MenuItem>

												<Divider />
												<MenuItem style={{justifyContent: 'flex-start'}}>
													<Typography variant="inherit" align="center">
														TransactionID: {o.transaction_id}
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
														<Typography
															className={classes.typography2}
															variant="h5"
															align="center"
														>
															Total items in the orders: {o.products.length}
														</Typography>
													</strong>
												</MenuItem>
												<div style={{justifyContent: 'flex-start'}}>
													{o.products &&
														o.products.map(p => {
															return (
																<MenuList key={p._id}>
																	<MenuItem>
																		<strong>
																			{showProducts('ProductID: ', p._id)}
																		</strong>
																	</MenuItem>
																	<div
																		style={{
																			border: '1px solid black',
																			margin: '5px',
																		}}
																	>
																		<MenuItem>
																			{showProducts('Name: ', p.name)}
																		</MenuItem>
																		<MenuItem>
																			{showProducts('Price: ', p.price)}
																		</MenuItem>
																		<MenuItem>
																			{showProducts('Quantity: ', p.count)}
																		</MenuItem>
																		<MenuItem>
																			{showProducts(
																				'Total: ',
																				`$${p.count * p.price}`,
																			)}
																		</MenuItem>
																	</div>
																</MenuList>
															)
														})}
												</div>
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
