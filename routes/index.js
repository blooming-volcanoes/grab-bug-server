/* eslint-disable max-len */
/*
 In this file you need to declare all the major endpoints example : in authentication we have many endpoints so one major would be "/auth"
*/

const router = require('express').Router();
const userRouter = require('./userRoutes');
const projecRoutes = require('./projectRoutes');

router.use('/v1', userRouter);
router.use('/v1', projecRoutes);

module.exports = router;
