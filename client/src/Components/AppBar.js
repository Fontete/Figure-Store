import React, {useState} from 'react'
import axios from 'axios'
import {fade, makeStyles} from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import InputBase from '@material-ui/core/InputBase'
import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search'
import AccountCircle from '@material-ui/icons/AccountCircleSharp'
import {Link, withRouter} from 'react-router-dom'

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
}))

const AppSearchBar = ({history}) => {
	const classes = useStyles()

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
			<AppBar className={classes.appBar} position="static">
				<Toolbar>
					<IconButton
						edge="start"
						className={classes.menuButton}
						color="inherit"
						aria-label="open drawer"
					>
						<MenuIcon />
					</IconButton>
					<Link to="/">
						<img
							href="/"
							src="https://w0.pngwave.com/png/233/192/seven-deadly-sins-symbol-computer-icons-symbol-png-clip-art.png"
							alt="logo"
							height="48px"
						></img>
					</Link>
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
					<div className={classes.grow} />
					<div className={classes.sectionDesktop}>
						<IconButton
							href="/login"
							edge="end"
							aria-label="account of current user"
							aria-haspopup="true"
							color="inherit"
						>
							<AccountCircle />
						</IconButton>
						<IconButton
							edge="end"
							aria-label="account of current user"
							aria-haspopup="true"
							color="inherit"
							onClick={logout}
						>
							<AccountCircle />
						</IconButton>
					</div>
				</Toolbar>
			</AppBar>
		</div>
	)
}

export default withRouter(AppSearchBar)
