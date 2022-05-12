const mongoose = require('mongoose');

const SmsIssue = new mongoose.Schema(
    {
        issueName: {
            type: String,
            required: true,
        },

        severity: {
            type: String,
            required: true,
        },
        number: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);
const model = mongoose.model('SmsIssue', SmsIssue);

module.exports = model;
