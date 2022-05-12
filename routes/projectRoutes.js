<<<<<<< HEAD
=======
const express = require('express');
const {
    projects,
    allProject,
    singleProject,
    editProjectDetails,
    deleteProject,
    archiveProject,
    singleArchive,
} = require('../controllers/projectController');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.route('/project').post(isAuthenticated, projects);
router.route('/project/all').get(allProject);
router
    .route('/project/:id')
    .get(singleProject)
    .put(isAuthenticated, editProjectDetails)
    .delete(deleteProject);

// router.route('/projects/:id').put();

router.route('/archiveProjects').get(archiveProject);
router.route('/archive/:id').get(singleArchive);

module.exports = router;

>>>>>>> 1865a41b54fb7a00fc7d227154802b8b29b9076c
// const express = require('express');
// const {
//     projects,
//     allProject,
//     singleProject,
//     editProjectDetails,
//     deleteProject,
//     archiveProject,
//     singleArchive,
// } = require('../controllers/projectController');
// const { isAuthenticated } = require('../middleware/auth');

// const router = express.Router();

<<<<<<< HEAD
// router.route('/project').post(isAuthenticated, projects);
// router.route('/project/all').get(allProject);
// router
//     .route('/project/:id')
//     .get(isAuthenticated, singleProject)
//     .put(isAuthenticated, editProjectDetails)
=======
// router.route('/project').post( projects);
// router.route('/project/all').get(allProject);
// router
//     .route('/project/:id')
//     .get(singleProject)
//     .put(editProjectDetails)
>>>>>>> 1865a41b54fb7a00fc7d227154802b8b29b9076c
//     .delete(deleteProject);

// // router.route('/projects/:id').put();

// router.route('/archiveProjects').get(archiveProject);
// router.route('/archive/:id').get(singleArchive);

// module.exports = router;
<<<<<<< HEAD
const express = require('express');
const {
    projects,
    allProject,
    singleProject,
    editProjectDetails,
    deleteProject,
    archiveProject,
    singleArchive,
} = require('../controllers/projectController');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.route('/project').post(projects);
router.route('/project/all').get(allProject);
router.route('/project/:id').get(singleProject).put(editProjectDetails).delete(deleteProject);

// router.route('/projects/:id').put();

router.route('/archiveProjects').get(archiveProject);
router.route('/archive/:id').get(singleArchive);

module.exports = router;
=======
>>>>>>> 1865a41b54fb7a00fc7d227154802b8b29b9076c
