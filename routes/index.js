/* eslint-disable max-len */
/*
 In this file you need to declare all the major endpoints example : in authentication we have many endpoints so one major would be "/auth"
*/

const router = require('express').Router();
const userRouter = require('./userRoutes');
const issuesRoutes = require('./issuesRoutes');
const projecRoutes = require('./projectRoutes');

router.use('/auth', userRouter);
router.use('/issues', issuesRoutes);
router.use('/v1', projecRoutes);

module.exports = router;
