import React, {useState, useEffect} from 'react'
import {Typography, Grid, Button} from '@material-ui/core'
import {Link} from 'react-router-dom'

import CartItem from './CardInCart'
import {productsInCart} from '../../General/Method/CartHandler'
import Checkout from './Checkout'

const Cart = () => {
	const [product, setProduct] = useState([])
	const [run, setRun] = useState(false)

	const showProduct = () => {
		return (
			<Typography style={{padding: '5px'}} color="secondary" variant="body1">
				{product.length <= 1
					? `You have ${product.length} product in cart`
					: `You have ${product.length} products in cart`}
			</Typography>
		)
	}

	useEffect(() => {
		setProduct(productsInCart())
	}, [run])

	return (
		<Grid container item xs={12} sm={12} justify="center">
			<Grid container item spacing={0} xs={12} justify="flex-end">
				{showProduct()}
			</Grid>
			<Grid container xs={12} spacing={1} justify="center">
				{product.length !== 0 ? (
					product.map(product => (
						<Grid item xs={12}>
							<CartItem
								key={product._id}
								product={product}
								setRun={setRun}
								run={run}
							/>
						</Grid>
					))
				) : (
					<Grid item xs={12}>
						<Link style={{textDecorationColor: 'red'}} to="/shop">
							<Typography style={{color: '#fff'}} align="center" variant="h3">
								Shop Now!
							</Typography>
						</Link>
					</Grid>
				)}
				<Grid container xs={12} spacing={0} justify="flex-end">
					<Grid container item xs={12} justify="flex-end">
						<Checkout products={product} />
					</Grid>
					<Grid container item xs={12} justify="flex-end">
						<Button
							style={{maxWidth: '80px'}}
							variant="contained"
							color="secondary"
						>
							<Typography variant="caption">Checkout</Typography>
						</Button>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	)
}

export default Cart
