import React, {useState, Fragment} from 'react'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'

const RadioButtonsGroup = ({prices, productFilters}) => {
	const [value, setValue] = useState('')

	const handleChange = event => {
		productFilters(event.target.value)
		setValue(event.target.value)
	}

	return (
		<Fragment>
			{prices &&
				prices.map(p => (
					<RadioGroup key={p._id} aria-label="prices" value={value}>
						<FormControlLabel
							control={<Radio />}
							label={p.name}
							name={p}
							onChange={handleChange}
							value={`${p._id}`}
						/>
					</RadioGroup>
				))}
		</Fragment>
	)
}

export default RadioButtonsGroup
