const express = require('express');
const controller = require('../controllers/sharedController');

const router = express.Router();


router
.route('/')
.post(controller.GptDescription, controller.GptThemes);

router
.route('/carfilter')
.post(controller.CarFilters)

module.exports = router;