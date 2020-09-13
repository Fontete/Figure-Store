import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {
	TextField,
	Button,
	Grid,
	InputLabel,
	Typography,
	Snackbar,
} from '@material-ui/core'
import {Alert} from '@material-ui/lab'
import {makeStyles} from '@material-ui/core/styles'
import {isAuthenticated, updateProfile} from '../../General/Method/Authenticate'
import {Redirect} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
	paper: {
		margin: theme.spacing(8, 4),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}))

const Profile = () => {
	const classes = useStyles()

	const [values, setValues] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		error: false,
		success: false,
		response: '',
		redirect: false,
	})

	const userID = isAuthenticated().data.user._id
	const token = isAuthenticated().data.token

	const {
		firstName,
		lastName,
		email,
		password,
		success,
		error,
		response,
		redirect,
	} = values

	const fetchUserProfile = () => {
		axios
			.get(process.env.REACT_APP_BASE_URL + `users/${userID}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then(data => {
				setValues({
					...values,
					email: data.data.email,
					firstName: data.data.firstName,
					lastName: data.data.lastName,
				})
			})
			.catch(() => {
				setValues({...values, error: true})
			})
	}

	const fetchUpdateProfile = body => {
		axios
			.put(process.env.REACT_APP_BASE_URL + `users/${userID}`, body, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then(data => {
				updateProfile(data, () => {
					setValues({
						...values,
						firstName: data.data.firstName,
						lastName: data.data.lastName,
						password: data.data.password,
						email: data.data.email,
						success: true,
					})
				})
			})
			.catch(err => {
				setValues({
					...values,
					error: true,
					response: err.response.data.err,
					password: '',
				})
			})
	}

	const handleChange = name => e => {
		setValues({...values, error: false, [name]: e.target.value})
	}

	const submit = e => {
		e.preventDefault()
		fetchUpdateProfile({firstName, lastName, email, password})
	}

	const handleCloseSuccess = reason => {
		if (reason === 'clickaway') {
			return
		}

		setValues({...values, error: false, success: false, redirect: true})
	}

	const handleCloseError = reason => {
		if (reason === 'clickaway') {
			return
		}

		setValues({...values, error: false, success: false, redirect: false})
	}

	const showSuccess = () => {
		return (
			<div className={classes.root}>
				<Snackbar
					anchorOrigin={{vertical: 'top', horizontal: 'center'}}
					open={success}
					autoHideDuration={3000}
					onClose={handleCloseSuccess}
				>
					<Alert onClose={handleCloseSuccess} severity="success">
						Update Profile Successfully
					</Alert>
				</Snackbar>
			</div>
		)
	}

	const showError = () => {
		return (
			<div className={classes.root}>
				<Snackbar
					anchorOrigin={{vertical: 'top', horizontal: 'center'}}
					open={error}
					autoHideDuration={5000}
					onClose={handleCloseError}
				>
					<Alert onClose={handleCloseError} severity="error">
						{response}
					</Alert>
				</Snackbar>
			</div>
		)
	}

	const redirectTo = redirect => {
		if (redirect) {
			if (isAuthenticated().data.user.role === 1) {
				return <Redirect to="/user/profile" />
			} else return <Redirect to="/admin/profile" />
		}
	}

	useEffect(() => {
		fetchUserProfile()
	}, [])

	const showUpdateProfile = () => (
		<form className={classes.form}>
			<Typography variant="h5" color="primary" style={{marginBottom: '2em'}}>
				Update Profile
			</Typography>
			<Grid container spacing={2} xs={12} justify="center">
				<Grid item xs={12}>
					<InputLabel>
						<Typography variant="caption" color="secondary">
							Email
						</Typography>
					</InputLabel>
					<TextField
						style={{backgroundColor: '#fff'}}
						fullWidth
						type="email"
						variant="outlined"
						onChange={handleChange('email')}
						value={email}
					/>
				</Grid>
				<Grid item xs={6}>
					<InputLabel>
						<Typography variant="caption" color="secondary">
							First Name
						</Typography>
					</InputLabel>
					<TextField
						style={{backgroundColor: '#fff'}}
						fullWidth
						type="text"
						variant="outlined"
						onChange={handleChange('firstName')}
						value={firstName}
					/>
				</Grid>
				<Grid item xs={6}>
					<InputLabel>
						<Typography variant="caption" color="secondary">
							Last Name
						</Typography>
					</InputLabel>
					<TextField
						style={{backgroundColor: '#fff'}}
						fullWidth
						type="text"
						variant="outlined"
						onChange={handleChange('lastName')}
						value={lastName}
					/>
				</Grid>
				<Grid item xs={12}>
					<InputLabel>
						<Typography variant="caption" color="secondary">
							Password
						</Typography>
					</InputLabel>
					<TextField
						type="password"
						style={{backgroundColor: '#fff'}}
						fullWidth
						variant="outlined"
						label="Password"
						onChange={handleChange('password')}
						value={password}
					/>
				</Grid>
				<Grid item xs={12}>
					<Button
						fullWidth
						color="secondary"
						type="submit"
						variant="contained"
						className={classes.submit}
						onClick={submit}
					>
						Update
					</Button>
				</Grid>
			</Grid>
		</form>
	)

	return (
		<div className={classes.paper} style={{padding: '8em 0.5em 3em 0.5em'}}>
			<Grid container spacing={2} justify="center">
				<Grid item xs={12}>
					{showUpdateProfile()}
					{redirectTo(redirect)}
					{showSuccess()}
					{showError()}
				</Grid>
			</Grid>
		</div>
	)
}

export default Profile
