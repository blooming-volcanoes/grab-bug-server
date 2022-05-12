'use strict';

var mongoose = require('mongoose');

var SmsIssue = new mongoose.Schema(
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
    {
        timestamps: true,
    },
);
var model = mongoose.model('SmsIssue', SmsIssue);
module.exports = model;
