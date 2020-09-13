const expressJwt = require('express-jwt')

//express-validator middleware is required
exports.Validator = (req, res, next) => {
	req.check('firstName', 'First name is required').notEmpty()
	req.check('lastName', 'Last name is required').notEmpty()
	req
		.check('email', 'Email must be between 3 to 32 characters')
		.matches(/.+\@.+\..+/) // regular expression for email type as abc@xyz.com
		.withMessage('Wrong email type')
		.isLength({
			max: 32,
		})
	req.check('password', 'Password is required').notEmpty()
	req
		.check('password')
		.withMessage('Password must contain at least 6 characters')
		.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/) // regular expression for password
		.withMessage(
			'Password must contain at least 1 lowercase alphabetical character, at least 1 uppercase alphabetical character, at least 1 numeric character, at least one special character must be eight characters or longer',
		)
	const errors = req.validationErrors()
	if (errors) {
		const firstError = errors.map(error => error.msg)[0]
		return res.status(400).json({
			err: firstError,
		})
	}
	next()
}

exports.updateValidator = (req, res, next) => {
	req.check('firstName', 'First name is required').notEmpty()
	req.check('lastName', 'Last name is required').notEmpty()
	req
		.check('email', 'Email must be between 3 to 32 characters')
		.matches(/.+\@.+\..+/) // regular expression for email type as abc@xyz.com
		.withMessage('Wrong email type')
		.isLength({
			max: 32,
		})
	const errors = req.validationErrors()
	if (errors) {
		const firstError = errors.map(error => error.msg)[0]
		return res.status(400).json({
			err: firstError,
		})
	}
	next()
}

exports.jwtVerify = expressJwt({
	secret: process.env.JWT,
	userProperty: 'authenticate',
	algorithms: ['HS256'],
})
