const express = require('express')
const router = express.Router()

const pushNotiController = require('../controllers/notification')

router.post('/subscription', pushNotiController.addSubscription)

router.post('/pushnoti', pushNotiController.pushNoti)

module.exports = router
