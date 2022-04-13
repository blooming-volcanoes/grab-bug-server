const router = require('express').Router();
const {
    createIssues,
    getAnIssue,
    getAllIssues,
    updateAnIssue,
    deleteAnIssue,
    updateStatus,
    getArchive,
    getAllArchive,
} = require('../controllers/issueController');
// all routes for issues
router.get('/', getAllIssues);
router.route('/issue/:issueId').get(getAnIssue).put(updateAnIssue).delete(deleteAnIssue);
router.route('/issue/:issueId').put(updateStatus);
router.post('/createIssues', createIssues);
router.get('/getAllArchive', getAllArchive);
router.get('/getArchive/:archiveId', getArchive);

module.exports = router;
