
const express = require('express');
const authenToken = require('../middlewares/authenToken');
const adminMiddleware = require('../middlewares/adminMiddleware');
const userController = require('../controllers/user-Controller');
const uploadMiddleware = require('../middlewares/uploadFile')


const router = express.Router();

router.get('',authenToken,adminMiddleware,userController.getUsers);
router.patch('/updateUser',authenToken,adminMiddleware,uploadMiddleware.single('userImage'),userController.updateUser);


module.exports = router;