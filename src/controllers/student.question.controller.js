const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { studentQuestionService } = require('../services');

const createStudentQuestion = catchAsync(async (req, res) => {
  const result = await studentQuestionService.createStudentQuestion(req.body);
  res.status(httpStatus.CREATED).send(result);
});

const getAllStudentQuestion = catchAsync(async (req, res) => {
  const result = await studentQuestionService.getAllStudentQuestion();
  res.send(result);
});

const getStudentQuestionById = catchAsync(async (req, res) => {
  const result = await studentQuestionService.getStudentQuestionById(req.params.id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'question not found');
  }
  res.send(result);
});

const updateStudentQuestionById = catchAsync(async (req, res) => {
  const result = await studentQuestionService.updateStudentQuestionById(req.params.id, req.body);
  res.send(result);
});

const deleteStudentQuestionById = catchAsync(async (req, res) => {
  await studentQuestionService.deleteStudentQuestionById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createStudentQuestion,
  getAllStudentQuestion,
  getStudentQuestionById,
  updateStudentQuestionById,
  deleteStudentQuestionById,
};
