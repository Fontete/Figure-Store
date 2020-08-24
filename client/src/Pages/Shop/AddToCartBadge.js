import React from 'react'
import Badge from '@material-ui/core/Badge'
import {withStyles} from '@material-ui/core/styles'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'

const StyledBadge = withStyles(theme => ({
	badge: {
		right: -3,
		top: 13,
		border: `2px solid ${theme.palette.background.paper}`,
		padding: '0 4px',
	},
}))(Badge)

const InStockBadge = ({quantity}) => {
	return (
		<StyledBadge badgeContent={quantity} color="secondary">
			<ShoppingCartIcon style={{color: '#fff'}} />
		</StyledBadge>
	)
}

export default InStockBadge
