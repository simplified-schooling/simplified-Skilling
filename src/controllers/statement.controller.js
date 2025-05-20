const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { statementService } = require('../services');

const createStatement = catchAsync(async (req, res) => {
  const statement = await statementService.createStatement(req.body);
  res.status(httpStatus.CREATED).send(statement);
});

const getAllStatement = catchAsync(async (req, res) => {
  const result = await statementService.getAllStatement();
  res.send(result);
});

const getByIdStatement = catchAsync(async (req, res) => {
  const statement = await statementService.getStatementById(req.params.statementId);
  if (!statement) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Statement not found');
  }
  res.send(statement);
});

const deleteStatementById = catchAsync(async (req, res) => {
  await statementService.deleteStatementById(req.params.statementId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createStatement,
  getAllStatement,
  getByIdStatement,
  deleteStatementById,
};
