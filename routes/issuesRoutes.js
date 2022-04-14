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
/*
 all major routes routes for issues
*/

// get all issues endpoint

router.get('/all', getAllIssues);

// get, put, delete, issues endpoint

router.route('/issue/:issueId').get(getAnIssue).put(updateAnIssue).delete(deleteAnIssue);

// post a issue

router.post('/issue', createIssues);

// get all deleted issue

router.get('/all', getAllArchive);

// delete and issue and store in archives

router.get('/archives/:issueId', getArchive);

module.exports = router;
