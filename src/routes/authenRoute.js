const authenController = require('../controllers/authen-controller')
const uploadMiddleware = require('../middlewares/uploadFile')


// เกี่ยวกับ Authen ทั้งหมด

const express = require('express');

const router = express.Router();

router.post('/register',uploadMiddleware.single('userImage'),authenController.register);
router.post('/login',authenController.login);




module.exports = router;