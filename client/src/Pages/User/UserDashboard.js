import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {makeStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import EditIcon from '@material-ui/icons/Edit'
import IconButton from '@material-ui/core/IconButton'
import {MenuList, MenuItem} from '@material-ui/core'
import {Link} from 'react-router-dom'

import {isAuthenticated} from '../../General/Method/Authenticate'
import moment from 'moment'

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
		[theme.breakpoints.up('xs')]: {
			width: 'auto',
			padding: '6em 0.5em 0em 0.5em',
		},
		[theme.breakpoints.up('sm')]: {
			width: 'auto',
			padding: '6em 0.5em 0em 0.5em',
		},
		[theme.breakpoints.up('md')]: {
			width: 'auto',
			padding: '6em 0.5em 0em 0.5em',
		},
		[theme.breakpoints.up('lg')]: {
			width: 'auto',
			padding: '6em 2em 0em 2em',
		},
	},
	card: {
		minWidth: 275,
		backgroundColor: '#fff',
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)',
	},
	title: {
		fontSize: 14,
	},
	pos: {
		marginBottom: 12,
	},
	typography: {
		[theme.breakpoints.up('xs')]: {
			fontSize: 16,
		},
		[theme.breakpoints.up('sm')]: {
			fontSize: 20,
		},
		[theme.breakpoints.up('md')]: {
			fontSize: 22,
		},
		[theme.breakpoints.up('lg')]: {
			fontSize: 24,
		},
	},
}))

const Dashboard = () => {
	const classes = useStyles()
	const userID = isAuthenticated().data.user._id
	const token = isAuthenticated().data.token
	const [history, setHistory] = useState([])

	const fetchPurchaseHistory = () => {
		axios
			.get(process.env.REACT_APP_BASE_URL + `users/purchase/${userID}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then(data => {
				setHistory(data.data)
			})
			.catch(err => {
				console.log(err.response.data.err)
			})
	}

	useEffect(() => {
		fetchPurchaseHistory()
	}, [])

	const Profile = () => {
		return (
			<Card className={classes.card} variant="outlined">
				<CardContent>
					<Typography variant="h3" color="inherit">
						Profile
						<Link
							to={`/profile/${isAuthenticated().data.user._id}`}
							style={{textDecoration: 'none'}}
						>
							<IconButton edge="start" color="inherit" style={{float: 'right'}}>
								<EditIcon style={{color: 'black'}} />
							</IconButton>
						</Link>
					</Typography>
				</CardContent>
				<Divider />
				<CardContent>
					<Typography
						className={classes.title}
						color="textSecondary"
						gutterBottom
					>
						Firstname
					</Typography>
					<Typography variant="h5" component="h2">
						{isAuthenticated().user
							? isAuthenticated().user.data.firstName
							: isAuthenticated().data.user.firstName}
					</Typography>
					<Divider />
					<Typography
						className={classes.title}
						color="textSecondary"
						gutterBottom
					>
						Lastname
					</Typography>
					<Typography variant="h5" component="h2">
						{isAuthenticated().user
							? isAuthenticated().user.data.lastName
							: isAuthenticated().data.user.lastName}
					</Typography>
					<Divider />
					<Typography
						className={classes.title}
						color="textSecondary"
						gutterBottom
					>
						Email
					</Typography>
					<Typography variant="h5" component="h2">
						{isAuthenticated().user
							? isAuthenticated().user.data.email
							: isAuthenticated().data.user.email}
					</Typography>
					<Divider />
					<Typography
						className={classes.title}
						color="textSecondary"
						gutterBottom
					>
						Role
					</Typography>
					<Typography variant="h5" component="h2">
						{isAuthenticated().user
							? isAuthenticated().user.data.role === 0
								? 'Admin'
								: 'Member'
							: isAuthenticated().data.user.role === 0
							? 'Admin'
							: 'Member'}
					</Typography>
				</CardContent>
				<Divider />
			</Card>
		)
	}

	const PurchaseHistory = () => {
		return (
			<Card className={classes.card} variant="outlined">
				<CardContent>
					<Typography variant="h4" color="inherit">
						Purchase History
					</Typography>
				</CardContent>
				<Divider />
				<Grid container xs={12}>
					<Grid xs={12}>
						<CardContent>
							<MenuList style={{margin: '0 0 2em 0'}}>
								{history &&
									history.map((p, i) => {
										return (
											<div key={i} style={{border: '3px solid black'}}>
												<MenuItem style={{borderBottom: '3px solid black'}}>
													<Typography
														className={classes.typography}
														variant="h4"
													>
														OrderID: {p._id}
													</Typography>
												</MenuItem>
												<div>
													<MenuList>
														<Typography variant="h5">Products</Typography>
													</MenuList>
													{p.products &&
														p.products.map((item, index) => {
															return (
																<div
																	key={index}
																	style={{borderBottom: '1px solid black'}}
																>
																	<Typography
																		style={{paddingLeft: '3px'}}
																		variant="h6"
																	>
																		Item {index + 1}
																	</Typography>
																	<MenuItem>
																		<Typography>Name: {item.name}</Typography>
																	</MenuItem>
																	<MenuItem>
																		<Typography>
																			Price: ${item.price}
																		</Typography>
																	</MenuItem>
																	<MenuItem>
																		<Typography>
																			Quantity: {item.count}
																		</Typography>
																	</MenuItem>
																</div>
															)
														})}

													<MenuItem style={{justifyContent: 'flex-start'}}>
														<Typography>Status: {p.status}</Typography>
													</MenuItem>
													<MenuItem style={{justifyContent: 'flex-start'}}>
														<Typography>Total: ${p.amount}</Typography>
													</MenuItem>
													<MenuItem style={{justifyContent: 'flex-start'}}>
														<Typography>
															Purchase at: {moment(p.createdAt).fromNow()}
														</Typography>
													</MenuItem>
													<MenuItem style={{justifyContent: 'flex-start'}}>
														<Typography>
															Shipping address: {p.address}
														</Typography>
													</MenuItem>
												</div>
											</div>
										)
									})}
							</MenuList>
						</CardContent>
					</Grid>
				</Grid>
			</Card>
		)
	}

	return (
		<div className={classes.root}>
			<Grid container spacing={2} justify="center">
				<Grid item xs={12}>
					{Profile()}
				</Grid>
				<Grid item xs={12}>
					{PurchaseHistory()}
				</Grid>
			</Grid>
		</div>
	)
}

export default Dashboard
