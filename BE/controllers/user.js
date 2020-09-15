const userModel = require('../models/user')
const {Order} = require('../models/order')
const jwt = require('jsonwebtoken')
const error = require('../general/error')

exports.register = async (req, res) => {
	const user = new userModel(req.body)
	user.save((err, user) => {
		if (err) {
			return res.status(400).json({
				err: error.errorHandler(err),
			})
		}
		res.json({
			user,
		})
	})
}

exports.logIn = async (req, res) => {
	const {email, password} = req.body
	userModel.findOne(
		{
			email,
		},
		(err, user) => {
			if (err || !user) {
				return res.status(400).json({
					err: 'Account is not existed',
				})
			}

			if (!user.authenticate(password)) {
				return res.status(401).json({
					err: 'Email or password is invalid',
				})
			}

			//create token
			const token = jwt.sign(
				{
					_id: user._id,
				},
				process.env.JWT,
			)
			res.cookie('token', token, {
				expire: 60 * 60 * 24,
			})

			const {_id, firstName, lastName, email, role} = user
			return res.json({
				token,
				user: {
					_id,
					firstName,
					lastName,
					email,
					role,
				},
			})
		},
	)
}

exports.logOut = async (req, res) => {
	res.clearCookie('token')
	res.json({
		message: 'Log out successfully',
	})
}

//userID middleware
exports.userByID = async (req, res, next, id) => {
	userModel.findById(id).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				err: 'User is not existed',
			})
		}
		req.profile = user
		next()
	})
}

//enable this function when you use userID middleware
exports.info = async (req, res) => {
	res.json(req.profile)
}

//Disable this function if you want to use userID middleware
// exports.profile = (req, res) => {
//         userModel.findById(req.params.userID).exec((err,user)=>{
//             if (err || !user) {
//                 return res.status(400).json({
//                     err: "User is not existed"
//                 })
//             }
//             return res.json(user)
//         })
//     }

exports.isMember = (req, res, next) => {
	let user = req.profile && req.profile._id == req.authenticate._id
	if (!user) {
		return res.status(403).json({
			err: 'Unauthorize',
		})
	}
	next()
}

exports.isAdmin = (req, res, next) => {
	if (req.profile.role !== 0) {
		return res.status(403).json({
			err: 'You are not an admin',
		})
	}
	next()
}

exports.profile = (req, res) => {
	req.profile.hashed_password = undefined
	req.profile.salt = undefined
	return res.json(req.profile)
}

exports.update = (req, res) => {
	userModel.findOneAndUpdate(
		{_id: req.profile._id},
		{$set: req.body},
		{new: true},
		(err, user) => {
			if (err) {
				return res.status(400).json({
					err: 'Email is already exist',
				})
			}

			const strongRegex = new RegExp(
				'^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})',
			)

			if (req.body.password) {
				if (!strongRegex.test(req.body.password)) {
					return res.status(400).json({
						err:
							'Password must contain at least 1 lowercase alphabetical character, at least 1 uppercase alphabetical character, at least 1 numeric character,  at least one special character must be eight characters or longer',
					})
				} else {
					user.password = req.body.password
				}
			}

			user.save((err, updatedUser) => {
				if (err) {
					console.log('USER UPDATE ERROR', err)
					return res.status(400).json({
						err: 'User update failed',
					})
				}
				updatedUser.hashed_password = undefined
				updatedUser.salt = undefined
				res.json(updatedUser)
			})
		},
	)
}

exports.orderHistory = (req, res, next) => {
	let history = []
	req.body.order.products.map(i => {
		history.push({
			_id: i._id,
			name: i.name,
			description: i.description,
			category: i.category,
			quantity: i.quantity,
			transaction_id: req.body.order.transaction_id,
			amount: req.body.order.amount,
			createdAt: req.body.order.createdAt,
			currency: req.body.order.currency,
		})
	})
	userModel.findOneAndUpdate(
		{_id: req.profile._id},
		{$push: {history: history}},
		{new: true},
		(err, data) => {
			if (err) {
				return res.status(400).json({err: 'Update purchase history failed'})
			}
			next()
		},
	)
}

exports.purchaseHistory = (req, res) => {
	Order.find({user: req.profile._id})
		.populate('user', '_id name')
		.sort()
		.exec((err, orders) => {
			if (err) {
				return res.status(400).json({err: error.errorHandler(err)})
			}
			res.json(orders)
		})
}
