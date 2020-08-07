import React, {useState, useEffect, Fragment} from 'react'
import axios from 'axios'
import {makeStyles} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import Typography from '@material-ui/core/Typography'

import Card from './Card'
import Checkbox from './Checkbox'

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
	},
}))

const Home = () => {
	const classes = useStyles()

	const [categories, setCategories] = useState()
	const [product, setProduct] = useState()
	const [error, setError] = useState(false)

	const fetchListCategoryAPI = () => {
		axios
			.get(process.env.REACT_APP_BASE_URL + `categories`)
			.then(data => {
				setCategories(data.data)
			})
			.catch(() => {
				setError(true)
			})
	}

	const fetchListProductAPI = () => {
		axios
			.get(process.env.REACT_APP_BASE_URL + `products`)
			.then(data => {
				console.log(data)
				setProduct(data.data)
			})
			.catch(() => {
				setError(true)
			})
	}

	useEffect(() => {
		fetchListCategoryAPI()
		fetchListProductAPI()
	}, [])

	return (
		<Fragment>
			<div className={classes.root} style={{padding: '8em 6em 0em 6em'}}>
				<Grid container spacing={4}>
					<Grid container item xs={2}>
						<FormControl component="fieldset">
							<FormLabel component="legend" style={{color: '#fff'}}>
								<Typography variant="h4">Categories</Typography>
							</FormLabel>
							<Checkbox categories={categories}/>
						</FormControl>
					</Grid>
					<Grid container item xs={10} spacing={4}>
						{product &&
							product.map(product => (
								<Card key={product._id} product={product} />
							))}
					</Grid>
				</Grid>
			</div>
		</Fragment>
	)
}

export default Home
