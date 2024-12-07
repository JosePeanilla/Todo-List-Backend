const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ["TODO", "PENDING", "IN_PROGRESS", "DONE"],
        default: "TODO",
    },
    user: {
        type: String,
        required: true,
    },    
    createdAt: {
        type: Date,
        default: Date.now,
    },
    modifiedAt: {
        type: Date,
        default: Date.now,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
});

const TaskModel = mongoose.model("Task", taskSchema);

module.exports = TaskModel;