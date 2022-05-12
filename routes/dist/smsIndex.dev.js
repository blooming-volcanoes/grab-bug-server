'use strict';

/* eslint-disable max-len */

/*
 In this file you need to declare all the major endpoints example : in authentication we have many endpoints so one major would be "/auth"
*/
var router = require('express').Router();

var smsRoutes = require('./smsRoutes');

router.use(smsRoutes);
module.exports = router;
