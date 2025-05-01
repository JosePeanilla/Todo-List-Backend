const UserModel = require("../models/user");

const createUser = (data) => new UserModel(data).save();

const findUserByEmail = (email) => UserModel.findOne({ email }).lean();

const getAllUsers = () => UserModel.find().lean();

module.exports = {
    createUser,
    findUserByEmail,
    getAllUsers,
};
