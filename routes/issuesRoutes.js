const router = require('express').Router();
const { createIssues } = require('../controllers/issueController');

router.post('/createIssues', createIssues);

module.exports = router;
