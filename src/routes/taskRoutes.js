const { getAllTasks,getIncompleteTasks, getTaskById, createTask, updateTask, completeTask, deleteTask } = require("../controllers/taskController");

const router = require("express").Router();

router.get("/all", getAllTasks);

router.get("/", getIncompleteTasks);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.put("/:id", updateTask);
router.patch("/:id", completeTask);
router.delete("/:id", deleteTask);

module.exports = {
    taskRouter: router
}