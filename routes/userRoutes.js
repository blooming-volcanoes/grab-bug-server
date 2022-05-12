const express = require('express');
const {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    matchOtp,
    allUsers,
    userProfile,
    getAllUsers,
    editUserRole,
} = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

// All routes for the user Authentication

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

router.route('/password/forget').post(forgotPassword);

router.route('/password/reset/:token').put(resetPassword);

router.route('/otp').post(matchOtp);

router.route('/users').get(isAuthenticated, allUsers);

router.route('/all-users').get(getAllUsers);

router.route('/me').get(isAuthenticated, userProfile);

router.route('/user').put(editUserRole);

module.exports = router;
