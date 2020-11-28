import React, {Fragment, useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import Fab from '@material-ui/core/Fab'
import AddCartIcon from '@material-ui/icons/AddShoppingCart'
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'
import {Link} from 'react-router-dom'

import moment from 'moment'
import Badge from './InStockBadge'
import {addProduct} from '../../General/Method/CartHandler'
import {lime, yellow} from '@material-ui/core/colors'

const useStyles = makeStyles(theme => ({
	root: {
		maxWidth: '100%',
	},
	media: {
		maxHeight: '100%',
		maxWidth: '100%',
		display: 'block',
		paddingTop: '56.25%', // 16:9
	},
	typography: {
		padding: theme.spacing(2),
	},
	title: {
		[theme.breakpoints.up('xs')]: {
			width: 'auto',
		},
		[theme.breakpoints.up('sm')]: {
			width: 'auto',
			height: '50px',
		},
		[theme.breakpoints.up('md')]: {
			width: 'auto',
			height: '75px',
		},
		[theme.breakpoints.up('lg')]: {
			width: 'auto',
			height: 'auto',
		},
	},
	desc: {
		[theme.breakpoints.up('xs')]: {
			width: 'auto',
		},
		[theme.breakpoints.up('sm')]: {
			width: 'auto',
			height: '50px',
		},
		[theme.breakpoints.up('md')]: {
			width: 'auto',
			height: '50px',
		},
		[theme.breakpoints.up('lg')]: {
			width: 'auto',
			height: 'auto',
		},
	},
}))

const ProductCard = ({
	product: {
		_id,
		name,
		description,
		quantity,
		price,
		category,
		createdAt,
		shipping,
	},
	showViewButton = true,
}) => {
	const classes = useStyles()

	const [isAdd, setIsAdd] = useState(false)

	const time = moment(createdAt).fromNow()
	const url = process.env.REACT_APP_BASE_URL + `products/image/${_id}`

	const showProductButton = showViewButton => {
		return (
			showViewButton && (
				<Fab color="primary" className={classes.fab}>
					<ListAltOutlinedIcon />
				</Fab>
			)
		)
	}

	const handleOutOfStock = quantity => {
		if (quantity === 0) {
			return true
		} else {
			return false
		}
	}

	const showSTock = quantity => {
		return !shipping ? (
			quantity > 1 ? (
				<Badge message=" Order Slots" quantity={quantity}></Badge>
			) : (
				<Badge message=" Order Slot" quantity={quantity}></Badge>
			)
		) : quantity > 0 ? (
			<Badge message=" In Stock" quantity={quantity}></Badge>
		) : (
			<Badge message="Out Of Stock"></Badge>
		)
	}

	const addToCartSuccess = () => {
		return (
			<Snackbar
				anchorOrigin={{vertical: 'top', horizontal: 'center'}}
				open={isAdd}
				autoHideDuration={3000}
				onClose={handleClose}
			>
				<Alert onClose={handleClose} severity="success">
					Item is added to cart
				</Alert>
			</Snackbar>
		)
	}

	const handleClose = reason => {
		if (reason === 'clickaway') {
			return
		}
		setIsAdd(false)
	}

	return (
		<div className="grow">
			<Card style={{border: '3px solid #C0C0C0'}} className={classes.root}>
				<Link to={`/product/${_id}`}>
					<CardMedia
						style={{borderBottom: '1px solid #C0C0C0'}}
						image={url}
						className={classes.media}
					/>
				</Link>
				<CardContent>
					<div className={classes.title}>
						<Typography
							style={{wordWrap: 'break-word'}}
							align="center"
							variant="h4"
							color="inherit"
							component="p"
						>
							{name}
						</Typography>
					</div>
					<Typography align="center" variant="h6" color="primary" component="p">
						${price}
					</Typography>
					<Typography align="center" variant="h8" component="p">
						{!shipping ? (
							<p
								style={{
									backgroundColor: 'blue',
									color: 'white',
									borderRadius: '10px',
									fontSize: '18px',
									fontWeight: 'bold',
								}}
							>
								Pre-order
							</p>
						) : shipping && quantity > 0 ? (
							<p
								style={{
									backgroundColor: '#32cd32',
									color: 'white',
									borderRadius: '10px',
									fontSize: '18px',
									fontWeight: 'bold',
								}}
							>
								Available
							</p>
						) : (
							<p
								style={{
									backgroundColor: 'grey',
									color: 'white',
									borderRadius: '10px',
									fontSize: '18px',
									fontWeight: 'bold',
								}}
							>
								Unavailable
							</p>
						)}
					</Typography>
					<Typography align="center" variant="caption" component="p">
						{showSTock(quantity)}
					</Typography>
					<div className={classes.desc}>
						<Typography
							style={{wordWrap: 'break-word'}}
							align="center"
							variant="subtitle2"
							color="textPrimary"
							component="p"
						>
							{description.length > 50
								? `${description.substring(0, 50)} ...`
								: description}
						</Typography>
					</div>
					<Typography
						align="center"
						variant="caption"
						color="primary"
						component="p"
					>
						Category: {category.name}
					</Typography>
					<Typography
						align="center"
						variant="subtitle2"
						color="primary"
						component="p"
					>
						Added on {time}
					</Typography>
				</CardContent>
				<CardActions style={{justifyContent: 'center'}} disableSpacing>
					<Tooltip
						title="Add to cart"
						aria-label="add"
						style={{marginRight: '0.5em'}}
					>
						<Fab
							onClick={() => {
								addProduct({
									_id,
									name,
									description,
									quantity,
									price,
									category,
									createdAt,
								})
								setIsAdd(true)
							}}
							disabled={handleOutOfStock(quantity)}
							color="primary"
							className={classes.fab}
						>
							<AddCartIcon />
						</Fab>
					</Tooltip>
					<Tooltip
						title="View detail"
						aria-label="view"
						style={{marginLeft: '0.5em'}}
					>
						<Link to={`/product/${_id}`}>
							{showProductButton(showViewButton)}
						</Link>
					</Tooltip>
				</CardActions>
				{addToCartSuccess()}
			</Card>
		</div>
	)
}
export default ProductCard
