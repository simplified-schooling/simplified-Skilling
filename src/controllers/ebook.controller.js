const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { ebookService } = require('../services');

const createEbook = catchAsync(async (req, res) => {
  const ebook = await ebookService.createEbook(req.body);
  res.status(httpStatus.CREATED).send(ebook);
});

const getEbook = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['path']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  options.sortBy = 'order';
  const result = await ebookService.queryEbook(filter, options);
  res.send(result);
});

const getEbookById = catchAsync(async (req, res) => {
  const ebook = await ebookService.getEbookById(req.params.ebookId);
  if (!ebook) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ebook not found');
  }
  res.send(ebook);
});
const getEbookByChapterId = catchAsync(async (req, res) => {
  const ebook = await ebookService.getEbookByChapterId(req.params.chapterId);
  if (!ebook) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Chapter not found');
  }
  res.send(ebook);
});

const getEbookByFilter = catchAsync(async (req, res) => {
  const { boardId, mediumId, classId, subjectId, bookId, search } = req.body;
  const options = {
    limit: parseInt(req.body.limit, 10) || 10,
    page: parseInt(req.body.page, 10) || 1,
    sortBy: 'chapterName', // Sorting by subject name
  };

  const ebook = await ebookService.getEbookByFilter(boardId, mediumId, classId, subjectId, bookId, search, options);
  if (!ebook || ebook.totalResults === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No ebook found');
  }

  res.send(ebook);
  // const { boardId, mediumId, classId, subjectId, bookId } = req.params;
  // const ebook = await ebookService.getEbookByFilter(boardId, mediumId, classId, subjectId, bookId);
  // if (!ebook) {
  //   throw new ApiError(httpStatus.NOT_FOUND, 'Ebook not found');
  // }
  // res.send(ebook);
});

const updateEbook = catchAsync(async (req, res) => {
  const ebook = await ebookService.updateEbookById(req.params.ebookId, req.body);
  res.send(ebook);
});

const deleteEbook = catchAsync(async (req, res) => {
  await ebookService.deleteEbookById(req.params.ebookId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createEbook,
  getEbookById,
  updateEbook,
  deleteEbook,
  getEbook,
  getEbookByFilter,
  getEbookByChapterId,
};
