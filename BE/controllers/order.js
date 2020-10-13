const {Order, cartItem} = require('../models/order')
const error = require('../general/error')

exports.orderByID = (req, res, next, id) => {
	Order.findById(id)
		.populate('products.product', 'name price')
		.exec((err, order) => {
			if (err || !order) {
				return res.status(400).json({
					err: error.errorHandler(err),
				})
			}
			req.order = order
			next()
		})
}

exports.create = (req, res) => {
	req.body.order.user = req.profile
	const order = new Order(req.body.order)
	order.save((err, data) => {
		if (err) {
			return res.status(400).json({err: error.errorHandler(err)})
		}
		res.json(data)
	})
}

exports.list = (req, res) => {
	Order.find()
		.populate('user', '_id firstName lastName')
		.sort()
		.exec((err, orders) => {
			if (err) {
				return res.status(400).json({
					err: error.errorHandler(err),
				})
			}
			res.json(orders)
		})
}

exports.listStatus = (req, res) => {
	res.json(Order.schema.path('status').enumValues)
}

exports.updateStatus = (req, res) => {
	Order.updateOne(
		{_id: req.params.orderId},
		{$set: {status: req.body.status}},
		(err, order) => {
			if (err) {
				return res.status(400).json({
					err: error.errorHandler(err),
				})
			}
			res.json(order)
		},
	)
}

exports.search = (req, res) => {
	if (req.params.search) {
		Order.findById({_id: req.params.search})
			.populate('user')
			.exec((err, orders) => {
				if (err) {
					return res.status(400).json({
						err: 'No result was found',
					})
				}
				res.json(orders)
			})
	}
}
