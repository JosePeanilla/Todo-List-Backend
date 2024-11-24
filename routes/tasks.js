const express = require("express");
const router = express.Router();

//Simulación de una base de datos
let tasks = [
    { id: "1", title: "Comprar pan", description: "Comprar pan sin glutén en la panadería de la esquina", status: "TODO", dueDate: "2024-11-30", user: "Sandra" },
    { id: "2", title: "Llevar a la perra al veterinario", description: "Preguntar porque cogea cuando se despierta de la siesta", status: "IN_PROGRESS", dueDate: "2024-11-25", user: "Jose"}
];

//Ruta para obtener una lista de las tareas incompletas
router.get("/", (req, res) => {
    const incompleteTasks = tasks.filter(task => task.status !== "DONE");
    res.status(200).json(incompleteTasks);
});

//Ruta para obtener una tarea concreta por su ID
router.get("/:id", (req, res) => {
    const taskId = req.params.id;
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        res.status(200).json(task);
    } else {
        res.status(404).json({ msg: "Task not found" });
    }
});

//Ruta para crear una tarea nueva
router.post("/", (req, res) => {
    const { title, description, status, dueDate, user } = req.body;

    if (!title || !description || !status || !dueDate || !user) {
        res.status(400).json({ msg: "Missing required parameters" });
    } else {
        const newTask = { id: String(tasks.length + 1), title, description, status, dueDate, user };
        tasks.push(newTask);
        res.status(201).json({ msg: "Task created", id: newTask.id});
    } 
});

//Ruta para actualizar una tarea ya creada
router.put("/:id", (req, res) => {
    const taskId = req.params.id;
    const { title, description, status, dueDate, user } = req.body; 

    if (!title || !description || !status || !dueDate || !user) {    
        res.status(400).json({ msg: "Missing required parameters" });
    } else {
        const task = tasks.find(task => task.id === taskId);
        if (task) {
            task.title = title;
            task.description = description;
            task.status = status;
            task.dueDate = dueDate;
            task.user = user;
            res.status(200).json({ msg: "Task updated" });
        } else {
            res.status(404).json({ msg: "Task not found" });
        }       
    }
});
  
//Ruta para marcar una tarea como completada
router.patch("/:id", (req, res) => {
    const taskId = req.params.id;
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        task.status = "DONE";
        res.status(200).json({ msg: "Task marked as completed" });
    } else {
        res.status(404).json({ msg: "Task not found" });
    }       
});

//Ruta para eliminar una tarea
router.delete("/:id", (req, res) => {
    const taskId = req.params.id;
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        res.status(200).json({ msg: "Task removed successfully" });
    } else {
        res.status(404).json({ msg: "Task not found" });
    }       
});

module.exports = router;