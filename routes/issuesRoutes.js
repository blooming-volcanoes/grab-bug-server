const router = require('express').Router();
const {
    createIssues,
    getAnIssue,
    getAllIssues,
    updateAnIssue,
    deleteAnIssue,
    getArchive,
    getAllArchive,
} = require('../controllers/issueController');
// all routes for issues
router.get('/', getAllIssues);
router.route('/issue/:issueId').get(getAnIssue).put(updateAnIssue).delete(deleteAnIssue);
router.post('/createIssues', createIssues);
router.get('/getAllArchive', getAllArchive);
router.get('/getArchive/:archiveId', getArchive);

module.exports = router;
