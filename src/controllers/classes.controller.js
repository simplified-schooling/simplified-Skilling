const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { classesService } = require('../services');
// const { filterPath } = require('../utils/s3middleware');

// const createClasses = catchAsync(async (req, res) => {
//   // const { file } = req;
//   // req.body.thumbnail = await filterPath(file.location);
//   const newClass = await classesService.createClasses(req.body);
//   res.status(httpStatus.CREATED).send(newClass);
// });

const createClasses = catchAsync(async (req, res) => {
  if (req.files?.thumbnail) {
    req.body.thumbnail = req.files.thumbnail[0].location;
  }

  if (req.files?.poster) {
    req.body.poster = req.files.poster[0].location;
  }

  const newClass = await classesService.createClasses(req.body);
  res.status(httpStatus.CREATED).send(newClass);
});

const getClasses = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['className']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  options.sortBy = 'order';
  const allClasses = await classesService.getAllClasses(filter, options);
  res.send(allClasses);
});

const getSingleClass = catchAsync(async (req, res) => {
  const singleClass = await classesService.getClassById(req.params.classId);
  if (!singleClass) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Class not found');
  }
  res.send(singleClass);
});

const updateSingleClass = catchAsync(async (req, res) => {
  if (req.files?.thumbnail) {
    req.body.thumbnail = req.files.thumbnail[0].location;
  }
  if (req.files?.poster) {
    req.body.poster = req.files.poster[0].location;
  }
  const updatedClass = await classesService.updateClassById(req.params.classId, req.body);
  res.send(updatedClass);
});

const deleteSingleClass = catchAsync(async (req, res) => {
  const deletedClass = await classesService.deleteClassById(req.params.classId);
  res.status(httpStatus.NO_CONTENT).send(deletedClass);
});

module.exports = {
  createClasses,
  getClasses,
  getSingleClass,
  updateSingleClass,
  deleteSingleClass,
};
