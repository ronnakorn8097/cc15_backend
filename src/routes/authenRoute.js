const authenController = require('../controllers/authen-controller')

// เกี่ยวกับ Authen ทั้งหมด

const express = require('express');

const router = express.Router();

router.post('/register',authenController.register);
router.post('/login',authenController.login);



module.exports = router;