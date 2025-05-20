const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createSubject = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    classId: Joi.string().custom(objectId).required(),
    mediumId: Joi.string().custom(objectId).required(),
    boardId: Joi.string().custom(objectId).required(),
    code: Joi.string().required(),
    thumbnail: Joi.string(),
    poster: Joi.string(),
  }),
};

const getAllSubject = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getSubject = {
  params: Joi.object().keys({
    subjectId: Joi.string().custom(objectId).required(),
  }),
};
const getSubjectByClassId = {
  params: Joi.object().keys({
    classId: Joi.string().custom(objectId).required(),
  }),
};
const getSubjectByFiltersId = {
  params: Joi.object().keys({
    classId: Joi.string().custom(objectId).required(),
    mediumId: Joi.string().custom(objectId).required(),
    boardId: Joi.string().custom(objectId).required(),
  }),
};
// const getSubjectByFiltersId = {
//   params: Joi.object().keys({
//     classId: Joi.string().custom(objectId).required(),
//     mediumId: Joi.string().custom(objectId).required(),
//     boardId: Joi.string().custom(objectId).required(),
//   }),
//   query: Joi.object().keys({
//     search: Joi.string().optional(), // Optional search query
//     page: Joi.number().integer().min(1).optional(), // Optional page number, default 1
//     limit: Joi.number().integer().min(10).optional(), // Optional limit, default 10
//   }),
// };
const updateSubject = {
  params: Joi.object().keys({
    subjectId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      classId: Joi.string().custom(objectId),
      mediumId: Joi.string().custom(objectId),
      boardId: Joi.string().custom(objectId),
      code: Joi.string(),
      thumbnail: Joi.string(),
      poster: Joi.string(),
    })
    .min(1),
};

const deleteSubject = {
  params: Joi.object().keys({
    subjectId: Joi.string(),
  }),
};

module.exports = {
  createSubject,
  getSubject,
  updateSubject,
  deleteSubject,
  getAllSubject,
  getSubjectByClassId,
  getSubjectByFiltersId,
};
