const braintree = require('braintree')
const nodemailer = require('nodemailer')
require('dotenv').config

const gateway = braintree.connect({
	environment: braintree.Environment.Sandbox,
	merchantId: process.env.BRAINTREE_MERCHANT_ID,
	publicKey: process.env.BRAINTREE_PUBLIC_KEY,
	privateKey: process.env.BRAINTREE_PRIVATE_KEY,
})

exports.generateToken = (req, res) => {
	gateway.clientToken.generate({}, (err, response) => {
		if (err) {
			res.status(500).send(err)
		} else {
			res.send(response)
		}
	})
}

exports.purchaseProcess = (req, res) => {
	gateway.transaction.sale(
		{
			amount: req.body.amount,
			paymentMethodNonce: req.body.paymentMethodNonce,
			options: {
				submitForSettlement: true,
			},
		},
		(err, result) => {
			if (err) {
				res.status(500).json(err)
			} else {
				const transporter = nodemailer.createTransport({
					service: 'gmail',
					auth: {
						user: 'pipi.esd@gmail.com',
						pass: 'pp@fpt.com.vn',
					},
				})
				const mailOptions = {
					from: '"Kaze Figures Store"' + '<' + 'PhongTT' + ' > ',
					to: req.profile.email,
					subject: 'Confirmation',
					text:
						'Thank you for your payment. You order is in handling process now!',
				}
				transporter.sendMail(mailOptions, function (error, info) {
					if (error) {
						console.log(error)
						res.status(400).send('Error.')
					} else {
						console.log('Email sent: ' + info.response)
						res.json(result)
					}
				})
			}
		},
	)
}
