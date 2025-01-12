const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    dueDate: {
        type: Date,
        default: null,
    },
    status: {
        type: String,
        enum: ["TODO", "PENDING", "IN_PROGRESS", "DONE"],
        default: "TODO",
    },
    user: {
        type: String,
        default: "Anonymous",
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
