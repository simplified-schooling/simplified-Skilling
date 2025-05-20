const httpStatus = require('http-status');
const { CaseStudy } = require('../models');
const ApiError = require('../utils/ApiError');


const uploadBulkCaseStudy = async (caseStudyData) => {
    if (!caseStudyData || caseStudyData.length === 0) {
      return { savedCaseStudies: [], duplicates: [] };
    }
  
    // Extract case study texts for duplicate checking
    const caseStudyTexts = caseStudyData.map((cs) => cs.case);
  
    // Step 1: Check for existing case studies in the database
    const existingCaseStudies = await CaseStudy.find({
      case: { $in: caseStudyTexts },
      boardId: caseStudyData[0]?.boardId,
      mediumId: caseStudyData[0]?.mediumId,
      classId: caseStudyData[0]?.classId,
      bookId: caseStudyData[0]?.bookId,
      subjectId: caseStudyData[0]?.subjectId,
      chapterId: caseStudyData[0]?.chapterId,
      lessonId: caseStudyData[0]?.lessonId,
    });
  
    const existingCaseStudySet = new Set(existingCaseStudies.map((cs) => cs.case.toLowerCase()));
  
    // Step 2: Separate new and duplicate case studies
    const newCaseStudies = caseStudyData.filter((cs) => !existingCaseStudySet.has(cs.case.toLowerCase()));
  
    // Step 3: Prepare duplicate records
    const duplicates = existingCaseStudies.map((cs) => ({
      case: cs.case,
      questions: cs.questions,
      boardId: cs.boardId,
      mediumId: cs.mediumId,
      classId: cs.classId,
      bookId: cs.bookId,
      subjectId: cs.subjectId,
      chapterId: cs.chapterId,
      lessonId: cs.lessonId,
    }));
  
    // Step 4: Insert only the new case studies
    let savedCaseStudies = [];
    if (newCaseStudies.length > 0) {
      savedCaseStudies = await CaseStudy.insertMany(newCaseStudies);
    }
  
    return { savedCaseStudies, duplicates };
  };

/**
 * Create a CaseStudy
 * @param {Object} CaseStudyBody
 * @returns {Promise<CaseStudy>}
 */
const createCaseStudy = async (CaseStudyBody) => {
  return CaseStudy.create(CaseStudyBody);
};

/**
 * CaseStudy for board
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCaseStudy = async (filter, options) => {
  const getallCaseStudy = await CaseStudy.paginate(filter, options);
  return getallCaseStudy;
};

/**
 * Get CaseStudy by id
 * @param {ObjectId} id
 * @returns {Promise<CaseStudy>}
 */
const getCaseStudyById = async (id) => {
  return CaseStudy.findById(id);
};

/**
 * Get CaseStudy by filter
 * @param {ObjectId} boardId
 * @param {ObjectId} mediumId
 * @param {ObjectId} bookId
 * @param {ObjectId} chapterId
 * @param {ObjectId} subjectId
 * @param {ObjectId} classId
 * @returns {Promise<CaseStudy>}
 */
const getCaseStudyByFilterId = async (boardId, mediumId, classId, subjectId, bookId, chapterId, lessonId, search, options) => {
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
    filter.case = { $regex: search, $options: 'i' };
  }

  // Fetch data with pagination
  return CaseStudy.paginate(filter, options);
  // return CaseStudy.find({ boardId, mediumId, classId, bookId, subjectId, chapterId });
};



/**
 * Update CaseStudy by id
 * @param {ObjectId} CaseStudyId
 * @param {Object} updateBody
 * @returns {Promise<CaseStudy>}
 */
const updateCaseStudyById = async (caseStudyId, updateBody) => {
  const updateCaseStudy = await getCaseStudyById(caseStudyId);
  if (!updateCaseStudy) {
    throw new ApiError(httpStatus.NOT_FOUND, 'CaseStudy not found');
  }
  Object.assign(updateCaseStudy, updateBody);
  await updateCaseStudy.save();
  return updateCaseStudy;
};

/**
 * Delete CaseStudy by id
 * @param {ObjectId} CaseStudyId
 * @returns {Promise<CaseStudy>}
 */
const deleteCaseStudyById = async (caseStudyId) => {
  const deleteCaseStudy = await getCaseStudyById(caseStudyId);
  if (!deleteCaseStudy) {
    throw new ApiError(httpStatus.NOT_FOUND, 'CaseStudy not found');
  }
  await deleteCaseStudy.remove();
  return deleteCaseStudy;
};

/**
 * Get quiz by quizName and other identifying fields
 * @param {Object} quizData - Quiz data containing quizName and identifiers
 * @returns {Promise<Quize|null>}
 */
const checkQuestion = async (caseStudy, boardId, mediumId, classId, bookId, subjectId, chapterId, lessonId ) => {
 
  return CaseStudy.findOne({
    case:caseStudy,
    boardId: boardId, 
    mediumId: mediumId, 
    classId: classId, 
    bookId: bookId, 
    subjectId: subjectId, 
    chapterId: chapterId, 
    lessonId: lessonId
  });
};


module.exports = {
  createCaseStudy,
  queryCaseStudy,
  getCaseStudyByFilterId,
  getCaseStudyById,
  updateCaseStudyById,
  deleteCaseStudyById,
  uploadBulkCaseStudy,
  checkQuestion,
};
