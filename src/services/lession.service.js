const httpStatus = require('http-status');
//const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { Lession } = require('../models');
const ApiError = require('../utils/ApiError');
const { DeleteObjectCommand, S3Client } = require('@aws-sdk/client-s3');


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
//         Bucket: 'simplifiedskilling', // Your bucket name
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
const s3Client = new S3Client({
  endpoint: 'https://blr1.digitaloceanspaces.com',
  region: 'blr1',
  credentials: {
    accessKeyId: 'DO801BZNF48AH37WUGWK',
    secretAccessKey: 'kp374u2BqIgiKMIUtu5n6tva57++whRRs9sGoI43YEc',
  },
});

const deleteLessionById = async (lessonId) => {
  const lesson = await getLessionById(lessonId);
  if (!lesson) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lesson not found');
  }

  // ✅ Extract file key after ".com/"
  const extractFileKey = (url) => {
    if (!url) return null;
    const match = url.match(/\.com\/(.+)$/);
    return match ? decodeURIComponent(match[1]) : null;
  };

  // ✅ Gather all possible file keys
  // const fileKeys = [
  //   extractFileKey(lesson.thumbnail),
  //   extractFileKey(lesson.poster),
  //   ...[
  //     'videoLectures',
  //     'selfEvaluation',
  //     'practiceTest',
  //     'caseStudy',
  //     'quickRecap',
  //     'questionAndAnswers',
  //   ].flatMap((section) =>
  //     lesson[section]
  //       ? [
  //           extractFileKey(lesson[section].poster),
  //           extractFileKey(lesson[section].icon),
  //         ]
  //       : []
  //   ),
  // ];
const fileKeys = [
  extractFileKey(lesson.thumbnail),
  extractFileKey(lesson.poster),
  ...[
    'videoLectures',
    'selfEvaluation',
    'practiceTest',
    'caseStudy',
    'quickRecap',
    'questionAndAnswers',
  ].flatMap((section) =>
    lesson[section]
      ? [
          extractFileKey(lesson[section].poster),
          extractFileKey(lesson[section].icon),
        ]
      : []
  ),
].filter(Boolean);

  // ✅ Delete files from CDN
  const deleteFileFromCDN = async (key) => {
    if (!key) return;
    try {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: 'simplifiedskilling',
          Key: key,
        })
      );
      console.log(`✅ Deleted: ${key}`);
    } catch (error) {
      console.error(`❌ Error deleting ${key}:`, error.message);
    }
  };

  // await Promise.all(fileKeys.map(deleteFileFromCDN));
for (const key of fileKeys.filter(Boolean)) {
  await deleteFileFromCDN(key);
}
  // ✅ Remove lesson from DB
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
