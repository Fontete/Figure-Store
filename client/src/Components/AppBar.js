import React, {useState} from 'react'
import axios from 'axios'
import {makeStyles} from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import DashboardIcon from '@material-ui/icons/Dashboard'
import AccountCircle from '@material-ui/icons/AccountCircleSharp'
import Typography from '@material-ui/core/Typography'
import Drawer from '@material-ui/core/Drawer'
import MenuItem from '@material-ui/core/MenuItem'
import Divider from '@material-ui/core/Divider'
import Fab from '@material-ui/core/Fab'
import {withRouter, Link} from 'react-router-dom'
import {isAuthenticated} from '../General/Method/Authenticate'
import Grid from '@material-ui/core/Grid'
import Popover from '@material-ui/core/Popover'

import {total} from '../General/Method/CartHandler'
import Badge from '../Pages/Shop/AddToCartBadge'
import Cart from '../Pages/Shop/Cart'

const useStyles = makeStyles(theme => ({
	grow: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	appBar: {
		backgroundColor: '#1b262c',
	},
	paper: {
		maxWidth: 250,
		backgroundColor: '#1b262c',
		color: '#fff',
		width: 170,
		justifyContent: 'space-strech',
	},
	popover: {
		[theme.breakpoints.up('xs')]: {
			width: 'auto',
		},
		[theme.breakpoints.up('sm')]: {
			width: '50%',
		},
		[theme.breakpoints.up('md')]: {
			width: '40%',
		},
		[theme.breakpoints.up('lg')]: {
			width: '25%',
		},
		overflowY: 'scroll',
		'&::-webkit-scrollbar': {
			width: 0,
		},
		overflowX: 'hidden',
		backgroundColor: '#696969',
	},
}))

const AppSearchBar = ({history}) => {
	const classes = useStyles()
	//Drawer
	const [anchorEl, setAnchorEl] = useState(null)

	const handleClick = e => {
		setAnchorEl(e.currentTarget)
	}

	const handleClose = () => {
		setAnchorEl(null)
	}
	//Popover
	const [popoverAnchorEl, setPopoverAnchorEl] = useState(null)
	const open = Boolean(popoverAnchorEl)
	const id = open ? 'simple-popover' : undefined

	const handleCart = event => {
		setPopoverAnchorEl(event.currentTarget)
	}

	const handlePopoverClose = () => {
		setPopoverAnchorEl(null)
	}

	const UserDrawer = () => {
		return (
			<Drawer
				classes={{paper: classes.paper}}
				docked={false}
				open={anchorEl}
				onClose={handleClose}
			>
				<MenuItem onClick={handleClose}>
					<Link to="/" style={{textDecoration: 'none'}}>
						<IconButton edge="end" color="inherit">
							<img
								src="https://w0.pngwave.com/png/233/192/seven-deadly-sins-symbol-computer-icons-symbol-png-clip-art.png"
								alt="logo"
								height="48"
								width="100"
							></img>
						</IconButton>
					</Link>
				</MenuItem>
				<Divider />
				<MenuItem onClick={handleClose}>
					<Link to="/user/profile" style={{textDecoration: 'none'}}>
						<IconButton edge="end" color="inherit">
							<DashboardIcon style={{color: '#fff'}} />
							<Typography style={{color: '#fff'}}>Profile</Typography>
						</IconButton>
					</Link>
				</MenuItem>
				<Divider />
			</Drawer>
		)
	}

	const AdminDrawer = () => {
		return (
			<Drawer
				classes={{paper: classes.paper}}
				docked={false}
				open={anchorEl}
				onClose={handleClose}
			>
				<MenuItem onClick={handleClose}>
					<Link to="/" style={{textDecoration: 'none'}}>
						<IconButton edge="end" color="inherit">
							<img
								src="https://w0.pngwave.com/png/233/192/seven-deadly-sins-symbol-computer-icons-symbol-png-clip-art.png"
								alt="logo"
								height="48"
								width="100"
							></img>
						</IconButton>
					</Link>
				</MenuItem>
				<Divider />
				<MenuItem onClick={handleClose}>
					<Link to="/admin/profile" style={{textDecoration: 'none'}}>
						<IconButton edge="end" color="inherit">
							<DashboardIcon style={{color: '#fff'}} />
							<Typography style={{color: '#fff'}}>Profile</Typography>
						</IconButton>
					</Link>
				</MenuItem>
				<Divider />
				<MenuItem onClick={handleClose}>
					<Link to="/admin/category/add" style={{textDecoration: 'none'}}>
						<IconButton edge="end" color="inherit">
							<DashboardIcon style={{color: '#fff'}} />
							<Typography style={{color: '#fff'}}>Categories</Typography>
						</IconButton>
					</Link>
				</MenuItem>
				<Divider />
				<MenuItem onClick={handleClose}>
					<Link to="/admin/product/add" style={{textDecoration: 'none'}}>
						<IconButton edge="end" color="inherit">
							<DashboardIcon style={{color: '#fff'}} />
							<Typography style={{color: '#fff'}}> Add Products</Typography>
						</IconButton>
					</Link>
				</MenuItem>
				<Divider />
				<MenuItem onClick={handleClose}>
					<Link to="/admin/product/manage" style={{textDecoration: 'none'}}>
						<IconButton edge="end" color="inherit">
							<DashboardIcon style={{color: '#fff'}} />
							<Typography style={{color: '#fff'}}>Management</Typography>
						</IconButton>
					</Link>
				</MenuItem>
				<Divider />
				<MenuItem onClick={handleClose}>
					<Link to="/admin/product/orders" style={{textDecoration: 'none'}}>
						<IconButton edge="end" color="inherit">
							<DashboardIcon style={{color: '#fff'}} />
							<Typography style={{color: '#fff'}}>Orders</Typography>
						</IconButton>
					</Link>
				</MenuItem>
				<Divider />
			</Drawer>
		)
	}

	const CartPopover = () => {
		return (
			<Popover
				classes={{paper: classes.popover}}
				style={{maxHeight: '400px'}}
				id={id}
				open={open}
				anchorEl={popoverAnchorEl}
				onClose={handlePopoverClose}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'left',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'left',
				}}
			>
				<Cart />
			</Popover>
		)
	}

	const logout = () => {
		if (typeof window !== 'undefined') {
			localStorage.removeItem('jwt')
			axios
				.get(process.env.REACT_APP_BASE_URL + 'users/logout')
				.then(() => {
					history.push('/')
				})
				.catch(err => {
					console.log(err.response.data)
				})
		}
	}

	return (
		<div className={classes.grow}>
			<AppBar className={classes.appBar} position="fixed">
				<Toolbar>
					<Grid container spacing={4}>
						<Grid container item xs={5}>
							<IconButton
								edge="start"
								className={classes.menuButton}
								color="inherit"
								aria-label="open drawer"
								onClick={handleClick}
							>
								<MenuIcon />
							</IconButton>
							<Link style={{textDecoration: 'none'}} to="/shop">
								<Fab
									size="small"
									color="secondary"
									variant="extended"
									style={{
										width: '100px',

										marginTop: '5px',
										marginBottom: '5px',
									}}
								>
									<Typography variant="caption" color="inherit">
										Shop Now!
									</Typography>
								</Fab>
							</Link>
						</Grid>
						<Grid container item xs={7} justify="flex-end">
							<IconButton onClick={handleCart}>
								<Badge quantity={total()} />
							</IconButton>
							{CartPopover()}
							{!isAuthenticated() && (
								<Link to="/login" style={{textDecoration: 'none'}}>
									<IconButton
										title="Sign In"
										edge="end"
										aria-label="account of current user"
										aria-haspopup="true"
										color="inherit"
									>
										<AccountCircle style={{color: '#fff'}} />
										<Typography style={{color: '#fff'}}>Sign In</Typography>
									</IconButton>
								</Link>
							)}
							{isAuthenticated() && (
								<IconButton
									title="Sign Out"
									edge="end"
									aria-label="account of current user"
									aria-haspopup="true"
									color="inherit"
									onClick={logout}
								>
									<AccountCircle />
									<Typography>Sign Out</Typography>
								</IconButton>
							)}
						</Grid>
					</Grid>
				</Toolbar>
			</AppBar>
			{isAuthenticated() && isAuthenticated().data.user.role === 1
				? UserDrawer()
				: AdminDrawer()}
		</div>
	)
}

export default withRouter(AppSearchBar)
