/* eslint-disable consistent-return */
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const ErrorHandler = require('../lib/errorHandler');
const sendToken = require('../lib/jwt');
const sendEmail = require('../lib/sendEmail');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Users = require('../models/User');
const generate = require('../middleware/generate');
const User = require('../models/User');

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;

    // Checking the if the user already approve or not yet regitered

    const existingUser = await Users.findOne({ email, status: 'approve' });
    const user = await Users.findOne({ email });
    if (existingUser) {
        return next(new ErrorHandler('User already exist '));
    }

    // Creating and hashing the otp
    const x = generate.generateOtp();
    const otp = await bcrypt.hash(x, 10);

    // Use try catch cause of async fn, to detect unnecessay bug easily
    try {
        if (!user) {
            console.log('heoll');
            const newUser = await Users.create({
                email,
                password,
                name,
                otp,
                OTPExpire: Date.now() + 1 * 60 * 1000,
            });

            // Sending Email using nodemailer
            await sendEmail({
                email: newUser.email,
                subject: 'Issue Tracker Verify OTP',
                message: `Your new user OTP for Email Verification is ${x}`,
            });
            res.status(200).json({
                success: true,
                message: `Email ${newUser.email} sent to  successfully for new user Otp`,
            });
        } else {
            /*
            if user want get another otp,
            Existing Otp will be replaced with refres otp
            */
            const refreshOtp = await Users.findOne({
                email,
            });

            refreshOtp.otp = otp;
            refreshOtp.OTPExpire = Date.now() + 3 * 60 * 1000;
            await refreshOtp.save();

            console.log(refreshOtp, 'refrest');
            await sendEmail({
                email: req.body.email,
                subject: 'Issue Tracker  Verify OTP',
                message: `Your refresh OTP for Email Verification is '${x}'`,
            });

            res.status(200).json({
                success: true,
                message: `Email ${email} sent to  successfully refresh otp`,
            });
        }
    } catch (err) {
        // if there is any error happened otp and expire date will be undefined
        console.log(err.message);
        user.OTPExpire = undefined;
        user[0].otp = undefined;
        await user.save({ validateBeforeSave: false });
    }
});

// Checking OTP end point

exports.matchOtp = catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body;

    // finding otp with Date value
    const user = await Users.findOne({ email, OTPExpire: { $gt: Date.now() } });

    console.log('hlloo ', user.otp);

    // If OTP expire, this error will be shown
    if (!user) {
        return next(new ErrorHandler('Your otp expired'));
    }

    // Comparing both OTP to check whether true
    const isMatched = await bcrypt.compare(req.body.code, user.otp);
    console.log(isMatched);

    console.log(user.otp, 'he', isMatched, 'lam', req.body.code);

    if (!isMatched) {
        return next(new ErrorHandler('You otp didn not matched'));
    }

    console.log(isMatched);

    // if otp matched status will updated and otp will be undefined
    if (isMatched) {
        console.log(user);
        user.otp = undefined;
        user.status = 'approve';
        user.OTPExpire = undefined;
        console.log(user);
        user.save();

        const getUser = user;

        // By calling this fn i am sending user data with jwt token
        sendToken(getUser, res, 200);
    }
});

//  Login User

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // checking if user has given password and email both

    if (!email || !password) {
        return next(new ErrorHandler('Please Enter Email & Password', 400));
    }

    const user = await Users.findOne({ email, status: 'approve' }).select('+password');

    // await Users.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorHandler('Invalid email or password', 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid email or password', 401));
    }

    sendToken(user, res, 200);
});

/*
Forgot password recovery
*/

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await Users.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();

    console.log(resetToken.toString());

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://localhost:5000/api/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Issue Tracker Password Recovery',
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
});

/*
Reset Password token checking endpoint
*/
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    // creating token hash
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await Users.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(new ErrorHandler('Reset Password Token is invalid or has been expired', 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not password', 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, res, 200);
});

// allUsers search

exports.allUsers = catchAsyncErrors(async (req, res, next) => {
    const keyword = req.query.search
        ? {
              $or: [
                  { name: { $regex: req.query.search, $options: 'i' } },
                  { email: { $regex: req.query.search, $options: 'i' } },
              ],
          }
        : {};

    // console.log(req.user);

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

    res.status(200).json({
        success: true,
        users,
    });
});

// get user Profile

exports.userProfile = catchAsyncErrors(async (req, res, next) => {
    const id = req.user._id;
    const user = await User.findById(id);

    res.status(200).json({
        success: true,
        user,
    });
});
