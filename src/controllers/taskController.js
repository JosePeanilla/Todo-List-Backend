const mongoose = require("mongoose");
const TaskModel = require("../models/task");

const getAllTasks = async (req, res) => {
    try {
        const allTasks = await TaskModel.find().lean(); 
        res.status(200).json(allTasks); 
    } catch (error) {
        console.error("Error al obtener todas las tareas:", error);
        res.status(500).json({ msg: "Error al obtener todas las tareas" });
    }
};

const getIncompleteTasks = async (req, res) => {
    const incompleteTasks = await TaskModel.find({ status: { $ne: "DONE" } }).lean();
    res.status(200).json(
        incompleteTasks.map(task => ({
            ...task,
            description: task.description || "",
            createdAt: task.createdAt || new Date().toISOString(),
            modifiedAt: task.modifiedAt || new Date().toISOString(),
        }))
    );
}   

const getTaskById = async (req,res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid ID format" });
    }
    const task = await TaskModel.findById(id).lean();
    if (!task) {
        return res.status(404).json({ msg: "Task not found" });
    }  
    res.status(200).json(task);
}

const createTask = async (req, res) => {
    const { title, description, status, dueDate, user } = req.body;

    if (!title) return res.status(400).json({ msg: "El título es obligatorio." });

    try {
        const newTask = new TaskModel({
            title,
            description: description || "",
            status: status || "TODO",
            dueDate: dueDate || null,
            user: user || null,
            createdAt: new Date(),
            modifiedAt: new Date(),
            deletedAt: null,
        });

        await newTask.save();

        res.status(201).json({
            msg: "Task created",
            id: newTask.id,
            task: newTask, 
        });
    } catch (error) {
        console.error("Error al crear la tarea:", error);
        res.status(500).json({ msg: "Error al crear la tarea." });
    }
};

const updateTask = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid ID format" });
    }
    const { title, description, dueDate, status, user } = req.body;
    if (!title) return res.status(400).json({ msg: "You missed some parameters: parameter1, parameter2, ..." });
    const updatedTask = await TaskModel.findByIdAndUpdate(id, {
        title,
        description,
        dueDate,
        status,
        user,
        modifiedAt: new Date()
    }, { new: true });
    if (!updatedTask) return res.status(404).json({ msg: "Task not found" });
    res.status(200).json({ msg: "Task updated" });
}

const completeTask = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ msg: "You missed parameter 'id'" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid ID format" });
    }

    try {
        const task = await TaskModel.findById(id);

        if (!task) {
            return res.status(404).json({ msg: "Task not found" });
        }

        const newStatus = task.status === "DONE" ? "TODO" : "DONE";

        const updatedTask = await TaskModel.findByIdAndUpdate(
            id,
            { status: newStatus, modifiedAt: new Date() },
            { new: true }
        );

        res.status(200).json({ msg: "Task marked as completed", task: updatedTask });
    } catch (error) {
        console.error("Error toggling task status:", error);
        res.status(500).json({ msg: "Error toggling task status" });
    }
};

const deleteTask = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid ID format" });
    }
    if (!id) return res.status(400).json({ msg: "You missed parameter 'id'" });
    const task = await TaskModel.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ msg: "Task not found" });
    res.status(200).json({ msg: "Task removed successfully" });
}

module.exports = {
    getAllTasks,
    getIncompleteTasks,
    getTaskById,
    createTask,
    updateTask,
    completeTask,
    deleteTask,
}   