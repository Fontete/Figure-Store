import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {makeStyles} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Fab from '@material-ui/core/Fab'
import Typography from '@material-ui/core/Typography'
import './blink.css';

import Card from './Card'
import Search from './Search'

const useStyles = makeStyles(theme => ({
	root: {
		[theme.breakpoints.up('xs')]: {
			padding: '6em 2em 0em 2em',
		},
		[theme.breakpoints.up('sm')]: {
			padding: '6em 2em 0em 2em',
		},
		[theme.breakpoints.up('md')]: {
			padding: '6em 2em 0em 2em',
		},
		[theme.breakpoints.up('lg')]: {
			padding: '6em 8em 0em 8em',
		},
		flexGrow: 1,
		overflowY: 'scroll',
		'&::-webkit-scrollbar': {
			width: 0,
		},
		overflowX: 'hidden',
	},
}))

const Home = () => {
	const classes = useStyles()

	const [productBySell, setProductBySell] = useState()
	const [productByDate, setProductByDate] = useState()

	const fetchListProductBySell = () => {
		axios
			.get(
				process.env.REACT_APP_BASE_URL +
					`products?sortBy=sold&order=desc&limit=12`,
			)
			.then(data => {
				setProductBySell(data.data)
			})
			.catch(err => {
				console.log(err.response.data.err)
			})
	}

	const fetchListProductByDate = () => {
		axios
			.get(
				process.env.REACT_APP_BASE_URL +
					`products?sortBy=createdAt&order=desc&limit=12`,
			)
			.then(data => {
				setProductByDate(data.data)
			})
			.catch(err => {
				console.log(err.response.data.err)
			})
	}

	useEffect(() => {
		fetchListProductBySell()
		fetchListProductByDate()
	}, [])

	return (
		<div className={classes.root}>
			<Grid container justify="center">
				<Grid container item xs={12} sm={12}>
					<Search />
				</Grid>
				<Grid container item xs={12} sm={12}>
					<Fab
						color="secondary"
						variant="extended"
						style={{
							margin: '1em 0em 0.5em 0em',
						}}
					>
						<Typography color="inherit" variant="h4" align="center">
							<span className="blink">Hot</span>
						</Typography>
					</Fab>
					<Grid container spacing={4}>
						{productBySell &&
							productBySell.map(product => (
								<Grid item lg={3} sm={6} md={4} xs={12}>
									<Card key={product._id} product={product} />
								</Grid>
							))}
					</Grid>
				</Grid>
				<Grid container item sm={12}>
					<Fab
						color="secondary"
						variant="extended"
						style={{
							margin: '0.5em 0em 0.5em 0em',
						}}
					>
						<Typography color="inherit" variant="h4" align="center">
							<span className="blink">Newest</span>
						</Typography>
					</Fab>
					<Grid container spacing={4}>
						{productByDate &&
							productByDate.map(product => (
								<Grid item lg={3} sm={6} md={4} xs={12}>
									<Card key={product._id} product={product} />
								</Grid>
							))}
					</Grid>
				</Grid>
			</Grid>
		</div>
	)
}

export default Home
