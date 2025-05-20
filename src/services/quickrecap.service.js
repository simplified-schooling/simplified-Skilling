const httpStatus = require('http-status');
const { Quickrecap } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a quickrecap
 * @param {Object} quickRecapBody
 * @returns {Promise<Quickrecap>}
 */

const createQuickRecap = async (quickRecapBody) => {
  return Quickrecap.create(quickRecapBody);
};

/**
 * Query for quickrecap
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryQuickRecap = async (filter, options) => {
  const quickrecap = await Quickrecap.paginate(filter, options);
  return quickrecap;
};

/**
 * Get quickRecap by id
 * @param {ObjectId} id
 * @returns {Promise<Quickrecap>}
 */
const getQuickRecapById = async (id) => {
  return Quickrecap.findById(id);
};

/**
 * Get quickRecap by id
 * @param {ObjectId} chapterId
 * @returns {Promise<Quickrecap>}
 */
const getQuickRecapByChapterId = async (chapterId) => {
  return Quickrecap.findOne({ chapterId });
};

/**
 * Get QuickRecap by filter
 * @param {ObjectId} boardId
 * @param {ObjectId} mediumId
 * @param {ObjectId} classId
 * @param {ObjectId} subjectId
 * @param {ObjectId} bookId
 * @returns {Promise<Quickrecap>}
 */

const getQuickRecapByFilter = async (
  boardId,
  mediumId,
  classId,
  subjectId,
  bookId,
  chapterId,
  lessonId,
  search,
  options
) => {
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
    filter.chapterName = { $regex: search, $options: 'i' };
  }

  // Fetch data with pagination
  return Quickrecap.paginate(filter, options);
  // return Quickrecap.find({ boardId, mediumId, classId, subjectId, bookId, chapterId });
};

/**
 * Update quickRecap by id
 * @param {ObjectId} quickRecapId
 * @param {Object} updateBody
 * @returns {Promise<Quickrecap>}
 */
const updateQuickRecapById = async (quickRecapId, updateBody) => {
  const quickRecap = await getQuickRecapById(quickRecapId);
  if (!quickRecap) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Quick recap not found');
  }
  Object.assign(quickRecap, updateBody);
  await quickRecap.save();
  return quickRecap;
};

/**
 * Delete lession by id
 * @param {ObjectId} quickRecapId
 * @returns {Promise<Quickrecap>}
 */
const deleteQuickRecapById = async (quickRecapId) => {
  const quickRecap = await getQuickRecapById(quickRecapId);
  if (!quickRecap) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Quick recap not found');
  }
  await quickRecap.remove();
  return quickRecap;
};

module.exports = {
  createQuickRecap,
  queryQuickRecap,
  getQuickRecapById,
  updateQuickRecapById,
  deleteQuickRecapById,
  getQuickRecapByFilter,
  getQuickRecapByChapterId,
};
