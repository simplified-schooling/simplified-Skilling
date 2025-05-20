const Joi = require('joi');
const { objectId } = require('./custom.validation');


const createHomework = {
  body: Joi.object().keys({
    Question: Joi.string().required(),
    answer: Joi.string().required(),
    answerType: Joi.number().valid(1, 2, 3).required(), // fix type
    boardId: Joi.string().custom(objectId).required(),
    mediumId: Joi.string().custom(objectId).required(),
    classId: Joi.string().custom(objectId).required(),
    bookId: Joi.string().custom(objectId).required(),
    subjectId: Joi.string().custom(objectId).required(),
    chapterId: Joi.string().custom(objectId).required(),
    lessonId: Joi.string().custom(objectId).required(),
    questionLevel: Joi.number().valid(1, 2, 3, 4).required(),
    audioPath: Joi.string().optional(), // ADD this field
  }),
};

const getAllHomework = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getHomework = {
  params: Joi.object().keys({
    homeworkId: Joi.string().custom(objectId),
  }),
};

const updateHomework = {
  params: Joi.object().keys({
    homeworkId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      Question: Joi.string(),
      // veryShortAnswer: Joi.string(),
      // shortAnswer: Joi.string(),
      // longAnswer: Joi.string(),
      // description: Joi.string(),
      answer: Joi.string(),
      answerType: Joi.number(),
      boardId: Joi.string(),
      mediumId: Joi.string(),
      classId: Joi.string(),
      bookId: Joi.string(),
      subjectId: Joi.string(),
      chapterId: Joi.string(),
      lessonId: Joi.string().custom(objectId),
      questionLevel: Joi.number(),
      audioPath: Joi.string(),
    })
    .min(1),
};

const deleteHomework = {
  params: Joi.object().keys({
    homeworkId: Joi.string().custom(objectId),
  }),
};
const answerTypeWiseByChapterId = {
  params: Joi.object().keys({
    chapterId: Joi.string().custom(objectId),
  }),
};

const getHomeworkFilter = {
  query: Joi.object().keys({
    classId: Joi.string(),
    boardId: Joi.string(),
    mediumId: Joi.string(),
    bookId: Joi.string(),
    subjectId: Joi.string(),
    chapterId: Joi.string(),
  }),
};

const getHomeByFilter = {
  body: Joi.object().keys({
    boardId: Joi.string().custom(objectId),
    mediumId: Joi.string().custom(objectId),
    classId: Joi.string().custom(objectId),
    subjectId: Joi.string().custom(objectId),
    bookId: Joi.string().custom(objectId),
    chapterId: Joi.string().custom(objectId),
    lessonId: Joi.string().custom(objectId),
    search: Joi.string(),
    limit: Joi.number().integer().min(1).default(10),
    page: Joi.number().integer().min(1).default(1),
  }),
};
module.exports = {
  createHomework,
  getAllHomework,
  getHomework,
  answerTypeWiseByChapterId,
  updateHomework,
  deleteHomework,
  getHomeworkFilter,
  getHomeByFilter,
};
