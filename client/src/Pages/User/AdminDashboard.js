import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import EditIcon from '@material-ui/icons/Edit'
import IconButton from '@material-ui/core/IconButton'

import {isAuthenticated} from '../../General/Method'

const useStyles = makeStyles({
	root: {
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
			<div style={{padding: '8em 40em 1.5em 40em'}}>
				<Card className={classes.root} variant="outlined">
					<CardContent>
						<Typography variant="h4" color="inherit" gutterBottom>
							Profile
							<div style={{float: 'right'}}>
								<IconButton edge="start" color="inherit">
									<EditIcon />
								</IconButton>
							</div>
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
			</div>
		)
	}

	return <div>{Profile()}</div>
}

export default Dashboard
