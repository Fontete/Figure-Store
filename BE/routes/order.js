const express = require('express')
const router = express.Router()

const method = require('../general/method')
const userController = require('../controllers/user')
const orderController = require('../controllers/order')
const productController = require('../controllers/product')

router.get(
	'/:userID',
	method.jwtVerify,
	userController.isMember,
	userController.isAdmin,
	orderController.list,
)

router.get(
	'/status/:userID',
	method.jwtVerify,
	userController.isMember,
	userController.isAdmin,
	orderController.listStatus,
)

router.put(
	'/:orderId/status/:userID',
	method.jwtVerify,
	userController.isMember,
	userController.isAdmin,
	orderController.updateStatus,
)

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
router.param('orderID', orderController.orderByID)

module.exports = router
