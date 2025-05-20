const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const quizeSchema = mongoose.Schema(
  {
    quizName: {
      type: String,
      index: true,
      trim:true,
    },
    // quizNameAudioPath: {
    //   type: String,
    //   index: true,
    // },
    displayFormat: {
      type: Number,
      enum: [1, 2, 3],
    },
    questionLevel: {
      type: Number,
      enum: [1, 2, 3, 4],
    },
    questionType: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
    },
    files: {
      type: String,
    },
    options: [
      {
        A: String,
        B: String,
        C: String,
        D: String,
      },
    ],
    // optionsAudioPath: [
    //   {
    //     A: String,
    //     B: String,
    //     C: String,
    //     D: String,
    //   },
    // ],
    correctOptions: [String],
    // correctOptionsAudioPath: {
    //   A: String,
    //   B: String,
    //   C: String,
    //   D: String,
    // },
    explain: {
      type: String,
    },
    // explainAudioPath: {
    //   type: String,
    // },
    hint: {
      type: String,
    },
    // hintAudioPath: {
    //   type: String,
    // },
    types: {
      type: String,
      enum: [1, 2, 3],
    },
    // isVerified: {
    //   type: Boolean,
    //   default: false,
    // },
    // marks: {
    //   type: Number,
    // },
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
    // lectureVideoId: {
    //   type: mongoose.SchemaTypes.ObjectId,
    //   ref: 'lecturevideo',
    //   required: true,
    // },
      lessonId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'lession',
        required: true,
        trim: true,
      },
    description: {
      type: String,
    },
    weightage: {
      type: Number,
    },
    negativeWeightage: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
quizeSchema.plugin(toJSON);
quizeSchema.plugin(paginate);

const Quize = mongoose.model('quize', quizeSchema);

module.exports = Quize;
