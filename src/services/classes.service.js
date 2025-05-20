const httpStatus = require('http-status');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { Classes } = require('../models');
const ApiError = require('../utils/ApiError');
const { s3Client } = require('../utils/cdn');

/**
 * Create a Classes
 * @param {Object} classBody
 * @returns {Promise<Classes>}
 */
const createClasses = async (classBody) => {
  return Classes.create(classBody);
};

/**
 * Query for Classes
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getAllClasses = async (filter, options) => {
  const classes = await Classes.paginate(filter, options);
  return classes;
};

/**
 * Get Classes by classId
 * @param {ObjectId} classId
 * @returns {Promise<Classes>}
 */
const getClassById = async (classId) => {
  return Classes.findById(classId);
};

/**
 * Get Classes by classId
 * @param {ObjectId} mediumId
 * @returns {Promise<Classes>}
 */
const getClassesByMediumId = async (mediumId) => {
  return Classes.find({ mediumId });
};

/**
 * Update Classes by classId
 * @param {ObjectId} classId
 * @param {Object} updateBody
 * @returns {Promise<Classes>}
 */
const updateClassById = async (classId, updateBody) => {
  const singleClass = await getClassById(classId);
  if (!singleClass) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Class not found');
  }
  Object.assign(singleClass, updateBody);
  await singleClass.save();
  return singleClass;
};

/**
 * Delete Classes by classId
 * @param {ObjectId} classId
 * @returns {Promise<Classes>}
 */
// const deleteClassById = async (classId) => {
//   const user = await getClassById(classId);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Class not found');
//   }
//   await user.remove();
//   return user;
// };
const deleteClassById = async (classId) => {
  const classData = await Classes.findById(classId);
  if (!classData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Class not found');
  }

  // Extract file names from URLs
  const extractFileName = (url) => (url ? url.split('/').pop() : null);
  const thumbnailKey = extractFileName(classData.thumbnail);
  const posterKey = extractFileName(classData.poster);

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

  // Delete class document from MongoDB
  await classData.remove();
  return classData;
};
module.exports = {
  createClasses,
  getAllClasses,
  getClassById,
  updateClassById,
  deleteClassById,
  getClassesByMediumId,
};
