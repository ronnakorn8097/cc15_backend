
// route ตัวนี้ทำหน้าที่เกี่ยวกับ menu route
const express = require('express')
const authenToken = require('../middlewares/authenToken');
const menuController = require('../controllers/menu-Controller');
const adminMiddleware = require('../middlewares/adminMiddleware');

const router = express.Router();

router.get('',authenToken,menuController.getMenus);
router.post('/createMenu',authenToken,adminMiddleware,menuController.menuCreate);
router.patch('/updateMenu',authenToken,adminMiddleware,menuController.updateMenus);
router.delete('/:deleteMenu',authenToken,adminMiddleware,menuController.deleteMenu);

module.exports = router


