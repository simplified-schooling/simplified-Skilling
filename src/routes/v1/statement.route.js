const express = require('express');
const { statementController } = require('../../controllers');
// const { upload } = require('../../utils/cdn');

const router = express.Router();

router.route('/').post(statementController.createStatement).get(statementController.getAllStatement); // validate(lectureVideoValidation.getLectures),

router
  .route('/:lectureId')
  .get(statementController.getByIdStatement) // validate(lectureVideoValidation.getLecture),
  .delete(statementController.deleteStatementById); // validate(lectureVideoValidation.deleteLession),

module.exports = router;
