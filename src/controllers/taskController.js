const mongoose = require("mongoose");
const taskService = require("../services/taskService");

const getAllTasks = async (req, res) => {
    try {
        const tasks = await taskService.getAllTasks();
        res.status(200).json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error al obtener las tareas" });
    }
};

const getIncompleteTasks = async (req, res) => {
    const tasks = await taskService.getIncompleteTasks();
    res.status(200).json(tasks.map(task => ({
        ...task,
        description: task.description || "",
        createdAt: task.createdAt || new Date().toISOString(),
        modifiedAt: task.modifiedAt || new Date().toISOString(),
    })));
};

const getTaskById = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: "Invalid ID format" });

    const task = await taskService.getTaskById(id);
    if (!task) return res.status(404).json({ msg: "Task not found" });
    res.status(200).json(task);
};

const createTask = async (req, res) => {
    const { title, description, status, dueDate, user } = req.body;
    if (!title) return res.status(400).json({ msg: "Missing title" });

    try {
        const newTask = await taskService.createTask({
            title,
            description,
            status: status || "TODO",
            dueDate: dueDate ? new Date(dueDate) : null,
            user: user || "Anonymous",
            createdAt: new Date(),
            modifiedAt: new Date(),
        });
        res.status(201).json({ msg: "Task created", task: newTask });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error al crear tarea" });
    }
};

const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, dueDate, status, user } = req.body;

    if (!title) return res.status(400).json({ msg: "Missing title" });
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: "Invalid ID format" });

    try {
        const updatedTask = await taskService.updateTask(id, {
            title,
            description: description || "",
            dueDate: dueDate ? new Date(dueDate) : null,
            status,
            user,
            modifiedAt: new Date(),
        });
        if (!updatedTask) return res.status(404).json({ msg: "Task not found" });
        res.status(200).json({ msg: "Task updated", task: updatedTask });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error al actualizar tarea" });
    }
};

const completeTask = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: "Invalid ID format" });

    try {
        const task = await taskService.toggleStatus(id);
        if (!task) return res.status(404).json({ msg: "Task not found" });
        res.status(200).json({ msg: "Task status toggled", task });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error toggling task" });
    }
};

const deleteTask = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: "Invalid ID format" });

    const task = await taskService.deleteTask(id);
    if (!task) return res.status(404).json({ msg: "Task not found" });
    res.status(200).json({ msg: "Task deleted" });
};

module.exports = {
    getAllTasks,
    getIncompleteTasks,
    getTaskById,
    createTask,
    updateTask,
    completeTask,
    deleteTask,
};
