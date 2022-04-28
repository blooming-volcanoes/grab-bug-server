const { sendMessage, allMessage } = require('../controllers/messageController');

const { isAuthenticated } = require('../middleware/auth');

const router = require('express').Router();

router.route('/message').post(isAuthenticated, sendMessage);

router.route('/message/:chatId').get(isAuthenticated, allMessage);

module.exports = router;
