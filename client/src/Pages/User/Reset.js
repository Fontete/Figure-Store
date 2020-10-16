import React, {useState, Fragment} from 'react'
import axios from 'axios'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import {Link} from 'react-router-dom'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import Alert from '@material-ui/lab/Alert'
import Snackbar from '@material-ui/core/Snackbar'
import {makeStyles} from '@material-ui/core/styles'
import {Redirect} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
	root: {
		height: '100vh',
	},
	image: {
		backgroundImage:
			'url(https://images.alphacoders.com/733/thumb-1920-733488.png)',
		backgroundRepeat: 'no-repeat',
		backgroundColor:
			theme.palette.type === 'light'
				? theme.palette.grey[50]
				: theme.palette.grey[900],
		backgroundSize: 'cover',
		backgroundPosition: 'center',
	},
	paper: {
		margin: theme.spacing(8, 4),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}))

const Reset = () => {
	const classes = useStyles()

	const [values, setValues] = useState({
		email: '',
		alert: '',
		sentOtpSuccess: '',
		newPassword: '',
		confirmPassword: '',
		otpCode: '',
		confirmAlert: '',
		changePassSuccess: '',
	})

	const {
		email,
		alert,
		sentOtpSuccess,
		changePassSuccess,
		newPassword,
		confirmPassword,
		otpCode,
	} = values

	const [showOTPBox, setShowOTPBox] = useState(false)
	const [resetSuccess, setResetSuccess] = useState(false)
	const [redirect, setRedirect] = useState(false)

	//higher order function (function that returns other function)
	const handleChange = input => e => {
		setValues({...values, [input]: e.target.value, alert: ''})
		setShowOTPBox(false)
	}

	const handleChangeOTP = input => e => {
		setValues({...values, [input]: e.target.value, alert: ''})
	}

	const handleChangeReset = input => e => {
		setValues({...values, [input]: e.target.value})
	}

	const handleClose = reason => {
		if (reason === 'clickaway') {
			return
		}
		setResetSuccess(false)
		setRedirect(true)
	}

	const showError = () => (
		<Alert severity="error" style={{display: alert !== '' ? '' : 'none'}}>
			{alert}
		</Alert>
	)

	const showSuccess = message => (
		<Typography
			style={{paddingLeft: '10px'}}
			color="secondary"
			component="cation"
			variant="caption"
		>
			{message}
		</Typography>
	)

	const changePasswordSuccess = () => {
		return (
			<Snackbar
				anchorOrigin={{vertical: 'top', horizontal: 'center'}}
				open={resetSuccess}
				autoHideDuration={3000}
				onClose={handleClose}
			>
				<Alert onClose={handleClose} severity="success">
					{changePassSuccess}
				</Alert>
			</Snackbar>
		)
	}

	const redirectToLogin = redirect => {
		if (redirect) {
			return <Redirect to="/login" />
		}
	}

	const fetchOTP = body => {
		axios
			.post(process.env.REACT_APP_BASE_URL + 'users/otp', body)
			.then(data => {
				setValues({...values, sentOtpSuccess: data.data.message})
				setShowOTPBox(true)
			})
			.catch(err => {
				setValues({
					...values,
					alert: err.response.data.err,
				})
			})
	}

	const fetchResetPassword = body => {
		axios
			.post(process.env.REACT_APP_BASE_URL + 'users/reset', body)
			.then(data => {
				setValues({
					...values,
					changePassSuccess: data.data.message,
					alert: '',
				})
				setResetSuccess(true)
			})
			.catch(err => {
				setValues({
					...values,
					alert: err.response.data.err,
				})
			})
	}

	const getOTP = e => {
		e.preventDefault() //prevent browser reload when the button is clicked
		fetchOTP({email: email})
	}

	const changePassword = e => {
		e.preventDefault() //prevent browser reload when the button is clicked
		if (confirmPassword === '') {
			setValues({...values, alert: 'Confirm password is required'})
			return
		}
		if (newPassword !== confirmPassword) {
			setValues({...values, alert: 'Password does not match'})
			return
		}
		fetchResetPassword({
			email: email,
			otp: otpCode,
			password: newPassword,
			confirmPassword: confirmPassword,
		})
	}

	return (
		<Grid container component="main" className={classes.root}>
			<CssBaseline />
			<Grid item xs={false} sm={4} md={7} className={classes.image} />
			<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Reset password
					</Typography>
					{redirectToLogin(redirect)}
					{changePasswordSuccess()}
					{showError()}
					<form className={classes.form} noValidate>
						{!showOTPBox && (
							<Fragment>
								<TextField
									variant="outlined"
									margin="normal"
									required
									fullWidth
									id="email"
									label="Email Address"
									name="email"
									autoComplete="email"
									autoFocus
									onChange={handleChange('email')}
									value={email}
								/>
							</Fragment>
						)}
						{!showOTPBox && (
							<Button
								type="submit"
								fullWidth
								variant="contained"
								color="primary"
								className={classes.submit}
								onClick={getOTP}
							>
								Get OTP
							</Button>
						)}
						{showOTPBox && (
							<Fragment>
								<TextField
									variant="outlined"
									margin="normal"
									required
									fullWidth
									name="New password"
									label="New password"
									type="password"
									id="newpassword"
									onChange={handleChangeReset('newPassword')}
									value={newPassword}
								/>
								{newPassword !== '' && (
									<TextField
										variant="outlined"
										margin="normal"
										required
										fullWidth
										name="Confirm password"
										label="Confirm password"
										type="password"
										id="confirmpassword"
										onChange={handleChangeReset('confirmPassword')}
										value={confirmPassword}
									/>
								)}
								<TextField
									variant="outlined"
									margin="normal"
									required
									fullWidth
									name="OTP"
									label="OTP"
									type="number"
									id="otp"
									onChange={handleChangeOTP('otpCode')}
									value={otpCode}
								/>
								{showSuccess(sentOtpSuccess)}
								<Button
									type="submit"
									fullWidth
									variant="contained"
									color="primary"
									className={classes.submit}
									onClick={changePassword}
								>
									Reset
								</Button>
							</Fragment>
						)}
						<Grid container>
							<Grid item xs></Grid>
							<Grid item>
								<Link to="/login" variant="body2">
									Back to sign in?
								</Link>
							</Grid>
						</Grid>
					</form>
				</div>
			</Grid>
		</Grid>
	)
}

export default Reset
