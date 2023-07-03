const express = require('express');
const controller = require('../controllers/sharedController');
const protectController = require ('../controllers/protectController');

const router = express.Router();


router
.route('/')
.post(protectController.Protect,controller.GptDescription, controller.GptThemes, controller.OrganizeData, controller.AutoSaveData);

router
.route('/viewcar/shared')
.get(controller.ViewSharedCarInfo)

router
.route('/carfilter')
.post(protectController.Protect,controller.CarFilters);

router
.route('/savedata')
.post(protectController.Protect,controller.SaveGptResponse);

router
.route('/carinfo')
.post(protectController.Protect,controller.GetCarInformation);

module.exports = router;