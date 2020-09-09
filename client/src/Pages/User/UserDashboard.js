import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import EditIcon from '@material-ui/icons/Edit'
import IconButton from '@material-ui/core/IconButton'
import {Link} from 'react-router-dom'

import {isAuthenticated} from '../../General/Method/Authenticate'

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
		[theme.breakpoints.up('xs')]: {
			width: 'auto',
			padding: '6em 0.5em 0em 0.5em',
		},
		[theme.breakpoints.up('sm')]: {
			width: 'auto',
			padding: '6em 0.5em 0em 0.5em',
		},
		[theme.breakpoints.up('md')]: {
			width: 'auto',
			padding: '6em 0.5em 0em 0.5em',
		},
		[theme.breakpoints.up('lg')]: {
			width: 'auto',
			padding: '6em 2em 0em 2em',
		},
	},
	card: {
		minWidth: 275,
		backgroundColor: '#3282b8',
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)',
	},
	title: {
		fontSize: 14,
	},
	pos: {
		marginBottom: 12,
	},
}))

const Dashboard = () => {
	const classes = useStyles()

	const Profile = () => {
		return (
			<Card className={classes.card} variant="outlined">
				<CardContent>
					<Typography variant="h3" color="inherit">
						Profile
						<Link
							to={`/profile/${isAuthenticated().data.user._id}`}
							style={{textDecoration: 'none'}}
						>
							<IconButton edge="start" color="inherit" style={{float: 'right'}}>
								<EditIcon style={{color: 'black'}} />
							</IconButton>
						</Link>
					</Typography>
				</CardContent>
				<Divider />
				<CardContent>
					<Typography
						className={classes.title}
						color="textSecondary"
						gutterBottom
					>
						Firstname
					</Typography>
					<Typography variant="h5" component="h2">
						{isAuthenticated().user
							? isAuthenticated().user.data.firstName
							: isAuthenticated().data.user.firstName}
					</Typography>
					<Divider />
					<Typography
						className={classes.title}
						color="textSecondary"
						gutterBottom
					>
						Lastname
					</Typography>
					<Typography variant="h5" component="h2">
						{isAuthenticated().user
							? isAuthenticated().user.data.lastName
							: isAuthenticated().data.user.lastName}
					</Typography>
					<Divider />
					<Typography
						className={classes.title}
						color="textSecondary"
						gutterBottom
					>
						Email
					</Typography>
					<Typography variant="h5" component="h2">
						{isAuthenticated().user
							? isAuthenticated().user.data.email
							: isAuthenticated().data.user.email}
					</Typography>
					<Divider />
					<Typography
						className={classes.title}
						color="textSecondary"
						gutterBottom
					>
						Role
					</Typography>
					<Typography variant="h5" component="h2">
						{isAuthenticated().user
							? isAuthenticated().user.data.role === 0
								? 'Admin'
								: 'Member'
							: isAuthenticated().data.user.role === 0
							? 'Admin'
							: 'Member'}
					</Typography>
				</CardContent>
				<Divider />
			</Card>
		)
	}

	const PurchaseHistory = () => {
		return (
			<Card className={classes.card} variant="outlined">
				<CardContent>
					<Typography variant="h4" color="inherit">
						Purchase History
					</Typography>
				</CardContent>
				<Divider />
				<Grid container xs={12}>
					<Grid item xs={4}></Grid>
					<Grid item xs={8}>
						<CardContent>
							<Typography
								className={classes.title}
								color="textSecondary"
								gutterBottom
							>
								Firsname
							</Typography>
							<Typography variant="h5" component="h2">
								Hi
							</Typography>
							<Divider />
							<Typography
								className={classes.title}
								color="textSecondary"
								gutterBottom
							>
								Lastname
							</Typography>
							<Typography variant="h5" component="h2">
								Hi
							</Typography>
							<Divider />
							<Typography
								className={classes.title}
								color="textSecondary"
								gutterBottom
							>
								Email
							</Typography>
							<Typography variant="h5" component="h2">
								Hi
							</Typography>
							<Divider />
							<Typography
								className={classes.title}
								color="textSecondary"
								gutterBottom
							>
								Word of the Day
							</Typography>
							<Typography variant="h5" component="h2">
								Hi
							</Typography>
						</CardContent>
					</Grid>
				</Grid>
			</Card>
		)
	}

	return (
		<div className={classes.root}>
			<Grid container spacing={2} justify="center">
				<Grid item xs={12}>
					{Profile()}
				</Grid>
				<Grid item xs={12}>
					{PurchaseHistory()}
				</Grid>
			</Grid>
		</div>
	)
}

export default Dashboard
