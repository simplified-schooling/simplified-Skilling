const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { planvideoService } = require('../services');

const createNewPlan = catchAsync(async (req, res) => {
  const user = await planvideoService.createNewPlan(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getAllPlans = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'board', 'class', 'subject', 'book', 'chapter', 'videoid']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  options.sortBy = 'order';
  const result = await planvideoService.getAllPlans(filter, options);
  res.send(result);
});

const getSinglePlan = catchAsync(async (req, res) => {
  const user = await planvideoService.getPlanById(req.params.planId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');
  }
  res.send(user);
});

const getTodayPlans = catchAsync(async (req, res) => {
  const result = await planvideoService.getTodayPlans();
  res.send(result);
});

const updatePlan = catchAsync(async (req, res) => {
  const user = await planvideoService.updatePlanById(req.params.planId, req.body);
  res.send(user);
});

const deletePlan = catchAsync(async (req, res) => {
  await planvideoService.deletePlanById(req.params.planId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getPlanVideoByFilter = catchAsync(async (req, res) => {
  const { boardId, mediumId, classId, subjectId, bookId, chapterId, lessonId, search } = req.body;
  const options = {
    limit: parseInt(req.body.limit, 10) || 10,
    page: parseInt(req.body.page, 10) || 1,
    sortBy: 'name', // Sorting by subject name
  };

  const planvideo = await planvideoService.getPlanVideoByFilter(
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
  if (!planvideo || planvideo.totalResults === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No planvideo found');
  }

  res.send(planvideo);
});

module.exports = {
  createNewPlan,
  getAllPlans,
  getTodayPlans,
  getSinglePlan,
  updatePlan,
  deletePlan,
  getPlanVideoByFilter,
};
