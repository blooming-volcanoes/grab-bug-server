const {  createMessage, getConversation, getMessage } = require('../controllers/messageController');

const { isAuthenticated } = require('../middleware/auth');

const router = require('express').Router();

router.route('/message').post(isAuthenticated, createMessage);

router.route('/conversations').get(isAuthenticated, getConversation);

router.route('/message/:id').get(isAuthenticated, getMessage);

module.exports = router;
