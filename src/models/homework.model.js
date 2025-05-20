const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const homeworkSchema = mongoose.Schema(
  {
    Question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    answerType: {
      type: Number,
      enum: [1, 2, 3],
    },
    boardId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'board',
      required: true,
      trim: true,
    },
    mediumId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'medium',
      required: true,
      trim: true,
    },
    classId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'class',
      required: true,
      trim: true,
    },
    bookId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'book',
      required: true,
      trim: true,
    },
    subjectId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'subject',
      required: true,
      trim: true,
    },
    chapterId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'chapter',
      required: true,
      trim: true,
    },
    lessonId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'lession',
      required: true,
      trim: true,
    },
    // description: {
    //   type: String,
    // },
    questionLevel: {
      type: Number,
      enum: [1, 2, 3, 4],
    },
    audioPath: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);


// add plugin that converts mongoose to json
homeworkSchema.plugin(toJSON);
homeworkSchema.plugin(paginate);

const Homework = mongoose.model('Homework', homeworkSchema);

module.exports = Homework;
