// const mongoose = require('mongoose');
// const { toJSON, paginate } = require('./plugins');

// const chapterSchema = mongoose.Schema(
//   {
//     boardId: {
//       type: mongoose.SchemaTypes.ObjectId,
//       ref: 'board',
//       required: true,
//       trim: true,
//     },
//     mediumId: {
//       type: mongoose.SchemaTypes.ObjectId,
//       ref: 'medium',
//       required: true,
//       trim: true,
//     },
//     classId: {
//       type: mongoose.SchemaTypes.ObjectId,
//       ref: 'Classes',
//       required: true,
//       trim: true,
//     },
//     subjectId: {
//       type: mongoose.SchemaTypes.ObjectId,
//       ref: 'Subject',
//       required: true,
//       trim: true,
//     },
//     bookId: {
//       type: mongoose.SchemaTypes.ObjectId,
//       ref: 'book',
//       required: true,
//       trim: true,
//     },
//     chapterName: {
//       type: String,
//       trim: true,
//     },
//     order: {
//       type: Number,
//       trim: true,
//     },
//     thumbnail: {
//       type: String,
//     },
//     poster: {
//       type: String,
//     },
//     description: {
//       type: String,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // add plugin that converts mongoose to json
// chapterSchema.plugin(toJSON);
// chapterSchema.plugin(paginate);

// const Chapter = mongoose.model('Chapter', chapterSchema);

// module.exports = Chapter;
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

// Reusable section schema
const sectionSchema = mongoose.Schema(
  {
    icon: {
      type: String,
      trim: true,
    },
    poster: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { _id: false } // Prevent auto _id for subdocs
);

const chapterSchema = mongoose.Schema(
  {
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
    chapterName: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      trim: true,
    },
    thumbnail: {
      type: String,
    },
    poster: {
      type: String,
    },
    description: {
      type: String,
    },

    // Additional Sectional Fields (like lesson model)
    ebook: sectionSchema,
    quickRecap: sectionSchema,
    bookQuestionSolutions: sectionSchema, // NCERT Book Solutions
    chapterEvaluation: sectionSchema,
  },
  {
    timestamps: true,
  }
);

// Add plugins
chapterSchema.plugin(toJSON);
chapterSchema.plugin(paginate);

const Chapter = mongoose.model('Chapter', chapterSchema);

module.exports = Chapter;
