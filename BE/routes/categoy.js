const express = require('express')
const router = express.Router()

const categoryController = require('../controllers/category')
const userController = require('../controllers/user')
const method = require('../general/method')

router.post(
	'/create/:userID',
	method.jwtVerify,
	userController.isMember,
	userController.isAdmin,
	categoryController.add,
)
router.get('/', categoryController.listCategory)
router.get('/:categoryID', categoryController.categoryDetail)
router.put(
	'/:categoryID/:userID',
	method.jwtVerify,
	userController.isMember,
	userController.isAdmin,
	categoryController.update,
)
router.delete(
	'/:categoryID/:userID',
	method.jwtVerify,
	userController.isMember,
	userController.isAdmin,
	categoryController.delete,
)

//params
router.param('userID', userController.userByID)
router.param('categoryID', categoryController.categoryByID)

module.exports = router
