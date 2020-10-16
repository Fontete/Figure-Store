import React, {useState, useEffect, Fragment} from 'react'
import axios from 'axios'
import {isAuthenticated} from '../../General/Method/Authenticate'
import {
	Typography,
	Grid,
	Paper,
	MenuList,
	MenuItem,
	Divider,
	FormControl,
	InputBase,
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import {makeStyles, fade} from '@material-ui/core/styles'
import moment from 'moment'
import {Link} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
	},
	paper: {
		[theme.breakpoints.up('xs')]: {
			width: 'auto',
			marginLeft: '0.5em',
			marginRight: '0.5em',
		},
		[theme.breakpoints.up('sm')]: {
			width: 'auto',
			marginLeft: '0.5em',
			marginRight: '0.5em',
		},
		[theme.breakpoints.up('md')]: {
			width: 'auto',
			marginLeft: '0.5em',
			marginRight: '0.5em',
		},
		[theme.breakpoints.up('lg')]: {
			marginLeft: '10em',
			marginRight: '10em',
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
	search: {
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.8),
		'&:hover': {
			backgroundColor: fade(theme.palette.common.white, 0.25),
		},
		marginRight: theme.spacing(2),
		marginLeft: 0,
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing(3),
			width: 'auto',
		},
	},
	searchIcon: {
		padding: theme.spacing(0, 2),
		height: '100%',
		position: 'absolute',
		pointerEvents: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	inputRoot: {
		color: 'inherit',
		width: '100%',
	},
	inputInput: {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
		// transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('md')]: {
			width: '60ch',
		},
	},
}))

const Orders = () => {
	const classes = useStyles()
	// const [data, setData] = useState([])
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
			<Typography color="secondary" variant="inherit" align="center">
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

	//Search
	const [data, setData] = useState({
		search: '',
		responses: '',
		isSearch: false,
		isHide: false,
	})
	const {search, responses, isSearch, isHide} = data

	const fetchSearchOrder = orderID => {
		axios
			.get(process.env.REACT_APP_BASE_URL + `orders/list/search/${orderID}`)
			.then(data => {
				setData({...data, responses: data.data, isSearch: true, isHide: true})
			})
			.catch(err => {
				console.log(err.response.data.err)
			})
	}

	const searchForm = () => (
		<form className={classes.form} noValidate onSubmit={submit}>
			<div
				className={classes.search}
				style={{
					height: '100%',
					marginTop: '0.75em',
					marginBottom: '0.75em',
				}}
			>
				<div className={classes.searchIcon}>
					<SearchIcon />
				</div>
				<InputBase
					autoFocus
					placeholder="Input the orderID you want to find"
					classes={{
						root: classes.inputRoot,
						input: classes.inputInput,
					}}
					inputProps={{'aria-label': 'search'}}
					onChange={handleChange('search')}
				/>
			</div>
		</form>
	)

	const submit = e => {
		e.preventDefault()
		fetchSearchOrder(search)
	}

	const handleChange = orderID => event => {
		setData({
			...data,
			[orderID]: event.target.value,
			isSearch: true,
			isHide: false,
			responses: null,
		})
	}

	const searchedProducts = responses => {
		if (responses) {
			return (
				<Fragment>
					<Paper className={classes.paper} style={{backgroundColor: '#fff'}}>
						<Grid container spacing={4} justify="center">
							<strong>
								<Typography
									style={{paddingTop: '5px'}}
									className={classes.typography}
									variant="h4"
									align="center"
								>
									OrderID: {responses._id}
								</Typography>
							</strong>

							<Grid item xs={12}>
								<MenuList style={{margin: '0 0 2em 0'}}>
									<div style={{border: '1px solid indigo'}}>
										<MenuItem style={{justifyContent: 'flex-start'}}>
											{listStatus(responses)}
										</MenuItem>

										<Divider />
										<MenuItem style={{justifyContent: 'flex-start'}}>
											<Typography variant="inherit" align="center">
												TransactionID: {responses.transaction_id}
											</Typography>
										</MenuItem>
										<Divider />
										<MenuItem style={{justifyContent: 'flex-start'}}>
											<Typography variant="inherit" align="center">
												Amount: ${responses.amount}
											</Typography>
										</MenuItem>
										<Divider />
										<MenuItem style={{justifyContent: 'flex-start'}}>
											<Typography variant="inherit" align="center">
												Order By:
												{`${responses.user.firstName} ${responses.user.lastName}`}
											</Typography>
										</MenuItem>
										<Divider />
										<MenuItem style={{justifyContent: 'flex-start'}}>
											<Typography variant="inherit" align="center">
												Ordered on: {moment(responses.createdAt).fromNow()}
											</Typography>
										</MenuItem>
										<Divider />
										<MenuItem style={{justifyContent: 'flex-start'}}>
											<Typography variant="inherit" align="center">
												Shipping address: {responses.address}
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
													Total items in the orders: {responses.products.length}
												</Typography>
											</strong>
										</MenuItem>
										<div style={{justifyContent: 'flex-start'}}>
											{responses.products &&
												responses.products.map(p => {
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
							</Grid>
						</Grid>
						<Grid item xs={12}></Grid>
					</Paper>
				</Fragment>
			)
		}
	}

	useEffect(() => {
		fetchOrdersList()
		fetchListStatus()
	}, [])

	return (
		<Fragment>
			<Grid
				container
				spacing={2}
				className={classes.root}
				style={{padding: '8em 0 3em 0'}}
			>
				<Grid item sm={2} md={3}></Grid>
				<Grid item sm={8} md={6} xs={12} style={{margin: '0.5em'}}>
					{searchForm()}
				</Grid>
				<Grid item sm={2} md={3}></Grid>
				<Grid item xs={12}>
					{searchedProducts(responses)}
				</Grid>
				<Grid item xs={12}>
					{!isHide && (
						<Paper className={classes.paper} style={{backgroundColor: '#fff'}}>
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
															Order By:{' '}
															{`${o.user.firstName} ${o.user.lastName}`}
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
					)}
				</Grid>
			</Grid>
		</Fragment>
	)
}

export default Orders
