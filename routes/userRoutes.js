const express = require('express');
const {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    matchOtp,
} = require('../controllers/userController');

const router = express.Router();

// All routes for the user Authentication

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

router.route('/password/forget').post(forgotPassword);

router.route('/password/reset/:token').put(resetPassword);

router.route('/otp').post(matchOtp);

module.exports = router;