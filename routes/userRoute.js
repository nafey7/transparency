const express = require('express');
const controller = require('../controllers/userController');

const router = express.Router();

// router
// .route('/chatgpt')
// .post(controller.ChatGpt);

router
.route('/signup')
.post(controller.Signup);

router
.route('/login')
.post(controller.Login);

module.exports = router;