import React, {useState, useEffect, Fragment} from 'react'
import queryString from 'query-string'
import axios from 'axios'
import SearchIcon from '@material-ui/icons/Search'
import InputBase from '@material-ui/core/InputBase'
import Grid from '@material-ui/core/Grid'
import {fade, makeStyles} from '@material-ui/core/styles'

import Card from './Card'

const useStyles = makeStyles(theme => ({
	search: {
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		'&:hover': {
			backgroundColor: fade(theme.palette.common.white, 0.25),
		},
		marginRight: theme.spacing(2),
		marginLeft: 0,
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing(3),
			width: 'auto',
		},
	},
	searchIcon: {
		padding: theme.spacing(0, 2),
		height: '100%',
		position: 'absolute',
		pointerEvents: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	inputRoot: {
		color: 'inherit',
	},
	inputInput: {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('md')]: {
			width: '200ch',
		},
	},
}))

const Search = () => {
	const classes = useStyles()
	const [data, setData] = useState({
		categories: '',
		category: '',
		search: '',
		responses: '',
		isSearch: false,
	})

	const {categories, category, search, responses, isSearch} = data

	const fetchListCategory = () => {
		axios
			.get(process.env.REACT_APP_BASE_URL + `categories`)
			.then(data => {
				setData({...data, categories: data.data})
			})
			.catch(err => {
				console.log(err.response.data.err)
			})
	}

	const fetchSearchProduct = params => {
		const query = queryString.stringify(params)

		axios
			.get(process.env.REACT_APP_BASE_URL + `products/list/search?${query}`)
			.then(data => {
				setData({...data, responses: data.data, isSearch: true})
			})
			.catch(err => {
				console.log(err.response.data.err)
			})
	}

	const searchForm = () => (
		<form className={classes.form} noValidate onSubmit={submit}>
			<div
				className={classes.search}
				style={{
					height: '100%',
					marginTop: '0.75em',
					marginBottom: '0.75em',
				}}
			>
				<Grid container>
					<Grid item sm={3} md={2} xs={2}>
						<select
							onChange={handleChange('category')}
							style={{
								height: '100%',
								width: '100%',
								border: 'inset',
								backgroundColor: 'inherit',
								borderRadius: '5%',
							}}
						>
							<option value="All">All</option>
							{categories &&
								categories.map(c => (
									<option key={c._id} value={c._id}>
										{c.name}
									</option>
								))}
						</select>
					</Grid>
					<Grid item sm={7} md={10} xs={10}>
						<div className={classes.searchIcon}>
							<SearchIcon />
						</div>
						<InputBase
							placeholder="Search…"
							classes={{
								root: classes.inputRoot,
								input: classes.inputInput,
							}}
							inputProps={{'aria-label': 'search'}}
							onChange={handleChange('search')}
						/>
					</Grid>
				</Grid>
			</div>
		</form>
	)

	const searchedProducts = (responses = []) => {
		return (
			<div>
				{/* <h2 className="mt-4 mb-4">
                    {searchMessage(searched, results)}
                </h2> */}

				<Grid container spacing={4}>
					{responses &&
						responses.map(product => (
							<Card key={product._id} product={product} />
						))}
				</Grid>
			</div>
		)
	}

	const searchData = () => {
		search &&
			fetchSearchProduct({search: search || undefined, category: category})
	}

	const submit = e => {
		e.preventDefault()
		searchData()
	}

	const handleChange = name => event => {
		setData({...data, [name]: event.target.value, isSearch: false})
	}

	useEffect(() => {
		fetchListCategory()
	}, [])

	return (
		<Fragment>
			<Grid container>
				<Grid item xs={12}>
					{searchForm()}
				</Grid>
				<Grid item xs={12}>
					{searchedProducts(responses)}
				</Grid>
			</Grid>
		</Fragment>
	)
}

export default Search
