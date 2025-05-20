const httpStatus = require('http-status');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { Subject } = require('../models');
const ApiError = require('../utils/ApiError');
const { s3Client } = require('../utils/cdn');

/**
 * Create a subject
 * @param {Object} subjectBody
 * @returns {Promise<Subject>}
 */
const createSubject = async (subjectBody) => {
  return Subject.create(subjectBody);
};

/**
 * Query for subject
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySubject = async (filter, options) => {
  const subject = await Subject.paginate(filter, options);
  return subject;
};

/**
 * Get subject by id
 * @param {ObjectId} id
 * @returns {Promise<Subject>}
 */
const getSubjectById = async (id) => {
  return Subject.findById(id);
};
/**
 * Get subject by classId
 * @param {ObjectId} classId
 * @returns {Promise<Subject>}
 */
const getSubjectByClassId = async (classId) => {
  return Subject.find({ classId });
};
/**
 * Get subject
 * @returns {Promise<Subject>}
 */
const getSubjectOfClass = async () => {
  return Subject.find().populate('Class');
};

/**
 * Get book by filter
 * @param {ObjectId} boardId
 * @param {ObjectId} mediumId
 * @param {ObjectId} classId
 * @returns {Promise<Book>}
 */

const getSubjectByFilter = async (boardId, mediumId, classId) => {
  return Subject.find({ boardId, mediumId, classId });
};
// const getSubjectByFilter = async (boardId, mediumId, classId, search, options) => {
//   const filter = {};

//   // If boardId, mediumId, and classId are provided, filter by them
//   if (boardId) filter.boardId = boardId;
//   if (mediumId) filter.mediumId = mediumId;
//   if (classId) filter.classId = classId;

//   // If search is provided, apply global search on `name`
//   if (search) {
//     filter.name = { $regex: search, $options: 'i' };
//   }

//   // Fetch data with pagination
//   return Subject.paginate(filter, options);
// };
const getUbjectByFilter = async (boardId, mediumId, classId, search, options = {}) => {
  const filter = {};

  // If boardId, mediumId, and classId are provided, filter by them
  if (boardId) filter.boardId = boardId;
  if (mediumId) filter.mediumId = mediumId;
  if (classId) filter.classId = classId;

  // If search is provided, apply global search on `name`
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }

  // Default options if not provided
  const paginationOptions = {
    limit: options.limit || 10,
    page: options.page || 1,
    sortBy: options.sortBy || 'name', // Default sorting by name
  };

  return Subject.paginate(filter, paginationOptions);
};
// const getSubjectByFilter = async (boardId, mediumId, classId, options) => {
//   const filter = {
//     boardId,
//     mediumId,
//     classId,
//   };

//   // Use pagination function to get data
//   const subjects = await Subject.paginate(filter, options);
// console.log(subjects);
//   return subjects;
// };
// const getSubjectByFilter = async (boardId, mediumId, classId, page = 1, limit = 10) => {
//   const skip = (page - 1) * limit;

//   const results = await Subject.find({ boardId, mediumId, classId })
//     .skip(skip)
//     .limit(limit);

//   const totalCount = await Subject.countDocuments({ boardId, mediumId, classId });

//   return {
//     results,
//     totalPages: Math.ceil(totalCount / limit),
//     currentPage: page,
//     totalCount
//   };
// };
/**
 * Update subject by id
 * @param {ObjectId} subjectId
 * @param {Object} updateBody
 * @returns {Promise<Board>}
 */
const updatSubjectById = async (subjectId, updateBody) => {
  const subject = await getSubjectById(subjectId);
  if (!subject) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subject not found');
  }
  Object.assign(subject, updateBody);
  await subject.save();
  return subject;
};

/**
 * Delete board by id
 * @param {ObjectId} subjectId
 * @returns {Promise<Subject>}
 */
const deleteSubjectById = async (subjectId) => {
  const subjectData = await getSubjectById(subjectId);
  if (!subjectData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subject not found');
  }
  // Extract file names from URLs
  const extractFileName = (url) => (url ? url.split('/').pop() : null);
  const thumbnailKey = extractFileName(subjectData.thumbnail);
  const posterKey = extractFileName(subjectData.poster);

  const deleteFileFromCDN = async (key) => {
    if (!key) return;
    try {
      const params = {
        Bucket: 'lmscontent', // Your bucket name
        Key: key, // File key (filename in the bucket)
      };
      await s3Client.send(new DeleteObjectCommand(params));
    } catch (error) {
      // console.error(`Error deleting ${key}:`, error);
    }
  };

  // Delete files from CDN
  await Promise.all([deleteFileFromCDN(thumbnailKey), deleteFileFromCDN(posterKey)]);
  await subjectData.remove();
  return subjectData;
};

module.exports = {
  createSubject,
  querySubject,
  getSubjectById,
  updatSubjectById,
  deleteSubjectById,
  getSubjectByClassId,
  getSubjectOfClass,
  getSubjectByFilter,
  getUbjectByFilter,
};
