const express = require('express')
const router = express.Router()

const productController = require('../controllers/product')
const userController = require('../controllers/user')
const method = require('../general/method')

router.post(
	'/create/:userID',
	method.jwtVerify,
	userController.isMember,
	userController.isAdmin,
	productController.add,
)
router.get('/:productID/', productController.productDetail)
router.delete(
	'/:productID/:userID',
	method.jwtVerify,
	userController.isMember,
	userController.isAdmin,
	productController.delete,
)
router.put(
	'/:productID/:userID',
	method.jwtVerify,
	userController.isMember,
	userController.isAdmin,
	productController.update,
)

//params
router.param('userID', userController.userByID)
// enable this line if you want to use productID middleware.
// I prefer using middleware because we use the params at different URL, but we just handle it one time.
router.param('productID', productController.productByID)

module.exports = router
