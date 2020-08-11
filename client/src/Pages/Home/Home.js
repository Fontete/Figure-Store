import React, {useState, useEffect, Fragment} from 'react'
import axios from 'axios'
import {makeStyles} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import Typography from '@material-ui/core/Typography'

import Card from './Card'
import Checkbox from './Checkbox'
import Radio from './Radio'
import {prices} from './PriceRange'

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
	const [filter, setFilter] = useState({filters: {category: [], price: []}})

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
				setProduct(data.data)
			})
			.catch(() => {
				setError(true)
			})
	}

	const handlePrice = value => {
		const data = prices
		let arr = []
		for (let i in data) {
			if (data[i]._id === parseInt(value)) {
				arr = data[i].array
			}
		}
		return arr
	}

	const loadProduct = newFilters => {
		console.log(newFilters)
	}

	const productFilter = (filters, filterBy) => {
		const newFilters = {...filter}
		newFilters.filters[filterBy] = filters
		if (filterBy === 'price') {
			let price = handlePrice(filters)
			newFilters.filters[filterBy] = price
		}
		loadProduct(filter.filters)
		setFilter(newFilters)
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
								<Typography variant="h5">Categories</Typography>
							</FormLabel>
							<Checkbox
								categories={categories}
								productFilters={filters => productFilter(filters, 'category')}
							/>
						</FormControl>
						<FormControl component="fieldset">
							<FormLabel component="legend" style={{color: '#fff'}}>
								<Typography variant="h5">Prices</Typography>
							</FormLabel>
							<Radio
								prices={prices}
								productFilters={filters => productFilter(filters, 'price')}
							/>
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
