const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const multimediaSchema = mongoose.Schema(
  {
    lessionName: {
      type: String,
      trim: true,
      required: true,
    },
    icon1: {
      type: String,
      // portrait
    },
    icon2: {
      type: String,
      // landscape
    },
    path: {
      type: String,
    },
    mobileVideoPath: {
      type: String,
    },
    multimediaType: {
      type: String,
      enum: ['Multimedia', 'Lecture'],
    },
    videoType: {
      type: String,
    },
    description: {
      type: String,
    },
    mobileVideoType: {
      type: String,
    },
    order: {
      type: Number,
    },
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
      ref: 'Book',
      required: true,
    },
    chapterId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Chapter',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
multimediaSchema.plugin(toJSON);
multimediaSchema.plugin(paginate);
const Multimedia = mongoose.model('Multimedia', multimediaSchema);

module.exports = Multimedia;
