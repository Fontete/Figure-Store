import React, {useState, useEffect, Fragment} from 'react'
import axios from 'axios'
import {
	Grid,
	MenuList,
	MenuItem,
	Button,
	Paper,
	Snackbar,
	Typography,
} from '@material-ui/core'
import {Alert} from '@material-ui/lab'
import {isAuthenticated} from '../../General/Method/Authenticate'
import {Link} from 'react-router-dom'

const ManageCategory = () => {
	const [categories, setCategories] = useState([])
	const [success, setSuccess] = useState(false)
	const [error, setError] = useState(false)
	const [response, setResponse] = useState('')
	const userID = isAuthenticated().data.user._id
	const token = isAuthenticated().data.token

	const fetchListCategories = () => {
		axios
			.get(process.env.REACT_APP_BASE_URL + `categories/`)
			.then(data => {
				setCategories(data.data)
			})
			.catch(err => {
				console.log(err.response.data.err)
			})
	}

	const fetchDeleteCategory = categoryID => {
		axios
			.delete(
				process.env.REACT_APP_BASE_URL + `categories/${categoryID}/${userID}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
			.then(data => {
				setSuccess(true)
				setResponse(data.data.message)
				fetchListCategories()
			})
			.catch(err => {
				setError(true)
				setResponse(err.response.data.err)
			})
	}

	const handleClose = reason => {
		if (reason === 'clickaway') {
			return
		}

		setSuccess(false)
		setError(false)
	}

	const showSuccess = () => {
		return (
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
		)
	}

	const showError = () => {
		return (
			<Snackbar
				anchorOrigin={{vertical: 'top', horizontal: 'center'}}
				open={error}
				autoHideDuration={3000}
				onClose={handleClose}
			>
				<Alert onClose={handleClose} severity="error">
					{response}
				</Alert>
			</Snackbar>
		)
	}

	useEffect(() => {
		fetchListCategories()
	}, [])

	return (
		<div style={{padding: '5em 0.5em 3em 0.5em'}}>
			{showSuccess()}
			{showError()}
			<Grid container spacing={2} justify="center">
				<Grid item xs={12}>
					<Link style={{textDecoration: 'none'}} to="/admin/category/add">
						<Button
							type="submit"
							variant="filled"
							style={{
								marginBottom: '1em',
								backgroundColor: 'gray',
							}}
						>
							Add Category
						</Button>
					</Link>

					<Paper>
						<MenuList>
							<MenuItem style={{borderBottom: '3px solid black'}}>
								<Grid container xs={12}>
									<Grid item xs={6}>
										<Typography variant="caption" color="secondary">
											Name
										</Typography>
									</Grid>
									<Grid item xs={6}>
										<Typography variant="caption" color="secondary">
											Action
										</Typography>
									</Grid>
								</Grid>
							</MenuItem>
							{categories.map(c => {
								return (
									<Fragment>
										<MenuItem
											style={{height: '100px', borderBottom: '3px solid black'}}
										>
											<Grid container spacing={4} xs={12} justify="center">
												<Grid
													style={{borderRight: '3px solid black'}}
													item
													xs={4}
												>
													<Typography style={{paddingTop: '1em'}}>
														{c.name}
													</Typography>
												</Grid>
												<Grid item xs={6}>
													<Link
														style={{textDecoration: 'none'}}
														to={`/admin/category/update/${c._id}`}
													>
														<Button
															type="submit"
															variant="filled"
															style={{
																marginTop: '1em',
																backgroundColor: 'blue',
															}}
														>
															Update
														</Button>
													</Link>
													<Button
														style={{
															marginTop: '1em',
															marginLeft: '1em',
															backgroundColor: 'red',
														}}
														onClick={() => fetchDeleteCategory(c._id)}
													>
														Delete
													</Button>
												</Grid>
											</Grid>
										</MenuItem>
									</Fragment>
								)
							})}
						</MenuList>
					</Paper>
				</Grid>
			</Grid>
		</div>
	)
}

export default ManageCategory
