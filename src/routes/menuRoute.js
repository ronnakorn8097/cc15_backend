
// route ตัวนี้ทำหน้าที่เกี่ยวกับ menu route
const express = require('express')
const authenToken = require('../middlewares/authenToken');
const menuController = require('../controllers/menu-Controller');
const adminMiddleware = require('../middlewares/adminMiddleware');
const uploadMiddleware = require('../middlewares/uploadFile')

const router = express.Router();

router.get('',authenToken,menuController.getMenus);
router.post('/createMenu',authenToken,adminMiddleware,uploadMiddleware.single('menuImage'),menuController.menuCreate);
router.patch('/updateMenu',authenToken,adminMiddleware,uploadMiddleware.single('menuImage'),menuController.updateMenus);
router.delete('/:deleteMenu',authenToken,adminMiddleware,menuController.deleteMenu);
router.get('/:menuId',authenToken,adminMiddleware,menuController.getMenuById)

module.exports = router


