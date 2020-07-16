const categoryModel = require('../models/category')
const error = require('../general/error')

exports.add = (req, res) => {
	const category = new categoryModel(req.body)
	category.save(err => {
		if (err) {
			return res.status(403).json({
				err: error.errorHandler(err),
			})
		}
		res.json({
			message: 'Create successfully',
		})
	})
}
