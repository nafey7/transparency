const express = require('express');
const controller = require('../controllers/sharedController');
const protectController = require ('../controllers/protectController');

const router = express.Router();


router
.route('/')
.post(protectController.Protect,controller.GptDescription, controller.GptThemes, controller.OrganizeData, controller.AutoSaveData);

router
.route('/carfilter')
.post(controller.CarFilters)

module.exports = router;