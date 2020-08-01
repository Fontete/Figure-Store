import React, {useState} from 'react'
import axios from 'axios'
import {Grid, TextField, Button, Paper} from '@material-ui/core'
import {Link} from 'react-router-dom'
import {makeStyles} from '@material-ui/core/styles'

import {isAuthenticated} from '../../General/Method'
import SuccessSnackbar from '../../Components/SuccessSnackbar'

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
	},
	paper: {
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
	const [error, setError] = useState(false)
	const [success, setSuccess] = useState(false)

	const userID = isAuthenticated().data.user._id
	const token = isAuthenticated().data.token

	const categoryName = {
		name: name,
	}

	const handleChange = e => {
		setError('')
		setName(e.target.value)
	}

	const fetchAddCategoryAPI = body => {
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
				setError('')
				setSuccess(true)
			})
			.catch(err => {
				setError(err.response.data.error)
			})
	}

	const submit = e => {
		e.preventDefault()
		setError('')
		setSuccess(false)
		fetchAddCategoryAPI(categoryName)
	}

	const AddForm = () => {
		return (
			<Grid container spacing={2} justify="center">
				<Grid item xs={12}>
					<form className={classes.form} noValidate>
						<TextField
							style={{backgroundColor: '#bbe1fa'}}
							variant="filled"
							required
							fullWidth
							id="name"
							label="Category Name"
							name="name"
							onChange={handleChange}
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
			<Grid container spacing={3}>
				<Grid item xs={4}></Grid>
				<Grid item xs={4}>
					<Paper className={classes.paper} style={{backgroundColor: '#3282b8'}}>
						{AddForm()}
					</Paper>
				</Grid>
				<Grid item xs={4}></Grid>
				<Grid item xs={3}>
					<Paper className={classes.paper}>xs=3</Paper>
				</Grid>
				<Grid item xs={3}>
					<Paper className={classes.paper}>xs=3</Paper>
				</Grid>
				<Grid item xs={3}>
					<Paper className={classes.paper}>xs=3</Paper>
				</Grid>
				<Grid item xs={3}>
					<Paper className={classes.paper}>xs=3</Paper>
				</Grid>
			</Grid>
		</div>
	)
}

export default AddCategory
