// Create Token and saving in Cookie

const sendToken = (user, res, statusCode) => {
    const token = user[0].getJWTToken();

    // option for cookie
    // const options = {
    //     expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    //     httpOnly: true,
    // };

    res.status(statusCode).json({
        success: true,
        user,
        token,
    });
};
module.exports = sendToken;
