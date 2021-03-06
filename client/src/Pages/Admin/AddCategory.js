import React, {useState} from 'react'
import axios from 'axios'
import {Grid, TextField, Button, Paper, Snackbar} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import {makeStyles} from '@material-ui/core/styles'

import {isAuthenticated} from '../../General/Method/Authenticate'
import {Redirect} from 'react-router-dom'

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
		},
		[theme.breakpoints.up('lg')]: {
			marginLeft: '10em',
			marginRight: '10em',
			width: 'auto',
		},
		padding: theme.spacing(2),
		textAlign: 'center',
		color: theme.palette.text.secondary,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}))

const AddCategory = () => {
	const classes = useStyles()

	const [name, setName] = useState('')
	const [response, setResponse] = useState()
	const [error, setError] = useState(false)
	const [success, setSuccess] = useState(false)
	const [redirect, setRedirect] = useState(false)

	const userID = isAuthenticated().data.user._id
	const token = isAuthenticated().data.token

	const categoryName = {
		name: name,
	}

	const handleInputChange = e => {
		setName(e.target.value)
	}

	const handleClose = reason => {
		if (reason === 'clickaway') {
			return
		}

		setSuccess(false)
		setError(false)
		setRedirect(true)
	}

	const handleCloseErr = reason => {
		if (reason === 'clickaway') {
			return
		}

		setSuccess(false)
		setError(false)
		setRedirect(false)
	}

	const redirectToCateManagement = redirec => {
		if (redirect) {
			return <Redirect to="/admin/category/manage" />
		}
	}

	const showSuccess = () => {
		return (
			<div className={classes.root}>
				<Snackbar
					anchorOrigin={{vertical: 'top', horizontal: 'center'}}
					open={success}
					autoHideDuration={3000}
					onClose={handleClose}
				>
					<Alert onClose={handleClose} severity="success">
						{response}
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
					autoHideDuration={3000}
					onClose={handleCloseErr}
				>
					<Alert onClose={handleCloseErr} severity="error">
						{response}
					</Alert>
				</Snackbar>
			</div>
		)
	}

	const fetchAddCategory = body => {
		axios
			.post(
				process.env.REACT_APP_BASE_URL + `categories/create/${userID}`,
				body,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
			.then(data => {
				setSuccess(true)
				setResponse(data.data.message)
			})
			.catch(err => {
				setError(true)
				setResponse(err.response.data.err)
			})
	}

	const submit = e => {
		e.preventDefault()
		fetchAddCategory(categoryName)
	}

	const AddForm = () => {
		return (
			<Grid container spacing={2} justify="center">
				<Grid item xs={12}>
					<form className={classes.form} noValidate>
						<TextField
							style={{backgroundColor: '#fff'}}
							variant="filled"
							required
							fullWidth
							id="name"
							label="Category Name"
							name="name"
							onChange={handleInputChange}
							value={name}
							autoFocus
						/>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							className={classes.submit}
							onClick={submit}
						>
							Add
						</Button>
					</form>
				</Grid>
			</Grid>
		)
	}

	return (
		<div className={classes.root} style={{padding: '8em 0.5em 3em 0.5em'}}>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Paper className={classes.paper} style={{backgroundColor: '#3282b8'}}>
						{showSuccess()}
						{showError()}
						{AddForm()}
						{redirectToCateManagement(redirect)}
					</Paper>
				</Grid>
			</Grid>
		</div>
	)
}

export default AddCategory
