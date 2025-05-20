const httpStatus = require('http-status');
const XLSX = require('xlsx');
const fs = require('fs');
const he = require('he');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { HomeworkSerices } = require('../services');

// const normalizeQuestion = (question) => {
//   if (typeof question !== 'string') return '';
//   return question.replace(/\s+/g, ' ').trim().toLowerCase();
// };


// const bulkUploadHomework = catchAsync(async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: 'CSV file is required' });
//   }

//   const filePath = req.file.path;
//   const { boardId, mediumId, classId, bookId, subjectId, chapterId, lessonId } = req.body;

//   try {
//     const workbook = XLSX.readFile(filePath);
//     const sheetName = workbook.SheetNames[0];
//     const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { raw: false });

//     if (!data || data.length === 0) {
//       return res.status(400).json({ message: 'Uploaded file is empty' });
//     }

//     const compositeSet = new Set();
//     const duplicateInFile = [];
//     const formattedHomework = [];

//     for (const row of data) {
//       if (!row.Question || !row.Answer) continue;

//       const normalizedQuestion = normalizeQuestion(row.Question);
//       const normalizedAnswerType = (row['Question Type'] || 'Very Short Answer').trim().toLowerCase();
//       const normalizedLevel = parseInt(row['Question Level'], 10) || 1;

//       const compositeKey = `${normalizedQuestion}||${normalizedAnswerType}||${normalizedLevel}`;

//       if (compositeSet.has(compositeKey)) {
//         duplicateInFile.push(row.Question);
//       } else {
//         compositeSet.add(compositeKey);
//         formattedHomework.push({
//           Question: row.Question,
//           answer: row.Answer,
//           answerType: row['Question Type'] || 'Very Short Answer',
//           questionLevel: normalizedLevel,
//           boardId,
//           mediumId,
//           classId,
//           bookId,
//           subjectId,
//           chapterId,
//           lessonId,
//         });
//       }
//     }

//     if (duplicateInFile.length > 0) {
//       return res.status(400).json({
//         message: 'Duplicate questions found in the uploaded file (by Question + answerType + questionLevel)',
//         duplicateQuestions: duplicateInFile,
//       });
//     }

//     if (formattedHomework.length === 0) {
//       return res.status(400).json({ message: 'No valid data found in the file' });
//     }

//     const result = await HomeworkSerices.uploadBulkHomework(formattedHomework);

//     return res.status(201).json({
//       message: 'Bulk upload processed successfully',
//       uploadedCount: result.savedHomework.length || 0,
//       duplicatesInDatabaseCount: result.duplicates.length || 0,
//       uploadedHomework: result.savedHomework.map((q) => q.Question) || [],
//       duplicateHomework: result.duplicates.map((q) => q.Question) || [],
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error uploading homework', error: error.message });
//   } finally {
//     fs.unlinkSync(filePath);
//   }
// });


// Normalize the question text
const normalizeQuestion = (question) => {
  if (typeof question !== 'string') return '';
  return question.replace(/\s+/g, ' ').trim().toLowerCase();
};

// Map question type string to enum value
const getAnswerTypeEnum = (type) => {
  const map = {
    'very short answer': 1,
    'short answer': 2,
    'long answer': 3,
  };
  return map[type?.trim().toLowerCase()] || 1; // Default to 1
};

const bulkUploadHomework = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'CSV file is required' });
  }

  const filePath = req.file.path;
  const { boardId, mediumId, classId, bookId, subjectId, chapterId, lessonId } = req.body;

  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { raw: false });

    if (!data || data.length === 0) {
      return res.status(400).json({ message: 'Uploaded file is empty' });
    }

    const compositeSet = new Set();
    const duplicateInFile = [];
    const formattedHomework = [];

    for (const row of data) {
      if (!row.Question || !row.Answer) continue;

      const normalizedQuestion = normalizeQuestion(row.Question);
      const answerTypeEnum = getAnswerTypeEnum(row['Question Type']);
      const normalizedLevel = parseInt(row['Question Level'], 10) || 1;

      const compositeKey = `${normalizedQuestion}||${answerTypeEnum}||${normalizedLevel}`;

      if (compositeSet.has(compositeKey)) {
        duplicateInFile.push(row.Question);
      } else {
        compositeSet.add(compositeKey);
        formattedHomework.push({
          Question: row.Question.trim(),
          answer: row.Answer.trim(),
          answerType: answerTypeEnum,
          questionLevel: normalizedLevel,
          boardId,
          mediumId,
          classId,
          bookId,
          subjectId,
          chapterId,
          lessonId,
          audioPath:row.Path.trim()
        });
      }
    }

    if (duplicateInFile.length > 0) {
      return res.status(400).json({
        message: 'Duplicate questions found in the uploaded file (by Question + answerType + questionLevel)',
        duplicateQuestions: duplicateInFile,
      });
    }

    if (formattedHomework.length === 0) {
      return res.status(400).json({ message: 'No valid data found in the file' });
    }

    const result = await HomeworkSerices.uploadBulkHomework(formattedHomework);

    return res.status(201).json({
      message: 'Bulk upload processed successfully',
      uploadedCount: result.savedHomework.length || 0,
      duplicatesInDatabaseCount: result.duplicates.length || 0,
      uploadedHomework: result.savedHomework.map((q) => q.Question),
      duplicateHomework: result.duplicates.map((q) => q.Question),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading homework', error: error.message });
  } finally {
    fs.unlinkSync(filePath); // Clean up file
  }
});

const createHomework = catchAsync(async (req, res) => {
  const Homework = await HomeworkSerices.createHomework(req.body);
  res.status(httpStatus.CREATED).send(Homework);
});

const getAllHomework = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['Question']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await HomeworkSerices.queryHomework(filter, options);
  res.send(result);
});

const getHomeworkById = catchAsync(async (req, res) => {
  const homework = await HomeworkSerices.getHomeworkById(req.params.homeworkId);
  if (!homework) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Homework not found');
  }
  res.send(homework);
});

const getHomeworkByFilterId = catchAsync(async (req, res) => {
  const { boardId, mediumId, classId, subjectId, bookId, chapterId, lessonId, search } = req.body;
  const options = {
    limit: parseInt(req.body.limit, 10) || 10,
    page: parseInt(req.body.page, 10) || 1,
    sortBy: 'Question', // Sorting by subject name
  };

  const homework = await HomeworkSerices.getHomeworkByFilterId(
    boardId,
    mediumId,
    classId,
    subjectId,
    bookId,
    chapterId,
    lessonId,
    search,
    options
  );
  if (!homework || homework.totalResults === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No homework found');
  }

  res.send(homework);
});

const answerTypeWiseByChapterId = catchAsync(async (req, res) => {
  const homework = await HomeworkSerices.answerTypeWiseByChapterId(req.params.chapterId);
  if (!homework) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Homework not found');
  }
  res.send(homework);
});

const updateHomework = catchAsync(async (req, res) => {
  const updateHomeworks = await HomeworkSerices.updateHomeworkById(req.params.homeworkId, req.body);
  res.send(updateHomeworks);
});

const deleteHomework = catchAsync(async (req, res) => {
  await HomeworkSerices.deleteHomeworkById(req.params.homeworkId);
  res.status(httpStatus.OK).send();
});

const checkQuestionByName = catchAsync(async (req, res) => {
  const { Question, answerType, questionLevel, boardId, mediumId, classId, bookId, subjectId, chapterId, lessonId } = req.body;
  const decodedQuestion = he.decode(Question);
  const question = await HomeworkSerices.checkQuestion(
    decodedQuestion,
    answerType,
    questionLevel,
    boardId,
    mediumId,
    classId,
    bookId,
    subjectId,
    chapterId,
    lessonId
  );
  if (!decodedQuestion || !answerType || !questionLevel || !boardId || !mediumId || !classId || !bookId || !subjectId || !chapterId || !lessonId) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: 'All fields must be provided' });
  }
  if (question) {
    return res.status(httpStatus.OK).json({ message: 'Question Exists' });
  }

  return res.status(httpStatus.NOT_FOUND).json({ message: 'Question No Exists' });
});

const getHomeworkSummary = async (req, res) => {
  try {
    const summary = await HomeworkSerices.getHomeworkSummaryService(req.body);
    return res.status(httpStatus.OK).json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
module.exports = {
  createHomework,
  getAllHomework,
  getHomeworkByFilterId,
  getHomeworkById,
  answerTypeWiseByChapterId,
  updateHomework,
  deleteHomework,
  bulkUploadHomework,
  checkQuestionByName,
  getHomeworkSummary,
};
