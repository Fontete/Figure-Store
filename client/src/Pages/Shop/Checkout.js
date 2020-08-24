import React from 'react'
import {Typography} from '@material-ui/core'
const Checkout = ({products}) => {
	const purchase = () => {
		return products.reduce((currentValue, nextValue) => {
			return currentValue + nextValue.count * nextValue.price
		}, 0)
	}

	return (
		<div>
			<Typography style={{padding: '5px'}} color="secondary" variant="body1">
				Total: ${purchase()}
			</Typography>
		</div>
	)
}

export default Checkout
