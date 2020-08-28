const mongoose = require('mongoose')
const schema = mongoose.Schema
const {ObjectId} = schema

const cartItemSchema = new schema(
	{
		product: {type: ObjectId, ref: 'Product'},
		name: String,
		price: Number,
		count: Number,
	},
	{timestamps: true},
)

const cartItem = mongoose.model('cartItem', cartItemSchema)

const OrderSchema = new schema(
	{
		products: [cartItemSchema],
		transaction_id: {},
		amount: {type: Number},
		address: String,
		status: {
			type: String,
			default: 'Not processed',
			// enum = string objects
			enum: [
				'Not processed',
				'Processing',
				'Shipped',
				'Delivered',
				'Cancelled',
			],
		},
		updated: Date,
		user: {type: ObjectId, ref: 'User'},
	},
	{timestamps: true},
)

const Order = mongoose.model('Order', OrderSchema)

module.exports = {Order, cartItem}
