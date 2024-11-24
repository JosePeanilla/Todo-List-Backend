const express = require("express");
const router = express.Router();

//Simulación de una base de datos
let tasks = [
    { id: '1', title: 'Comprar pan', description: 'Comprar pan sin glutén en la panadería de la esquina', status: 'TODO', dueDate: '2024-11-30', user: 'Sandra' },
    { id: '2', title: 'Llevar a la perra al veterinario', description: 'Preguntar porque cogea cuando se despierta de la siesta', status: 'IN_PROGRESS', dueDate: '2024-11-25', user: 'Jose'}
];

//Ruta para obtener una lista de las tareas incompletas
router.get("/", (req, res) => {
    const incompleteTasks = tasks.filter(task => task.status !== "DONE");
    res.status(200).json(incompleteTasks);
});