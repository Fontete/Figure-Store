const mongoose = require('mongoose')
const schema = mongoose.Schema
const crypto = require('crypto')
const uuidv1 = require('uuidv1')

const userSchema = new schema(
	{
		fullname: {
			type: String,
			trim: true,
			required: true,
			maxlength: 32,
		},
		email: {
			type: String,
			trim: true,
			required: true,
			unique: true,
		},
		hashed_password: {
			type: String,
			required: true,
		},
		salt: String,
		role: {
			type: Number,
			default: 1,
		},
		history: {
			type: Array,
			default: [],
		},
	},
	{timestamps: true},
)

// virtual field
userSchema
	.virtual('password')
	.set(function (password) {
		this._password = password
		this.salt = uuidv1()
		this.hashed_password = this.encryptPassword(password)
	})
	.get(function () {
		return this._password
	})

userSchema.methods = {
	authenticate: function (password) {
		return this.encryptPassword(password) === this.hashed_password
	},

	encryptPassword: function (password) {
		if (!password) return ''
		try {
			return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
		} catch (err) {
			return ''
		}
	},
}

module.exports = mongoose.model('User', userSchema)
