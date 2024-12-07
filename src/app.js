const express = require("express");
const { default: mongoose } = require("mongoose");
const TaskModel = require("./models/task");

const app = express();

const port = 3000;

app.use(express.json());

const dbConnectionStringCloud = `mongodb+srv://josepeanilla:nuclio@aplicaciondetareas.c43oe.mongodb.net/?retryWrites=true&w=majority&appName=aplicaciondetareas`

mongoose.connect(dbConnectionStringCloud)
    .then(db => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));

app.get('/', (req, res) => {
    res.send('Bienvenido/a a la APP para gestionar tus tareas!');
});

//Simulación de una base de datos


let user = [
    { id: "1", firstName: "Sandra", lastName: "Fernández", email: "sandra@example.com", password: "sandra123" },
    { id: "2", firstName: "Jose", lastName: "Peanilla", email: "jose@example.com", password: "jose123"}
];

//Función para obtener una lista de tareas incompletas
app.get("/tasks", (req, res) => {
    const incompleteTasks = tasks.filter(task => task.status !== "DONE");
    res.status(200).json(
        incompleteTasks.map(task => ({
            ...task,
            createdAt: task.createdAt || new Date().toISOString(),
            modifiedAt: task.modifiedAt || new Date().toISOString(),
        }))
    );
});

//Función para obtener una tarea por su ID
app.get("/tasks/:id", (req,res) => {
    const { id } = req.params;
    const task = tasks.find(task => task.id === id);
    if (!task) return res.status(404).json({ msg: "Task not found" });    
    res.status(200).json(task);
});

//Función para crear una nueva tarea
app.post("/task", async (req, res) => {
    const { title, description, status, dueDate, user} = req.body;
    if (!title || !description || !dueDate) return res.status(400).json({ msg: "You missed some parameters: parameter1, parameter2, ..." });
    const newTask = new TaskModel({
        title,
        description: description || "",
        status: status || "TODO",
        dueDate: dueDate || null,
        user: user || null,
        createdAt: new Date(),
        modifiedAt: new Date(),
        deletedAt: null
    });
    await newTask.save();
    res.status(201).json({ msg: "Task created", id: newTask.id });
});

//Función para actualizar una tarea
app.put("/tasks/:id", (req, res) => {
    const { id } = req.params;
    const {title, description, dueDate, status, user } = req.body;
    const task = tasks.find(tasks => tasks.id === id);
    if (!task) return res.status(404).json({ msg: "Task not found" });
    if (!id || !title || !description || !dueDate) return res.status(400).json({ msg: "You missed some parameters: parameter1, parameter2, ..." });
    task.title = title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.status = status || task.status;
    task.user = user || task.user;
    task.modifiedAt = new Date();
    res.status(200).json({ msg: "Task updated" });
});

//Función para marcar una tarea como completada
app.patch("/tasks/:id?", (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ msg: "You missed parameter 'id'"});
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return res.status(404).json({ msg: "Task not found" });
    tasks[taskIndex].status = "DONE";
    tasks[taskIndex].modifiedAt = new Date();   
    res.status(200).json({ msg: "Task marked as completed" });
});

//Función para eliminar una tarea
app.delete("/tasks/:id?", (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ msg: "You missed parameter 'id'" });
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return res.status(404).json({ msg: "Task not found" });
    tasks.splice(taskIndex, 1);
    tasks.forEach((task, index) => {
        task.id = (index + 1).toString();
    });
    res.status(200).json({ msg: "Task removed successfully" });
});

//Función para obtener la información del usuario
app.get("/user", (req, res) => {
    res.status(200).json(user);
});

//Función para iniciar sesión de un usuario
app.post("/user/login", (req, res) => {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email);
    if (!user) return res.status(404).json({ msg: "User not found" });
    if (user.password !== password) return res.status(403).json({ msg: "Forbidden" });
    res.status(200).json({ msg: "Login successful" });
});

const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

module.exports = { app, server };