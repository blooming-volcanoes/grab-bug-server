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

router.route('/me').get(isAuthenticated, userProfile);

<<<<<<< HEAD
router.route('/user/:id').put(editUserRole);
=======
router.route('/user').put(editUserRole);
>>>>>>> 1865a41b54fb7a00fc7d227154802b8b29b9076c

module.exports = router;
