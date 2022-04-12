const express = require('express');
const {
    projects,
    allProject,
    singleProject,
    editProjectDetails,
} = require('../controllers/projectController');

const router = express.Router();

router.route('/project').post(projects);
router.route('/project/all').get(allProject);
router.route('/project/:id').get(singleProject);
router.route('/projects/:id').put(editProjectDetails);

module.exports = router;
