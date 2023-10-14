const express = require('express')
const authenToken = require('../middlewares/authenToken')
const orderController = require('../controllers/order-Controller')
const router = express.Router();



router.post('/',authenToken,orderController.createOrder)


module.exports = router