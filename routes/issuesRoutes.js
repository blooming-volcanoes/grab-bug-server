const router = require('express').Router();
const { createIssues, getAnIssue } = require('../controllers/issueController');

router.post('/createIssues', createIssues);
router.get('/issue/:issueId', getAnIssue);

module.exports = router;
