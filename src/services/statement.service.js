const httpStatus = require('http-status');
const { Statement } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Statemnet
 * @param {Object} reqBody
 * @returns {Promise<Statemnet>}
 */
const createStatement = async (reqBody) => {
  return Statement.create(reqBody);
};

/**
 * Query for Statemnet
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getAllStatement = async () => {
  const session = await Statement.find();
  return session;
};

/**
 * Get Statemnet by id
 * @param {ObjectId} id
 * @returns {Promise<Statemnet>}
 */
const getStatementById = async (id) => {
  return Statement.findById(id);
};

/**
 * Delete session by id
 * @param {ObjectId} sessionId
 * @returns {Promise<Statemnet>}
 */
const deleteStatementById = async (sessionId) => {
  const session = await getStatementById(sessionId);
  if (!session) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Statemnet not found');
  }
  await session.remove();
  return session;
};

module.exports = {
  createStatement,
  getAllStatement,
  deleteStatementById,
  getStatementById,
};
