const httpStatus = require('http-status');
const { StudentQuestion } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a role
 * @param {Object} reqBody
 * @returns {Promise<StudentQuestion>}
 */
const createStudentQuestion = async (reqBody) => {
  return StudentQuestion.create(reqBody);
};

/**
 * get all  role
 * @returns {Promise<StudentQuestion>}
 */
const getAllStudentQuestion = async () => {
  const role = await StudentQuestion.find();
  return role;
};

/**
 * Get role by id
 * @param {ObjectId} id
 * @returns {Promise<StudentQuestion>}
 */
const getStudentQuestionById = async (id) => {
  return StudentQuestion.findById(id);
};

/**
 * Update role by id
 * @param {ObjectId} roleId
 * @param {Object} updateBody
 * @returns {Promise<StudentQuestion>}
 */
const updateStudentQuestionById = async (roleId, updateBody) => {
  const role = await getStudentQuestionById(roleId);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
  }
  Object.assign(role, updateBody);
  await role.save();
  return role;
};

/**
 * Delete role by id
 * @param {ObjectId} roleId
 * @returns {Promise<StudentQuestion>}
 */
const deleteStudentQuestionById = async (roleId) => {
  const role = await getStudentQuestionById(roleId);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
  }
  await role.remove();
  return role;
};

module.exports = {
  createStudentQuestion,
  getStudentQuestionById,
  getAllStudentQuestion,
  updateStudentQuestionById,
  deleteStudentQuestionById,
};
