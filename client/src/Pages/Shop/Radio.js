import React, {useState, Fragment} from 'react'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import Box from '@material-ui/core/Box'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import {Typography} from '@material-ui/core'
import './radio.css';

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
					<RadioGroup className="priceText" key={p._id} aria-label="prices" value={value}>
						<FormControlLabel 
							control={<Radio style={{color: '#fff'}} />}
							label={
								<Box>
									<p>{p.name}</p>
								</Box>
							}
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
