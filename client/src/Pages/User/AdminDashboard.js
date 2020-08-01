import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import EditIcon from '@material-ui/icons/Edit'
import IconButton from '@material-ui/core/IconButton'

import {isAuthenticated} from '../../General/Method'

const useStyles = makeStyles({
	root: {
		flexGrow: 1,
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
})

const Dashboard = () => {
	const classes = useStyles()

	const Profile = () => {
		return (
			<Grid container spacing={2} justify="center">
				<Grid item xs={12} justify="center">
					<Card className={classes.card} variant="outlined">
						<CardContent>
							<Typography variant="h3" color="inherit">
								Profile
								<IconButton
									edge="start"
									color="inherit"
									style={{float: 'right'}}
								>
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
				</Grid>
			</Grid>
		)
	}

	return (
		<div className={classes.root} style={{padding: '8em 0.5em 3em 0.5em'}}>
			<Grid container spacing={3}>
				<Grid item xs={4}></Grid>
				<Grid item xs={4}>
					{Profile()}
				</Grid>
				<Grid item xs={4}></Grid>
				<Grid item xs={12}></Grid>
			</Grid>
		</div>
	)
}

export default Dashboard
