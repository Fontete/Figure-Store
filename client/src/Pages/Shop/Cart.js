import React, {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'

import CartItem from './CardInCart'
import {Typography, Grid} from '@material-ui/core'
import {productsInCart} from '../../General/Method/CartHandler'

const useStyles = makeStyles(theme => ({
	typography: {
		padding: theme.spacing(2),
	},
}))

const Cart = () => {
	const classes = useStyles()
	const [product, setProduct] = useState([])

	const showProduct = () => {
		return (
			<Typography variant="caption" align="center">
				You have {`${product.length} in cart`}
			</Typography>
		)
	}

	const showEmpty = () => {
		return (
			<Typography variant="caption" align="center">
				Your cart is empty
			</Typography>
		)
	}

	useEffect(() => {
		setProduct(productsInCart())
	}, [])

	return (
		<Grid container item xs={12} sm={12} justify="center">
			<Grid container xs={12} spacing={1} justify="center">
				{product &&
					product.map(product => (
						<Grid item xs={12}>
							<CartItem key={product._id} product={product} />
						</Grid>
					))}
			</Grid>
		</Grid>
	)
}

export default Cart
