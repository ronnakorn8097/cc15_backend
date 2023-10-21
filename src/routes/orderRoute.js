const express = require('express')
const authenToken = require('../middlewares/authenToken')
const orderController = require('../controllers/order-Controller')
const router = express.Router();



router.post('/',authenToken,orderController.createOrder)
router.get('/:orderId',authenToken,orderController.getOrderById)
router.patch('/:orderId',authenToken,orderController.orderStatus)



module.exports = router