
const express = require('express');
const authenToken = require('../middlewares/authenToken');
const adminMiddleware = require('../middlewares/adminMiddleware');
const userController = require('../controllers/user-Controller');
const uploadMiddleware = require('../middlewares/uploadFile')


const router = express.Router();

router.get('',authenToken,adminMiddleware,userController.getUsers); // user ทั้งหมด ในหน้า user manage
router.get('/:userId',authenToken,adminMiddleware,userController.getUserById)
router.patch('/updateUser',authenToken,adminMiddleware,uploadMiddleware.single('userImage'),userController.updateUser);
router.delete('/:deleteUser',authenToken,adminMiddleware,userController.deleteUser)

module.exports = router;