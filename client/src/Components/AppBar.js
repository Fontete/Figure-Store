import React, {useState} from 'react'
import axios from 'axios'
import {fade, makeStyles} from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import InputBase from '@material-ui/core/InputBase'
import CategoryIcon from '@material-ui/icons/Category'
import NewestIcon from '@material-ui/icons/NewReleases'
import HotIcon from '@material-ui/icons/TrendingUp'
import SearchIcon from '@material-ui/icons/Search'
import DashboardIcon from '@material-ui/icons/Dashboard'
import AccountCircle from '@material-ui/icons/AccountCircleSharp'
import Typography from '@material-ui/core/Typography'
import Drawer from '@material-ui/core/Drawer'
import MenuItem from '@material-ui/core/MenuItem'
import Divider from '@material-ui/core/Divider'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import {Link, withRouter} from 'react-router-dom'
import {isAuthenticated} from '../General/Method/Authenticate'
import Grid from '@material-ui/core/Grid'

const useStyles = makeStyles(theme => ({
	grow: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		display: 'none',
		[theme.breakpoints.up('sm')]: {
			display: 'block',
		},
	},
	search: {
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		'&:hover': {
			backgroundColor: fade(theme.palette.common.white, 0.25),
		},
		marginRight: theme.spacing(2),
		marginLeft: 0,
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing(3),
			width: 'auto',
		},
	},
	searchIcon: {
		padding: theme.spacing(0, 2),
		height: '100%',
		position: 'absolute',
		pointerEvents: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	inputRoot: {
		color: 'inherit',
	},
	inputInput: {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('md')]: {
			width: '20ch',
		},
	},
	sectionDesktop: {
		display: 'none',
		[theme.breakpoints.up('md')]: {
			display: 'flex',
		},
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
}))

const AppSearchBar = ({history}) => {
	const classes = useStyles()

	const [anchorEl, setAnchorEl] = useState(null)

	const handleClick = e => {
		setAnchorEl(e.currentTarget)
	}

	const handleClose = () => {
		setAnchorEl(null)
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
				<Grid container>
					<Toolbar>
						<IconButton
							edge="start"
							className={classes.menuButton}
							color="inherit"
							aria-label="open drawer"
							onClick={handleClick}
						>
							{/* <MenuIcon /> */}
							<img
								src="https://w0.pngwave.com/png/233/192/seven-deadly-sins-symbol-computer-icons-symbol-png-clip-art.png"
								alt="logo"
								height="48px"
							></img>
						</IconButton>
						<div className={classes.search}>
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
						</div>
						<Tabs
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
						</Tabs>
						<div className={classes.grow} />
						<div className={classes.sectionDesktop}>
							{!isAuthenticated() && (
								<IconButton
									href="/login"
									edge="end"
									aria-label="account of current user"
									aria-haspopup="true"
									color="inherit"
								>
									<AccountCircle />
									<Typography>Sign In</Typography>
								</IconButton>
							)}

							{isAuthenticated() && (
								<IconButton
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
						</div>
					</Toolbar>
				</Grid>
			</AppBar>
			{isAuthenticated() && isAuthenticated().data.user.role === 1
				? UserDrawer()
				: AdminDrawer()}
		</div>
	)
}

export default withRouter(AppSearchBar)
