/* eslint-disable prettier/prettier */
// eslint-disable-next-line import/no-unresolved
const otpGenerator = require('otp-generator');

exports.generateOtp = () =>
    otpGenerator.generate(6, {
        digits: true,
        alphabets: false,
        upperCase: false,
        specialChars: false,
    });
