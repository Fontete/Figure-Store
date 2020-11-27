const mongoose = require('mongoose')
const schema = mongoose.Schema
const pushNotiSchema = new schema(
	{
		subscription: {
			type: Object,
		},
	},
	{timestamps: true},
)

module.exports = mongoose.model('pushNoti', pushNotiSchema)
