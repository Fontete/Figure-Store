import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import Fab from '@material-ui/core/Fab'
import AddCartIcon from '@material-ui/icons/AddShoppingCart'
import ViewDetailIcon from '@material-ui/icons/ViewList'
import {Link} from 'react-router-dom'

import moment from 'moment'
import Badge from './InStockBadge'
import {addProduct} from '../../General/Method/CartHandler'

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
}))

const ProductCard = ({
	product: {_id, name, description, quantity, price, category, createdAt},
	showViewButton = true,
}) => {
	const classes = useStyles()

	const time = moment(createdAt).fromNow()
	const url = process.env.REACT_APP_BASE_URL + `products/image/${_id}`

	const showProductButton = showViewButton => {
		return (
			showViewButton && (
				<Fab color="secondary" className={classes.fab}>
					<ViewDetailIcon />
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
		return quantity > 0 ? (
			<Badge message=" In Stock" quantity={quantity}></Badge>
		) : (
			<Badge message="Out Of Stock"></Badge>
		)
	}

	return (
		<Card style={{border: '3px solid #C0C0C0'}} className={classes.root}>
			<Link to={`/product/${_id}`}>
				<CardMedia
					style={{borderBottom: '1px solid #C0C0C0'}}
					image={url}
					className={classes.media}
				/>
			</Link>
			<CardContent>
				<Typography
					style={{wordWrap: 'break-word'}}
					align="center"
					variant="h4"
					color="secondary"
					component="p"
				>
					{name}
				</Typography>
				<Typography align="center" variant="h6" color="primary" component="p">
					${price}
				</Typography>
				<Typography
					align="center"
					variant="caption"
					color="secondary"
					component="p"
				>
					{showSTock(quantity)}
				</Typography>
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
		</Card>
	)
}
export default ProductCard
