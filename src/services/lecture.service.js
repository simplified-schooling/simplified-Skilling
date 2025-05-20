const httpStatus = require('http-status');
const { LectureVideo } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a lession
 * @param {Object} lectureVideoBody
 * @returns {Promise<LectureVideo>}
 */

const createLectureVideo = async (lectureVideoBody) => {
  return LectureVideo.create(lectureVideoBody);
};

/**
 * Query for lession
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryLectureVideo = async (filter, options) => {
  const lectureVideo = await LectureVideo.paginate(filter, options);
  return lectureVideo;
};

/**
 * Get lession by id
 * @param {ObjectId} id
 * @returns {Promise<LectureVideo>}
 */
const getLectureVideoById = async (id) => {
  return LectureVideo.findById(id);
};

/**
 * Get lession by id
 * @param {ObjectId} lectureVideoId
 * @returns {Promise<LectureVideo>}
 */
const getLectureVideobychapterId = async (chapterId) => {
  return LectureVideo.find({ chapterId });
};

/**
 * Get LectureVideo by filter
 * @param {ObjectId} boardId
 * @param {ObjectId} mediumId
 * @param {ObjectId} classId
 * @param {ObjectId} subjectId
 * @param {ObjectId} bookId
 * @returns {Promise<lesssion>}
 */

const getLectureVideoByFilter = async (boardId, mediumId, classId, subjectId, bookId, chapterId, lessonId, search, options) => {
  const filter = {};

  // If boardId, mediumId, and classId are provided, filter by them
  if (boardId) filter.boardId = boardId;
  if (mediumId) filter.mediumId = mediumId;
  if (classId) filter.classId = classId;
  if (subjectId) filter.subjectId = subjectId;
  if (bookId) filter.bookId = bookId;
  if (chapterId) filter.chapterId = chapterId;
  if (lessonId) filter.lessonId = lessonId;
  // If search is provided, apply global search on `name`
  if (search) {
    filter.lessionName = { $regex: search, $options: 'i' };
  }

  // Fetch data with pagination
  return LectureVideo.paginate(filter, options);
  // return LectureVideo.find({ boardId, mediumId, classId, subjectId, bookId, chapterId }).sort('order');
};

/**
 * Update lession by id
 * @param {ObjectId} lessionId
 * @param {Object} updateBody
 * @returns {Promise<LectureVideo>}
 */
const updateLectureVideoById = async (lectureId, updateBody) => {
  const lectureVideo = await getLectureVideoById(lectureId);
  if (!lectureVideo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'lecture video not found');
  }
  Object.assign(lectureVideo, updateBody);
  await lectureVideo.save();
  return lectureVideo;
};

/**
 * Delete lession by id
 * @param {ObjectId} lectureVideoId
 * @returns {Promise<LectureVideo>}
 */
const deleteLectureVideoById = async (lectureId) => {
  const lectureVideo = await getLectureVideoById(lectureId);
  if (!lectureVideo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'lecture video not found');
  }
  await lectureVideo.remove();
  return lectureVideo;
};

module.exports = {
  createLectureVideo,
  queryLectureVideo,
  getLectureVideoById,
  updateLectureVideoById,
  deleteLectureVideoById,
  getLectureVideobychapterId,
  getLectureVideoByFilter,
};
