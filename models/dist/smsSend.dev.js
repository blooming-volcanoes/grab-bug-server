'use strict';

var mongoose = require('mongoose');

var SmsSend = new mongoose.Schema(
    {
        issueName: {
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
var model = mongoose.model('SmsSend', SmsSend);
module.exports = model;
