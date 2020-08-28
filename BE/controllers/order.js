const {Order, cartItem} = require('../models/order')
const error = require('../general/error')

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
