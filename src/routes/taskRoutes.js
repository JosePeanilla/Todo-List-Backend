const { Router } = require("express");
const controller = require("../controllers/taskController");

const router = Router();

router.get("/all", controller.getAllTasks);
router.get("/", controller.getIncompleteTasks);
router.get("/:id", controller.getTaskById);
router.post("/", controller.createTask);
router.put("/:id", controller.updateTask);
router.patch("/:id", controller.completeTask);
router.delete("/:id", controller.deleteTask);

module.exports = { taskRouter: router };
