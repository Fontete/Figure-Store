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
import AddCardIcon from '@material-ui/icons/AddShoppingCart'
import ViewDetailIcon from '@material-ui/icons/ViewList'

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

const ProductCard = ({product: {_id, name, description, price}}) => {
	const classes = useStyles()
	const [anchorEl, setAnchorEl] = useState()

	const handleClick = event => {
		setAnchorEl(event.currentTarget)
	}

	const handleClose = () => {
		setAnchorEl(null)
	}

	const open = Boolean(anchorEl)
	const id = open ? 'simple-popover' : undefined

	const url = process.env.REACT_APP_BASE_URL + `products/image/${_id}`

	return (
		<Grid item sm={4} md={4} xs={12}>
			<Card className={classes.root}>
				<CardMedia image={url} className={classes.media} />

				<CardContent>
					<Typography align="center" variant="h5" color="primary" component="p">
						{name}
					</Typography>
					<Typography align="center" variant="h6" color="primary" component="p">
						${price}
					</Typography>
					<Typography
						align="center"
						variant="subtitle2"
						color="textPrimary"
						component="p"
					>
						{description.length > 50
							? `${description.substring(0, 50)} ...`
							: description}
					</Typography>
				</CardContent>
				<CardActions style={{justifyContent: 'center'}} disableSpacing>
					{/* <IconButton aria-label="add to favorites">
						<Button variant="outlined" color="primary">
							Buy
						</Button>
					</IconButton>
					<IconButton>
						<Button
							aria-describedby={id}
							variant="contained"
							color="primary"
							onClick={handleClick}
						>
							View More Detail
						</Button>
					</IconButton>
					<Popover
						id={id}
						open={open}
						anchorEl={anchorEl}
						onClose={handleClose}
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'center',
						}}
						transformOrigin={{
							vertical: 'top',
							horizontal: 'center',
						}}
					>
						<Typography className={classes.typography}>
							{description}.
						</Typography>
					</Popover> */}
					<Tooltip
						title="Add to cart"
						aria-label="add"
						style={{marginRight: '0.5em'}}
					>
						<Fab color="primary" className={classes.fab}>
							<AddCardIcon />
						</Fab>
					</Tooltip>
					<Tooltip
						title="View detail"
						aria-label="view"
						style={{marginLeft: '0.5em'}}
					>
						<Fab color="secondary" className={classes.fab}>
							<ViewDetailIcon />
						</Fab>
					</Tooltip>
				</CardActions>
			</Card>
		</Grid>
	)
}
export default ProductCard
