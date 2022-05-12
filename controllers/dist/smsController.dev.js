'use strict';

var catchAsyncErrors = require('../middleware/catchAsyncErrors.js');

var ErrorHandler = require('../lib/errorHandler');

var Nexmo = require('nexmo');

var SmsIssue = require('../models/SmsIssue');

var socketio = require('socket.io');

var httpserver = require('../index').httpserver;

var io = socketio(httpserver, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        allowedHeaders: ['my-custom-header'],
        credentials: true,
    },
});
io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
}); //Init Nexmo

var nexmo = new Nexmo(
    {
        apiKey: ''.concat(process.env.API_KEY),
        apiSecret: ''.concat(process.env.API_SECRET),
    },
    {
        debug: true,
    },
);
exports.makeIssue = catchAsyncErrors(function _callee(req, res, next) {
    var _req$body, issueName, severity, number;

    return regeneratorRuntime.async(function _callee$(_context) {
        while (1) {
            switch ((_context.prev = _context.next)) {
                case 0:
                    (_req$body = req.body),
                        (issueName = _req$body.issueName),
                        (severity = _req$body.severity),
                        (number = _req$body.number);

                    if (severity === 'critical') {
                        console.log('critical');
                        io.emit('smsStatus', 'sms'); // nexmo.message.sendSms(
                        //   "Sender Number",
                        //   number,
                        //   issueName,
                        //   { type: "unicode" },
                        //   (err, responseData) => {
                        //     if (err) {
                        //     } else {
                        //       console.log(responseData);
                        //       //Get data from response
                        //       const sms = {
                        //         id: responseData.messages[0]["message-id"],
                        //         number: responseData.messages[0]["to"],
                        //       };
                        //     }
                        //   }
                        // );
                        // res.send(req.body);
                        // console.log(req.body);
                    } // console.log(req.body.issueName)
                // // Checking the if the issue is created or not
                // const existingIssue = await SmsIssue.findOne({ issueName:issueName });
                // if (existingIssue) {
                //     return next(new ErrorHandler('Issue already exist '));
                // }
                // try{
                //     const newIssue = await SmsIssue.create({
                //         issueName,
                //         severity,
                //         number,
                //         })
                //       }
                // catch (err){
                //     res.send(err)
                // }

                case 2:
                case 'end':
                    return _context.stop();
            }
        }
    });
});
