const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createQuize = {
  body: Joi.object().keys({
    quizName: Joi.string(),
    description: Joi.string(),
    question: Joi.string(),
    options: Joi.array().items(Joi.string()),
    correctOptions: Joi.array().items(Joi.number()),
    explain: Joi.string(),
    hint: Joi.string(),
    types: Joi.string(),
    isVerified: Joi.boolean(),
    userAnswers: Joi.array().items(Joi.string()),
    marks: Joi.number(),
    boardId: Joi.string(),
    mediumId: Joi.string(),
    classId: Joi.string(),
    bookId: Joi.string(),
    subjectId: Joi.string(),
    chapterId: Joi.string(),
    lessonId: Joi.string(),
  }),
};

const getQuizes = {
  query: Joi.object().keys({
    quizName: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const uploadFiles = {
  body: Joi.object().keys({
    files: Joi.string(),
  }),
};

const getQuizeByQuizName = {
  body: Joi.object().keys({
    quizName: Joi.string().required(),
    boardId: Joi.string().required(),
    mediumId: Joi.string().required(),
    classId: Joi.string().required(),
    bookId: Joi.string().required(),
    subjectId: Joi.string().required(),
    chapterId: Joi.string().required(),
    lessonId: Joi.string().required(),
  }),
};
const NotSelectQuize = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getQuize = {
  params: Joi.object().keys({
    quizeId: Joi.string().custom(objectId),
  }),
};

const getQuizeByChapterId = {
  params: Joi.object().keys({
    chapterId: Joi.string().custom(objectId),
  }),
};
const getQuizDayWise = {
  params: Joi.object().keys({
    classId: Joi.string(),
  }),
};

const getQuizFilter = {
  body: Joi.object().keys({
    classId: Joi.string(),
    boardId: Joi.string(),
    mediumId: Joi.string(),
    bookId: Joi.string(),
    subjectId: Joi.string(),
    chapterId: Joi.string(),
    lessonId: Joi.string(),
    search: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const submitQuize = {
  params: Joi.object().keys({
    quizeId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    answer: Joi.array().items(Joi.string()),
  }),
};

const updateQuize = {
  params: Joi.object().keys({
    quizeId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      quizName: Joi.string(),
      description: Joi.string(),
      question: Joi.string(),
      options: Joi.array().items(Joi.string()),
      correctOptions: Joi.array().items(Joi.number()),
      explain: Joi.string(),
      hint: Joi.string(),
      types: Joi.string(),
      isVerified: Joi.boolean(),
      userAnswers: Joi.array().items(Joi.string()),
      marks: Joi.number(),
      boardId: Joi.string(),
      mediumId: Joi.string(),
      classId: Joi.string(),
      bookId: Joi.string(),
      subjectId: Joi.string(),
      chapterId: Joi.string(),
      // questionId: Joi.string(),
      lessonId: Joi.string(),
    })
    .min(1),
};

const deleteQuize = {
  params: Joi.object().keys({
    quizeId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createQuize,
  getQuizes,
  getQuize,
  getQuizFilter,
  submitQuize,
  updateQuize,
  deleteQuize,
  NotSelectQuize,
  uploadFiles,
  getQuizDayWise,
  getQuizeByQuizName,
  getQuizeByChapterId,
};
