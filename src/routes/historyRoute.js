
const authenToken = require('../middlewares/authenToken')
const historyController = require('../controllers/history-controller')
const express = require('express');

const router = express.Router();

router.get('',authenToken,historyController.getHistory)

module.exports = router