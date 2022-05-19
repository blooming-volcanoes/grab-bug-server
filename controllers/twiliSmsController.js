const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

exports.sendSms = catchAsyncErrors(async (req, res) => {
    res.header('Content-Type', 'application/json');
    console.log(req.body);
    client.messages
        .create({
            from: process.env.TWILIO_PHONE_NUMBER,
            to: req.body.to,
            body: req.body.body,
        })
        .then(() => {
            res.send(JSON.stringify({ success: true }));
        })
        .catch((err) => {
            console.log(err);
            res.send(JSON.stringify({ success: false }));
        });
});

//  module.exports = mongoose.model('message', messageSchema);
