const TaskModel = require("../models/task");

const getAllTasks = () => TaskModel.find().lean();

const getIncompleteTasks = () =>
    TaskModel.find({ status: { $ne: "DONE" } }).lean();

const getTaskById = (id) => TaskModel.findById(id).lean();

const createTask = (data) => new TaskModel(data).save();

const updateTask = (id, data) =>
    TaskModel.findByIdAndUpdate(id, data, { new: true });

const toggleStatus = async (id) => {
    const task = await TaskModel.findById(id);
    if (!task) return null;
    const newStatus = task.status === "DONE" ? "TODO" : "DONE";
    return TaskModel.findByIdAndUpdate(id, { status: newStatus, modifiedAt: new Date() }, { new: true });
};

const deleteTask = (id) => TaskModel.findByIdAndDelete(id);

module.exports = {
    getAllTasks,
    getIncompleteTasks,
    getTaskById,
    createTask,
    updateTask,
    toggleStatus,
    deleteTask,
};
