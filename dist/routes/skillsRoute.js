"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const { searchSkills, dropdownSkillsAPI, createDatacollection, getDatacollection, updateDatacollection, deleteDatacollection } = require('../controllers/skillsController');
const { getSkillName } = require('../controllers/portfolioController');
const { requireAuth } = require('../middlewares/authMiddleware');
// home page
router.get('/search', searchSkills);
router.get('/category', dropdownSkillsAPI);
// detailstandard page
router.post('/createDatacollection', requireAuth, createDatacollection);
router.get('/getDatacollection', requireAuth, getDatacollection);
router.put('/updateDatacollection', requireAuth, updateDatacollection);
router.delete('/deleteDatacollection', requireAuth, deleteDatacollection);
//portfolioa
router.get('/getSkillName', requireAuth, getSkillName);
module.exports = router;
