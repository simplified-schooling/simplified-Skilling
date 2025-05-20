const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createLecture = {
  body: Joi.object().keys({
    boardId: Joi.string().custom(objectId),
    description: Joi.string(),
    mediumId: Joi.string().custom(objectId),
    classId: Joi.string().custom(objectId),
    subjectId: Joi.string().custom(objectId),
    bookId: Joi.string().custom(objectId),
    chapterId: Joi.string().custom(objectId),
    lessonId: Joi.string().custom(objectId),
    lessionName: Joi.string().required(),
    icon1: Joi.string(),
    icon2: Joi.string(),
    path: Joi.string(),
    mobileVideoPath: Joi.string(),
    mobileVideoType: Joi.string(),
    videoType: Joi.string(),
    // type: Joi.string().required(),
    order: Joi.number(),
  }),
};

const getLectures = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getLecture = {
  params: Joi.object().keys({
    lessionId: Joi.string().custom(objectId),
  }),
};

const getLectureVideobychapterId = {
  params: Joi.object().keys({
    chapterId: Joi.string().custom(objectId),
  }),
};
const getLessionByFilter = {
  params: Joi.object().keys({
    boardId: Joi.string().custom(objectId).required(),
    mediumId: Joi.string().custom(objectId).required(),
    classId: Joi.string().custom(objectId).required(),
    subjectId: Joi.string().custom(objectId).required(),
    bookId: Joi.string().custom(objectId).required(),
    chapterId: Joi.string().custom(objectId).required(),
    lessonId: Joi.string().custom(objectId),
  }),
};

const updateLecture = {
  params: Joi.object().keys({
    lectureId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      boardId: Joi.string().custom(objectId),
      description: Joi.string(),
      mediumId: Joi.string().custom(objectId),
      classId: Joi.string().custom(objectId),
      subjectId: Joi.string().custom(objectId),
      bookId: Joi.string().custom(objectId),
      chapterId: Joi.string().custom(objectId),
      lessonId: Joi.string().custom(objectId),
      lessionName: Joi.string().required(),
      icon1: Joi.string(),
      icon2: Joi.string(),
      path: Joi.string(),
      videoType: Joi.string(),
      mobileVideoPath: Joi.string(),
      mobileVideoType: Joi.string(),
      // type: Joi.string().required(),
      order: Joi.number(),
    })
    .min(1),
};

const deleteLession = {
  params: Joi.object().keys({
    lectureId: Joi.string().custom(objectId),
  }),
};
const getLecByFilter = {
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
  createLecture,
  getLectures,
  getLecture,
  updateLecture,
  deleteLession,
  getLectureVideobychapterId,
  getLessionByFilter,
  getLecByFilter,
};
