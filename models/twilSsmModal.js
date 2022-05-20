const mongoose = require('mongoose');

const smsSchema = new mongoose.Schema({
    from: {
        type: String,
    },
    to: {
        type: String,
    },
    body: {
        type: String,
    },
});

module.exports = mongoose.model('sms', smsSchema);
