/* eslint-disable max-len */
/*
 In this file you need to declare all the major endpoints example : in authentication we have many endpoints so one major would be "/auth"
*/

const router = require('express').Router();
const userRouter = require('./userRoutes');
const issuesRoutes = require('./issuesRoutes');
const projecRoutes = require('./projectRoutes');

router.use(userRouter);
router.use(issuesRoutes);
router.use(projecRoutes);

module.exports = router;
