const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const caseStudySchema = new mongoose.Schema(
  {
    case: { type: String, required: true },
    questions: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    boardId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Board',
      required: true,
    },
    mediumId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Medium',
      required: true,
    },
    classId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Class',
      required: true,
    },
    bookId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Book',
      required: true,
    },
    subjectId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Subject',
      required: true,
    },
    chapterId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Chapter',
      required: true,
    },
    lessonId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Lesson',
      required: true,
    },
  },
  { timestamps: true }
);

caseStudySchema.plugin(toJSON);
caseStudySchema.plugin(paginate);

const CaseStudy = mongoose.model('CaseStudy', caseStudySchema);
module.exports = CaseStudy;
