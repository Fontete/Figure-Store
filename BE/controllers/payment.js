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

//https://myaccount.google.com/lesssecureapps?pli=1&rapt=AEjHL4MzCzD2bOAyKGTH5briX0QpoQwQ0hABhEf1XPFcOUvUVKyRtuhR8aO6YwfH1et50gIblcuVZTnqF_1ywDvWmGNZFVkEaA
//https://accounts.google.com/b/0/DisplayUnlockCaptcha?fbclid=IwAR3FEJmYDufvpIrEEndSjBXAJ_FbCxmM95Ws-of3w8ZG1jEPTP7Jmllh8IA
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
						user: 'kazefigurestore@gmail.com',
						pass: 'phong12345',
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
