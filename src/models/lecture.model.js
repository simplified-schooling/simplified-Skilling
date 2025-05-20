const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const lectureSchema = mongoose.Schema(
  {
    lessionName: {
      type: String,
      trim: true,
      required: true,
    },
    // icon1: {
    //   type: String,
    //   // portrait
    // },
    // description: {
    //   type: String,
    // },
    // icon2: {
    //   type: String,
    //   // landscape
    // },
    path: {
      type: String,
    },
    mobileVideoPath: {
      type: String,
    },
    mobileVideoType: {
      type: String,
    },
    videoType: {
      type: String,
    },
    order: {
      type: Number,
    },
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
      ref: 'class',
      required: true,
    },
    bookId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'book',
      required: true,
    },
    subjectId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'subject',
      required: true,
    },
    chapterId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'chapter',
      required: true,
    },
    lessonId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'lession',
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
lectureSchema.plugin(toJSON);
lectureSchema.plugin(paginate);

const LectureVideo = mongoose.model('LectureVideo', lectureSchema);

module.exports = LectureVideo; ///  lecture video = topic/lesson
