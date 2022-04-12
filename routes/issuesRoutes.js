const router = require('express').Router();
const {
    createIssues,
    getAnIssue,
    getAllIssues,
    updateAnIssue,
} = require('../controllers/issueController');
// all routes for issues
router.get('/', getAllIssues);
router.route('/issue/:issueId').get(getAnIssue).put(updateAnIssue);
router.post('/createIssues', createIssues);

module.exports = router;
