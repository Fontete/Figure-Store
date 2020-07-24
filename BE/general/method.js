const expressJwt = require('express-jwt')

//express-validator middleware is required
exports.Validator = (req, res, next) => {
	req.check('firstName', 'We need to know your first name').notEmpty()
	req.check('lastName', 'We need to know your last name').notEmpty()
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
		.matches(/^(?=.*\d)(?=.*[A-Za-z])[a-zA-Z0-9]{6,32}$/) // regular expression for password
		.withMessage(
			'Password must contain at least 6 characters and less than 32 characters. It must has at least one number, one character and not includes special character',
		)
	const errors = req.validationErrors()
	if (errors) {
		const firstError = errors.map(error => error.msg)[0]
		return res.status(400).json({
			error: firstError,
		})
	}
	next()
}

exports.jwtVerify = expressJwt({
	secret: process.env.JWT,
	userProperty: 'authenticate',
	algorithms: ['HS256'],
})
