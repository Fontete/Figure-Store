import React, {useState, useEffect} from 'react'
import axios from 'axios'
import DropIn from 'braintree-web-drop-in-react'
import {Grid, Button, Typography, Snackbar, TextField} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import {makeStyles} from '@material-ui/core/styles'
import {Redirect} from 'react-router-dom'

import {emptyCart} from '../../General/Method/CartHandler'

import {isAuthenticated} from '../../General/Method/Authenticate'

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
		instance: {},
		address: '',
		hidden: '',
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
				const orderData = {
					products: props.location.state,
					transaction_id: res.data.transaction_id,
					amount: res.data.amount,
					address: data.address,
				}
				fetchCreateOrder({order: orderData})
			})
			.catch(err => console.log(err.response.data.err))
	}

	const fetchCreateOrder = body => {
		axios
			.post(process.env.REACT_APP_BASE_URL + `orders/create/${userID}`, body, {
				headers: {
					Authorization: `Bearer ${bearerToken}`,
				},
			})
			.then(() => {
				setData({...data, success: true, hidden: true})
				emptyCart(() => {
					console.log('empty')
				})
			})
			.catch(err => console.log(err.response.data.err))
	}

	const totalPurchase = () => {
		return props.location.state.reduce((currentValue, nextValue) => {
			return currentValue + nextValue.count * nextValue.price
		}, 0)
	}

	const purchaseHandle = () => {
		let nonce
		data.instance
			.requestPaymentMethod()
			.then(data => {
				nonce = data.nonce
				console.log(
					'send nonce and total to process: ',
					nonce,
					totalPurchase(props.location.state),
				)
				const paymentData = {
					paymentMethodNonce: nonce,
					amount: totalPurchase(props.location.state),
				}
				fetchpurchaseProcess(paymentData)
			})
			.catch(err => {
				console.log(err)
				setData({...data, error: err.message})
			})
	}

	const handleClose = reason => {
		if (reason === 'clickaway') {
			return
		}
		setData({...data, success: false})
	}

	const handleAddress = e => {
		setData({...data, address: e.target.value})
	}

	const dropIn = () => {
		return (
			<div>
				{data.paymentToken !== null && (
					<Grid container justify="center">
						<Grid item xs={12}>
							<TextField
								id="standard-basic"
								label="Shipping Address"
								variant="outlined"
								onChange={handleAddress}
								value={data.address}
								fullWidth
								required
							/>
						</Grid>
						<Grid item xs={12}>
							<DropIn
								options={{
									authorization: data.paymentToken,
									// paypal: {
									// 	flow: 'vault',
									// },
								}}
								onInstance={instance => (data.instance = instance)}
							/>
						</Grid>
						<Button
							style={{display: data.hidden ? 'none' : ''}}
							variant="contained"
							color="secondary"
							onClick={purchaseHandle}
						>
							<Typography variant="caption">Purchase</Typography>
						</Button>
					</Grid>
				)}
			</div>
		)
	}

	const showSuccess = () => {
		return (
			<Snackbar
				anchorOrigin={{vertical: 'top', horizontal: 'center'}}
				open={data.success}
				autoHideDuration={3000}
				onClose={handleClose}
			>
				<Alert onClose={handleClose} severity="success">
					Thank you for your payment
				</Alert>
			</Snackbar>
		)
	}

	useEffect(() => {
		fetchBraintreeToken()
	}, [])

	return (
		<div className={classes.root} style={{padding: '6em 2em 0em 2em'}}>
			{showSuccess()}
			{dropIn()}
			{/* {data.success && <Redirect to="/" />} */}
		</div>
	)
}

export default Checkout
