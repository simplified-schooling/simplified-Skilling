const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createEbook = {
  body: Joi.object().keys({
    chapterId: Joi.string().custom(objectId),
    description: Joi.string(),
    path: Joi.string(),
    chapterName: Joi.string(),
    order: Joi.number(),
    boardId: Joi.string().custom(objectId),
    mediumId: Joi.string().custom(objectId),
    classId: Joi.string().custom(objectId),
    subjectId: Joi.string().custom(objectId),
    bookId: Joi.string().custom(objectId),
  }),
};

const getAllEbook = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getEbookById = {
  params: Joi.object().keys({
    ebookId: Joi.string().custom(objectId),
  }),
};
const getEbookByChapertId = {
  params: Joi.object().keys({
    chapterId: Joi.string().custom(objectId),
  }),
};

const getEbookByFilter = {
  params: Joi.object().keys({
    boardId: Joi.string().custom(objectId).required(),
    mediumId: Joi.string().custom(objectId).required(),
    classId: Joi.string().custom(objectId).required(),
    subjectId: Joi.string().custom(objectId).required(),
    bookId: Joi.string().custom(objectId).required(),
  }),
};

const updateEbook = {
  params: Joi.object().keys({
    ebookId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      chapterId: Joi.string().custom(objectId),
      description: Joi.string(),
      path: Joi.string(),
      order: Joi.number(),
      chapterName: Joi.string(),
      boardId: Joi.string().custom(objectId),
      mediumId: Joi.string().custom(objectId),
      classId: Joi.string().custom(objectId),
      subjectId: Joi.string().custom(objectId),
      bookId: Joi.string().custom(objectId),
    })
    .min(1),
};

const deleteEbook = {
  params: Joi.object().keys({
    ebookId: Joi.string().custom(objectId),
  }),
};
const getEbooksByFilter = {
  body: Joi.object().keys({
    boardId: Joi.string().custom(objectId),
    mediumId: Joi.string().custom(objectId),
    classId: Joi.string().custom(objectId),
    subjectId: Joi.string().custom(objectId),
    bookId: Joi.string().custom(objectId),
    search: Joi.string(),
    limit: Joi.number().integer().min(1).default(10),
    page: Joi.number().integer().min(1).default(1),
  }),
};
module.exports = {
  createEbook,
  getAllEbook,
  getEbookById,
  getEbookByFilter,
  getEbookByChapertId,
  updateEbook,
  deleteEbook,
  getEbooksByFilter,
};
