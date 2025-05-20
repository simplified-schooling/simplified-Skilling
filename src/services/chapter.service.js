const httpStatus = require('http-status');
const mongoose = require('mongoose');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { Chapter } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a chapter
 * @param {Object} Chapter
 * @returns {Promise<Chapter>}
 */
const createChapter = async (chapter) => {
 
  return Chapter.create(chapter);
};

/**
 * Query for Chapter
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getAllChapter = async (filter, options) => {
  const chapters = await Chapter.paginate(filter, options);
  return chapters;
};

/**
 * Get Chapter by id
 * @param {ObjectId} chapterId
 * @returns {Promise<Chapter>}
 */
const getChapterById = async (chapterId) => {
  return Chapter.findById(chapterId);
};

const getByBookIdChapter = async (bookId) => {
  const result = await Chapter.aggregate([
    {
      $match: {
        bookId: mongoose.Types.ObjectId(bookId),
      },
    },
    {
      $lookup: {
        from: 'multimedias', // The name of your multimedia collection
        localField: '_id', // Use chapter's _id as the local field
        foreignField: 'chapterId', // Matching multimedia's chapterId
        as: 'multimedia',
      },
    },
    {
      $project: {
        chapterName: 1,
        chapterId: 1,
        order: 1,
        thumbnail: 1,
        multimedia: 1,
        name: 1,
      },
    },
    {
      $unwind: '$multimedia', // Unwind the multimedia array
    },
    {
      $group: {
        _id: null,
        multimedias: {
          $push: '$multimedia',
        },
        chapterName: {
          $first: '$chapterName',
        },
        order: {
          $first: '$order',
        },
        thumbnail: {
          $first: '$thumbnail',
        },
      },
    },
  ]);

  return result;
};

/**
 * Get Chapter by id
 * @param {ObjectId} bookId
 * @returns {Promise<Chapter>}
 */
const getChaptersByBookId = async (bookId) => {
  return Chapter.find({ bookId });
};

/**
 * Get Chapter by filter
 * @param {ObjectId} boardId
 * @param {ObjectId} mediumId
 * @param {ObjectId} classId
 * @param {ObjectId} subjectId
 * @param {ObjectId} bookId
 * @returns {Promise<Chapter>}
 */
const getChaptersByFilter = async (boardId, mediumId, classId, subjectId, bookId) => {
  return Chapter.find({ boardId, mediumId, classId, subjectId, bookId });
};

// const getBookByFilter = async (boardId, mediumId, classId, subjectId, bookId, page = 1, limit = 10) => {
//   const skip = (page - 1) * limit;

//   const results = await Chapter.find({ boardId, mediumId, classId, subjectId, bookId })
//     .skip(skip)
//     .limit(limit).sort('order');

//   const totalCount = await Chapter.countDocuments({ boardId, mediumId, classId, subjectId, bookId });

//   return {
//     results,
//     totalPages: Math.ceil(totalCount / limit),
//     currentPage: page,
//     totalCount
//   };
// };
/**
 * Update Chapter by id
 * @param {ObjectId} chapterId
 * @param {Object} updateBody
 * @returns {Promise<Chapter>}
 */
const updateChapterById = async (chapterId, updateBody) => {
  const singleChapter = await getChapterById(chapterId);
  if (!singleChapter) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Chapter not found');
  }
  Object.assign(singleChapter, updateBody);
  await singleChapter.save();
  return singleChapter;
};

// /**
//  * Delete Chapter by id
//  * @param {ObjectId} chapterId
//  * @returns {Promise<Chapter>}
//  */
// const deleteChapterById = async (chapterId) => {
//   const chapter = await getChapterById(chapterId);
//   if (!chapter) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Chapter not found');
//   }
//   const extractFileName = (url) => (url ? url.split('/').pop() : null);
//   const thumbnailKey = extractFileName(chapter.thumbnail);
//   const posterKey = extractFileName(chapter.poster);

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
//   await chapter.remove();
//   return chapter;
// };
/**
 * Delete Chapter by id
 * @param {ObjectId} chapterId
 * @returns {Promise<Chapter>}
 */
const deleteChapterById = async (chapterId) => {
  const chapter = await getChapterById(chapterId);
  if (!chapter) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Chapter not found');
  }

  // Extract file name from URL
  const extractFileName = (url) => (url ? url.split('/').pop() : null);

  // Collect all file keys to delete
  const fileKeys = [];

  // Main thumbnail and poster
  fileKeys.push(extractFileName(chapter.thumbnail));
  fileKeys.push(extractFileName(chapter.poster));

  // Section fields to check
  const sections = [
    'ebook',
    'quickRecap',
    'bookQuestionSolutions',
    'chapterEvaluation',
  ];

  sections.forEach((section) => {
    if (chapter[section]) {
      fileKeys.push(extractFileName(chapter[section].poster));
      fileKeys.push(extractFileName(chapter[section].icon));
    }
  });

  // Function to delete from S3
  const deleteFileFromCDN = async (key) => {
    if (!key) return;
    try {
      const params = {
        Bucket: 'lmscontent',
        Key: key,
      };
      await s3Client.send(new DeleteObjectCommand(params));
    } catch (error) {
      // Optional: log error
      // console.error(`Error deleting ${key}:`, error);
    }
  };

  // Delete all files concurrently
  await Promise.all(fileKeys.map(deleteFileFromCDN));

  // Remove the chapter
  await chapter.remove();
  return chapter;
};

const getChapterListByFilter = async (boardId, mediumId, classId, subjectId, bookId, search, options) => {
  const filter = {};

  // If boardId, mediumId, and classId are provided, filter by them
  if (boardId) filter.boardId = boardId;
  if (mediumId) filter.mediumId = mediumId;
  if (classId) filter.classId = classId;
  if (subjectId) filter.subjectId = subjectId;
  if (bookId) filter.bookId = bookId;

  // If search is provided, apply global search on `name`
  if (search) {
    filter.chapterName = { $regex: search, $options: 'i' };
  }

  // Fetch data with pagination
  return Chapter.paginate(filter, options);
};

module.exports = {
  createChapter,
  getChapterById,
  getAllChapter,
  updateChapterById,
  deleteChapterById,
  getChaptersByBookId,
  getChaptersByFilter,
  getByBookIdChapter,
  getChapterListByFilter,
};
