const httpStatus = require('http-status');
const XLSX = require('xlsx');
const fs = require('fs');
const he = require('he');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { quizeService } = require('../services');

const createQuize = catchAsync(async (req, res) => {
  const quize = await quizeService.createQuize(req.body);
  res.status(httpStatus.CREATED).send(quize);
});

// const bulkUpload = catchAsync(async (req, res) => {
//   const filePath = req.file.path;
//   console.log(filePath);
//   const { boardId, mediumId, classId, bookId, subjectId, chapterId, lessonId } = req.body;
//   console.log(boardId, mediumId, classId, bookId, subjectId, chapterId, lessonId);
//   const quizzes = [];

//   fs.createReadStream(filePath)
//     .pipe(csv())
//     .on('data', (row) => {
//       const quiz = {
//         quizName: row.quizName,
//         files: row.files,
//         options: JSON.parse(row.options),
//         correctOptions: JSON.parse(row.correctOptions),
//         explain: row.explain,
//         hint: row.hint,
//         types: row.types,
//         isVerified: row.isVerified === 'true',
//         marks: parseInt(row.marks),
//         boardId,
//         mediumId,
//         classId,
//         bookId,
//         subjectId,
//         chapterId,
//         lessonId,
//       };
//       quizzes.push(quiz);
//     })
//     .on('end', async () => {
//       const savedQuizzes = await quizeService.uploadBulkQuizzes(quizzes);
//       res.status(201).json({ message: 'Quizzes uploaded successfully', data: savedQuizzes });
//     });
// });

// const bulkUpload = catchAsync(async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: 'CSV file is required' });
//   }

//   const filePath = req.file.path;
//   const { boardId, mediumId, classId, bookId, subjectId, chapterId, lessonId } = req.body;
//   const quizzes = [];

//   // Read CSV and process data
//   fs.createReadStream(filePath)
//     .pipe(csv())
//     .on('data', (row) => {
//       const quiz = {
//         quizName: row.quizName,
//         files: row.files,
//         // options: JSON.parse(row.options),
//         options:row.options,
//         correctOptions: JSON.parse(row.correctOptions),
//         explain: row.explain,
//         hint: row.hint,
//         types: row.types,
//         isVerified: row.isVerified === 'true',
//         marks: parseInt(row.marks),
//         boardId,
//         mediumId,
//         classId,
//         bookId,
//         subjectId,
//         chapterId,
//         lessonId,
//       };
//       quizzes.push(quiz);
//     })
//     .on('end', async () => {
//       const savedQuizzes = await quizeService.uploadBulkQuizzes(quizzes);
//       res.status(201).json({ message: 'Quizzes uploaded successfully', data: savedQuizzes });
//     });
// });

// const bulkUpload = catchAsync(async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: 'CSV file is required' });
//   }
//   const filePath = req.file.path;
//   const { boardId, mediumId, classId, bookId, subjectId, chapterId, lessonId } = req.body;
//   const quizzes = [];

//   // Read CSV and process data
//   fs.createReadStream(filePath)
//     .pipe(csv())
//     .on('data', (row) => {
//       const options = [row.option1, row.option2, row.option3, row.option4];
//       const quiz = {
//         quizName: row.quizName,
//         files: row.files,
//         options, // Use combined options array
//         correctOptions: JSON.parse(row.correctOptions),
//         explain: row.explain,
//         hint: row.hint,
//         types: row.types,
//         isVerified: row.isVerified === 'true',
//         marks: parseInt(row.marks),
//         boardId,
//         mediumId,
//         classId,
//         bookId,
//         subjectId,
//         chapterId,
//         lessonId,
//       };
//       quizzes.push(quiz);
//     })
//     .on('end', async () => {
//       const savedQuizzes = await quizeService.uploadBulkQuizzes(quizzes);
//       res.status(201).json({ message: 'Quizzes uploaded successfully', data: savedQuizzes });
//     });
// });

// const bulkUpload = catchAsync(async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: 'Excel file is required' });
//   }
//   const filePath = req.file.path;
//   const { boardId, mediumId, classId, bookId, subjectId, chapterId, lectureVideoId } = req.body;

//   // Read Excel file
//   const workbook = XLSX.readFile(filePath);
//   const sheetName = workbook.SheetNames[0];
//   const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

//   // Transform data to match the new model
//   const quizzes = data.map((row) => {
//     console.log(row);
//    // const options = [row.OptionA, row.OptionB, row.OptionC, row.OptionD];
//    const options = {
//     a: row.OptionA,
//     b: row.OptionB,
//     c: row.OptionC,
//     d: row.OptionD,
//   };
//   const correctOptions = row.CorrectAnswer
//   ? row.CorrectAnswer.split(',').map((answer) => answer.trim()) // Split by comma and trim whitespace
//   : [];
//     return {
//       quizName: row.Question,
//       displayFormat: row.DisplayFormat,
//       questionLevel: row.QuestioLevel,
//       questionType: row.Questiontype,
//       files: row.files || '',
//       options: [options],
//       correctOptions,
//       //correctOptions: JSON.parse(row.CorrectAnswer), // Parse correct options as an array
//       explain: row.Explaination || '',
//       hint: row.Hint || '',
//       types: row.types || 1, // Default to 'easy' if types is not provided
//       // isVerified: row.isVerified === 'true',
//       // marks: parseInt(row.marks || 0, 10), // Default marks to 0 if not provided
//       boardId,
//       mediumId,
//       classId,
//       bookId,
//       subjectId,
//       chapterId,
//       lectureVideoId,
//     };
//   });

//   // Save quizzes in bulk
//   const savedQuizzes = await quizeService.uploadBulkQuizzes(quizzes);
//   res.status(201).json({ message: 'Quizzes uploaded successfully', data: savedQuizzes });
// });

// const bulkUpload = catchAsync(async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: 'Excel file is required' });
//   }

//   const filePath = req.file.path;
//   const { boardId, mediumId, classId, bookId, subjectId, chapterId, lectureVideoId } = req.body;

//   try {
//     // Read Excel file
//     const workbook = XLSX.readFile(filePath);
//     const sheetName = workbook.SheetNames[0];
//     const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

//     if (!data || data.length === 0) {
//       return res.status(400).json({ message: 'Uploaded file is empty' });
//     }

//     // Transform data to match the model
//     const quizzes = data.map((row) => {
//       const options = {
//         A: row['Option A'],
//         B: row['Option B'],
//         C: row['Option C'],
//         D: row['Option D'],
//       };

//       const correctOptions = row['Correct Answer'] ? row['Correct Answer'].split(',').map((answer) => answer.trim()) : [];

//       return {
//         quizName: row.Question,
//         displayFormat: parseInt(row['Display Format'], 10) || 1,
//         questionLevel: parseInt(row['Question Level'], 10) || 1,
//         questionType: parseInt(row['Question Type'], 10) || 1,
//         files: row.Files || '',
//         options: [options],
//         correctOptions,
//         explain: row.Explaination || '',
//         hint: row.Hint || '',
//         types: row.Types || 1,
//         boardId,
//         mediumId,
//         classId,
//         bookId,
//         subjectId,
//         chapterId,
//         lectureVideoId,
//         description: row.Description || '',
//         weightage:  parseInt(row['Weightage'], 10) || 1,
//         negativeWeightage:  parseInt(row['Negative Weightage'], 10) || 1,
//       };
//     });

//     // Ensure `uploadBulkQuizzes` returns a valid response
//     const result = (await quizeService.uploadBulkQuizzes(quizzes)) || { savedQuizzes: [], duplicates: [] };

//     return res.status(201).json({
//       message: 'Bulk upload processed successfully',
//       uploadedCount: result.savedQuizzes.length || 0,
//       duplicatesCount: result.duplicates.length || 0,
//       uploadedQuizzes: result.savedQuizzes.map((q) => q.quizName) || [],
//       duplicateQuizzes: result.duplicates.map((q) => q.quizName) || [],
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error uploading quizzes', error: error.message });
//   }
// });

// Normalize questions to handle minor differences

const normalizeQuestion = (question) => {
  if (typeof question !== 'string') {
    return ''; // Return an empty string if it's not a string
  }
  return question.replace(/\s+/g, ' ').replace(/_+/g, '_').trim().toLowerCase();
};

const bulkUpload = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Excel file is required' });
  }

  const filePath = req.file.path;
  const { boardId, mediumId, classId, bookId, subjectId, chapterId, lessonId } = req.body;

  try {
    // Read Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    // const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { raw: false });
    if (!data || data.length === 0) {
      return res.status(400).json({ message: 'Uploaded file is empty' });
    }

    // Step 1: Check for duplicates within the uploaded file
    const questionSet = new Set();
    const formattedQuizzes = [];
    const duplicateInFile = [];

    for (const row of data) {
      const normalizedQuestion = normalizeQuestion(row.Question);

      if (questionSet.has(normalizedQuestion)) {
        duplicateInFile.push(row.Question);
      } else {
        questionSet.add(normalizedQuestion);
        formattedQuizzes.push({
          quizName: row.Question,
          normalizedQuizName: normalizedQuestion, // Store for easy duplicate check
          displayFormat: parseInt(row['Display Format'], 10) || 1,
          questionLevel: parseInt(row['Question Level'], 10) || 1,
          questionType: parseInt(row['Question Type'], 10) || 1,
          files: row.Files || '',
          options: [
            {
              A: row['Option A'],
              B: row['Option B'],
              C: row['Option C'],
              D: row['Option D'],
            },
          ],
          correctOptions: row['Correct Answer'] ? row['Correct Answer'].split(',').map((answer) => answer.trim()) : [],
          explain: row.Explaination || '',
          hint: row.Hint || '',
          types: row.Types || 1,
          boardId,
          mediumId,
          classId,
          bookId,
          subjectId,
          chapterId,
          lessonId,
          description: row.Description || '',
          weightage: parseInt(row.Weightage, 10) || 1,
          negativeWeightage: parseInt(row['Negative Weightage'], 10) || 1,
        });
      }
    }

    if (duplicateInFile.length > 0) {
      return res.status(400).json({
        message: 'Duplicate questions found in the uploaded file.',
        duplicateQuestions: duplicateInFile,
      });
    }

    // Step 2: Send data to the service layer for DB validation
    const result = await quizeService.uploadBulkQuizzes(formattedQuizzes);

    return res.status(201).json({
      message: 'Bulk upload processed successfully',
      uploadedCount: result.savedQuizzes.length || 0,
      duplicatesInDatabaseCount: result.duplicates.length || 0,
      uploadedQuizzes: result.savedQuizzes.map((q) => q.quizName) || [],
      duplicateQuizzes: result.duplicates.map((q) => q.quizName) || [],
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading quizzes', error: error.message });
  } finally {
    // Delete the uploaded file after processing
    fs.unlinkSync(filePath);
  }
});

// const normalizeQuestion = (question) => {
//   if (typeof question !== 'string') {
//     return ''; // Return empty string if not a valid string
//   }
//   return question.replace(/\s+/g, ' ').replace(/_+/g, '_').trim().toLowerCase();
// };

// const bulkUpload = catchAsync(async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: 'Excel file is required' });
//   }

//   const filePath = req.file.path;
//   const { boardId, mediumId, classId, bookId, subjectId, chapterId, lectureVideoId } = req.body;

//   try {
//     const workbook = XLSX.readFile(filePath);
//     const sheetName = workbook.SheetNames[0];
//     const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

//     if (!data || data.length === 0) {
//       return res.status(400).json({ message: 'Uploaded file is empty' });
//     }

//     // Step 1: Check for duplicates within the uploaded file
//     const questionSet = new Set();
//     const formattedQuizzes = [];
//     const duplicateInFile = [];

//     for (const row of data) {
//       if (!row.Question || typeof row.Question !== 'string') {
//         continue; // Skip invalid rows
//       }

//       const normalizedQuestion = normalizeQuestion(row.Question);

//       if (questionSet.has(normalizedQuestion)) {
//         duplicateInFile.push(row.Question);
//       } else {
//         questionSet.add(normalizedQuestion);
//         formattedQuizzes.push({
//           quizName: row.Question,
//           normalizedQuizName: normalizedQuestion, // Store normalized name
//           displayFormat: parseInt(row['Display Format'], 10) || 1,
//           questionLevel: parseInt(row['Question Level'], 10) || 1,
//           questionType: parseInt(row['Question Type'], 10) || 1,
//           files: row.Files || '',
//           options: [
//             {
//               A: row['Option A'],
//               B: row['Option B'],
//               C: row['Option C'],
//               D: row['Option D'],
//             },
//           ],
//           correctOptions: row['Correct Answer']
//             ? row['Correct Answer'].toString().split(',').map((answer) => answer.trim())
//             : [],
//           explain: row.Explaination || '',
//           hint: row.Hint || '',
//           types: row.Types || 1,
//           boardId,
//           mediumId,
//           classId,
//           bookId,
//           subjectId,
//           chapterId,
//           lectureVideoId,
//           description: row.Description || '',
//           weightage: parseInt(row['Weightage'], 10) || 1,
//           negativeWeightage: parseInt(row['Negative Weightage'], 10) || 1,
//         });
//       }
//     }

//     if (duplicateInFile.length > 0) {
//       return res.status(400).json({
//         message: 'Duplicate questions found in the uploaded file.',
//         duplicateQuestions: duplicateInFile,
//       });
//     }

//     // Step 2: Send data to the service layer for DB validation
//     const result = await quizeService.uploadBulkQuizzes(formattedQuizzes);

//     return res.status(201).json({
//       message: 'Bulk upload processed successfully',
//       uploadedCount: result.savedQuizzes.length || 0,
//       duplicatesInDatabaseCount: result.duplicates.length || 0,
//       uploadedQuizzes: result.savedQuizzes.map((q) => q.quizName) || [],
//       duplicateQuizzes: result.duplicates.map((q) => q.quizName) || [],
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error uploading quizzes', error: error.message });
//   } finally {
//     fs.unlinkSync(filePath); // Delete file after processing
//   }
// });
// const bulkUpload = catchAsync(async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: 'Excel file is required' });
//   }

//   const filePath = req.file.path;
//   const { boardId, mediumId, classId, bookId, subjectId, chapterId, lectureVideoId } = req.body;

//   try {
//     // Read Excel file
//     const workbook = XLSX.readFile(filePath);
//     const sheetName = workbook.SheetNames[0];
//     const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

//     if (!data || data.length === 0) {
//       return res.status(400).json({ message: 'Uploaded file is empty' });
//     }

//     // Step 1: Check for duplicates within the uploaded file
//     const questionSet = new Set();
//     const formattedQuizzes = [];
//     const duplicateInFile = [];

//     for (const row of data) {
//       const normalizedQuestion = row.Question.trim();

//       if (questionSet.has(normalizedQuestion)) {
//         duplicateInFile.push(normalizedQuestion);
//       } else {
//         questionSet.add(normalizedQuestion);
//         formattedQuizzes.push({
//           quizName: normalizedQuestion,
//           displayFormat: parseInt(row['Display Format'], 10) || 1,
//           questionLevel: parseInt(row['Question Level'], 10) || 1,
//           questionType: parseInt(row['Question Type'], 10) || 1,
//           files: row.Files || '',
//           options: [
//             {
//               A: row['Option A'],
//               B: row['Option B'],
//               C: row['Option C'],
//               D: row['Option D'],
//             },
//           ],
//           correctOptions: row['Correct Answer'] ? row['Correct Answer'].split(',').map((answer) => answer.trim()) : [],
//           explain: row.Explaination || '',
//           hint: row.Hint || '',
//           types: row.Types || 1,
//           boardId,
//           mediumId,
//           classId,
//           bookId,
//           subjectId,
//           chapterId,
//           lectureVideoId,
//           description: row.Description || '',
//           weightage: parseInt(row['Weightage'], 10) || 1,
//           negativeWeightage: parseInt(row['Negative Weightage'], 10) || 1,
//         });
//       }
//     }

//     if (duplicateInFile.length > 0) {
//       return res.status(400).json({
//         message: 'Duplicate questions found in the uploaded file.',
//         duplicateQuestions: duplicateInFile,
//       });
//     }

//     // Step 2: Check for duplicates in the database and save unique quizzes
//     const result = await quizeService.uploadBulkQuizzes(formattedQuizzes, {
//       boardId,
//       mediumId,
//       classId,
//       bookId,
//       subjectId,
//       chapterId,
//       lectureVideoId,
//     });

//     return res.status(201).json({
//       message: 'Bulk upload processed successfully',
//       uploadedCount: result.savedQuizzes.length || 0,
//       duplicatesInDatabaseCount: result.duplicates.length || 0,
//       uploadedQuizzes: result.savedQuizzes.map((q) => q.quizName) || [],
//       duplicateQuizzes: result.duplicates.map((q) => q.quizName) || [],
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error uploading quizzes', error: error.message });
//   } finally {
//     // Delete the uploaded file after processing
//     fs.unlinkSync(filePath);
//   }
// });

const uploadFiles = catchAsync(async (req, res) => {
  const quizData = await quizeService.uploadQuiz(req.body);
  res.status(httpStatus.CREATED).send(quizData);
});

const getAllQuize = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['quizName']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await quizeService.queryQuize(filter, options);
  res.send(result);
});

const getAllNotSelected = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['quizName']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await quizeService.QuizeNotSelected(filter, options);
  res.send(result);
});

const getQuizeById = catchAsync(async (req, res) => {
  const quize = await quizeService.getQuizeById(req.params.quizeId);
  if (!quize) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Quize not found');
  }
  res.send(quize);
});

const getQuizeByFilter = catchAsync(async (req, res) => {
  const { boardId, mediumId, classId, bookId, subjectId, chapterId, lessonId, search } = req.body;
  // const filter = { boardId, mediumId, classId, bookId, subjectId, chapterId };
  // const options = pick(req.body, ['sortBy', 'limit', 'page']);
  const options = {
    limit: parseInt(req.body.limit, 10) || 10,
    page: parseInt(req.body.page, 10) || 1,
    sortBy: 'quizName', // Sorting by subject name
  };

  const quizes = await quizeService.getQuizeByFilter(
    boardId,
    mediumId,
    classId,
    bookId,
    subjectId,
    chapterId,
    lessonId,
    search,
    options
  );

  if (!quizes || quizes.totalResults === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No quizes found');
  }
  res.send(quizes);
});

const getQuizeByChapterId = catchAsync(async (req, res) => {
  const quize = await quizeService.getQuizeBychapterId(req.params.chapterId);
  if (!quize) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Quize not found');
  }
  res.send(quize);
});

// const getQuizeByQuizName = catchAsync(async (req, res) => {

//   const quize = await quizeService.getQuizeByQestion(req.body.quizName);
//   if (!quize) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Quize not found');
//   }
//   res.send(quize);
// });
// function normalizeText(str) {
//   return str.replace(/\s+/g, ' ').trim().toLowerCase();
// }

const getQuizeByQuizName = catchAsync(async (req, res) => {
  //const normalizedQuizName = normalizeText(req.body.quizName);
  const { quizName, boardId, mediumId, classId, bookId, subjectId, chapterId, lessonId } = req.body;
   const decodedQuestion = he.decode(quizName);
  const quize = await quizeService.getQuizeByQestion(
    decodedQuestion,
    boardId,
    mediumId,
    classId,
    bookId,
    subjectId,
    chapterId,
    lessonId
  );
   if (!decodedQuestion || !boardId || !mediumId || !classId || !bookId || !subjectId || !chapterId || !lessonId) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: 'All fields must be provided' });
    }
  if (!quize) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Quiz not found');
  }
  res.status(httpStatus.OK).send(quize);
});
const getQuizByClassIdAndDayWise = catchAsync(async (req, res) => {
  const quize = await quizeService.getQuizByclassIdAndDayWise(req.params.classId);
  if (!quize) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Quize not found');
  }
  res.send(quize);
});

const QuizeByIdSubmit = catchAsync(async (req, res) => {
  const quiz = await quizeService.CheckoutAnswer(req.params.quizeId, req.body.answer);
  if (!quiz) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Quiz not found');
  }
  res.send(quiz);
});

const updateQuizeById = catchAsync(async (req, res) => {
  const quize = await quizeService.updateQuizeById(req.params.quizeId, req.body);
  res.send(quize);
});

const deleteQuizeById = catchAsync(async (req, res) => {
  await quizeService.deleteQuizeById(req.params.quizeId);
  res.status(httpStatus.NO_CONTENT).send();
});
const getQuestionStats = catchAsync(async (req, res) => {
  const stats = await quizeService.getQuestionStats(req.body);
  res.status(httpStatus.OK).json({ success: true, data: stats });
});
module.exports = {
  createQuize,
  getAllQuize,
  getQuizeById,
  QuizeByIdSubmit,
  getQuizeByFilter,
  updateQuizeById,
  deleteQuizeById,
  getAllNotSelected,
  uploadFiles,
  getQuizByClassIdAndDayWise,
  getQuizeByQuizName,
  getQuizeByChapterId,
  bulkUpload,
  getQuestionStats,
};
