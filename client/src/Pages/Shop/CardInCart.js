import React, {useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import View from '@material-ui/icons/ViewList'
import Remove from '@material-ui/icons/RemoveShoppingCart'
import InputBase from '@material-ui/core/InputBase'
import {Link} from 'react-router-dom'

import {updateProduct, removeProduct} from '../../General/Method/CartHandler'

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
	},
	details: {
		display: 'flex',
		flexDirection: 'column',
	},
	content: {
		flex: '1 0 auto',
	},
	cover: {
		width: 151,
		display: 'blocl',
	},
	controls: {
		display: 'flex',
		alignItems: 'center',
		paddingLeft: theme.spacing(1),
		paddingBottom: theme.spacing(1),
	},
	playIcon: {
		height: 38,
		width: 38,
	},
}))

const CardInCart = ({product, setRun = f => f, run = undefined}) => {
	const classes = useStyles()
	const url = process.env.REACT_APP_BASE_URL + `products/image/${product._id}`
	const [count, setCount] = useState(product.count)

	const handleChange = productId => e => {
		setRun(!run)
		setCount(e.target.value < 1 ? 1 : e.target.value)
		if (e.target.value >= 1) {
			updateProduct(productId, e.target.value)
		}
	}

	const updateQuantity = () => {
		return (
			<InputBase
				color="inherit"
				style={{
					backgroundColor: '#f1f1e8',
					maxWidth: '50px',
					maxHeight: '20px',
				}}
				type="number"
				value={count}
				onChange={handleChange(product._id)}
			/>
		)
	}

	return (
		<Card className={classes.root}>
			<CardMedia className={classes.cover} image={url} />
			<div className={classes.details}>
				<CardContent className={classes.content}>
					<Typography component="h5" variant="h5">
						{product.name}
					</Typography>
					<Typography variant="subtitle1" color="textSecondary">
						${product.price}
					</Typography>
					<Typography variant="subtitle2" color="textSecondary">
						Quantity {updateQuantity()}
					</Typography>
				</CardContent>
				<div className={classes.controls}>
					<IconButton
						title="Remove from cart"
						aria-label="remove"
						onClick={() => {
							removeProduct(product._id)
							setRun(!run)
						}}
					>
						<Remove />
					</IconButton>
					<Link to={`/product/${product._id}`}>
						<IconButton title="View details" aria-label="view details">
							<View />
						</IconButton>
					</Link>
				</div>
			</div>
		</Card>
	)
}

export default CardInCart
