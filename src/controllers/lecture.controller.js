const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { lectureVideoService } = require('../services');

const createLectureVideo = catchAsync(async (req, res) => {
  const lectureVideo = await lectureVideoService.createLectureVideo(req.body);
  res.status(httpStatus.CREATED).send(lectureVideo);
});

const queryLectureVideos = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['board']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  options.sortBy = 'order';
  const result = await lectureVideoService.queryLectureVideo(filter, options);
  res.send(result);
});

const getLectureVideo = catchAsync(async (req, res) => {
  const lectureVideo = await lectureVideoService.getLectureVideoById(req.params.lectureId);
  if (!lectureVideo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'LectureVideo not found');
  }
  res.send(lectureVideo);
});

const getLectureVideobychapId = catchAsync(async (req, res) => {
  const lectureVideo = await lectureVideoService.getLectureVideobychapterId(req.params.chapterId);
  if (!lectureVideo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'LectureVideo not found by this chapter ID');
  }
  res.send(lectureVideo);
});

const getLectureVideoByFilter = catchAsync(async (req, res) => {
  // const { boardId, mediumId, classId, subjectId, bookId, chapterId } = req.params;
  const { boardId, mediumId, classId, subjectId, bookId, chapterId, lessonId,  search } = req.body;
  const options = {
    limit: parseInt(req.body.limit, 10) || 10,
    page: parseInt(req.body.page, 10) || 1,
    sortBy: 'order', // Sorting by subject name
  };
  const lectureVideo = await lectureVideoService.getLectureVideoByFilter(
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
  if (!lectureVideo || lectureVideo.totalResults === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No lectureVideo found');
  }
  res.send(lectureVideo);
});

const updateLectureVideo = catchAsync(async (req, res) => {
  const lectureVideo = await lectureVideoService.updateLectureVideoById(req.params.lectureId, req.body);
  res.send(lectureVideo);
});

const deleteLectureVideo = catchAsync(async (req, res) => {
  await lectureVideoService.deleteLectureVideoById(req.params.lectureId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createLectureVideo,
  queryLectureVideos,
  getLectureVideo,
  updateLectureVideo,
  deleteLectureVideo,
  getLectureVideobychapId,
  getLectureVideoByFilter,
};
