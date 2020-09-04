import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import EditIcon from '@material-ui/icons/Edit'
import IconButton from '@material-ui/core/IconButton'

import {isAuthenticated} from '../../General/Method/Authenticate'

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
	},
	card: {
		[theme.breakpoints.up('xs')]: {
			width: 'auto',
		},
		[theme.breakpoints.up('sm')]: {
			width: 'auto',
		},
		[theme.breakpoints.up('md')]: {
			width: 'auto',
			marginLeft: '40em',
			marginRight: '40em',
		},
		[theme.breakpoints.up('lg')]: {
			width: 'auto',
		},
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
						<IconButton edge="start" color="inherit" style={{float: 'right'}}>
							<EditIcon />
						</IconButton>
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
						{isAuthenticated().data.user.firstName}
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
						{isAuthenticated().data.user.lastName}
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
						{isAuthenticated().data.user.email}
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
						{isAuthenticated().data.user.role === 0 ? 'Admin' : 'Member'}
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
		<div className={classes.root} style={{padding: '8em 0.5em 3em 0.5em'}}>
			<Grid container spacing={2} xs={12} justify="center">
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
