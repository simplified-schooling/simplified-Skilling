const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const statementSchema = new mongoose.Schema({
  actor: Object,
  verb: Object,
  object: Object,
  timestamp: { type: Date, default: Date.now },
});

// add plugin that converts mongoose to json
statementSchema.plugin(toJSON);
statementSchema.plugin(paginate);
const statement = mongoose.model('statement', statementSchema);

module.exports = statement;
