const express = require('express')
const router = express.Router();

const userController = require('../controllers/user')
const method = require('../general/method')

router.post("/register",method.Validator , userController.register)
router.post("/login", userController.logIn)
router.get("/logout", userController.logOut)


module.exports = router