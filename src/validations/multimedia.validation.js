const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createMultimeda = {
  body: Joi.object().keys({
    lessionName: Joi.string().required(),
    description: Joi.string().required(),
    // files: Joi.array().items(Joi.string()),
    path: Joi.string().required(),
    icon1: Joi.string(),
    icon2: Joi.string(),
    multimediaType: Joi.string().valid('Multimedia', 'Lecture'),
    order: Joi.number().required(),
    // order: Joi.number().required(),
    videoType: Joi.string().required(),
    boardId: Joi.string().custom(objectId).required(),
    mediumId: Joi.string().custom(objectId).required(),
    classId: Joi.string().custom(objectId).required(),
    subjectId: Joi.string().custom(objectId).required(),
    bookId: Joi.string().custom(objectId).required(),
    chapterId: Joi.string().custom(objectId).required(),
  }),
};

const getAllMultimedia = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    lessionName: Joi.string(),
    multimediaType: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getMultimediaById = {
  params: Joi.object().keys({
    multimediaId: Joi.string().custom(objectId),
  }),
};

const getMultimediaByChaperId = {
  params: Joi.object().keys({
    chapterId: Joi.string().custom(objectId),
  }),
};

// const getMultimediaByType = {
//   params: Joi.object().keys({
//     multimediaType: Joi.string(),
//   }),
// };

// Updated validation code to include pagination parameters
// const getMultimediaByType = {
//   params: Joi.object().keys({
//     multimediaType: Joi.string().required(),
//   }),
//   query: Joi.object().keys({
//     limit: Joi.number().integer().min(1).default(10),  // Default limit = 10
//     page: Joi.number().integer().min(1).default(1),    // Default page = 1
//   }),
// };
const getMultimediaByType = {
  body: Joi.object().keys({
    multimediaType: Joi.string(),
    search: Joi.string().allow(''), // Optional search parameter
    limit: Joi.number().integer().min(1).default(10), // Default limit = 10
    page: Joi.number().integer().min(1).default(1), // Default page = 1
  }),
};

// const getMultimediaByFilter = {
//   params: Joi.object().keys({
//     boardId: Joi.string().custom(objectId).required(),
//     mediumId: Joi.string().custom(objectId).required(),
//     classId: Joi.string().custom(objectId).required(),
//     subjectId: Joi.string().custom(objectId).required(),
//     bookId: Joi.string().custom(objectId).required(),
//     chapterId: Joi.string().custom(objectId).required(),
//   }),
// };

const getMultimediaByFilter = {
  body: Joi.object().keys({
    boardId: Joi.string().custom(objectId),
    mediumId: Joi.string().custom(objectId),
    classId: Joi.string().custom(objectId),
    subjectId: Joi.string().custom(objectId),
    bookId: Joi.string().custom(objectId),
    chapterId: Joi.string().custom(objectId),
    multimediaType: Joi.string(),
    search: Joi.string(),
    limit: Joi.number().integer().min(1).default(10),
    page: Joi.number().integer().min(1).default(1),
  }),
};

const getMultimediaByTypeFilter = {
  params: Joi.object().keys({
    boardId: Joi.string().custom(objectId).required(),
    mediumId: Joi.string().custom(objectId).required(),
    classId: Joi.string().custom(objectId).required(),
    subjectId: Joi.string().custom(objectId).required(),
    bookId: Joi.string().custom(objectId).required(),
    chapterId: Joi.string().custom(objectId).required(),
    multimediaType: Joi.string().required(),
  }),
};

const updateMultimedia = {
  params: Joi.object().keys({
    multimediaId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      lessionName: Joi.string(),
      description: Joi.string().required(),
      // files: Joi.array().items(Joi.string()),
      path: Joi.string(),
      icon1: Joi.string(),
      icon2: Joi.string(),
      multimediaType: Joi.string().valid('Multimedia', 'Lecture'),
      order: Joi.number(),
      videoType: Joi.string(),
      boardId: Joi.string().custom(objectId),
      mediumId: Joi.string().custom(objectId),
      classId: Joi.string().custom(objectId),
      subjectId: Joi.string().custom(objectId),
      bookId: Joi.string().custom(objectId),
      chapterId: Joi.string().custom(objectId),
    })
    .min(1),
};

const deleteMultimedia = {
  params: Joi.object().keys({
    multimediaId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createMultimeda,
  getAllMultimedia,
  getMultimediaById,
  getMultimediaByFilter,
  updateMultimedia,
  deleteMultimedia,
  getMultimediaByType,
  getMultimediaByChaperId,
  getMultimediaByTypeFilter,
};
