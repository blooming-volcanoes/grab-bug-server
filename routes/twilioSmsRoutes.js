const { sendSms } = require('../controllers/twiliSmsController');

const router = require('express').Router();

router.route('/sendSms').post(sendSms);

module.exports = router;
