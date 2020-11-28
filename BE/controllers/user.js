const userModel = require('../models/user')
const {Order} = require('../models/order')
const nodemailer = require('nodemailer')
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
			// res.cookies('token', token, {
			// 	httpOnly: false,
			// 	expire: 60 * 60 * 24,
			// })

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
	// res.clearCookie('token')
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

exports.sendConfirmativeCode = (req, res) => {
	if (req.body.email) {
		userModel.findOne({email: req.body.email}, (err, email) => {
			if (err || !email) {
				return res.status(400).json({err: 'Email is not existed'})
			}
			const transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: 'kazefigurestore@gmail.com',
					pass: 'phong12345',
				},
			})
			let confirmativeCode = ''
			for (let i = 0; i < 6; i++) {
				confirmativeCode += Math.floor(Math.random() * 10).toString()
			}
			const mailOptions = {
				from: '"Kaze Figures Store"' + '<' + 'PhongTT' + ' > ',
				to: req.body.email,
				subject: 'Reset password',
				text:
					'OTP code: ' +
					confirmativeCode +
					'\n' +
					'The code is expired after 3 minutes.',
			}
			transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					res.status(400).json({err: 'Error. Please try again!'})
				} else {
					console.log('Email sent: ' + info.response)
					jwt.sign(
						{confirmativeCode},
						process.env.JWT,
						{expiresIn: 60 * 3},
						(err, otp) => {
							userModel.findOneAndUpdate(
								{email: req.body.email},
								{$set: {otp: otp}},
								{new: true},
								(errorUpdate, update) => {
									if (errorUpdate) {
										return res.status(400).json({err: 'OTP error'})
									}
									res
										.status(200)
										// .cookie('otp', otp, {
										// 	maxAge: 3 * 60 * 1000,
										// 	httpOnly: false,
										// })
										.json({
											message: 'OTP code is sent. Please check your email!',
										})
								},
							)
						},
					)
				}
			})
		})
	}
}

exports.resetPassword = (req, res) => {
	userModel.findOne({email: req.body.email}, (err, user) => {
		if (err || !user) {
			return res.status(400).json({err: 'User is not existed'})
		}
		jwt.verify(user.otp, process.env.JWT, function (errVerify, decoded) {
			if (errVerify) {
				return res.status(500).json({err: 'OTP code is expired!'})
			} else {
				const strongRegex = new RegExp(
					'^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})',
				)

				if (!req.body.password) {
					return res.status(400).json({err: 'Password is required'})
				}

				if (req.body.password) {
					if (!strongRegex.test(req.body.password)) {
						return res.status(400).json({
							err:
								'Password must contain at least 1 lowercase alphabetical character, at least 1 uppercase alphabetical character, at least 1 numeric character,  at least one special character, must be eight characters or longer',
						})
					} else {
						user.password = req.body.password
					}
				}

				if (decoded.confirmativeCode !== req.body.otp) {
					return res.status(400).json({err: 'Invalid OTP'})
				}

				user.save((errUpdate, updatedUser) => {
					if (errUpdate) {
						console.log('USER UPDATE ERROR', errUpdate)
						return res.status(400).json({
							err: 'Password update failed',
						})
					}
					updatedUser.hashed_password = undefined
					updatedUser.salt = undefined
					res.json({message: 'Change password successfully'})
				})
			}
		})
	})
}
