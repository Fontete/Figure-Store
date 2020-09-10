import React, {useState, Fragment} from 'react'
import queryString from 'query-string'
import axios from 'axios'
import SearchIcon from '@material-ui/icons/Search'
import InputBase from '@material-ui/core/InputBase'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import {fade, makeStyles} from '@material-ui/core/styles'
import {
	MuiThemeProvider,
	createMuiTheme,
	responsiveFontSizes,
} from '@material-ui/core'

import Card from './Card'

let theme = createMuiTheme()
theme = responsiveFontSizes(theme)

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
		search: '',
		responses: '',
		isSearch: false,
	})

	const {search, responses, isSearch} = data

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
				<Grid container item>
					<Grid item sm={8} md={6} xs={12}>
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

	const searchMessage = (isSearch, responses) => {
		if (isSearch && responses.length > 0) {
			return (
				<Typography variant="caption" color="secondary">
					{responses.length} results was found
				</Typography>
			)
		}
		if (isSearch && responses.length === 0) {
			return (
				<Typography variant="caption" color="secondary">
					No result was found
				</Typography>
			)
		}
	}

	const searchedProducts = (responses = []) => {
		return (
			<div>
				<MuiThemeProvider theme={theme}>
					<Typography
						variant="subtitle1"
						align="right"
						gutterBottom
						style={{margin: '1em 0 1em 0'}}
					>
						{searchMessage(isSearch, responses)}
					</Typography>
				</MuiThemeProvider>

				<Grid container spacing={4}>
					{responses &&
						responses.map(product => (
							<Grid item lg={3} sm={6} md={4} xs={12}>
								<Card key={product._id} product={product} />
							</Grid>
						))}
				</Grid>
			</div>
		)
	}

	const searchData = () => {
		search && fetchSearchProduct({search: search || undefined})
	}

	const submit = e => {
		e.preventDefault()
		searchData()
	}

	const handleChange = name => event => {
		setData({...data, [name]: event.target.value, isSearch: false})
	}

	return (
		<Fragment>
			<Grid container>
				<Grid item sm={2} md={3}></Grid>
				<Grid item sm={8} md={6} xs={12}>
					{searchForm()}
				</Grid>
				<Grid item sm={2} md={3}></Grid>
				<Grid item xs={12}>
					{searchedProducts(responses)}
				</Grid>
			</Grid>
		</Fragment>
	)
}

export default Search
