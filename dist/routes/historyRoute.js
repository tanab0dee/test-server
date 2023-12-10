"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const { getHistory } = require('../controllers/historyController');
const { requireAuth } = require('../middlewares/authMiddleware');
const router = (0, express_1.Router)();
router.get('/getHistory', requireAuth, getHistory);
module.exports = router;
