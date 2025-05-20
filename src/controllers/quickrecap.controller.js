const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { quickRecapService } = require('../services');

const createQuickRecap = catchAsync(async (req, res) => {
  const lession = await quickRecapService.createQuickRecap(req.body);
  res.status(httpStatus.CREATED).send(lession);
});

const getAllQuickRecap = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['chapterName']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await quickRecapService.queryQuickRecap(filter, options);
  res.send(result);
});

const getByQuickRecapId = catchAsync(async (req, res) => {
  const quickRecap = await quickRecapService.getQuickRecapById(req.params.quickRecapId);
  if (!quickRecap) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Quick Recap not found');
  }
  res.send(quickRecap);
});

const getByQuickRecapChapterId = catchAsync(async (req, res) => {
  const quickRecap = await quickRecapService.getQuickRecapByChapterId(req.params.chapterId);
  if (!quickRecap) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Quick Recap not found');
  }
  res.send(quickRecap);
});

const getQuickRecapByFilter = catchAsync(async (req, res) => {
  const { boardId, mediumId, classId, subjectId, bookId, chapterId, lessonId, search } = req.body;
  const options = {
    limit: parseInt(req.body.limit, 10) || 10,
    page: parseInt(req.body.page, 10) || 1,
    sortBy: 'chapterName', // Sorting by subject name
  };

  const quickRecap = await quickRecapService.getQuickRecapByFilter(
    boardId,
    mediumId,
    classId,
    subjectId,
    bookId,
    chapterId,
    lessonId,
    search,
    options
  );
  if (!quickRecap || quickRecap.totalResults === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No quickRecap found');
  }

  res.send(quickRecap);
});

const updateQuickRecap = catchAsync(async (req, res) => {
  const quickRecap = await quickRecapService.updateQuickRecapById(req.params.quickRecapId, req.body);
  res.send(quickRecap);
});

const deleteQuickRecap = catchAsync(async (req, res) => {
  await quickRecapService.deleteQuickRecapById(req.params.quickRecapId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createQuickRecap,
  getAllQuickRecap,
  getByQuickRecapId,
  updateQuickRecap,
  deleteQuickRecap,
  getQuickRecapByFilter,
  getByQuickRecapChapterId,
};
