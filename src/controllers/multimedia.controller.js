const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { multimediaService } = require('../services');
// const { filterPath } = require('../utils/s3middleware');

const createMultimedia = catchAsync(async (req, res) => {
  // if (req.files.icon1) {
  // console.log(req.body);
  //   req.body.icon1 = await filterPath(req.files.icon1[0].location);
  // }
  // if (req.files.icon2) {
  //   req.body.icon2 = await filterPath(req.files.icon2[0].location);
  // }
  const multimedia = await multimediaService.createMultimedia(req.body);
  res.status(httpStatus.CREATED).send(multimedia);
});

// const createMultimedia = catchAsync(async (req, res) => {
//   // if (req.files.icon1) {
//   // console.log(req.body);
//   //   req.body.icon1 = await filterPath(req.files.icon1[0].location);
//   // }
//   // if (req.files.icon2) {
//   //   req.body.icon2 = await filterPath(req.files.icon2[0].location);
//   // }
//   const multimedia = await multimediaService.createMultimedia(req.body);
//   res.status(httpStatus.CREATED).send(multimedia);
// });

const getMultimedia = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['lessionName', 'multimediaType']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  options.sortBy = 'order';
  const result = await multimediaService.queryMultimedia(filter, options);
  res.send(result);
});

const getMultimediaById = catchAsync(async (req, res) => {
  const multimedia = await multimediaService.getMultimediaById(req.params.multimediaId);
  if (!multimedia) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Multimedia not found');
  }
  res.send(multimedia);
});

// const getMultimediaByType = catchAsync(async (req, res) => {
//   const multimedia = await multimediaService.getMultimediaByType(req.params.multimediaType);
//   if (!multimedia) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Mltimedia not found');
//   }
//   res.send(multimedia);
// });

// const getMultimediaByType = catchAsync(async (req, res) => {
//   // Get multimediaType from params
//   const { multimediaType } = req.params;

//   // Get pagination options from query params (default values if not provided)
//   const options = {
//     limit: parseInt(req.query.limit, 10) || 10,  // Default limit = 10
//     page: parseInt(req.query.page, 10) || 1,     // Default page = 1
//     sortBy: 'order',                             // You can change the sorting field if needed
//   };

//   // Get multimedia by type with pagination
//   const multimedia = await multimediaService.getMultimediaByType(multimediaType, options);

//   // Check if multimedia data is found
//   if (!multimedia) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Multimedia not found');
//   }

//   // Send the response with pagination data
//   res.send(multimedia);
// });

// const getMultimediaByType = catchAsync(async (req, res) => {
//   // Extract parameters from request body
//   const { multimediaType, search } = req.body;
//   const options = {
//     limit: parseInt(req.body.limit, 10) || 10,
//     page: parseInt(req.body.page, 10) || 1,
//     sortBy: 'order',
//   };

//   // Call the service function with the search parameter
//   const multimedia = await multimediaService.getMultimediaByType(multimediaType, search, options);

//   if (!multimedia) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Multimedia not found');
//   }

//   res.send(multimedia);
// });
const getMultimediaByType = catchAsync(async (req, res) => {
  const { multimediaType, search } = req.body;
  const options = {
    limit: parseInt(req.body.limit, 10) || 10,
    page: parseInt(req.body.page, 10) || 1,
    sortBy: 'order',
  };

  // Call the service function
  const multimedia = await multimediaService.getMultimediaByType(multimediaType, search, options);

  if (!multimedia || multimedia.totalResults === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No multimedia data found');
  }

  res.send(multimedia);
});
const getMultimediaByChaper = catchAsync(async (req, res) => {
  const multimedia = await multimediaService.getMultimediaByChaperId(req.params.chapterId);
  if (!multimedia) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Multimedia not found by chaperId');
  }
  res.send(multimedia);
});

const getMultimediaByTypeFilter = catchAsync(async (req, res) => {
  const { boardId, mediumId, classId, subjectId, bookId, chapterId, multimediaType } = req.params;
  const multimedia = await multimediaService.getMultimediaByTypeFilter(
    boardId,
    mediumId,
    classId,
    subjectId,
    bookId,
    chapterId,
    multimediaType
  );
  if (!multimedia) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Multimedia not found');
  }
  res.send(multimedia);
});

const getMultimediaByFilter = catchAsync(async (req, res) => {
  const { boardId, mediumId, classId, subjectId, bookId, chapterId, multimediaType, search } = req.body;
  const options = {
    limit: parseInt(req.body.limit, 10) || 10,
    page: parseInt(req.body.page, 10) || 1,
    sortBy: 'order', // Sorting by subject name
  };

  const multimedia = await multimediaService.getMultimediaByFilter(
    boardId,
    mediumId,
    classId,
    subjectId,
    bookId,
    chapterId,
    multimediaType,
    search,
    options
  );
  if (!multimedia || multimedia.totalResults === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No multimedia found');
  }

  res.send(multimedia);
});

const updateMultimedia = catchAsync(async (req, res) => {
  // if (req.files.icon1) {
  //   req.body.icon1 = await filterPath(req.files.icon1[0].location);
  // }
  // if (req.files.icon2) {
  //   req.body.icon2 = await filterPath(req.files.icon2[0].location);
  // }
  const multimedia = await multimediaService.updateMultimediaById(req.params.multimediaId, req.body);
  res.send(multimedia);
});

const deleteMultimedia = catchAsync(async (req, res) => {
  await multimediaService.deleteMultimediaById(req.params.multimediaId);
  res.status(httpStatus.NO_CONTENT).send();
});
const getMultimediaByBookId = catchAsync(async (req, res) => {
  const { bookId, mediatype } = req.params;
  const chaptersData = await multimediaService.getMultimediaByBookId(bookId, mediatype);
  res.status(200).json({ chaptersData });
});
module.exports = {
  createMultimedia,
  getMultimedia,
  getMultimediaById,
  getMultimediaByFilter,
  updateMultimedia,
  deleteMultimedia,
  getMultimediaByType,
  getMultimediaByChaper,
  getMultimediaByBookId,
  getMultimediaByTypeFilter,
};
