const express = require('express');
const { registerUser, loginUser, logout, forgotPassword } = require('../controllers/userControllers');
const userModel = require('../models/userModel');
const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logout);
router.route('/password/forgot').post(forgotPassword);

module.exports = router;