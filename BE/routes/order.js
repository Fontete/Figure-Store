const express = require('express')
const router = express.Router()

const method = require('../general/method')
const userController = require('../controllers/user')
const orderController = require('../controllers/order')
const productController = require('../controllers/product')

router.post(
	'/:userID',
	method.jwtVerify,
	userController.isMember,
	userController.orderHistory,
	productController.updateQuantity,
	orderController.create,
)

//params
router.param('userID', userController.userByID)

module.exports = router
