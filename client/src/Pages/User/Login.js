import React, {useState} from 'react'
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
import {Redirect} from 'react-router-dom'
import {makeStyles} from '@material-ui/core/styles'

import {authenticate, isAuthenticated} from '../../General/Method/Authenticate'

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

const Login = () => {
	const classes = useStyles()

	const [values, setValues] = useState({
		email: '',
		password: '',
		error: '',
		redirectToAuth: false,
	})

	const {email, password, error, redirectToAuth} = values

	//higher order function (function that returns other function)
	const handleChange = input => e => {
		setValues({...values, error: false, [input]: e.target.value})
	}

	const inputData = {
		email: email,
		password: password,
	}

	const showError = () => (
		<Alert severity="error" style={{display: error ? '' : 'none'}}>
			{error}
		</Alert>
	)

	const redirectUser = () => {
		if (redirectToAuth) {
			if (isAuthenticated() && isAuthenticated().data.user.role === 0) {
				return <Redirect to="/admin/profile" />
			} else {
				return <Redirect to="/user/profile" />
			}
		}
		if (isAuthenticated()) {
			return <Redirect to="/" />
		}
	}

	const fetchLogin = body => {
		axios
			.post(process.env.REACT_APP_BASE_URL + 'users/login', body)
			.then(data => {
				authenticate(data, () => {
					setValues({
						...values,
						redirectToAuth: true,
					})
				})
			})
			.catch(err => {
				setValues({
					...values,
					error: err.response.data.err,
				})
			})
	}

	const submit = e => {
		e.preventDefault() //prevent browser reload when the button is clicked
		fetchLogin(inputData)
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
						Sign in
					</Typography>
					{showError()}
					<form className={classes.form} noValidate>
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
						<TextField
							variant="outlined"
							margin="normal"
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
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
							onClick={submit}
						>
							Sign In
						</Button>
						<Grid container>
							<Grid item xs>
								{/* <Link to="#" variant="body2">
									Forgot password?
								</Link> */}
							</Grid>
							<Grid item>
								<Link to="/register" variant="body2">
									Don't have an account? Sign Up
								</Link>
							</Grid>
						</Grid>
					</form>
					{redirectUser()}
				</div>
			</Grid>
		</Grid>
	)
}

export default Login
