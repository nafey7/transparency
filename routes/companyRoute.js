const express = require('express');
const controller = require('../controllers/companyController');

const router = express.Router();

// router
// .route('/chatgpt')
// .post(controller.ChatGpt);

router
.route('/signup')
.post(controller.Signup);


module.exports = router;