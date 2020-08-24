import React, {useState, Fragment} from 'react'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'

const CheckboxLabels = ({categories, productFilters}) => {
	const [isChecked, setIsChecked] = useState([])

	const handleChecked = c => () => {
		const currentCategoryId = isChecked.indexOf(c)
		const newCheckedCategoryId = [...isChecked]

		if (currentCategoryId === -1) {
			newCheckedCategoryId.push(c)
		} else {
			newCheckedCategoryId.splice(currentCategoryId, 1)
		}

		setIsChecked(newCheckedCategoryId)
		productFilters(newCheckedCategoryId)
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
