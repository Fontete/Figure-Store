import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {
	Grid,
	Button,
	Paper,
	Snackbar,
	Typography,
	Input,
} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import {makeStyles} from '@material-ui/core/styles'
import {Redirect} from 'react-router-dom'

import {isAuthenticated} from '../../General/Method/Authenticate'

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

const UpdateProduct = ({match}) => {
	const classes = useStyles()

	const [values, setValues] = useState({
		name: '',
		success: false,
		error: '',
		response: '',
		redirect: false,
	})
	const {name, success, error, response, redirect} = values

	const userID = isAuthenticated().data.user._id
	const token = isAuthenticated().data.token

	const handleInputChange = e => {
		setValues({
			...values,
			name: e.target.value,
		})
	}

	const handleClose = reason => {
		if (reason === 'clickaway') {
			return
		}

		setValues({...values, error: false, success: false, redirect: true})
	}

	const handleCloseErr = reason => {
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

	const fetchSingleCategory = categoryID => {
		axios
			.get(process.env.REACT_APP_BASE_URL + `categories/${categoryID}`)
			.then(data => {
				setValues({
					...values,
					name: data.data.name,
				})
			})
			.catch(err => {
				setValues({...values, error: true, response: err.response.data.err})
			})
	}

	const fetchUpdateCategory = (categoryID, body) => {
		console.log(categoryID)
		axios
			.put(
				process.env.REACT_APP_BASE_URL + `categories/${categoryID}/${userID}`,
				body,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
			.then(data => {
				setValues({
					...values,
					success: true,
					response: data.data.message,
				})
			})
			.catch(err => {
				setValues({...values, error: true, response: err.response.data.err})
			})
	}

	useEffect(() => {
		fetchSingleCategory(match.params.categoryId)
	}, [])

	const submit = e => {
		e.preventDefault()
		fetchUpdateCategory(match.params.categoryId, {name: name})
	}

	const AddForm = () => {
		return (
			<Grid container spacing={2} justify="center">
				<Grid item xs={12}>
					<form className={classes.form} onSubmit={submit}>
						<Grid container>
							<Grid item xs={1}>
								<Typography variant="h6" style={{paddingLeft: '0.3em'}}>
									Name
								</Typography>
							</Grid>
							<Grid item xs={11}></Grid>
							<Grid item xs={12} style={{padding: '0.2 0 0.2 0'}}>
								<Input
									style={{backgroundColor: '#bbe1fa', height: '4em'}}
									required
									fullWidth
									id="name"
									name="name"
									onChange={handleInputChange}
									value={name}
									autoFocus
									placeholder="Category name..."
								/>
							</Grid>
						</Grid>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							className={classes.submit}
						>
							Update
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
						{redirect && <Redirect to="/admin/category/manage" />}
					</Paper>
				</Grid>
			</Grid>
		</div>
	)
}

export default UpdateProduct
