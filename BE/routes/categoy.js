const express = require('express')
const router = express.Router();

const categoryController = require('../controllers/category')
const userController = require('../controllers/user')
const method = require('../general/method')

router.post("/create/:userID", method.jwtVerify, userController.isMember, userController.isAdmin, categoryController.addProduct)
router.param('userID', userController.userByID)

module.exports = router