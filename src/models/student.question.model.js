const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const studentQestionSchema = mongoose.Schema(
  {
    boardId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'board',
      required: true,
    },
    mediumId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'medium',
      required: true,
    },
    classId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Classes',
      required: true,
    },
    subjectId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Subject',
      required: true,
    },
    bookId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'book',
      required: true,
    },
    chapterId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'chapter',
      required: true,
    },
    numberOfStudent: {
      type: Number,
    },
    perStudentQuestion: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
studentQestionSchema.plugin(toJSON);
studentQestionSchema.plugin(paginate);

const StudentQuestion = mongoose.model('StudentQuestion', studentQestionSchema);

module.exports = StudentQuestion;
