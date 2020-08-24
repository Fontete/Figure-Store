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
import {Hidden} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
		overflowY: 'scroll',
		'&::-webkit-scrollbar': {
			width: 0,
		},
		overflowX: 'hidden',
	},
}))

const ShopPage = () => {
	const classes = useStyles()

	const [limit, setLimit] = useState(6)
	const [skip, setSkip] = useState(0)
	const [categories, setCategories] = useState()
	const [product, setProduct] = useState()
	const [filter, setFilter] = useState({filters: {category: [], price: []}})

	const fetchListCategory = () => {
		axios
			.get(process.env.REACT_APP_BASE_URL + `categories`)
			.then(data => {
				setCategories(data.data)
			})
			.catch(err => {
				console.log(err.response.data.err)
			})
	}

	const fetchlistProductFilter = (skip, limit, filters = {}) => {
		const body = {skip, limit, filters}
		axios
			.post(process.env.REACT_APP_BASE_URL + `products/filter`, body)
			.then(data => {
				setProduct(data.data)
				setSkip(0)
			})
			.catch(err => {
				console.log(err.response.data.err)
			})
	}

	const fetchMoreProduct = (skip, limit, filters = {}) => {
		const body = {skip, limit, filters}
		axios
			.post(process.env.REACT_APP_BASE_URL + `products/filter`, body)
			.then(data => {
				setProduct([...product, ...data.data])
				setSkip(skip)
			})
			.catch(err => {
				console.log(err.response.data.err)
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

	const loadFilterProduct = newFilters => {
		fetchlistProductFilter(skip, limit, newFilters)
	}

	const handleScroll = e => {
		const {offsetHeight, scrollTop, scrollHeight} = e.target
		let toSkip = skip + limit

		if (offsetHeight + scrollTop === scrollHeight) {
			fetchMoreProduct(toSkip, limit, filter.filters)
		}
	}

	const productFilter = (filters, filterBy) => {
		const newFilters = {...filter}
		newFilters.filters[filterBy] = filters
		if (filterBy === 'price') {
			let price = handlePrice(filters)
			newFilters.filters[filterBy] = price
		}
		loadFilterProduct(filter.filters)
		setFilter(newFilters)
	}

	useEffect(() => {
		fetchListCategory()
		loadFilterProduct(skip, limit, filter.filters)
	}, [])

	return (
		<Fragment>
			<div
				className={classes.root}
				style={{padding: '6em 2em 0em 2em'}}
				onScroll={handleScroll}
			>
				<Grid container justify="center">
					<Hidden xsDown={true} mdDown={true}>
						<Grid container item sm={2}>
							<FormControl component="fieldset" style={{position: 'fixed'}}>
								<FormLabel component="legend" style={{color: '#fff'}}>
									<Typography variant="h5">Categories</Typography>
								</FormLabel>
								<Checkbox
									categories={categories}
									productFilters={filters => productFilter(filters, 'category')}
								/>
								<FormLabel component="legend" style={{color: '#fff'}}>
									<Typography variant="h5">Prices</Typography>
								</FormLabel>
								<Radio
									prices={prices}
									productFilters={filters => productFilter(filters, 'price')}
								/>
							</FormControl>
						</Grid>
					</Hidden>
					<Grid container item sm={10} spacing={4}>
						{product &&
							product.map(product => (
								<Grid item lg={4} sm={6} md={4} xs={12}>
									<Card key={product._id} product={product} />
								</Grid>
							))}
					</Grid>
				</Grid>
			</div>
		</Fragment>
	)
}

export default ShopPage
