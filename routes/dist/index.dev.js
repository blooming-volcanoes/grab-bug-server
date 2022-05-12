'use strict';

/* eslint-disable max-len */

/*
 In this file you need to declare all the major endpoints example : in authentication we have many endpoints so one major would be "/auth"
*/
var router = require('express').Router();

var userRouter = require('./userRoutes');

var issuesRoutes = require('./issuesRoutes');

var projecRoutes = require('./projectRoutes');

var smsRoutes = require('./smsRoutes');

router.use(userRouter);
router.use(issuesRoutes);
router.use(projecRoutes);
router.use(smsRoutes);
module.exports = router;
