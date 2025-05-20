const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createStudentQuestion = {
  body: Joi.object().keys({
    classId: Joi.string().required(),
    subjectId: Joi.string().required(),
    mediumId: Joi.string().required(),
    boardId: Joi.string().required(),
    bookId: Joi.string().required(),
    chapterId: Joi.string().required(),
    numberOfStudent: Joi.number().required(),
    perStudentQuestion: Joi.number().required(),
  }),
};

const getAllStudentQuestion = {
  query: Joi.object().keys({
    numberOfStudent: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getStudentQuestionById = {
  params: Joi.object().keys({
    id: Joi.string(),
  }),
};

const updateStudentQuestionById = {
  params: Joi.object().keys({
    mappingId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      classId: Joi.string(),
      subjectId: Joi.string(),
      mediumId: Joi.string(),
      boardId: Joi.string(),
      bookId: Joi.string(),
      chapterId: Joi.string(),
      numberOfStudent: Joi.number(),
      perStudentQuestion: Joi.number(),
    })
    .min(1),
};

const deleteStudentQuestionById = {
  params: Joi.object().keys({
    mappingId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createStudentQuestion,
  getAllStudentQuestion,
  getStudentQuestionById,
  updateStudentQuestionById,
  deleteStudentQuestionById,
};
