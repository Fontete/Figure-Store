import React, {useState} from 'react'
import axios from 'axios'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import {Link} from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Alert from '@material-ui/lab/Alert'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'

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
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	modalPaper: {
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
}))

const Register = () => {
	const classes = useStyles()

	const [values, setValues] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		error: '',
		success: false,
	})

	const {firstName, lastName, email, password, success, error} = values

	//higher order function (function that returns other function)
	const handleChange = input => e => {
		setValues({...values, error: false, [input]: e.target.value})
	}

	const handleClose = () => {
		setValues({...values, success: false})
	}

	const showError = () => (
		<Alert severity="error" style={{display: error ? '' : 'none'}}>
			{error}
		</Alert>
	)

	const showSuccess = () => (
		<div style={{display: success ? '' : 'none'}}>
			<Modal
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				className={classes.modal}
				open={success}
				onClose={handleClose}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Fade in={success}>
					<div className={classes.modalPaper}>
						<h2 id="transition-modal-title">{`Welcome, ${lastName} ${firstName}. Your are member now`}</h2>
						<p id="transition-modal-description">
							<Link align="center" to="/login">
								Click here to login
							</Link>
						</p>
					</div>
				</Fade>
			</Modal>
		</div>
	)

	const inputData = {
		firstName: firstName,
		lastName: lastName,
		email: email,
		password: password,
	}

	const fetchRegisterAPI = body => {
		axios
			.post(process.env.REACT_APP_BASE_URL + 'users/register', body)
			.then(() => {
				setValues({
					...values,
					success: true,
				})
			})
			.catch(err => {
				setValues({...values, error: err.response.data.err, success: false})
			})
	}

	const submit = e => {
		e.preventDefault() //prevent browser reload when the button is clicked
		fetchRegisterAPI(inputData)
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
						Sign up
					</Typography>
					{showSuccess()}
					{showError()}
					<form className={classes.form} noValidate>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextField
									autoComplete="fname"
									name="firstName"
									variant="outlined"
									required
									fullWidth
									id="firstName"
									label="First Name"
									autoFocus
									onChange={handleChange('firstName')}
									value={firstName}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									variant="outlined"
									required
									fullWidth
									id="lastName"
									label="Last Name"
									name="lastName"
									autoComplete="lname"
									onChange={handleChange('lastName')}
									value={lastName}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									variant="outlined"
									required
									fullWidth
									id="email"
									label="Email Address"
									name="email"
									autoComplete="email"
									onChange={handleChange('email')}
									value={email}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									variant="outlined"
									required
									fullWidth
									name="password"
									label="Password"
									type="password"
									id="password"
									autoComplete="current-password"
									onChange={handleChange('password')}
									value={password}
								/>
							</Grid>
						</Grid>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
							onClick={submit}
						>
							Sign Up
						</Button>
						<Grid container justify="flex-end">
							<Grid item>
								<Link to="/login" variant="body2">
									Already have an account? Sign in
								</Link>
							</Grid>
						</Grid>
					</form>
				</div>
			</Grid>
		</Grid>
	)
}

export default Register
