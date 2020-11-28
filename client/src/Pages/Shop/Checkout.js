import React, {useState, useEffect, Fragment} from 'react'
import axios from 'axios'
import DropIn from 'braintree-web-drop-in-react'
import {
	Grid,
	Button,
	Typography,
	Snackbar,
	TextField,
	InputLabel,
} from '@material-ui/core'
import {Alert} from '@material-ui/lab'
import {makeStyles} from '@material-ui/core/styles'
import {Redirect} from 'react-router-dom'

import {emptyCart} from '../../General/Method/CartHandler'
import {isAuthenticated} from '../../General/Method/Authenticate'
import Loading from '../../Components/Backdrop'

const useStyles = makeStyles(theme => ({
	root: {
		[theme.breakpoints.up('xs')]: {
			width: 'auto',
		},
		[theme.breakpoints.up('sm')]: {
			width: 'auto',
		},
		[theme.breakpoints.up('md')]: {
			width: 'auto',
		},
		[theme.breakpoints.up('lg')]: {
			width: 'auto',
			marginLeft: '40em',
			marginRight: '40em',
		},
		overflowY: 'scroll',
		'&::-webkit-scrollbar': {
			width: 0,
		},
		overflowX: 'hidden',
	},
}))

const Checkout = props => {
	const classes = useStyles()
	const [data, setData] = useState({
		success: false,
		paymentToken: null,
		error: '',
		response: '',
		instance: {},
		hidden: false,
		loading: false,
		redirect: false,
		address: '',
	})

	const userID = isAuthenticated() && isAuthenticated().data.user._id
	const bearerToken = isAuthenticated() && isAuthenticated().data.token

	const fetchBraintreeToken = () => {
		axios
			.get(process.env.REACT_APP_BASE_URL + `payments/token/${userID}`, {
				headers: {
					Authorization: `Bearer ${bearerToken}`,
				},
			})
			.then(data => {
				setData({...data, paymentToken: data.data.clientToken})
			})
			.catch(err => {
				setData({...data, error: err.response.data.err})
			})
	}

	const fetchpurchaseProcess = body => {
		axios
			.post(
				process.env.REACT_APP_BASE_URL + `payments/purchase/${userID}`,
				body,
				{
					headers: {
						Authorization: `Bearer ${bearerToken}`,
					},
				},
			)
			.then(res => {
				console.log(res.data)
				setData({loading: true})
				const orderData = {
					products: props.location.state,
					transaction_id: res.data.transaction.id,
					amount: res.data.transaction.amount,
					createdAt: res.data.transaction.createdAt,
					currency: res.data.transaction.currencyIsoCode,
					address: data.address,
				}
				fetchCreateOrder({order: orderData})
			})
			.catch(err => {
				console.log(err)
			})
	}

	const fetchCreateOrder = body => {
		axios
			.post(process.env.REACT_APP_BASE_URL + `orders/${userID}`, body, {
				headers: {
					Authorization: `Bearer ${bearerToken}`,
				},
			})
			.then(() => {
				setData({...data, success: true, hidden: true})
				emptyCart(() => {})
			})
			.catch(err => console.log(err.response.data.err))
	}

	const handleAddress = event => {
		setData({
			...data,
			address: event.target.value,
		})
	}

	const totalPurchase = () => {
		return props.location.state.reduce((currentValue, nextValue) => {
			return currentValue + nextValue.count * nextValue.price
		}, 0)
	}

	const purchaseHandle = () => {
		let nonce
		data.instance &&
			data.instance
				.requestPaymentMethod()
				.then(data => {
					nonce = data.nonce
					const paymentData = {
						paymentMethodNonce: nonce,
						amount: totalPurchase(props.location.state),
					}
					fetchpurchaseProcess(paymentData)
				})
				.catch(err => {
					console.log(err)
					setData({...data, error: true, response: err.message})
				})
	}

	const handleCloseSuccess = reason => {
		if (reason === 'clickaway') {
			return
		}
		setData({...data, success: false, redirect: true})
	}

	const handleCloseError = reason => {
		if (reason === 'clickaway') {
			return
		}
		setData({...data, error: false})
	}

	const dropIn = () => {
		return (
			<Fragment>
				{data.paymentToken !== null && (
					<Grid container justify="center">
						<Grid item xs={12}>
							<InputLabel>
								<Typography variant="caption" color="secondary">
									Shipping Address
								</Typography>
							</InputLabel>
							<TextField
								color="secondary"
								style={{backgroundColor: '#fff'}}
								required
								fullWidth
								id="address"
								variant="outlined"
								autoFocus
								value={data.address}
								onChange={handleAddress}
							></TextField>
						</Grid>
						<Grid item xs={12}>
							<DropIn
								options={{
									authorization: data.paymentToken,
									// card: false,
									paypal: {
										flow: 'checkout',
										amount: '10.00',
										currency: 'USD',
										// enableShippingAddress: true,
										buttonStyle: {
											color: 'gold',
											shape: 'rect',
											size: 'medium',
										},
									},
								}}
								onInstance={instance => (data.instance = instance)}
							/>
						</Grid>
						<Button
							style={{
								display: data.hidden ? 'none' : '',
								margin: '3px',
							}}
							variant="contained"
							color="secondary"
							onClick={purchaseHandle}
						>
							<Typography variant="caption">Purchase</Typography>
						</Button>
					</Grid>
				)}
			</Fragment>
		)
	}

	const showError = () => {
		return (
			<Snackbar
				anchorOrigin={{vertical: 'top', horizontal: 'center'}}
				open={data.error}
				autoHideDuration={3000}
				onClose={handleCloseError}
			>
				<Alert onClose={handleCloseError} severity="error">
					{data.response}
				</Alert>
			</Snackbar>
		)
	}

	const showSuccess = () => {
		return (
			<Snackbar
				anchorOrigin={{vertical: 'top', horizontal: 'center'}}
				open={data.success}
				autoHideDuration={3000}
				onClose={handleCloseSuccess}
			>
				<Alert onClose={handleCloseSuccess} severity="success">
					Thank you for your payment
				</Alert>
			</Snackbar>
		)
	}

	const showLoading = loading => loading && <Loading loading={data.loading} />

	useEffect(() => {
		fetchBraintreeToken()
	}, [])

	return (
		<div className={classes.root} style={{padding: '6em 2em 0em 2em'}}>
			{showLoading(data.loading)}
			{showSuccess()}
			{showError()}
			{dropIn()}
			{data.redirect && <Redirect to="/" />}
		</div>
	)
}

export default Checkout
