import React, {useState, useEffect, Fragment} from 'react'
import axios from 'axios'
import Grid from '@material-ui/core/Grid'
import Fab from '@material-ui/core/Fab'
import Typography from '@material-ui/core/Typography'
import CardMedia from '@material-ui/core/CardMedia'
import CardImg from '@material-ui/core/Card'
import {makeStyles} from '@material-ui/core/styles'
import './blink.css'

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
	card: {
		maxWidth: '100%',
	},
	media: {
		maxHeight: '100%',
		maxWidth: '100%',
		display: 'block',
		paddingTop: '56.25%', // 16:9
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
			width: 'auto',
			height: '140px',
		},
	},
}))

const Detail = props => {
	const classes = useStyles()
	const [product, setProduct] = useState({})
	const [related, setRelated] = useState()
	const [url2, setUrl2] = useState()
	const [url3, setUrl3] = useState()
	const [url4, setUrl4] = useState()
	const [url5, setUrl5] = useState()

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
		setUrl2(process.env.REACT_APP_BASE_URL + `products/image2/${productId}`)
		setUrl3(process.env.REACT_APP_BASE_URL + `products/image3/${productId}`)
		setUrl4(process.env.REACT_APP_BASE_URL + `products/image4/${productId}`)
		setUrl5(process.env.REACT_APP_BASE_URL + `products/image5/${productId}`)
		fetchProductDetail(productId)
		window.scrollTo(0, 0)
	}, [props])

	console.log(url2)

	return (
		<Fragment>
			<div className={classes.root} style={{padding: '6em 2em 0em 2em'}}>
				<Grid container justify="center" spacing={2}>
					<Grid container item lg={6} md={12} xs={12} sm={12}>
						<Grid container spacing={4}>
							<Grid item lg={12} sm={12} md={12} xs={12}>
								{product && product.description && (
									<Card product={product} showViewButton={false} />
								)}
							</Grid>
						</Grid>
					</Grid>
					<Grid container item lg={6} spacing={4}>
						<Grid item xs={6}>
							<CardImg
								className={classes.Card}
								style={{border: '1px solid #C0C0C0'}}
							>
								<CardMedia image={url2} className={classes.media}></CardMedia>
							</CardImg>
						</Grid>
						<Grid item xs={6}>
							<CardImg
								className={classes.card}
								style={{border: '1px solid #C0C0C0'}}
							>
								<CardMedia image={url3} className={classes.media}></CardMedia>
							</CardImg>
						</Grid>
						<Grid item xs={6}>
							<CardImg
								className={classes.card}
								style={{border: '1px solid #C0C0C0'}}
							>
								<CardMedia image={url4} className={classes.media}></CardMedia>
							</CardImg>
						</Grid>
						<Grid item xs={6}>
							<CardImg
								className={classes.card}
								style={{border: '1px solid #C0C0C0'}}
							>
								<CardMedia image={url5} className={classes.media}></CardMedia>
							</CardImg>
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
								<span className="blink">Related</span>
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
