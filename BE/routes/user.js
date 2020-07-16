const express = require('express')
const router = express.Router()

const userController = require('../controllers/user')
const method = require('../general/method')

//Authentication
router.post('/register', method.Validator, userController.register)
router.post('/login', userController.logIn)
router.get('/logout', userController.logOut)

// User
router.get('/:userID', method.jwtVerify, userController.profile)

//params
//enable this line if you want to use userID middleware.
//I prefer using middleware because we use the params at different URL, but we just handle it one time.
router.param('userID', userController.userByID)

module.exports = router
