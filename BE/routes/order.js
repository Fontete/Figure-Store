const express = require('express')
const router = express.Router()

const method = require('../general/method')
const userController = require('../controllers/user')
const orderController = require('../controllers/order')

router.post(
	'/create/:userID',
	method.jwtVerify,
	userController.isMember,
	orderController.create,
)

//params
router.param('userID', userController.userByID)

module.exports = router
