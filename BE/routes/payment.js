const express = require('express')
const router = express.Router()

const method = require('../general/method')
const userController = require('../controllers/user')
const paymentController = require('../controllers/payment')

router.get('/token/:userID', method.jwtVerify, userController.isMember, paymentController.generateToken)

router.param('userID', userController.userByID)

module.exports = router
