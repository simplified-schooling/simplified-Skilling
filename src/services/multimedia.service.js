const httpStatus = require('http-status');
const mongoose = require('mongoose');
const { Multimedia } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Multimedia
 * @param {Object} multimediaBody
 * @returns {Promise<Multimedia>}
 */

const createMultimedia = async (multimediaBody) => {
  return Multimedia.create(multimediaBody);
};

/**
 * Query for Multimedia
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryMultimedia = async (filter, options) => {
  const multimedia = await Multimedia.paginate(filter, options);
  return multimedia;
};

/**
 * Get multimedia by id
 * @param {ObjectId} id
 * @returns {Promise<Multimedia>}
 */
const getMultimediaById = async (id) => {
  return Multimedia.findById(id);
};

/**
 * Get Multimedia by chapterId
 * @param {ObjectId} chapterId
 * @returns {Promise<Multimedia>}
 */
const getMultimediaByChaperId = async (chapterId) => {
  return Multimedia.find({ chapterId });
};

/**
 * Get multimedia by multimedia Type
 * @param {ObjectId} imultimediaTyped
 * @returns {Promise<Multimedia>}
 */
// const getMultimediaByType = async (multimediaType) => {
//   return Multimedia.find({ multimediaType });
// };
// const getMultimediaByType = async (multimediaType, options) => {
//   // Define the filter object
//   const filter = { multimediaType };

//   // Call the paginate method with the filter and options
//   const multimedia = await Multimedia.paginate(filter, options);

//   return multimedia;
// };

// const getMultimediaByType = async (multimediaType, search, options) => {
//   // Create filter object
//   let filter = { multimediaType };

//   // If search is provided, apply a case-insensitive global search on `lessionName`
//   if (search) {
//     filter.lessionName = { $regex: search, $options: 'i' };
//   }

//   // Fetch data with pagination
//   const multimedia = await Multimedia.paginate(filter, options);

//   return multimedia;
// };
const getMultimediaByType = async (multimediaType, search, options) => {
  const filter = {};

  // If multimediaType is provided, filter by it
  if (multimediaType) {
    filter.multimediaType = multimediaType;
  }

  // If search is provided, apply case-insensitive global search on `lessionName`
  if (search) {
    filter.lessionName = { $regex: search, $options: 'i' };
  }

  // Fetch data with pagination
  const multimedia = await Multimedia.paginate(filter, options);

  return multimedia;
};
// const getMultimediaByType = async (filter, options) => {
//   return Multimedia.paginate(filter, options);
// };

/**
 * Get mutimedia by Filter
 * @param {ObjectId} boardId
 *  @param {ObjectId} mediumId
 *  @param {ObjectId} classId
 *  @param {ObjectId} subjectId
 *  @param {ObjectId} bookId
 *  @param {ObjectId} chapterId
 * @returns {Promise<Multimedia>}
 */
const getMultimediaByFilter = async (
  boardId,
  mediumId,
  classId,
  subjectId,
  bookId,
  chapterId,
  multimediaType,
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
  if (multimediaType) filter.multimediaType = multimediaType;
  // If search is provided, apply global search on `name`
  if (search) {
    filter.lessionName = { $regex: search, $options: 'i' };
  }

  // Fetch data with pagination
  return Multimedia.paginate(filter, options);
  // return Multimedia.find({ boardId, mediumId, classId, subjectId, bookId, chapterId }).sort('order');
};
/**
 * Get mutimedia by Filter
 * @param {ObjectId} boardId
 *  @param {ObjectId} mediumId
 *  @param {ObjectId} classId
 *  @param {ObjectId} subjectId
 *  @param {ObjectId} bookId
 *  @param {ObjectId} chapterId
 *  @param {String} multimediaType
 * @returns {Promise<Multimedia>}
 */
const getMultimediaByTypeFilter = async (boardId, mediumId, classId, subjectId, bookId, chapterId, multimediaType) => {
  return Multimedia.find({ boardId, mediumId, classId, subjectId, bookId, chapterId, multimediaType }).sort('order');
};

/**
 * Update Multimedia by id
 * @param {ObjectId} multimediaId
 * @param {Object} updateBody
 * @returns {Promise<Multimedia>}
 */
const updateMultimediaById = async (multimediaId, updateBody) => {
  const multimedia = await getMultimediaById(multimediaId);
  if (!multimedia) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Multimedia not found');
  }
  Object.assign(multimedia, updateBody);
  await multimedia.save();
  return multimedia;
};

/**
 * Delete Multimedia by id
 * @param {ObjectId} multimediaId
 * @returns {Promise<Multimedia>}
 */
const deleteMultimediaById = async (multimediaId) => {
  const multimedia = await getMultimediaById(multimediaId);
  if (!multimedia) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Multimedia not found');
  }
  await multimedia.remove();
  return multimedia;
};
/**
 * get Multimedia by bookId
 * @param {ObjectId} bookId
 * @param {String} multimediaType
 * @returns {Promise<Multimedia>}
 */

const getMultimediaByBookId = async (bookId, multimediaType) => {
  const chaptersData = await Multimedia.aggregate([
    { $match: { bookId: mongoose.Types.ObjectId(bookId), multimediaType } },
    {
      $group: {
        _id: '$chapterId',
        multimediaData: {
          $push: {
            _id: '$_id',
            lessionName: '$lessionName',
            multimediaType: '$multimediaType',
            boardId: '$boardId',
            mediumId: '$mediumId',
            classId: '$classId',
            subjectId: '$subjectId',
            bookId: '$bookId',
            chapterId: '$chapterId',
            order: '$order',
            path: '$path',
            videoType: '$videoType',
            icon1: '$icon1',
            icon2: '$icon2',
          },
        },
      },
    },
    { $sort: { 'multimediaData.order': -1 } }, // Sort multimediaData array by order
    {
      $lookup: {
        from: 'chapters', // Assuming your Chapter collection is named 'chapters'
        localField: '_id',
        foreignField: '_id',
        as: 'chapterData',
      },
    },
    {
      $unwind: '$chapterData',
    },
    { $sort: { 'chapterData.order': 1 } },
    {
      $addFields: {
        'broadcasts.chapterName': '$chapterData.chapterName',
      },
    },
  ]);

  return chaptersData;
};

module.exports = {
  createMultimedia,
  queryMultimedia,
  getMultimediaByFilter,
  updateMultimediaById,
  deleteMultimediaById,
  getMultimediaById,
  getMultimediaByType,
  getMultimediaByChaperId,
  getMultimediaByBookId,
  getMultimediaByTypeFilter,
};
