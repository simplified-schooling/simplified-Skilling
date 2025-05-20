/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const todayPlanSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    boardId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Board',
      required: true,
      trim: true,
    },
    mediumId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Medium',
      required: true,
      trim: true,
    },
    classId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Classes',
      required: true,
      trim: true,
    },
    subjectId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Subject',
      required: true,
      trim: true,
    },
    bookId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'book',
      required: true,
      trim: true,
    },
    chapterId: {
      type:String,
      default : " ",
      // type: mongoose.SchemaTypes.ObjectId,
      // ref: 'Chapter',
      // required: true,
      // trim: true,
      
    },
    lessonId: {
      type:String,
      default : " ",
      // type: mongoose.SchemaTypes.ObjectId,
      // ref: 'lession',
      // required: true,
      // trim: true,
    },
    orderId: {
      type: String,
      //required: true,
      trim: true,
    },
    studioName: {
      type: String,
      required: true,
      trim: true,
    },
    // status: {
    //   type: String,
    //   trim: true,
    //   default: 'active',
    // },
    liveStreamingPath: {
      type: String,
      trim: true,
    },
    presenterName: {
      type: String,
      trim: true,
    },
    questions: {
      type: [String],
      default: [],
      trim: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
todayPlanSchema.plugin(toJSON);
todayPlanSchema.plugin(paginate);

/**
 * @typedef TodayPlan
 */
const TodayPlan = mongoose.model('TodayPlan', todayPlanSchema);

module.exports = TodayPlan;
