const httpStatus = require('http-status');
const mongoose = require('mongoose');
const { Homework } = require('../models');
const ApiError = require('../utils/ApiError');


const uploadBulkHomework = async (homeworkData) => {

  if (!homeworkData || homeworkData.length === 0) {
    return { savedHomework: [], duplicates: [] };
  }

  // Extract question names for duplicate checking
  const homeworkQuestions = homeworkData.map((hw) => hw.Question.toLowerCase());

  // Step 1: Check for duplicates in the database
  const existingHomework = await Homework.find({
    Question: { $in: homeworkQuestions },
    boardId: homeworkData[0]?.boardId,
    questionLevel: homeworkData[0]?.questionLevel,
    answerType: homeworkData[0]?.answerType,
    mediumId: homeworkData[0]?.mediumId,
    classId: homeworkData[0]?.classId,
    bookId: homeworkData[0]?.bookId,
    subjectId: homeworkData[0]?.subjectId,
    chapterId: homeworkData[0]?.chapterId,
    lessonId: homeworkData[0]?.lessonId,
  });

  const existingHomeworkQuestions = new Set(existingHomework.map((hw) => hw.Question.toLowerCase()));

  // Step 2: Filter out new homework that are not duplicates
  const newHomework = homeworkData.filter((hw) => !existingHomeworkQuestions.has(hw.Question.toLowerCase()));

  // Step 3: Prepare the list of duplicate homework
  const duplicates = existingHomework.map((hw) => ({
    Question: hw.Question,
    answer: hw.answer,
    answerType: hw.answerType,
    boardId: hw.boardId,
    mediumId: hw.mediumId,
    classId: hw.classId,
    bookId: hw.bookId,
    subjectId: hw.subjectId,
    chapterId: hw.chapterId,
    lessonId: hw.lessonId,
  }));

  // Step 4: Insert only the new homework
  let savedHomework = [];
  if (newHomework.length > 0) {
    savedHomework = await Homework.insertMany(newHomework);
  }

  return { savedHomework, duplicates };
};

/**
 * Create a Homework
 * @param {Object} HomeworkBody
 * @returns {Promise<Homework>}
 */
const createHomework = async (HomeworkBody) => {
  return Homework.create(HomeworkBody);
};

/**
 * Homework for board
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryHomework = async (filter, options) => {
  const getallHomework = await Homework.paginate(filter, options);
  return getallHomework;
};

/**
 * Get homework by id
 * @param {ObjectId} id
 * @returns {Promise<Homework>}
 */
const getHomeworkById = async (id) => {
  return Homework.findById(id);
};

/**
 * Get homework by filter
 * @param {ObjectId} boardId
 * @param {ObjectId} mediumId
 * @param {ObjectId} bookId
 * @param {ObjectId} chapterId
 * @param {ObjectId} subjectId
 * @param {ObjectId} classId
 * @returns {Promise<Homework>}
 */
const getHomeworkByFilterId = async (boardId, mediumId, classId, subjectId, bookId, chapterId, lessonId, search, options) => {
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
    filter.Question = { $regex: search, $options: 'i' };
  }

  // Fetch data with pagination
  return Homework.paginate(filter, options);
  // return Homework.find({ boardId, mediumId, classId, bookId, subjectId, chapterId });
};

const answerTypeWiseByChapterId = async (chapterId) => {
  // Use the $group operator to group the documents by answerType and create an array of objects
  const data = await Homework.aggregate([
    {
      $match: { chapterId: mongoose.Types.ObjectId(chapterId) },
    },
    {
      $group: {
        _id: '$answerType',
        data: { $push: '$$ROOT' },
      },
    },
  ]);
  // Organize the result into an object with answerType as keys
  const result = {};
  data.forEach((item) => {
    result[item._id] = item.data;
  });
  return result;
};

/**
 * Update homework by id
 * @param {ObjectId} homeworkId
 * @param {Object} updateBody
 * @returns {Promise<Homework>}
 */
const updateHomeworkById = async (homeworkId, updateBody) => {
  const updateHomework = await getHomeworkById(homeworkId);
  if (!updateHomework) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Homework not found');
  }
  Object.assign(updateHomework, updateBody);
  await updateHomework.save();
  return updateHomework;
};

/**
 * Delete Homework by id
 * @param {ObjectId} HomeworkId
 * @returns {Promise<Homework>}
 */
const deleteHomeworkById = async (HomeworkId) => {
  const deleteHomework = await getHomeworkById(HomeworkId);
  if (!deleteHomework) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Homework not found');
  }
  await deleteHomework.remove();
  return deleteHomework;
};
/**
 * Get quiz by quizName and other identifying fields
 * @param {Object} quizData - Quiz data containing quizName and identifiers
 * @returns {Promise<Quize|null>}
 */

const checkQuestion = async (Question, answerType, questionLevel, boardId, mediumId, classId, bookId, subjectId, chapterId, lessonId ) => {
  
  return Homework.findOne({
    Question: Question, // Now this will work with the decoded question
    answerType: answerType, 
    questionLevel: questionLevel, 
    boardId: boardId, 
    mediumId: mediumId, 
    classId: classId, 
    bookId: bookId, 
    subjectId: subjectId, 
    chapterId: chapterId, 
    lessonId: lessonId
  });
};


// const getHomeworkSummaryService = async (filterData) => {
//   const { boardId, mediumId, classId, bookId, subjectId, chapterId, lessonId } = filterData;

//   const filter = { boardId, mediumId, classId, bookId, subjectId, chapterId, lessonId };
//   Object.keys(filter).forEach(key => filter[key] === undefined && delete filter[key]);

//   // Define all possible answer types and question levels
//   //const answerTypes = ['Very Short Answer', 'Short Answer', 'Long Answer'];
//   const answerTypes = ['Very Short Answer', 'Short Answer', 'Long Answer'];
//   const questionLevels = [1, 2, 3, 4];

//   // Fetch all matching homework entries
//   const homeworks = await Homework.find(filter);

//   // Calculate total questions
//   const totalQuestions = homeworks.length;

//   // Group data by answerType and count per questionLevel
//   const groupedData = {};
//   answerTypes.forEach(answerType => {
//     groupedData[answerType] = { total: 0, questionLevels: {} };
//     questionLevels.forEach(level => {
//       groupedData[answerType].questionLevels[level] = 0;
//     });
//   });

//   homeworks.forEach(({ answerType, questionLevel }) => {
//     if (groupedData[answerType]) {
//       groupedData[answerType].questionLevels[questionLevel]++;
//       groupedData[answerType].total++;
//     }
//   });

//   // Convert groupedData object to array format
//   const formattedGroupedData = answerTypes.map(answerType => ({
//     _id: answerType,
//     total: groupedData[answerType].total,
//     questionLevels: questionLevels.map(level => ({
//       level,
//       count: groupedData[answerType].questionLevels[level]
//     }))
//   }));

//   return {
//     totalQuestions,
//     groupedData: formattedGroupedData
//   };
// };



const getHomeworkSummaryService = async (filterData) => {
  const { boardId, mediumId, classId, bookId, subjectId, chapterId, lessonId } = filterData;

  const filter = { boardId, mediumId, classId, bookId, subjectId, chapterId, lessonId };
  Object.keys(filter).forEach(key => filter[key] === undefined && delete filter[key]);

  // Define numeric answerType values and their labels
  const answerTypeMap = {
    1: 'Very Short Answer',
    2: 'Short Answer',
    3: 'Long Answer'
  };

  const answerTypes = [1, 2, 3];  // Numeric values
  const questionLevels = [1, 2, 3, 4];

  // Fetch all matching homework entries
  const homeworks = await Homework.find(filter);

  // Calculate total questions
  const totalQuestions = homeworks.length;

  // Initialize grouped data structure
  const groupedData = {};
  answerTypes.forEach(type => {
    groupedData[type] = { total: 0, questionLevels: {} };
    questionLevels.forEach(level => {
      groupedData[type].questionLevels[level] = 0;
    });
  });

  // Count occurrences
  homeworks.forEach(({ answerType, questionLevel }) => {
    if (groupedData[answerType]) {
      groupedData[answerType].questionLevels[questionLevel] = 
        (groupedData[answerType].questionLevels[questionLevel] || 0) + 1;
      groupedData[answerType].total++;
    }
  });

  // Convert groupedData object to array format
  const formattedGroupedData = answerTypes.map(type => ({
    _id: answerTypeMap[type],
    total: groupedData[type].total,
    questionLevels: questionLevels.map(level => ({
      level,
      count: groupedData[type].questionLevels[level] || 0
    }))
  }));

  return {
    totalQuestions,
    groupedData: formattedGroupedData
  };
};

module.exports = {
  createHomework,
  queryHomework,
  getHomeworkByFilterId,
  getHomeworkById,
  answerTypeWiseByChapterId,
  updateHomeworkById,
  deleteHomeworkById,
  uploadBulkHomework,
  checkQuestion,
  getHomeworkSummaryService,
};
