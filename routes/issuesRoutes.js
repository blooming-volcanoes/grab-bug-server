const router = require('express').Router();
const { createIssues } = require('../controllers/issueController');

// Post issue
router.post('/createIssues', createIssues);

// get issues
router.get('/issue', getIssue);

module.exports = router;
