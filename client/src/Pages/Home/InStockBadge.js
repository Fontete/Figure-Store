import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Badge from '@material-ui/core/Badge'
import QuantityIcon from '@material-ui/icons/ShoppingBasketOutlined'
import {Typography} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
	root: {
		'& > *': {
			margin: theme.spacing(1),
		},
	},
}))

const InStockBadge = ({message, quantity}) => {
	const classes = useStyles()

	return (
		<div className={classes.root}>
			<Badge max={1000} badgeContent={quantity} color="primary">
				<QuantityIcon />
			</Badge>
			<Typography>{message}</Typography>
		</div>
	)
}

export default InStockBadge
