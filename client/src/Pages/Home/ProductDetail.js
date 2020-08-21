import React, {useState, useEffect, Fragment} from 'react'
import axios from 'axios'
import Grid from '@material-ui/core/Grid'
import Fab from '@material-ui/core/Fab'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/core/styles'

import Card from './Card'

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

const Detail = props => {
	const classes = useStyles()
	const [product, setProduct] = useState({})
	const [related, setRelated] = useState()

	const fetchProductDetail = productId => {
		axios
			.get(process.env.REACT_APP_BASE_URL + `products/${productId}`)
			.then(data => {
				setProduct(data.data)
				fetchRelatedProduct(productId)
			})
			.catch(err => {
				console.log(err.response.data.err)
			})
	}

	const fetchRelatedProduct = productId => {
		axios
			.get(process.env.REACT_APP_BASE_URL + `products/related/${productId}`)
			.then(data => {
				setRelated(data.data)
			})
			.catch(err => {
				console.log(err.response.data.err)
			})
	}

	useEffect(() => {
		const productId = props.match.params.productId
		fetchProductDetail(productId)
	}, [])
	return (
		<Fragment>
			<div className={classes.root} style={{padding: '6em 2em 0em 2em'}}>
				<Grid container justify="center">
					<Grid container item lg={6} md={12} xs={12} sm={12}>
						<Grid container spacing={4}>
							<Grid item lg={12} sm={12} md={12} xs={12}>
								{product && product.description && (
									<Card product={product} showViewButton={false} />
								)}
							</Grid>
						</Grid>
					</Grid>
					<Grid container item lg={6} md={12} xs={12} sm={12}>
						<Grid container spacing={4}></Grid>
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
								Related
							</Typography>
						</Fab>
						<Grid container spacing={4}>
							{related &&
								related.map(product => (
									<Grid item lg={3} sm={6} md={4} xs={12}>
										<Card key={product._id} product={product} />
									</Grid>
								))}
						</Grid>
					</Grid>
				</Grid>
			</div>
		</Fragment>
	)
}

export default Detail
