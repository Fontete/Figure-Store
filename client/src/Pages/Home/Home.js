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
import Search from '../Home/Search'

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
		overflowY: 'scroll',
		'&::-webkit-scrollbar': {
			width: 0,
		},
	},
}))

const Home = () => {
	const classes = useStyles()

	const [limit, setLimit] = useState(8)
	const [skip, setSkip] = useState(0)
	const [categories, setCategories] = useState()
	const [product, setProduct] = useState()
	const [error, setError] = useState(false)
	const [filter, setFilter] = useState({filters: {category: [], price: []}})

	const fetchListCategory = () => {
		axios
			.get(process.env.REACT_APP_BASE_URL + `categories`)
			.then(data => {
				setCategories(data.data)
			})
			.catch(() => {
				setError(true)
			})
	}

	const fetchListProduct = (skip, limit, filters = {}) => {
		const body = {skip, limit, filters}
		axios
			.post(process.env.REACT_APP_BASE_URL + `products/search`, body)
			.then(data => {
				setProduct(data.data)
				setSkip(0)
			})
			.catch(err => {
				setError(err.response.data.err)
			})
	}

	const fetchMoreProduct = (skip, limit, filters = {}) => {
		const body = {skip, limit, filters}
		axios
			.post(process.env.REACT_APP_BASE_URL + `products/search`, body)
			.then(data => {
				setProduct([...product, ...data.data])
				setSkip(skip)
			})
			.catch(err => {
				setError(err.response.data.err)
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
		fetchListProduct(skip, limit, newFilters)
	}

	const handleScroll = e => {
		const {offsetHeight, scrollTop, scrollHeight} = e.target
		let toSkip = skip + limit

		if (offsetHeight + scrollTop === scrollHeight) {
			fetchMoreProduct(toSkip, limit, filter.filters)
		}
	}

	// const loadMoreButton = () => {
	// 	return (
	// 		size > 0 && size >= limit && loadMore()
	// 		<button onClick={loadMore} className="btn btn-warning mb-5">
	// 			Load more
	// 		</button>
	// 	)
	// }

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
		fetchListCategory()
		loadProduct(skip, limit, filter.filters)
	}, [])

	return (
		<Fragment>
			<div
				className={classes.root}
				style={{padding: '5em 2em 0em 2em'}}
				onScroll={handleScroll}
			>
				<Grid container justify="center">
					<Hidden xsDown={true} mdDown={true}>
						<Grid item sm={2}></Grid>
					</Hidden>
					<Grid item sm={10} alignItems="center" style={{marginBottom: '1em'}}>
						<Search />
					</Grid>
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
								<Card key={product._id} product={product} />
							))}
						{/* {loadMoreButton()} */}
					</Grid>
				</Grid>
			</div>
		</Fragment>
	)
}

export default Home
