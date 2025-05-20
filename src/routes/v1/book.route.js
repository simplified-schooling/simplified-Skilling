const express = require('express');
const validate = require('../../middlewares/validate');
const bookController = require('../../controllers/book.controller');
const bookValidation = require('../../validations/book.validation');
// const { createS3Middleware } = require('../../utils/s3middleware');
const { upload } = require('../../utils/cdn');

const router = express.Router();
router
  .route('/upload')
  .post(
    upload.fields([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'poster', maxCount: 1 },
    ]),
    bookController.createBook
  )
  .get(validate(bookValidation.getBooks), bookController.queryBook);

router
  .route('/:bookId')
  .get(validate(bookValidation.getBook), bookController.getBookById)
  .patch(
    upload.fields([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'poster', maxCount: 1 },
    ]),
    bookController.updateBook
  )
  .delete(validate(bookValidation.deleteBook), bookController.deleteBook);

router
  .route('/filter/:boardId/:mediumId/:classId/:subjectId')
  .get(validate(bookValidation.getBookByFilter), bookController.getBookByFilter);

router.route('/subject/:subjectId').get(validate(bookValidation.getBookBySubjectId), bookController.getBookBySubjectId);
router.route('/book/chapter/:subjectId').get(bookController.getBookChapters);
router.route('/getbooks/filter').post(bookController.getBooksByFilter);
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Book
 *   description: Book managment
 */

/**
 * @swagger
 * /books/upload:
 *   post:
 *     summary: Upload a book
 *     tags:
 *       - Book
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               boardId:
 *                 type: string
 *               mediumId:
 *                 type: string
 *               classId:
 *                 type: string
 *               subjectId:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *               poster:
 *                 type: string
 *             required:
 *               - name
 *               - boardId
 *               - mediumId
 *               - classId
 *               - subjectId
 *               - thumbnail
 *               - poster
 *     responses:
 *       '201':
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       '400':
 *         description: Bad request. Check your request parameters.
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *

 *   get:
 *     summary: Get all book
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: subject
 *         schema:
 *           type: string
 *         description: Subject name *
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
 *         description: Maximum number of subject
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
 *                     $ref: '#/components/schemas/Book'
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
 * /books/{bookId}:
 *   get:
 *     summary: Get a book
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: bookId
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Book'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a book
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: bookId
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
 * /books/filter/{boardId}/{mediumId}/{classId}/{subjectId}:
 *   get:
 *     summary: Get a Book
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         description: The ID of the board
 *         schema:
 *           type: string
 *       - in: path
 *         name: mediumId
 *         required: true
 *         description: The ID of the medium
 *         schema:
 *           type: string
 *       - in: path
 *         name: classId
 *         required: true
 *         description: The ID of the class
 *       - in: path
 *         name: subjectId
 *         required: true
 *         description: The ID of the subject
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /books/subject/{subjectId}:
 *   get:
 *     summary: Get a Book
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subjectId
 *         required: true
 *         description: The ID of the subject
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /books/{bookId}:
 *   patch:
 *     summary: Update a book
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: bookId
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               boardId:
 *                 type: string
 *               mediumId:
 *                 type: string
 *               classId:
 *                 type: string
 *               subjectId:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *               poster:
 *                 type: string
 *             required:
 *               - name
 *               - boardId
 *               - mediumId
 *               - classId
 *               - subjectId
 *               - thumbnail
 *               - poster
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Book'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /books/book/chapter/{subjectId}:
 *   get:
 *     summary: Get a Book
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subjectId
 *         required: true
 *         description: The ID of the subject
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
