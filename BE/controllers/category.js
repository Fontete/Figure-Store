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

//categoryID middleware
exports.categoryByID = async (req, res, next, id) => {
	categoryModel.findById(id).exec((err, category) => {
		if (err || !category) {
			return res.status(400).json({
				err: 'Category is not existed',
			})
		}
		req.category = category
		next()
	})
}

exports.categoryList = (req, res) => {
	categoryModel.find().exec((err, data) => {
		if (err) {
			return res.status(400).json({
				err: error.errorHandler(err),
			})
		}
		res.json(data)
	})
}

exports.categoryDetail = (req, res) => {
	return res.json(req.category)
}

exports.update = (req, res) => {
	const category = req.category
	categoryModel.findOneAndUpdate({_id: category._id}, {$set: req.body}, err => {
		if (err) {
			return res.status(400).json({err: error.errorHandler(err)})
		}
		res.json({message: 'Update successfully'})
	})
}

exports.delete = (req, res) => {
	categoryModel.findOneAndDelete(req.category._id, err => {
		if (err) {
			return res.status(400).json({
				err: error.errorHandler,
			})
		}
		res.json({
			message: 'Delete successfully',
		})
	})
}
