const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { recordedBroadcastService } = require('../services');
const { filterPath } = require('../utils/s3middleware');

const createRecordedBroadcast = catchAsync(async (req, res) => {
  if (req.files.portraitImage) {
    req.body.landscapeImage = await filterPath(req.files.portraitImage[0].location);
  }
  if (req.files.landscapeImage) {
    req.body.portraitImage = await filterPath(req.files.landscapeImage[0].location);
  }
  const newRecordedBroadcast = await recordedBroadcastService.createRecordedBroadcast(req.body);
  res.status(httpStatus.CREATED).send(newRecordedBroadcast);
});

const getAllRecordedBroadcast = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['title']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const allRecordedBroadcast = await recordedBroadcastService.getAllRecordedBroadcast(filter, options);
  res.send(allRecordedBroadcast);
});

const getRecordedBroadcastById = catchAsync(async (req, res) => {
  const singleRecordedBroadcast = await recordedBroadcastService.getRecordedBroadcastById(req.params.recordedBroadcastId);
  if (!singleRecordedBroadcast) {
    throw new ApiError(httpStatus.NOT_FOUND, 'RecordedBroadcast not found');
  }
  res.send(singleRecordedBroadcast);
});

const getRecordedBroadcastByBookId = catchAsync(async (req, res) => {
  const chaptersData = await recordedBroadcastService.getRecordedBroadcastByBookId(req.params.bookId);
  if (!chaptersData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'RecordedBroadcast not found');
  }
  res.send({ chaptersData });
});

const updateRecordedBroadcastById = catchAsync(async (req, res) => {
  if (req.files) {
    req.body.landscapeImage = await filterPath(req.files.landscapeImage[0].location);
  }
  if (req.files) {
    req.body.portraitImage = await filterPath(req.files.portraitImage[0].location);
  }
  const updatedRecordedBroadcast = await recordedBroadcastService.updateRecordedBroadcastById(
    req.params.recordedBroadcastId,
    req.body
  );
  res.send(updatedRecordedBroadcast);
});

const deleteRecordedBroadcastById = catchAsync(async (req, res) => {
  const deletedRecordedBroadcast = await recordedBroadcastService.deleteRecordedBroadcastById(
    req.params.recordedBroadcastId
  );
  res.status(httpStatus.NO_CONTENT).send(deletedRecordedBroadcast);
});

const getRecordedBroadcastByFilter = catchAsync(async (req, res) => {
  const { classId, subjectId } = req.params;
  const data = await recordedBroadcastService.getRecordedBroadcastByFilter(classId, subjectId);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'RecordedBroadcast data  not found');
  }
  res.send(data);
});

module.exports = {
  createRecordedBroadcast,
  getAllRecordedBroadcast,
  getRecordedBroadcastById,
  getRecordedBroadcastByBookId,
  updateRecordedBroadcastById,
  deleteRecordedBroadcastById,
  getRecordedBroadcastByFilter,
};
