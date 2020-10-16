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

const ManageProduct = () => {
	const [products, setProducts] = useState([])
	const [success, setSuccess] = useState(false)
	const [error, setError] = useState(false)
	const [response, setResponse] = useState('')
	const userID = isAuthenticated().data.user._id
	const token = isAuthenticated().data.token

	const fetchListProducts = () => {
		axios
			.get(process.env.REACT_APP_BASE_URL + `products/?limit=undefined`)
			.then(data => {
				setProducts(data.data)
			})
			.catch(err => {
				console.log(err.response.data.err)
			})
	}

	const fetchDeleteProduct = productID => {
		axios
			.delete(
				process.env.REACT_APP_BASE_URL + `products/${productID}/${userID}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
			.then(data => {
				setSuccess(true)
				setResponse(data.data.message)
				fetchListProducts()
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
		fetchListProducts()
	}, [])

	return (
		<div style={{padding: '5em 0.5em 3em 0.5em'}}>
			{showSuccess()}
			{showError()}
			<Grid container spacing={2} justify="center">
				<Grid item xs={12}>
					<Link style={{textDecoration: 'none'}} to="/admin/product/add">
						<Button
							type="submit"
							variant="filled"
							style={{
								marginBottom: '1em',
								backgroundColor: 'gray',
							}}
						>
							Add Product
						</Button>
					</Link>

					<Paper>
						<MenuList>
							<MenuItem style={{borderBottom: '3px solid black'}}>
								<Grid container xs={12}>
									<Grid item xs={2}>
										<Typography variant="caption" color="secondary">
											Image
										</Typography>
									</Grid>
									<Grid item xs={4}>
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
							{products.map(p => {
								return (
									<Fragment>
										<MenuItem
											style={{height: '100px', borderBottom: '3px solid black'}}
										>
											<Grid container spacing={4} xs={12} justify="center">
												<Grid
													style={{borderRight: '3px solid black'}}
													item
													xs={2}
												>
													<img
														style={{maxWidth: '100%', maxHeight: '100px'}}
														src={
															process.env.REACT_APP_BASE_URL +
															`products/image/${p._id}`
														}
														alt={p.name}
													/>
												</Grid>
												<Grid
													style={{borderRight: '3px solid black'}}
													item
													xs={4}
												>
													<Typography style={{paddingTop: '1em'}}>
														{p.name}
													</Typography>
												</Grid>
												<Grid item xs={6}>
													<Link
														style={{textDecoration: 'none'}}
														to={`/admin/product/update/${p._id}`}
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
														onClick={() => fetchDeleteProduct(p._id)}
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

export default ManageProduct
