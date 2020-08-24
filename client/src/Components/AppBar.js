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
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
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
		[theme.breakpoints.up('lg')]: {
			width: '20%',
		},
		overflowY: 'scroll',
		'&::-webkit-scrollbar': {
			width: 0,
		},
		overflowX: 'hidden',
		backgroundColor: '#0f3460',
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
					<IconButton href="/" edge="end" color="inherit">
						<img
							src="https://w0.pngwave.com/png/233/192/seven-deadly-sins-symbol-computer-icons-symbol-png-clip-art.png"
							alt="logo"
							height="48"
							width="100"
						></img>
					</IconButton>
				</MenuItem>
				<Divider />
				<MenuItem onClick={handleClose}>
					<IconButton href="/user/dashboard" edge="end" color="inherit">
						<DashboardIcon />
						<Typography>Dashboard</Typography>
					</IconButton>
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
					<IconButton href="/" edge="end" color="inherit">
						<img
							src="https://w0.pngwave.com/png/233/192/seven-deadly-sins-symbol-computer-icons-symbol-png-clip-art.png"
							alt="logo"
							height="48"
							width="100"
						></img>
					</IconButton>
				</MenuItem>
				<Divider />
				<MenuItem onClick={handleClose}>
					<IconButton href="/admin/dashboard" edge="end" color="inherit">
						<DashboardIcon />
						<Typography>Dashboard</Typography>
					</IconButton>
				</MenuItem>
				<Divider />
				<MenuItem onClick={handleClose}>
					<IconButton href="/admin/category/add" edge="end" color="inherit">
						<DashboardIcon />
						<Typography>Categories</Typography>
					</IconButton>
				</MenuItem>
				<Divider />
				<MenuItem onClick={handleClose}>
					<IconButton href="/admin/product/add" edge="end" color="inherit">
						<DashboardIcon />
						<Typography>Products</Typography>
					</IconButton>
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
						<Grid container item xs={2}>
							<IconButton
								edge="start"
								className={classes.menuButton}
								color="inherit"
								aria-label="open drawer"
								onClick={handleClick}
							>
								<MenuIcon />
								{/* <img
									src="https://w0.pngwave.com/png/233/192/seven-deadly-sins-symbol-computer-icons-symbol-png-clip-art.png"
									alt="logo"
									height="48px"
								></img> */}
							</IconButton>
							{/* <div
								className={classes.search}
								style={{
									height: '70%',
									marginTop: '0.75em',
									marginBottom: '0.75em',
								}}
							>
								<div className={classes.searchIcon}>
									<SearchIcon />
								</div>
								<InputBase
									placeholder="Search…"
									classes={{
										root: classes.inputRoot,
										input: classes.inputInput,
									}}
									inputProps={{'aria-label': 'search'}}
								/>
							</div> */}
						</Grid>
						{/* <Tabs
							variant="fullWidth"
							indicatorColor="primary"
							textColor="primary"
							aria-label="icon label tabs example"
						>
							<Link style={{textDecoration: 'none'}} to="/trending">
								<Tab
									style={{color: '#fff'}}
									icon={<HotIcon />}
									label="Hot & Newest"
								/>
							</Link>
							<Tab
								style={{color: '#fff'}}
								icon={<NewestIcon />}
								label="Newest"
							/>
							<Tab
								style={{color: '#fff'}}
								icon={<CategoryIcon />}
								label="Categories"
							/>
						</Tabs> */}
						<Grid container item xs={3}></Grid>
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
