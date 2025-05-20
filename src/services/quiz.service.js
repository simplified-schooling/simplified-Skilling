const httpStatus = require('http-status');
const { Quize, Subject } = require('../models');
const ApiError = require('../utils/ApiError');

// /**
//  * Bulk Upload Quizzes
//  * @param {Array} quizzes - Array of quiz objects
//  * @returns {Promise<Array>}
//  */
// const uploadBulkQuizzes = async (quizzes) => {
//   if (!quizzes || quizzes.length === 0) {
//     return { savedQuizzes: [], duplicates: [] }; // Ensure a valid return object
//   }

//   const quizNames = quizzes.map((quiz) => quiz.quizName);

//   // Find existing quizzes with the same quizName
//   const existingQuizzes = await Quize.find({ quizName: { $in: quizNames } });
//   const existingQuizNames = new Set(existingQuizzes.map((quiz) => quiz.quizName));

//   // Separate duplicates and new quizzes
//   const newQuizzes = quizzes.filter((quiz) => !existingQuizNames.has(quiz.quizName));
//   const duplicates = existingQuizzes;

//   // Insert only non-duplicate quizzes
//   let savedQuizzes = [];
//   if (newQuizzes.length > 0) {
//     savedQuizzes = await Quize.insertMany(newQuizzes);
//   }

//   return { savedQuizzes, duplicates };
// };

// /**
//  * Bulk Upload Quizzes
//  * @param {Array} quizzes - Array of quiz objects
//  * @returns {Promise<Object>}
//  */
// const uploadBulkQuizzes = async (quizzes) => {
//   if (!quizzes || quizzes.length === 0) {
//     return { savedQuizzes: [], duplicates: [] };
//   }
//   console.log(quizzes);
//   // Extract normalized question names
//   const normalizedQuestions = quizzes.map((quiz) => quiz.quizName);
// //console.log(normalizedQuestions);
//   // Step 1: Check for duplicates in the database
//   const existingQuizzes = await Quize.find({
//     quizName: { $in: normalizedQuestions },
//     boardId: quizzes[0].boardId, // Assuming all have same boardId
//     mediumId: quizzes[0].mediumId,
//     classId: quizzes[0].classId,
//     bookId: quizzes[0].bookId,
//     subjectId: quizzes[0].subjectId,
//     chapterId: quizzes[0].chapterId,
//     lectureVideoId: quizzes[0].lectureVideoId,
//   });

//   const existingQuizNames = new Set(existingQuizzes.map((quiz) => quiz.normalizedQuizName));

//   // Step 2: Separate new and duplicate quizzes
//   const newQuizzes = quizzes.filter((quiz) => !existingQuizNames.has(quiz.normalizedQuizName));
//   const duplicates = existingQuizzes.map((quiz) => ({
//     quizName: quiz.quizName,
//     boardId: quiz.boardId,
//     mediumId: quiz.mediumId,
//     classId: quiz.classId,
//     bookId: quiz.bookId,
//     subjectId: quiz.subjectId,
//     chapterId: quiz.chapterId,
//     lectureVideoId: quiz.lectureVideoId,
//   }));

//   // Step 3: Insert only non-duplicate quizzes
//   let savedQuizzes = [];
//   if (newQuizzes.length > 0) {
//     savedQuizzes = await Quize.insertMany(newQuizzes);
//   }

//   return { savedQuizzes, duplicates };
// };

/**
 * Bulk Upload Quizzes
 * @param {Array} quizzes - Array of quiz objects
 * @returns {Promise<Object>}
 */

// const uploadBulkQuizzes = async (quizzes) => {
//   if (!quizzes || quizzes.length === 0) {
//     return { savedQuizzes: [], duplicates: [] };
//   }

//   // Extract quiz names from input data
//   const quizNames = quizzes.map((quiz) => quiz.quizName);

//   // Step 1: Check for duplicates in the database
//   const existingQuizzes = await Quize.find({
//     quizName: { $in: quizNames },
//     boardId: quizzes[0].boardId, // Assuming all quizzes have the same boardId
//     mediumId: quizzes[0].mediumId,
//     classId: quizzes[0].classId,
//     bookId: quizzes[0].bookId,
//     subjectId: quizzes[0].subjectId,
//     chapterId: quizzes[0].chapterId,
//     lectureVideoId: quizzes[0].lectureVideoId,
//   });

//   // Step 2: Store existing quiz names in a Set for fast lookup
//   const existingQuizNames = new Set(existingQuizzes.map((quiz) => quiz.quizName));

//   // Step 3: Filter out new quizzes that are not duplicates
//   const newQuizzes = quizzes.filter((quiz) => !existingQuizNames.has(quiz.quizName));

//   // Step 4: Prepare the list of duplicate quizzes
//   const duplicates = existingQuizzes.map((quiz) => ({
//     quizName: quiz.quizName,
//     boardId: quiz.boardId,
//     mediumId: quiz.mediumId,
//     classId: quiz.classId,
//     bookId: quiz.bookId,
//     subjectId: quiz.subjectId,
//     chapterId: quiz.chapterId,
//     lectureVideoId: quiz.lectureVideoId,
//   }));

//   // Step 5: Insert only the new quizzes
//   let savedQuizzes = [];
//   if (newQuizzes.length > 0) {
//     savedQuizzes = await Quize.insertMany(newQuizzes);
//   }

//   return { savedQuizzes, duplicates };
// };

const uploadBulkQuizzes = async (quizzes) => {
  if (!quizzes || quizzes.length === 0) {
    return { savedQuizzes: [], duplicates: [] };
  }

  // Extract normalized quiz names for duplicate checking
  const quizNames = quizzes.map((quiz) => quiz.normalizedQuizName);
  const normalizedQuizNames = quizzes.map((quiz) => quiz.quizName);

  // Step 1: Check for duplicates in the database using `normalizedQuizName`
  // const existingQuizzes = await Quize.find({
  //   normalizedQuizName: { $in: normalizedQuizNames }, // Compare normalized names
  //   boardId: quizzes[0]?.boardId, // Use optional chaining to avoid errors
  //   mediumId: quizzes[0]?.mediumId,
  //   classId: quizzes[0]?.classId,
  //   bookId: quizzes[0]?.bookId,
  //   subjectId: quizzes[0]?.subjectId,
  //   chapterId: quizzes[0]?.chapterId,
  //   lectureVideoId: quizzes[0]?.lectureVideoId,
  // });

  const existingQuizzes = await Quize.find({
    quizName: { $in: normalizedQuizNames }, // ✅ Correct field
    boardId: quizzes[0]?.boardId,
    mediumId: quizzes[0]?.mediumId,
    classId: quizzes[0]?.classId,
    bookId: quizzes[0]?.bookId,
    subjectId: quizzes[0]?.subjectId,
    chapterId: quizzes[0]?.chapterId,
    lessonId: quizzes[0]?.lessonId,
  });
  // Step 2: Store normalized quiz names from DB for fast lookup
  const existingQuizNames = new Set(existingQuizzes.map((quiz) => quiz.quizName));

  // Step 3: Filter out new quizzes that are not duplicates
  const newQuizzes = quizzes.filter((quiz) => !existingQuizNames.has(quiz.quizName));

  // Step 4: Prepare the list of duplicate quizzes
  const duplicates = existingQuizzes.map((quiz) => ({
    quizName: quiz.quizName,
    normalizedQuizName: quiz.normalizedQuizName,
    boardId: quiz.boardId,
    mediumId: quiz.mediumId,
    classId: quiz.classId,
    bookId: quiz.bookId,
    subjectId: quiz.subjectId,
    chapterId: quiz.chapterId,
    lessonId: quiz.lessonId,
  }));

  // Step 5: Insert only the new quizzes
  let savedQuizzes = [];
  if (newQuizzes.length > 0) {
    savedQuizzes = await Quize.insertMany(newQuizzes);
  }

  return { savedQuizzes, duplicates };
};


// /**
//  * Bulk Upload Quizzes
//  * @param {Array} quizzes - Array of quiz objects
//  * @param {Object} filterCriteria - Object containing boardId, mediumId, etc.
//  * @returns {Promise<Object>}
//  */
// const uploadBulkQuizzes = async (quizzes, filterCriteria) => {
//   if (!quizzes || quizzes.length === 0) {
//     return { savedQuizzes: [], duplicates: [] };
//   }

//   // Extract quiz names from input data
//   const quizNames = quizzes.map((quiz) => quiz.quizName);

//   // Step 1: Check for existing quizzes in the database with matching fields
//   const existingQuizzes = await Quize.find({
//     quizName: { $in: quizNames },
//     boardId: filterCriteria.boardId,
//     mediumId: filterCriteria.mediumId,
//     classId: filterCriteria.classId,
//     bookId: filterCriteria.bookId,
//     subjectId: filterCriteria.subjectId,
//     chapterId: filterCriteria.chapterId,
//     lectureVideoId: filterCriteria.lectureVideoId,
//   });

//   // Step 2: Create a Set of existing quiz names for quick lookup
//   const existingQuizNames = new Set(existingQuizzes.map((quiz) => quiz.quizName));

//   // Step 3: Separate new quizzes from duplicates
//   const newQuizzes = quizzes.filter((quiz) => !existingQuizNames.has(quiz.quizName));

//   // Step 4: Insert only the new quizzes
//   let savedQuizzes = [];
//   if (newQuizzes.length > 0) {
//     savedQuizzes = await Quize.insertMany(newQuizzes);
//   }

//   return { savedQuizzes, duplicates: existingQuizzes };
// };
/**
 * Create a quize
 * @param {Object} quizeBody
 * @returns {Promise<Quize>}
 */
const createQuize = async (quizeBody) => {
  return Quize.create(quizeBody);
};
/**
 * Create Upload quize
 * @param {Object} quizeBody
 * @returns { Promise<Quize>}
 */
const uploadQuiz = async (quizeBody) => {
  const quizData = Quize.create(quizeBody);
  return quizData;
};
/**
 * Query for board
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryQuize = async (filter, options) => {
  const quizes = await Quize.paginate(filter, options);
  return quizes;
};

/**
 * Get quize by id
 * @param {ObjectId} id
 * @returns {Promise<Quize>}
 */
const getQuizeById = async (id) => {
  return Quize.findById(id);
};

// /**
//  * Get quize by quizName
//  * @param {ObjectId} quizName
//  * @returns {Promise<Quize>}
//  */
// const getQuizeByQestion = async (quizName) => {
//   return Quize.findOne({ quizName });
// };
/**
 * Get quiz by quizName and other identifying fields
 * @param {Object} quizData - Quiz data containing quizName and identifiers
 * @returns {Promise<Quize|null>}
 */
const getQuizeByQestion = async (quizName, boardId, mediumId, classId, bookId, subjectId, chapterId, lessonId ) => {
  return Quize.findOne({
    quizName:quizName,
    boardId: boardId, 
    mediumId: mediumId, 
    classId: classId, 
    bookId: bookId, 
    subjectId: subjectId, 
    chapterId: chapterId, 
    lessonId: lessonId
  });
};

/**
 * Get quize by chapterId
 * @param {ObjectId} chapterId
 * @returns {Promise<Quize>}
 */
const getQuizeBychapterId = async (chapterId) => {
  return Quize.find({ chapterId });
};
/**
 * Query for board
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const QuizeNotSelected = async (filter, options) => {
  const updatedFilter = { ...filter, isVerified: true };
  const quizes = await Quize.paginate(updatedFilter, options);
  return quizes;
};

/**
 * Get quize by id
 * @param {ObjectId} id
 * @returns {Promise<Quize>}
 */
const getQuizeByFilter = async (
  boardId,
  mediumId,
  classId,
  bookId,
  subjectId,
  chapterId,
  lessonId,
  search,
  options
) => {
  const filters = {};

  if (boardId) filters.boardId = boardId;
  if (mediumId) filters.mediumId = mediumId;
  if (classId) filters.classId = classId;
  if (bookId) filters.bookId = bookId;
  if (subjectId) filters.subjectId = subjectId;
  if (chapterId) filters.chapterId = chapterId;
  if (lessonId) filters.lessonId = lessonId;
  if (search) {
    filters.quizName = { $regex: search, $options: 'i' };
  }
  // Call the paginate method on Quize schema
  const quizzes = await Quize.paginate(filters, options);
  return quizzes;
};




/**
 * create quize by id
 * @param {ObjectId} quizeId
 * @param {Object} updateBody
 * @returns {Promise<Quize>}
 */
const QuizeByIdSubmit = async (quizeId, updateBody) => {
  const quizes = await getQuizeById(quizeId);
  if (!quizes) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Quize not found');
  }
  Object.assign(quizes, updateBody);
  await quizes.save();
  return quizes;
};
const CheckoutAnswer = async (correctOptions, answer) => {
  const quiz = await QuizeByIdSubmit(correctOptions);
  const correctAnswerSet = new Set(correctOptions);
  const allSelectedCorrect = answer.every((userAnswer) => correctAnswerSet.has(userAnswer));
  const atLeastOneCorrect = answer.some((userAnswer) => correctAnswerSet.has(userAnswer));
  if (allSelectedCorrect) {
    quiz.userAnswers = answer;
    await quiz.save();
    throw new ApiError(httpStatus.ACCEPTED, 'Correct answer!');
  }
  if (atLeastOneCorrect) {
    throw new ApiError(httpStatus.NOT_FOUND, 'At least one correct answer selected, but not all.');
  }
  throw new ApiError(httpStatus.NOT_FOUND, 'Incorrect answer.');
};

const getQuizByclassIdAndDayWise = async (classId) => {
  // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const today = new Date().getDay();

  const subjects = await Subject.find({ classId });

  if (subjects.length === 0) {
    throw new Error('No subjects found for the given class');
  }

  const selectedSubjectIndex = today % subjects.length;
  const selectedSubject = subjects[selectedSubjectIndex];

  const quizQuestions = await Quize.find({ subjectId: selectedSubject._id, classId });
  if (!quizQuestions) {
    throw new ApiError(httpStatus.NOT_FOUND, 'quiz not found');
  }
  const shuffledQuestions = quizQuestions.sort(() => Math.random() - 0.5); // Shuffle the questions
  return shuffledQuestions.slice(0, 15); // Return the first 10 questions
};

//   // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
//   const today = new Date().getDay();
//   console.log(today);
//   // Find subjects for the given class
//   const subjects = await Subject.find({ classId });
//   if (subjects.length === 0) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'subject not found');
//     // return [];
//   }
//   // Select a subject for the current day (using the day as an index, starting from 0)
//   const selectedSubjectIndex = today % subjects.length;
//   const selectedSubject = subjects[selectedSubjectIndex];

//   const quizQuestions = await Quize.find({ subjectId: selectedSubject._id, classId });
//   if (!quizQuestions) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'quiz not found');
//   }
//   const shuffledQuestions = quizQuestions.sort(() => Math.random() - 0.5); // Shuffle the questions
//   return shuffledQuestions.slice(0, 15); // Return the first 10 questions
// };

/**
 * Update quize by id
 * @param {ObjectId} quizeId
 * @param {Object} updateBody
 * @returns {Promise<Quize>}
 */
const updateQuizeById = async (quizeId, updateBody) => {
  const quizes = await getQuizeById(quizeId);
  if (!quizes) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Quize not found');
  }
  Object.assign(quizes, updateBody);
  await quizes.save();
  return quizes;
};

/**
 * Delete quize by id
 * @param {ObjectId} quizeId
 * @returns {Promise<Quize>}
 */
const deleteQuizeById = async (quizeId) => {
  const quize = await getQuizeById(quizeId);
  if (!quize) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Quize not found');
  }
  await quize.remove();
  return quize;
};

// const getQuestionStats = async (filter) => {
//   try {
//     // Step 1: Fetch all questions that match the filter
//     const questions = await Quize.find(filter);

//     // Step 2: Count total number of questions
//     const totalQuestions = questions.length;

//     // Step 3: Group questionType wise counts using reduce
//     const questionTypeStats = questions.reduce((acc, question) => {
//       const questionType = question.questionType;
//       acc[questionType] = acc[questionType] ? acc[questionType] + 1 : 1;
//       return acc;
//     }, {});

//     // Return the result
//     return {
//       totalQuestions,
//       questionTypeStats,
//     };
//   } catch (error) {
//     console.error('Error in getQuestionStats service:', error);
//     throw new Error('An error occurred while fetching question stats.');
//   }
// };

const getQuestionStats = async (filter) => {
  try {
    // Define all possible question types and question levels
    const questionTypes = ["1", "2", "3", "4", "5"]; // Adjust based on actual possible values
    const questionLevels = [1, 2, 3, 4]; // Adjust based on actual possible values

    // Step 1: Fetch all questions that match the filter
    const questions = await Quize.find(filter);

    // Step 2: Count total number of questions
    const totalQuestions = questions.length;

    // Step 3: Initialize the questionTypeStats object with all possible types and levels
    const questionTypeStats = {};
    questionTypes.forEach(type => {
      questionTypeStats[type] = {};
      questionLevels.forEach(level => {
        questionTypeStats[type][level] = 0;
      });
    });

    // Step 4: Populate the actual counts from the fetched questions
    questions.forEach(({ questionType, questionLevel }) => {
      if (questionTypeStats[questionType]) {
        questionTypeStats[questionType][questionLevel] += 1;
      }
    });

    // Return the result
    return {
      success: true,
      data: {
        totalQuestions,
        questionTypeStats,
      },
    };
  } catch (error) {
    throw new Error('An error occurred while fetching question stats.');
  }
};

module.exports = {
  createQuize,
  uploadBulkQuizzes,
  queryQuize,
  getQuizeById,
  getQuizeByFilter,
  QuizeByIdSubmit,
  updateQuizeById,
  deleteQuizeById,
  QuizeNotSelected,
  uploadQuiz,
  CheckoutAnswer,
  getQuizByclassIdAndDayWise,
  getQuizeByQestion,
  getQuizeBychapterId,
  getQuestionStats,
};
