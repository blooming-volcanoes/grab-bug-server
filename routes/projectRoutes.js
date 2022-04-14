const express = require('express');
const {
    projects,
    allProject,
    singleProject,
    editProjectDetails,
    deleteProject,
} = require('../controllers/projectController');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.route('/project').post(isAuthenticated, projects);
router.route('/project/all').get(allProject);
router
    .route('/project/:id')
    .get(isAuthenticated, singleProject)
    .put(isAuthenticated, editProjectDetails);

router.route('/deleteProject/:id').get(isAuthenticated, deleteProject);
// router.route('/projects/:id').put();

module.exports = router;
