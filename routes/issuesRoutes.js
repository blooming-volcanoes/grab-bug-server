const router = require('express').Router();
const {
    createIssues,
    getAnIssue,
    getAllIssues,
    updateAnIssue,
    deleteAnIssue,
    getArchive,
    getAllArchive,
    addCommentToIssue,
} = require('../controllers/issueController');
const upload = require('../lib/multer');
/*
 all major routes routes for issues
*/

// get all issues endpoint

router.get('/issue/all', getAllIssues);

// get, put, delete, issues endpoint

router.route('/issue/:issueId').get(getAnIssue).put(updateAnIssue).delete(deleteAnIssue);

// post a issue

router.post('/issue', createIssues);

// add comment to an issue

router.put('/comment/:issueId', addCommentToIssue);

// get all deleted issue

router.get('/all', getAllArchive);

// delete and issue and store in archives

router.get('/archives/:issueId', getArchive);

module.exports = router;
