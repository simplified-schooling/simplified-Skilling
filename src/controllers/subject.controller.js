const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { subjectService } = require('../services');

const createSubject = catchAsync(async (req, res) => {
  if (req.files?.thumbnail) {
    req.body.thumbnail = req.files.thumbnail[0].location;
  }

  if (req.files?.poster) {
    req.body.poster = req.files.poster[0].location;
  }
  const subject = await subjectService.createSubject(req.body);
  res.status(httpStatus.CREATED).send(subject);
});

const getAllSubject = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  options.sortBy = 'order';
  const result = await subjectService.querySubject(filter, options);
  res.send(result);
});

const getSubjectById = catchAsync(async (req, res) => {
  const subject = await subjectService.getSubjectById(req.params.subjectId);
  if (!subject) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subject not found');
  }
  res.send(subject);
});

const getSubjectOfClass = catchAsync(async (req, res) => {
  const subject = await subjectService.getSubjectOfClass();
  if (!subject) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subject not found');
  }
  res.send(subject);
});
const getSubjectByClassId = catchAsync(async (req, res) => {
  const subject = await subjectService.getSubjectByClassId(req.params.classId);
  if (!subject) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subject not found');
  }
  res.send(subject);
});

const getUbjectByFilter = catchAsync(async (req, res) => {
  const { boardId, mediumId, classId } = req.params;
  // const { page, limit } = req.query;
  const subject = await subjectService.getSubjectByFilter(boardId, mediumId, classId);
  if (!subject) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subject not found');
  }
  res.send(subject);
});

// const getSubjectByFilter = catchAsync(async (req, res) => {

//   const { boardId, mediumId, classId } = req.params;
//   const page = parseInt(req.query.page, 10) || 1;
//   const limit = parseInt(req.query.limit, 10) || 10;

//   const options = {
//     page,
//     limit,
//     sort: { order: 1 }, // Ensure sorting works correctly
//   };

//   // Call the service function to get the filtered and paginated subjects
//   const subjects = await subjectService.getSubjectByFilter(boardId, mediumId, classId, options);
// console.log(subjects);
//   if (!subjects || subjects.docs.length === 0) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Subjects not found');
//   }

//   // Send the paginated response with results
//   res.send({
//     totalDocs: subjects.totalDocs, // Total count of matched subjects
//     totalPages: subjects.totalPages, // Total number of pages
//     page: subjects.page, // Current page number
//     limit: subjects.limit, // Items per page
//     results: subjects.docs, // The actual subjects array
//   });
// });

const updateSubject = catchAsync(async (req, res) => {
  if (req.files?.thumbnail) {
    req.body.thumbnail = req.files.thumbnail[0].location;
  }

  if (req.files?.poster) {
    req.body.poster = req.files.poster[0].location;
  }
  const subject = await subjectService.updatSubjectById(req.params.subjectId, req.body);
  res.send(subject);
});

const deleteSubject = catchAsync(async (req, res) => {
  await subjectService.deleteSubjectById(req.params.subjectId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getSubjectByFilter = catchAsync(async (req, res) => {
  const { boardId, mediumId, classId, search } = req.body;
  const options = {
    limit: parseInt(req.body.limit, 10) || 10,
    page: parseInt(req.body.page, 10) || 1,
    sortBy: 'name', // Sorting by subject name
  };

  // Call service function
  const subjects = await subjectService.getUbjectByFilter(boardId, mediumId, classId, search, options);

  if (!subjects || subjects.totalResults === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No subjects found');
  }

  res.send(subjects);
});
module.exports = {
  createSubject,
  getAllSubject,
  getSubjectById,
  updateSubject,
  deleteSubject,
  getSubjectByClassId,
  getSubjectOfClass,
  getUbjectByFilter,
  getSubjectByFilter,
};
