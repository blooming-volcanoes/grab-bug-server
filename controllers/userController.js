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
const InviteUser = require('../models/inviteUser');
const { options } = require('../routes/userRoutes');
const { Projects } = require('../models/Project');

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { token, projectId, role } = req.query;

    console.log(token, projectId, 'cehc');

    const checkInvitation = await InviteUser.findOne({
        token,
        expireToken: { $gt: Date.now() },
    });

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
            const newUser = await Users.create({
                email,
                password,
                name,
                otp,
                OTPExpire: Date.now() + 1 * 60 * 1000,
            });

            // Sending Email using nodemailer
            // await sendEmail({
            //     email: newUser.email,
            //     subject: 'Issue Tracker Verify OTP',
            //     message: `Your new user OTP for Email Verification is ${x}`,
            // });

            // Push project Id into User
            console.log(checkInvitation);
            const id = newUser._id;
            console.log(id, 'userId');
            if (checkInvitation) {
                let updateUser = await User.updateOne(
                    { email: newUser.email },

                    {
                        $push: {
                            projects: { projectId: newUser._id, role: role },
                        },
                    },
                );

                const updateProject = await Projects.updateOne(
                    {
                        _id: projectId,
                    },
                    {
                        $push: {
                            assignedPeople: { assignedUser: updateUser._id, role: role },
                        },
                    },
                );
                // console.log(updateProject, "updae");
            }

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
        console.log(err);
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

    // If OTP expire, this error will be shown
    if (!user) {
        return next(new ErrorHandler('Your otp expired'));
    }

    // Comparing both OTP to check whether true
    const isMatched = await bcrypt.compare(req.body.code, user.otp);

    if (!isMatched) {
        return next(new ErrorHandler('You otp didn not matched'));
    }

    // if otp matched status will updated and otp will be undefined
    if (isMatched) {
        user.otp = undefined;
        user.status = 'approve';
        user.OTPExpire = undefined;

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

    console.log(user);
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
    console.log(req.user);
    const keyword = req.query.search
        ? {
              $or: [
                  { name: { $regex: req.query.search, $options: 'i' } },
                  { email: { $regex: req.query.search, $options: 'i' } },
              ],
          }
        : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

    res.status(200).json({
        success: true,
        users,
    });
});

exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find({});
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

// edit user role

exports.editUserRole = catchAsyncErrors(async (req, res, next) => {
    const { user, role, projectId } = req.body; // user is actually user's mongodb _id
    console.log(user, role, projectId);

    const u = await Projects.updateOne(
        {
            _id: projectId,
        },
        {
            $push: {
                assignedPeople: { assignedUser: user, role: role },
            },
        },
    );

    res.status(200).json({
        success: true,
        user,
        user: u,
    });
});

exports.inviteUser = catchAsyncErrors(async (req, res, next) => {
    const token = crypto.randomBytes(5).toString('hex');
    const { email, projectId, role } = req.body;
    const boardId = '628bbc406c3557f15fa7da5c';
    const expireToken = Date.now() + 72 * 60 * 60 * 1000;

    const checkEmail = await InviteUser.findOne({ email });

    if (checkEmail) {
        return next(new ErrorHandler('Invitation already sent '));
    }

    const all = { token, expireToken, boardId };
    const invitation = await InviteUser.create(all);

    const invitationUrl = `${req.protocol}://${
        req.headers.host
    }/register?token=${token}&projectId=${boardId}&role=${'moderator'}`;

    const options = {
        email: email,
        subject: 'You have got the invitation link to register in Issue Tracker',
        message: `Here is Your invitation link ${invitationUrl} `,
    };

    try {
        await sendEmail(options);

        res.status(200).json({
            success: true,
            message: `Invitation Email sent to ${email} successfully`,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: ` ${err.message} `,
        });

        console.log(err);
    }
});

exports.checkInvitaion = catchAsyncErrors(async (req, res, next) => {
    console.log(user);
    if (user) {
    } else {
        res.status(200).json({
            success: true,
            message: `Sorry your token is invalid or expired`,
        });
    }
});
