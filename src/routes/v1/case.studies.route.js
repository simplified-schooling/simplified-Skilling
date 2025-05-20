const express = require('express');
const multer = require('multer');
const caseStudyController = require('../../controllers/case.studies.controller');

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Bulk upload route
router.post('/bulk-upload', upload.single('file'), caseStudyController.bulkUploadCaseStudy);
router.route('/checkexist').post(caseStudyController.checkQuestionByName);
router
  .route('/')
  .post(caseStudyController.createCaseStudy)
  .get(caseStudyController.getAllCaseStudy);

router
  .route('/:caseStudyId')
  .get(caseStudyController.getCaseStudyById)
  .patch(caseStudyController.updateCaseStudy)
  .delete(caseStudyController.deleteCaseStudy);

router.route('/get-by/filter').post(caseStudyController.getCaseStudyByFilterId);
// router
//   .route('/get-by/:chapterId')
//   .get(caseStudyController.answerTypeWiseByChapterId);
// router.post('/homework-summary', caseStudyController.getHomeworkSummary);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: homework
 *   description: homework management and retrieval
 */

/**
 * @swagger
 * /homework:
 *   post:
 *     summary: Create a homework
 *     tags: [homework]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Question
 *               - answer
 *               - answerType
 *               - boardId
 *               - mediumId
 *               - classId
 *               - bookId
 *               - subjectId
 *               - chapterId
 *             example:
 *               Question: Run Node.js scripts from the command line
 *               answer: node app.js
 *               answerType: Very Short Answer
 *               mediumId: 64d327a41128844220f0cce4
 *               classId: 64d327811128844220f0cce0
 *               boardId: 64d327811128844220f0cce0
 *               bookId: 64d9d7143ac675796cdcd433
 *               subjectId: 64d9d4666205c371563fcadb
 *               chapterId: 64d327811128844220f0cce0
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all homework
 *     tags: [homework]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         queName: fake quetion
 *         schema:
 *           type: string
 *         description: homework name
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of users
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /homework/get-by/{chapterId}:
 *   get:
 *     summary: Get a homework
 *     tags: [homework]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chapterId
 *         required: true
 *         schema:
 *           type: string
 *         description: homework
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /homework/{id}:
 *   get:
 *     summary: Get a homework
 *     tags: [homework]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: homework
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a homework
 *     tags: [homework]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: HomeworkId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               - Question
 *               - veryShortAnswer
 *               - shortAnswer
 *               - longAnswer
 *               - boardId
 *               - mediumId
 *               - classId
 *               - bookId
 *               - subjectId
 *               - chapterId
 *             example:
 *               Question: Run Node.js scripts from the command line
 *               answer: node app.js
 *               answerType: hasvg
 *               boardId: 64d9ceaef49e9f5dc06502c6
 *               mediumId: 64d327a41128844220f0cce4
 *               classId: 64d327811128844220f0cce0
 *               bookId: 64d9d7143ac675796cdcd433
 *               subjectId: 64d9d4666205c371563fcadb
 *               chapterId: 64d327811128844220f0cce0
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a homework
 *     tags: [homework]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: HomeworkId
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /homework/get-by/filter:
 *   get:
 *     summary: Get homework based on filters
 *     tags: [homework]
 *     parameters:
 *       - in: query
 *         name: boardId
 *         schema:
 *           type: string
 *         description: ID of the board
 *       - in: query
 *         name: mediumId
 *         schema:
 *           type: string
 *         description: ID of the medium
 *       - in: query
 *         name: classId
 *         schema:
 *           type: string
 *         description: ID of the class
 *       - in: query
 *         name: bookId
 *         schema:
 *           type: string
 *         description: ID of the book
 *       - in: query
 *         name: subjectId
 *         schema:
 *           type: string
 *         description: ID of the subject
 *       - in: query
 *         name: chapterId
 *         schema:
 *           type: string
 *         description: ID of the chapter
 *     responses:
 *       "200":
 *         $ref: '#/components/responses/Unauthorized'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
