const mongoose = require('mongoose')
const schema = mongoose.Schema
const {ObjectId} = schema

const productSchema = new schema(
	{
		name: {
			type: String,
			trim: true,
			required: true,
			maxlength: 32,
		},
		description: {
			type: String,
			required: true,
			maxlength: 2000,
		},
		price: {
			type: Number,
			trim: true,
			required: true,
			maxlength: 32,
		},
		category: {
			type: ObjectId,
			ref: 'Category',
			required: true,
		},
		quantity: {
			type: Number,
		},
		sold: {
			type: Number,
			default: 0,
		},
		image: {
			data: Buffer,
			contentType: String,
		},
		image2: {
			data: Buffer,
			contentType: String,
		},
		image3: {
			data: Buffer,
			contentType: String,
		},
		image4: {
			data: Buffer,
			contentType: String,
		},
		image5: {
			data: Buffer,
			contentType: String,
		},
		shipping: {
			required: false,
			type: Boolean,
		},
	},
	{timestamps: true},
)

module.exports = mongoose.model('Product', productSchema)
