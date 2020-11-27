const express = require('express')
const router = express.Router()

const productController = require('../controllers/product')
const userController = require('../controllers/user')
const method = require('../general/method')

router.get('/:productID', productController.productDetail)
router.post(
	'/create/:userID',
	method.jwtVerify,
	userController.isMember,
	userController.isAdmin,
	productController.add,
)
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
router.get('/', productController.productList)
router.get('/list/search', productController.searchList)
router.get('/related/:productID', productController.relatedList)
// default = /
// by sell = /?sortBy=sold&order=desc&limit=4
// by arrival = ?sortBy=createdAt&order=desc&limit=4
router.post('/filter', productController.filterList)
router.get('/image/:productID', productController.image)
router.get('/image2/:productID', productController.image2)
router.get('/image3/:productID', productController.image3)
router.get('/image4/:productID', productController.image4)
router.get('/image5/:productID', productController.image5)

//params
router.param('userID', userController.userByID)
// enable this line if you want to use productID middleware.
// I prefer using middleware because we use the params at different URL, but we just handle it one time.
router.param('productID', productController.productByID)

module.exports = router
