const httpStatus = require('http-status');
const XLSX = require('xlsx');
const fs = require('fs');
const he = require('he');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { caseStudiesService } = require('../services');
const normalizeText = (text) => {
    if (typeof text !== 'string') return '';
    return text.replace(/\s+/g, ' ').trim().toLowerCase();
  };
  
  const bulkUploadCaseStudy = catchAsync(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'CSV file is required' });
    }
  
    const filePath = req.file.path;
    const { boardId, mediumId, classId, bookId, subjectId, chapterId, lessonId } = req.body;
  
    try {
      // Read CSV file
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { raw: false });
  
      if (!data || data.length === 0) {
        return res.status(400).json({ message: 'Uploaded file is empty' });
      }
  
      const caseStudySet = new Set(); // Store unique case studies
      const duplicateInFile = [];
      const formattedCaseStudies = [];
  
      for (const row of data) {
        const caseStudyText = row['Case Study'];
        if (!caseStudyText) continue; // Skip rows without case study
  
        const normalizedCaseStudy = normalizeText(caseStudyText);
        if (caseStudySet.has(normalizedCaseStudy)) {
          duplicateInFile.push(caseStudyText);
          continue;
        }
  
        caseStudySet.add(normalizedCaseStudy);
  
        // Extract questions dynamically
        const questions = [];
        let questionIndex = 1;
        while (row[`Question ${questionIndex}`] && row[`Answer ${questionIndex}`]) {
          questions.push({
            question: row[`Question ${questionIndex}`],
            answer: row[`Answer ${questionIndex}`],
          });
          questionIndex++;
        }
  
        if (questions.length === 0) continue; // Skip if no questions found
  
        formattedCaseStudies.push({
          case: caseStudyText,
          questions,
          boardId,
          mediumId,
          classId,
          bookId,
          subjectId,
          chapterId,
          lessonId,
        });
      }
  
      if (duplicateInFile.length > 0) {
        return res.status(400).json({
          message: 'Duplicate case studies found in the uploaded file.',
          duplicateCaseStudiesInFile: duplicateInFile,
        });
      }
  
      if (formattedCaseStudies.length === 0) {
        return res.status(400).json({ message: 'No valid case studies found in the file' });
      }
  
      // Send data to the service layer
      const result = await caseStudiesService.uploadBulkCaseStudy(formattedCaseStudies);
  
      return res.status(201).json({
        message: 'Bulk upload processed successfully',
        uploadedCount: result.savedCaseStudies.length || 0,
        duplicatesInDatabaseCount: result.duplicates.length || 0,
        uploadedCaseStudies: result.savedCaseStudies.map((c) => c.case) || [],
        duplicateCaseStudies: result.duplicates.map((c) => c.case) || [],
      });
    } catch (error) {
      res.status(500).json({ message: 'Error uploading Case Study', error: error.message });
    } finally {
      fs.unlinkSync(filePath); // Delete uploaded file after processing
    }
  });

const createCaseStudy = catchAsync(async (req, res) => {
  const CaseStudy = await caseStudiesService.createCaseStudy(req.body);
  res.status(httpStatus.CREATED).send(CaseStudy);
});

const getAllCaseStudy = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await caseStudiesService.queryCaseStudy(filter, options);
  res.send(result);
});

const getCaseStudyById = catchAsync(async (req, res) => {
  const CaseStudy = await caseStudiesService.getCaseStudyById(req.params.caseStudyId);
  if (!CaseStudy) {
    throw new ApiError(httpStatus.NOT_FOUND, 'CaseStudy not found');
  }
  res.send(CaseStudy);
});

const getCaseStudyByFilterId = catchAsync(async (req, res) => {
  const { boardId, mediumId, classId, subjectId, bookId, chapterId, lessonId, search } = req.body;
  const options = {
    limit: parseInt(req.body.limit, 10) || 10,
    page: parseInt(req.body.page, 10) || 1,
    sortBy: 'Question', // Sorting by subject name
  };

  const CaseStudy = await caseStudiesService.getCaseStudyByFilterId(
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
  if (!CaseStudy || CaseStudy.totalResults === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No CaseStudy found');
  }

  res.send(CaseStudy);
});

const answerTypeWiseByChapterId = catchAsync(async (req, res) => {
  const CaseStudy = await caseStudiesService.answerTypeWiseByChapterId(req.params.chapterId);
  if (!CaseStudy) {
    throw new ApiError(httpStatus.NOT_FOUND, 'CaseStudy not found');
  }
  res.send(CaseStudy);
});

const updateCaseStudy = catchAsync(async (req, res) => {
  const updateCaseStudys = await caseStudiesService.updateCaseStudyById(req.params.caseStudyId, req.body);
  res.send(updateCaseStudys);
});

const deleteCaseStudy = catchAsync(async (req, res) => {
  await caseStudiesService.deleteCaseStudyById(req.params.caseStudyId);
  res.status(httpStatus.OK).send();
});

const checkQuestionByName = catchAsync(async (req, res) => {
  const { caseStudy, boardId, mediumId, classId, bookId, subjectId, chapterId, lessonId } = req.body;
const decodedQuestion = he.decode(caseStudy);
  const question = await caseStudiesService.checkQuestion(
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
  if (question) {
    return res.status(httpStatus.OK).json({ message: 'Case Study Exists' });
  }

  return res.status(httpStatus.NOT_FOUND).json({ message: 'Case Study No Exists' });
});


const getCaseStudySummary = async (req, res) => {
  try {
    const summary = await caseStudiesService.getCaseStudySummaryService(req.body);
    return res.status(httpStatus.OK).json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
module.exports = {
  createCaseStudy,
  getAllCaseStudy,
  getCaseStudyByFilterId,
  getCaseStudyById,
  answerTypeWiseByChapterId,
  updateCaseStudy,
  deleteCaseStudy,
  bulkUploadCaseStudy,
  checkQuestionByName,
  getCaseStudySummary,
};
