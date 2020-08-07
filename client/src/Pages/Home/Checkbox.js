import React, {useState, Fragment} from 'react'
import {withStyles} from '@material-ui/core/styles'
import {green} from '@material-ui/core/colors'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'

const CheckboxLabels = ({categories}) => {
	const [isChecked, setIsChecked] = useState([])

	const handleChecked = c => () => {
		// return the first index or -1
		const currentCategoryId = isChecked.indexOf(c)
		const newCheckedCategoryId = [...isChecked]
		// if currently checked was not already in checked state > push
		// else pull/take off
		if (currentCategoryId === -1) {
			newCheckedCategoryId.push(c)
		} else {
			newCheckedCategoryId.splice(currentCategoryId, 1)
		}
		console.log(newCheckedCategoryId)
		setIsChecked(newCheckedCategoryId)
		// handleFilters(newCheckedCategoryId)
		console.log(newCheckedCategoryId)
	}

	return (
		<Fragment>
			{categories &&
				categories.map(c => (
					<FormGroup column>
						<FormControlLabel
							control={
								<Checkbox
									value={isChecked.indexOf(c._id === -1)}
									onChange={handleChecked(c._id)}
									name="checked"
								/>
							}
							label={c.name}
						/>
					</FormGroup>
				))}
		</Fragment>
	)
}

export default CheckboxLabels
