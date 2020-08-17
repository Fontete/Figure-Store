const formidable = require('formidable')
const lodash = require('lodash')
const fs = require('fs')

const productModel = require('../models/product')
const error = require('../general/error')
const router = require('../routes/product')

exports.add = (req, res) => {
	let form = new formidable.IncomingForm()
	form.keepExtensions = true
	form.parse(req, (err, form, files) => {
		if (err) {
			return res.status(400).json({
				err: 'File cannot upload',
			})
		}

		const {name, description, price, category, quantity, shipping} = form

		if (
			!name ||
			!description ||
			!price ||
			!category ||
			!quantity ||
			!shipping
		) {
			return res.status(400).json({
				err: 'Please complete all information for the product',
			})
		}

		if (quantity <= 0 || price <= 0) {
			return res.status(400).json({
				err: 'Number must be larger than zero',
			})
		}

		// add new product
		let product = new productModel(form)

		// if user upload image for product, check the size of image
		if (files.image) {
			// file size smaller than 1MB
			if (files.image.size > 1000000) {
				return res.status(400).json({
					err: 'File size is more than 1 MB',
				})
			}
			product.image.data = fs.readFileSync(files.image.path)
			product.image.contentType = files.image.type
		}
		product.save(err => {
			if (err) {
				return res.status(400).json({
					err: error.errorHandler(err),
				})
			}
			res.json({
				message: 'Add successfully',
			})
		})
	})
}

//productID middleware
exports.productByID = async (req, res, next, id) => {
	productModel.findById(id).exec((err, product) => {
		if (err || !product) {
			return res.status(400).json({
				err: 'Product is not existed',
			})
		}
		req.product = product
		next()
	})
}

//enable this function when you use productID middleware
exports.productDetail = (req, res) => {
	//the size of imgae may affect the performance, so we not respone the image
	req.product.image = undefined
	return res.json(req.product)
}

//disable this function if you want to use the middeware
// exports.productDetail = (req, res) => {
//     productModel.findById(req.params.productID).exec((err,product)=>{
//         if (err || !product) {
//             return res.status(400).json({
//                 err: "Product is not existed"
//             })
//         }
//         product.image = undefined
//         return res.json(product)
//     })
// }

exports.delete = (req, res) => {
	// the original is findById(id).remove(), findById is handle by prouctID middleware
	// req.product.remove((err) => {
	//     if (err) {
	//         return res.status(400).json({
	//             err: error.errorHandler
	//         })
	//     }
	//     res.json({
	//         message: "Delete successfully"
	//     })
	// })
	productModel.findOnedAndDelete(req.product._id, err => {
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

exports.update = (req, res) => {
	let form = new formidable.IncomingForm()
	form.keepExtensions = true
	form.parse(req, (err, form, files) => {
		if (err) {
			return res.status(400).json({
				err: 'File cannot upload',
			})
		}

		// update product

		let product = req.product
		product = lodash.extend(product, form)

		// if user upload image for product, check the size of image
		if (files.image) {
			// file size smaller than 1MB
			if (files.image.size > 1000000) {
				return res.status(400).json({
					err: 'File size is more than 1MB',
				})
			}
			product.image.data = fs.readFileSync(files.image.path)
			product.image.contentType = files.image.type
		}

		if (quantity <= 0 || price <= 0) {
			return res.status(400).json({
				err: 'Number must be larger than zero',
			})
		}

		product.save(err => {
			if (err) {
				return res.status(400).json({
					err: error.errorHandler(err),
				})
			}
			res.json({
				message: 'Update successfully',
			})
		})
	})
}

exports.image = (req, res, next) => {
	if (req.product.image.data) {
		res.set('Content-Type', req.product.image.contentType)
		return res.send(req.product.image.data)
	}
	next()
}

exports.productList = (req, res) => {
	let order = req.query.order ? req.query.order : 'asc'
	let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
	let limit = req.query.limit ? parseInt(req.query.limit) : 100

	productModel
		.find()
		.select('-image')
		.populate('category')
		.sort([[sortBy, order]])
		.limit(limit)
		.exec((err, data) => {
			if (err) {
				return res.status(400).json({
					err: 'Product is not existed',
				})
			}
			res.json(data)
		})
}

exports.relatedList = (req, res) => {
	let limit = req.query.limit ? parseInt(req.query.limit) : 4
	productModel
		.find({_id: {$ne: req.product}, category: req.product.category})
		.select('-image')
		.populate('category', '_id name')
		.limit(limit)
		.exec((err, data) => {
			if (err) {
				return res.status(400).json({
					err: 'Product is not existed',
				})
			}
			res.json(data)
		})
}

exports.filterList = (req, res) => {
	let order = req.body.order ? req.body.order : 'desc'
	let sortBy = req.body.sortBy ? req.body.sortBy : '_id'
	let limit = req.body.limit ? parseInt(req.body.limit) : 8
	let skip = parseInt(req.body.skip)
	let priceRange = {}

	for (let i in req.body.filters) {
		if (req.body.filters[i].length > 0) {
			if (i === 'price') {
				// gte -  greater than price [price 1 - price 2]
				// lte - less than
				priceRange[i] = {
					$gte: req.body.filters[i][0],
					$lte: req.body.filters[i][1],
				}
			} else {
				priceRange[i] = req.body.filters[i]
			}
		}
	}

	productModel
		.find(priceRange)
		.select('-image')
		.populate('category')
		.sort([[sortBy, order]])
		.skip(skip)
		.limit(limit)
		.exec((err, data) => {
			if (err) {
				return res.status(400).json({
					error: 'Product is not existed',
				})
			}
			res.json(data)
		})
}

exports.searchList = (req, res) => {
	const query = {}
	// assign search value to query.name
	if (req.query.search) {
		query.name = {$regex: req.query.search, $options: 'i'}
		// assign category value to query.category
		if (req.query.category && req.query.category != 'All') {
			query.category = req.query.category
		}
		// find the product based on query object with search and category properties
		productModel
			.find(query, (err, products) => {
				if (err) {
					return res.status(400).json({
						error: errorHandler(err),
					})
				}
				res.json(products)
			})
			.select('-photo')
	}
}
