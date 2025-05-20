const httpStatus = require('http-status');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { Lession } = require('../models');
const ApiError = require('../utils/ApiError');
const { s3Client } = require('../utils/cdn');

/**
 * Create a lession
 * @param {Object} lessionBody
 * @returns {Promise<Lession>}
 */

const createLession = async (lessionBody) => {

  return Lession.create(lessionBody);
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
const queryLessions = async (filter, options) => {
  const lession = await Lession.paginate(filter, options);
  return lession;
};

/**
 * Get lession by id
 * @param {ObjectId} id
 * @returns {Promise<Lession>}
 */
const getLessionById = async (id) => {
  return Lession.findById(id);
};

/**
 * Get lession by id
 * @param {ObjectId} chapterId
 * @returns {Promise<Lession>}
 */
const getLessionbychapterId = async (chapterId) => {
  return Lession.find({ chapterId });
};

/**
 * Get Lession by filter
 * @param {ObjectId} boardId
 * @param {ObjectId} mediumId
 * @param {ObjectId} classId
 * @param {ObjectId} subjectId
 * @param {ObjectId} bookId
 * @returns {Promise<lesssion>}
 */

const getLessionByFilter = async (boardId, mediumId, classId, subjectId, bookId, chapterId) => {
  return Lession.find({ boardId, mediumId, classId, subjectId, bookId, chapterId }).sort('order');
};

/**
 * Update lession by id
 * @param {ObjectId} lessionId
 * @param {Object} updateBody
 * @returns {Promise<Lession>}
 */
const updateLessionById = async (lessionId, updateBody) => {
  const lession = await getLessionById(lessionId);
  if (!lession) {
    throw new ApiError(httpStatus.NOT_FOUND, 'lession not found');
  }
  Object.assign(lession, updateBody);
  await lession.save();
  return lession;
};

// /**
//  * Delete lession by id
//  * @param {ObjectId} lessionId
//  * @returns {Promise<Lession>}
//  */
// const deleteLessionById = async (lessionId) => {
//   const lession = await getLessionById(lessionId);
//   if (!lession) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'lession not found');
//   }
//   // Extract file names from URLs
//   const extractFileName = (url) => (url ? url.split('/').pop() : null);
//   const thumbnailKey = extractFileName(lession.thumbnail);
//   const posterKey = extractFileName(lession.poster);

//   const deleteFileFromCDN = async (key) => {
//     if (!key) return;
//     try {
//       const params = {
//         Bucket: 'lmscontent', // Your bucket name
//         Key: key, // File key (filename in the bucket)
//       };
//       await s3Client.send(new DeleteObjectCommand(params));
//     } catch (error) {
//       // console.error(`Error deleting ${key}:`, error);
//     }
//   };

//   // Delete files from CDN
//   await Promise.all([deleteFileFromCDN(thumbnailKey), deleteFileFromCDN(posterKey)]);
//   await lession.remove();
//   return lession;
// };

/**
 * Delete lesson by id
 * @param {ObjectId} lessonId
 * @returns {Promise<Lesson>}
 */
const deleteLessionById = async (lessonId) => {
  const lesson = await getLessionById(lessonId);
  if (!lesson) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lesson not found');
  }

  // Extract file name from URL
  const extractFileName = (url) => (url ? url.split('/').pop() : null);

  // Collect all file keys to delete
  const fileKeys = [];

  // Main thumbnail and poster
  fileKeys.push(extractFileName(lesson.thumbnail));
  fileKeys.push(extractFileName(lesson.poster));

  // Section fields to check
  const sections = [
    'videoLectures',
    //'multimediaVideos',
    'selfEvaluation',
    'practiceTest',
    'caseStudy',
    'quickRecap',
    'questionAndAnswers',
  ];

  sections.forEach((section) => {
    if (lesson[section]) {
      fileKeys.push(extractFileName(lesson[section].poster));
      fileKeys.push(extractFileName(lesson[section].icon));
    }
  });

  // Function to delete from S3
  const deleteFileFromCDN = async (key) => {
    if (!key) return;
    try {
      const params = {
        Bucket: 'lmscontent', // your S3 bucket name
        Key: key,
      };
      await s3Client.send(new DeleteObjectCommand(params));
    } catch (error) {
      // Optional: log error but don't stop execution
      // console.error(`Error deleting ${key}:`, error);
    }
  };

  // Delete all files concurrently
  await Promise.all(fileKeys.map(deleteFileFromCDN));

  // Remove the lesson
  await lesson.remove();
  return lesson;
};

const getLessonListByFilter = async (boardId, mediumId, classId, subjectId, bookId, chapterId, search, options) => {
  const filter = {};

  // If boardId, mediumId, and classId are provided, filter by them
  if (boardId) filter.boardId = boardId;
  if (mediumId) filter.mediumId = mediumId;
  if (classId) filter.classId = classId;
  if (subjectId) filter.subjectId = subjectId;
  if (bookId) filter.bookId = bookId;
  if (chapterId) filter.chapterId = chapterId;

  // If search is provided, apply global search on `name`
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }

  // Fetch data with pagination
  return Lession.paginate(filter, options);
};

module.exports = {
  createLession,
  queryLessions,
  getLessionById,
  updateLessionById,
  deleteLessionById,
  getLessionbychapterId,
  getLessionByFilter,
  getLessonListByFilter,
};
