/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const ErrorHandler = require('../lib/errorHandler');

const catchAsyncErrors = require('./catchAsyncErrors');

const Users = require('../models/User');

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    // console.log(req.hea);
    const authorization = req.headers.authorization.split(' ')[1];
    if (!authorization) {
        return next(new ErrorHandler('Please Login to access this resource', 401));
    }

    const decodeData = jwt.verify(authorization, process.env.JWT_SECRET);

    req.user = await Users.findById(decodeData.id);

    next();
});

// Checking wether that person is an admin or not
exports.authorizeRoles = (...roles) => {
    (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`),
            );
        }
        next();
    };
};
