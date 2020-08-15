import React, {useState, useEffect, Fragment} from 'react'
import axios from 'axios'
import {makeStyles} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Fab from '@material-ui/core/Fab'
import Typography from '@material-ui/core/Typography'

import Card from './Card'

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
	},
}))

const Trending = () => {
	const classes = useStyles()

	const [productBySell, setProductBySell] = useState()
	const [productByDate, setProductByDate] = useState()
	const [error, setError] = useState(false)

	const fetchListProductBySell = () => {
		axios
			.get(
				process.env.REACT_APP_BASE_URL +
					`products?sortBy=sold&order=desc&limit=4`,
			)
			.then(data => {
				setProductBySell(data.data)
			})
			.catch(() => {
				setError(true)
			})
	}

	const fetchListProductByDate = () => {
		axios
			.get(
				process.env.REACT_APP_BASE_URL +
					`products?sortBy=createdAt&order=desc&limit=4`,
			)
			.then(data => {
				setProductByDate(data.data)
			})
			.catch(() => {
				setError(true)
			})
	}

	useEffect(() => {
		fetchListProductBySell()
		fetchListProductByDate()
	}, [])

	return (
		<Fragment>
			<div className={classes.root} style={{padding: '4em 2em 0em 2em'}}>
				<Fab
					color="secondary"
					variant="extended"
					style={{
						display: productBySell ? '' : 'none',
						margin: '1em 0em 0.5em 0em',
					}}
				>
					<Typography color="inherit" variant="h4" align="center">
						Hot
					</Typography>
				</Fab>
				<Grid container spacing={4}>
					{productBySell &&
						productBySell.map(product => (
							<Card key={product._id} product={product} />
						))}
				</Grid>
			</div>
			<div className={classes.root} style={{padding: '0em 2em 0em 2em'}}>
				<Fab
					color="secondary"
					variant="extended"
					style={{
						display: productBySell ? '' : 'none',
						margin: '0.5em 0em 0.5em 0em',
					}}
				>
					<Typography color="inherit" variant="h4" align="center">
						Newest
					</Typography>
				</Fab>
				<Grid container spacing={4}>
					{productByDate &&
						productByDate.map(product => (
							<Card key={product._id} product={product} />
						))}
				</Grid>
			</div>
		</Fragment>
	)
}

export default Trending
