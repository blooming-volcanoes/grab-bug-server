const router = require('express').Router();
const {
    createIssues,
    getAnIssue,
    getAllIssues,
    updateAnIssue,
    updateStatus,
} = require('../controllers/issueController');
// all routes for issues
router.get('/', getAllIssues);
router.route('/issue/:issueId').get(getAnIssue).put(updateAnIssue).put(updateStatus);
router.post('/createIssues', createIssues);

module.exports = router;
