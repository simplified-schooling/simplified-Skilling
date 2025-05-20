const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createNewPlan = {
  body: Joi.object().keys({
    name: Joi.string().trim(),
    date: Joi.string().required().trim(),
    time: Joi.string().required().trim(),
    type: Joi.string().required().trim(),
    boardId: Joi.string().required().trim(), // ObjectId
    mediumId: Joi.string().required().trim(), // ObjectId
    classId: Joi.string().required().trim(), // ObjectId
    subjectId: Joi.string().required().trim(), // ObjectId
    bookId: Joi.string().required().trim(), // ObjectId
    chapterId: Joi.string().trim().allow('', null), // ObjectId
    orderId: Joi.string().required().trim(),
    studioName: Joi.string().trim().allow('', null),
    liveStreamingPath: Joi.string().trim().allow('', null),
    presenterName: Joi.string().trim().allow('', null),
    questions: Joi.array().items(Joi.string()).allow('', null),
    lessonId: Joi.string().allow('', null),
    description: Joi.string().trim().allow('', null),
  }),
};

const getSinglePlan = {
  params: Joi.object().keys({
    planId: Joi.string().custom(objectId),
  }),
};

const getAllPlan = {
  query: Joi.object().keys({
    title: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getTodayPlan = {
  query: Joi.object().keys({
    title: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const updatePlanById = {
  params: Joi.object().keys({
    planId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().trim(),
      date: Joi.string().trim(),
      time: Joi.string().trim(),
      type: Joi.string().trim(),
      boardId: Joi.string().trim(), // ObjectId
      mediumId: Joi.string().trim(), // ObjectId
      classId: Joi.string().trim(), // ObjectId
      subjectId: Joi.string().trim(), // ObjectId
      bookId: Joi.string().trim(), // ObjectId
      chapterId: Joi.string().trim().allow('', null), // ObjectId
      orderId: Joi.string().trim().allow('', null),
      lessonId: Joi.string().allow('', null),
      studioName: Joi.string().trim().allow('', null),
      liveStreamingPath: Joi.string().trim().allow('', null),
      presenterName: Joi.string().trim().allow('', null),
      questions: Joi.array().items(Joi.string()).allow('', null),
      description: Joi.string().trim().allow('', null),
    })
    .min(1),
};
const deletePlanById = {
  params: Joi.object().keys({
    planId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createNewPlan,
  getSinglePlan,
  getAllPlan,
  getTodayPlan,
  updatePlanById,
  deletePlanById,
};
