const pushNotiModel = require('../models/notification')
const webPush = require('web-push')
// get vapid keys
// const vapidKeys = webPush.generateVAPIDKeys()
// console.log("Public Key: " + vapidKeys.publicKey);
// console.log("Private Key: " + vapidKeys.privateKey);
const publicVapidKey = process.env.PUBLIC_VAPID_KEY
const privateVapidKey = process.env.PRIVATE_VAPID_KEY

webPush.setVapidDetails(
	'mailto:pipi.esd@gmail.com',
	publicVapidKey,
	privateVapidKey,
)

exports.addSubscription = (req, res) => {
	const pushNoti = new pushNotiModel(req.body)
	pushNoti.save((err, data) => {
		if (err || !data) {
			console.log(data)
			return res.status(403).json({
				err: 'There is no subscription',
			})
		} else {
			res.json({msg: 'Add new subscription successfully'})
		}
	})
}

exports.pushNoti = (req, res) => {
	const payload = JSON.stringify({
		title: 'New products on Kaze Figure',
		icon: 'https://w0.pngwave.com/png/233/192/seven-deadly-sins-symbol-computer-icons-symbol-png-clip-art.png',
	})
	pushNotiModel
		.find()
		.populate('user')
		.sort()
		.exec((err, subscriptions) => {
			if (err) {
				return res.status(400).json({
					err: error.errorHandler(err),
				})
			}
			for (let i = 0; i < subscriptions.length; i++) {
				webPush.sendNotification(subscriptions[i].subscription, payload)
			}
			return res.status(201).send('Success.')
		})
}
