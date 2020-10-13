import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {
	Card,
	Grid,
	Button,
	Paper,
	Snackbar,
	TextareaAutosize,
	MenuItem,
	Select,
	Typography,
	Input,
} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import {makeStyles} from '@material-ui/core/styles'

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

const AddProduct = () => {
	const classes = useStyles()

	const [values, setValues] = useState({
		name: '',
		description: '',
		price: '',
		categories: false,
		category: '',
		shipping: '',
		quantity: '',
		image: '',
		success: false,
		error: '',
		formData: '',
		response: '',
	})
	const {
		name,
		description,
		price,
		categories,
		category,
		shipping,
		quantity,
		success,
		error,
		formData,
		response,
	} = values

	const userID = isAuthenticated().data.user._id
	const token = isAuthenticated().data.token

	const handleInputChange = name => event => {
		const value =
			name === 'image' ||
			name === 'image2' ||
			name === 'image3' ||
			name === 'image4' ||
			name === 'image5'
				? event.target.files[0]
				: event.target.value

		formData.set(name, value)
		setValues({
			...values,
			[name]: value,
		})
	}

	const handleClose = reason => {
		if (reason === 'clickaway') {
			return
		}

		setValues({...values, error: false, success: false})
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
					onClose={handleClose}
				>
					<Alert onClose={handleClose} severity="error">
						{response}
					</Alert>
				</Snackbar>
			</div>
		)
	}

	const fetchAddProduct = body => {
		axios
			.post(
				process.env.REACT_APP_BASE_URL + `products/create/${userID}`,
				body,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
			.then(data => {
				setValues({...values, success: true, response: data.data.message})
			})
			.catch(err => {
				setValues({...values, error: true, response: err.response.data.err})
			})
	}

	const fetchListCategory = () => {
		axios
			.get(process.env.REACT_APP_BASE_URL + `categories`)
			.then(data => {
				setValues({
					...values,
					categories: data.data,
					formData: new FormData(),
				})
			})
			.catch(err => {
				setValues({...values, error: true, response: err.response.data.err})
			})
	}

	useEffect(() => {
		fetchListCategory()
	}, [])

	const submit = e => {
		e.preventDefault()
		fetchAddProduct(formData)
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
									style={{backgroundColor: '#fff', height: '4em'}}
									required
									fullWidth
									id="name"
									name="name"
									onChange={handleInputChange('name')}
									value={name}
									autoFocus
									placeholder="Product name..."
								/>
							</Grid>
						</Grid>
						<Grid container>
							<Grid item xs={1}>
								<Typography variant="h6" style={{paddingLeft: '0.3em'}}>
									Price
								</Typography>
							</Grid>
							<Grid item xs={11}></Grid>
							<Grid item xs={12} style={{padding: '0.2 0 0.2 0'}}>
								<Input
									style={{backgroundColor: '#fff', height: '4em'}}
									required
									fullWidth
									id="price"
									name="price"
									onChange={handleInputChange('price')}
									value={price}
									placeholder="Price..."
									type="number"
								/>
							</Grid>
						</Grid>
						<Grid container>
							<Grid item xs={1}>
								<Typography variant="h6" style={{paddingLeft: '0.3em'}}>
									Quantity
								</Typography>
							</Grid>
							<Grid item xs={11}></Grid>
							<Grid item xs={12} style={{padding: '0.2 0 0.2 0'}}>
								<Input
									style={{backgroundColor: '#fff', height: '4em'}}
									required
									fullWidth
									id="quantity"
									name="quantiy"
									onChange={handleInputChange('quantity')}
									value={quantity}
									type="number"
									placeholder="Quantity..."
								/>
							</Grid>
						</Grid>
						<Grid container>
							<Grid item xs={1}>
								<Typography variant="h6" style={{paddingLeft: '0.3em'}}>
									Category
								</Typography>
							</Grid>
							<Grid item xs={11}></Grid>
							<Grid item xs={12} style={{padding: '0.2 0 0.2 0'}}>
								<Select
									style={{
										width: '100%',
										backgroundColor: '#fff',
									}}
									label="Category"
									variant="filled"
									labelId="demo-simple-select-filled-label"
									id="demo-simple-select-filled"
									required
									onChange={handleInputChange('category')}
									value={category}
								>
									{categories &&
										categories.map(c => (
											<MenuItem key={c._id} value={c._id}>
												{c.name}
											</MenuItem>
										))}
								</Select>
							</Grid>
						</Grid>
						<Grid container>
							<Grid item xs={1}>
								<Typography variant="h6" style={{paddingLeft: '0.3em'}}>
									Shipping
								</Typography>
							</Grid>
							<Grid item xs={11}></Grid>
							<Grid item xs={12} style={{padding: '0.2 0 0.2 0'}}>
								<Select
									style={{
										width: '100%',
										backgroundColor: '#fff',
									}}
									label="Category"
									variant="filled"
									labelId="demo-simple-select-filled-label"
									id="demo-simple-select-filled"
									required
									value={shipping}
									onChange={handleInputChange('shipping')}
								>
									<MenuItem value="1">Yes</MenuItem>
									<MenuItem value="0">No</MenuItem>
								</Select>
							</Grid>
						</Grid>
						<Grid container>
							<Grid item xs={1}>
								<Typography variant="h6" style={{paddingLeft: '0.3em'}}>
									Images
								</Typography>
							</Grid>
							<Grid item xs={11}></Grid>
							<Grid item xs={12} style={{padding: '0.2 0 0.2 0'}}>
								<Grid item xs={12}>
									<Card style={{height: '80px', backgroundColor: '#fff'}}>
										<Grid container xs={12} justify="center">
											<Grid item xs={2}>
												<Typography
													color="secondary"
													align="center"
													variant="caption"
												>
													Image 1
												</Typography>
											</Grid>
											<Grid item xs={2}>
												<Typography
													color="primary"
													align="center"
													variant="caption"
												>
													Image 2
												</Typography>
											</Grid>
											<Grid item xs={2}>
												<Typography
													color="primary"
													align="center"
													variant="caption"
												>
													Image 3
												</Typography>
											</Grid>
											<Grid item xs={2}>
												<Typography
													color="primary"
													align="center"
													variant="caption"
												>
													Image 4
												</Typography>
											</Grid>
											<Grid item xs={2}>
												<Typography
													color="primary"
													align="center"
													variant="caption"
												>
													Image 5
												</Typography>
											</Grid>
										</Grid>
										<Grid
											container
											xs={12}
											justify="center"
											style={{backgroundColor: '#fff'}}
										>
											<Grid item xs={2}>
												<label for="file">
													<img
														src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRGA1L3T04Ixnzozll3s8RLlR7VsGQ8OA-Mzg&usqp=CAU"
														alt="main"
														height="50px"
													/>
												</label>
											</Grid>
											<Grid item xs={2}>
												<label for="file2">
													<img
														src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRGA1L3T04Ixnzozll3s8RLlR7VsGQ8OA-Mzg&usqp=CAU"
														alt="main"
														height="50px"
													/>
												</label>
											</Grid>
											<Grid item xs={2}>
												<label for="file3">
													<img
														src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRGA1L3T04Ixnzozll3s8RLlR7VsGQ8OA-Mzg&usqp=CAU"
														alt="main"
														height="50px"
													/>
												</label>
											</Grid>
											<Grid item xs={2}>
												<label for="file4">
													<img
														src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRGA1L3T04Ixnzozll3s8RLlR7VsGQ8OA-Mzg&usqp=CAU"
														alt="main"
														height="50px"
													/>
												</label>
											</Grid>
											<Grid item xs={2}>
												<label for="file5">
													<img
														src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRGA1L3T04Ixnzozll3s8RLlR7VsGQ8OA-Mzg&usqp=CAU"
														alt="main"
														height="50px"
													/>
												</label>
											</Grid>
										</Grid>
										<input
											style={{display: 'none'}}
											id="file"
											onChange={handleInputChange('image')}
											type="file"
											name="image"
											accept="image/*"
										/>
										<input
											style={{display: 'none'}}
											id="file2"
											onChange={handleInputChange('image2')}
											type="file"
											name="image"
											accept="image/*"
										/>
										<input
											style={{display: 'none'}}
											id="file3"
											onChange={handleInputChange('image3')}
											type="file"
											name="image"
											accept="image/*"
										/>
										<input
											style={{display: 'none'}}
											id="file4"
											onChange={handleInputChange('image4')}
											type="file"
											name="image"
											accept="image/*"
										/>
										<input
											style={{display: 'none'}}
											id="file5"
											onChange={handleInputChange('image5')}
											type="file"
											name="image"
											accept="image/*"
										/>
									</Card>
								</Grid>
							</Grid>
						</Grid>
						<Grid container>
							<Grid item xs={1}>
								<Typography variant="h6" style={{paddingLeft: '0.3em'}}>
									Description
								</Typography>
							</Grid>
							<Grid item xs={11}></Grid>
							<Grid item xs={12} style={{padding: '0.2 0 0.2 0'}}>
								<TextareaAutosize
									style={{
										width: '99%',
										backgroundColor: '#fff',
										height: '8em',
									}}
									aria-label="minimum height"
									rowsMin={3}
									placeholder="Description..."
									required
									value={description}
									onChange={handleInputChange('description')}
								/>
							</Grid>
						</Grid>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							className={classes.submit}
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
					</Paper>
				</Grid>
			</Grid>
		</div>
	)
}

export default AddProduct
