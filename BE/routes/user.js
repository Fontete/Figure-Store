const express = require('express')
const router = express.Router();

const userController = require('../controllers/user')
const method = require('../general/method')

//Authentication
router.post("/register", method.Validator, userController.register)
router.post("/login", userController.logIn)
router.get("/logout", userController.logOut)

// User
router.get('/protected/:userID', method.jwtVerify, userController.profile)
router.param('userID', userController.userByID)

module.exports = router