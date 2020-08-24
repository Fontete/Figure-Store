import React, {useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Popover from '@material-ui/core/Popover'
import Tooltip from '@material-ui/core/Tooltip'
import Fab from '@material-ui/core/Fab'
import AddCartIcon from '@material-ui/icons/AddShoppingCart'
import ViewDetailIcon from '@material-ui/icons/ViewList'
import {Link, Redirect} from 'react-router-dom'

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

	const showSTock = quantity => {
		return quantity > 0 ? (
			<Badge message="In Stock" quantity={quantity}></Badge>
		) : (
			<Badge message="Out Of Stock" quantity={quantity}></Badge>
		)
	}

	return (
		<Card className={classes.root}>
			<Link to={`/product/${_id}`}>
				<CardMedia image={url} className={classes.media} />
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
