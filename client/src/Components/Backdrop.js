import React from 'react'
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}))

const Loading = ({loading}) => {
	const classes = useStyles()

	return (
		<Backdrop open={loading} className={classes.backdrop}>
			<CircularProgress color="inherit" />
		</Backdrop>
	)
}

export default Loading
