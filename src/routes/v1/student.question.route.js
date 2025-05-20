const express = require('express');
const validate = require('../../middlewares/validate');
const { studentQuestionController } = require('../../controllers');
const { studentQuestionValidation } = require('../../validations');

const router = express.Router();

router
  .route('/')
  .post(validate(studentQuestionValidation.createStudentQuestion), studentQuestionController.createStudentQuestion)
  .get(studentQuestionController.getAllStudentQuestion);

router
  .route('/:id')
  .get(validate(studentQuestionValidation.getStudentQuestionById), studentQuestionController.getStudentQuestionById)
  .patch(validate(studentQuestionValidation.updateStudentQuestionById), studentQuestionController.updateStudentQuestionById)
  .delete(
    validate(studentQuestionValidation.deleteStudentQuestionById),
    studentQuestionController.deleteStudentQuestionById
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: StudentQuestion
 *   description: Role management
 */

/**
 * @swagger
 * /student-question:
 *   post:
 *     summary: Create a StudentQuestion
 *     tags: [StudentQuestion]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               boardId:
 *                 type: string *
 *               mediumId:
 *                 type: string
 *               classId:
 *                 type: string
 *               subjectId:
 *                 type: string
 *               bookId:
 *                 type: string
 *               chapterId:
 *                 type: string
 *               numberOfStudent:
 *                 type: number
 *               perStudentQuestion:
 *                 type: number
 *             example:
 *               boardId: 6516761d9cee04ae5df9fb6f
 *               mediumId: 6516761d9cee04ae5df9fb6f
 *               classId: 6516761d9cee04ae5df9fb6f
 *               subjectId: 6516761d9cee04ae5df9fb6f
 *               bookId: 6516761d9cee04ae5df9fb6f
 *               chapterId: 6516761d9cee04ae5df9fb6f
 *               numberOfStudent: 12
 *               perStudentQuestion: 1
 *
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/StudentQuestion'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all StudentQuestion
 *     tags: [StudentQuestion]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/StudentQuestion'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /student-question/{id}:
 *   get:
 *     summary: Get a StudentQuestion
 *     tags: [StudentQuestion]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *         description: roleId
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/StudentQuestion'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a StudentQuestion
 *     tags: [StudentQuestion]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               boardId:
 *                 type: string *
 *               mediumId:
 *                 type: string
 *               classId:
 *                 type: string
 *               subjectId:
 *                 type: string
 *               bookId:
 *                 type: string
 *               chapterId:
 *                 type: string
 *               numberOfStudent:
 *                 type: number
 *               perStudentQuestion:
 *                 type: number
 *             example:
 *               boardId: 6516761d9cee04ae5df9fb6f
 *               mediumId: 6516761d9cee04ae5df9fb6f
 *               classId: 6516761d9cee04ae5df9fb6f
 *               subjectId: 6516761d9cee04ae5df9fb6f
 *               bookId: 6516761d9cee04ae5df9fb6f
 *               chapterId: 6516761d9cee04ae5df9fb6f
 *               numberOfStudent: 12
 *               perStudentQuestion: 1
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Role'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a StudentQuestion
 *     tags: [StudentQuestion]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: id
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
