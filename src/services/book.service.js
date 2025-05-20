const httpStatus = require('http-status');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { Book, Chapter } = require('../models');
const ApiError = require('../utils/ApiError');
const { s3Client } = require('../utils/cdn');

/**
 * Create a book
 * @param {Object} bookBody
 * @returns {Promise<Book>}
 */
const createBook = async (bookBody) => {
  return Book.create(bookBody);
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
const queryBook = async (filter, options) => {
  const book = await Book.paginate(filter, options);
  return book;
};

/**
 * Get book by filter
 * @param {ObjectId} boardId
 * @param {ObjectId} mediumId
 * @param {ObjectId} classId
 * @param {ObjectId} subjectId
 * @returns {Promise<Book>}
 */

const getBookByFilter = async (boardId, mediumId, classId, subjectId) => {
  return Book.find({ boardId, mediumId, classId, subjectId });
};

// const getBookByFilter = async (boardId, mediumId, classId, subjectId, page = 1, limit = 10) => {
//   const skip = (page - 1) * limit;

//   const results = await Book.find({ boardId, mediumId, classId, subjectId })
//     .skip(skip)
//     .limit(limit);

//   const totalCount = await Book.countDocuments({ boardId, mediumId, classId, subjectId });

//   return {
//     results,
//     totalPages: Math.ceil(totalCount / limit),
//     currentPage: page,
//     totalCount
//   };
// };

const getBookById = async (id) => {
  return Book.findById(id);
};

/**
 * Get book by subjectId
 * @param {ObjectId} subjectId
 * @returns {Promise<Book>}
 */

const getBookBysubjectId = async (subjectId) => {
  return Book.find({ subjectId });
};

const getBookChapters = async (subjectId) => {
  const books = await getBookBysubjectId(subjectId);
  const formattedData = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const book of books) {
    // eslint-disable-next-line no-await-in-loop
    const chapters = await Chapter.find({ bookId: book._id });
    // console.log(chapters);
    const bookData = {
      bookName: book.name,
      bookId: book._id,
      chapters: chapters.map((chapter) => chapter),
    };
    formattedData.push(bookData);
    return formattedData;
  }
};
/**
 * Update book by id
 * @param {ObjectId} bookId
 * @param {Object} updateBody
 * @returns {Promise<Book>}
 */
const updatBookById = async (bookId, updateBody) => {
  const book = await getBookById(bookId);
  if (!book) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
  }
  Object.assign(book, updateBody);
  await book.save();
  return book;
};

/**
 * Delete book by id
 * @param {ObjectId} booktId
 * @returns {Promise<Book>}
 */
const deleteBookById = async (bookId) => {
  const book = await getBookById(bookId);
  if (!book) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subject not found');
  }
  // Extract file names from URLs
  const extractFileName = (url) => (url ? url.split('/').pop() : null);
  const thumbnailKey = extractFileName(book.thumbnail);
  const posterKey = extractFileName(book.poster);

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
  await book.remove();
  return book;
};

const getBooksByFilter = async (boardId, mediumId, classId, subjectId, search, options) => {
  const filter = {};

  // If boardId, mediumId, and classId are provided, filter by them
  if (boardId) filter.boardId = boardId;
  if (mediumId) filter.mediumId = mediumId;
  if (classId) filter.classId = classId;
  if (subjectId) filter.subjectId = subjectId;

  // If search is provided, apply global search on `name`
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }

  // Fetch data with pagination
  return Book.paginate(filter, options);
};

module.exports = {
  createBook,
  queryBook,
  getBookById,
  updatBookById,
  deleteBookById,
  getBookByFilter,
  getBookBysubjectId,
  getBookChapters,
  getBooksByFilter,
};
