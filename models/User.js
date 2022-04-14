/* eslint-disable func-names */
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter your name'],
    },
    email: {
        type: String,
        required: [true, 'Please Enter your Email'],
    },
    password: {
        type: String,
        required: [true, 'Please Enter your Password'],
        select: false,
    },
    otp: {
        type: String,
    },
    OTPExpire: {
        type: Date,
    },
    role: {
        type: String,
        default: 'user',
    },
    status: {
        type: String,
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

// hashing the password before save to the DB

// eslint-disable-next-line func-names
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});
// Creating Sign Jwt Token

userSchema.methods.getJWTToken = function () {
    return jwt.sign(
        // eslint-disable-next-line no-underscore-dangle
        { id: this._id },

        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE,
            // eslint-disable-next-line comma-dangle
        }
    );
};

// Compare password

// eslint-disable-next-line func-names
userSchema.methods.comparePassword = async function (password) {
    const compPass = await bcrypt.compare(password, this.password);

    return compPass;
};
// Generating password reset Token

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
    // Generating Token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
};
// userSchema.methods.getOTP = function () {
//     // Generating Token
//     const otp = crypto.randomBytes(20).toString('hex');

//     // Hashing and adding resetPasswordToken to userSchema
//     this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

//     this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

//     return resetToken;
// };

module.exports = mongoose.model('Users', userSchema);
