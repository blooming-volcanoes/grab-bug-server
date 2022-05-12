'use strict';

var _require = require('../controllers/smsController'),
    makeIssue = _require.makeIssue;

var router = require('express').Router();

router.route('/smsIssue').post(makeIssue); // router.route('/smsSend').post(smsSend)

module.exports = router;
