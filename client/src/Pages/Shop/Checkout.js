import React, {useState, useEffect} from 'react'
import axios from 'axios'
import DropIn from 'braintree-web-drop-in-react'
import {Grid, Button, Typography, Snackbar} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import {makeStyles} from '@material-ui/core/styles'

// import {isAuthenticated} from '../../General/Method/Authenticate'

const useStyles = makeStyles(theme => ({
	root: {
		[theme.breakpoints.up('xs')]: {
			width: 'auto',
		},
		[theme.breakpoints.up('sm')]: {
			width: '50%',
		},
		[theme.breakpoints.up('md')]: {
			width: '40%',
		},
		[theme.breakpoints.up('lg')]: {
			width: '25%',
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

	//For must be member to purchasing
	// const userID = isAuthenticated() && isAuthenticated().data.user._id
	// const bearerToken = isAuthenticated() && isAuthenticated().data.token

	const fetchBraintreeToken = () => {
		axios
			// .get(process.env.REACT_APP_BASE_URL + `payments/token/${userID}`, {
			// 	headers: {
			// 		Authorization: `Bearer ${bearerToken}`,
			// 	},
			// })
			.get(process.env.REACT_APP_BASE_URL + `payments/token`)
			.then(data => {
				setData({...data, paymentToken: data.data.clientToken})
			})
			.catch(err => {
				setData({...data, error: err.response.data.err})
			})
	}

	const fetchpurchaseProcess = body => {
		axios
			.post(process.env.REACT_APP_BASE_URL + `payments/purchase`, body)
			.then(data => {
				console.log(data)
				setData({...data, success: true, hidden: true})
			})
			.catch(err => console.log(err.response.data.err))
	}

	const dropIn = () => {
		return (
			<div>
				{data.paymentToken !== null && (
					<Grid container justify="center">
						<Grid item xs={12}>
							<DropIn
								options={{authorization: data.paymentToken}}
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

	const totalPurchase = () => {
		return props.location.state.reduce((currentValue, nextValue) => {
			return currentValue + nextValue.count * nextValue.price
		}, 0)
	}

	const purchaseHandle = () => {
		let nonce
		let getNonce = data.instance
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
				setData({...data, error: err.message})
			})
	}

	const handleClose = reason => {
		if (reason === 'clickaway') {
			return
		}

		setData({...data, success: false})
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
		</div>
	)
}

export default Checkout
