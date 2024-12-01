const express = require("express");

const app = express();

const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Bienvenido/a a la APP para gestionar tus tareas!');
});

//Simulación de una base de datos
let tasks = [
    { id: "1", title: "Comprar pan", description: "Comprar pan sin glutén en la panadería de la esquina", status: "TODO", dueDate: "2024-11-30", user: "Sandra" },
    { id: "2", title: "Llevar a la perra al veterinario", description: "Preguntar porque cogea cuando se despierta", status: "IN_PROGRESS", dueDate: "2024-11-25", user: "Jose"}
];

let users = [
    { id: "1", firstName: "Sandra", lastName: "Fernández", email: "sandra@example.com", password: "sandra123" },
    { id: "2", firstName: "Jose", lastName: "Peanilla", email: "jose@example.com", password: "jose123"}
];

//Función para obtener una lista de tareas incompletas
app.get("/tasks", (req, res) => {
    const incompleteTasks = tasks.filter(task => task.status !== "DONE");
    res.status(200).json(
        incompleteTasks.map(task => ({
            ...task,
            createdAt: task.createdAt || new Date(),
            modifiedAt: task.modifiedAt || new Date(),
        }))
    );
});

//Función para obtener una tarea por su ID
app.get("/tasks/:id", (req,res) => {
    const { id } = req.params;
    const task = tasks.find(task => task.id === id);
    const userPermissions = true;
    if (!userPermissions) return res.status(403).json({ msg: "Forbidden" });
    if (!task) return res.status(404).json({ msg: "Task not found" });    
    res.status(200).json(task);
});

//Función para crear una nueva tarea
app.post("/tasks", (req, res) => {
    const { title, description, status, dueDate, user} = req.body;
    if (!title || !description || !status || !dueDate || !user) return res.status(400).json({ msg: "You missed some parameters: parameter1, parameter2, ..." });
    const newTask = {
        id: (tasks.length + 1).toString(),
        title,
        description: description || "",
        status: status || null,
        dueDate: dueDate || null,
        user: user || null,
        createdAt: new Date(),
        modifiedAt: new Date(),
        deletedAt: null
    };
    tasks.push(newTask);
    res.status(201).json({ msg: "Task created", id: newTask.id });
});

//Función para actualizar una tarea
app.put("/tasks/:id", (req, res) => {
    const { id } = req.params;
    const { title, description, dueDate } = req.body;
    const task = tasks.find(tasks => tasks.id === id);
    if (!task) return res.status(404).json({ msg: "Task not found" });
    const userPermissions = true;
    if (!userPermissions) return res.status(403).json({ msg: "Forbidden" });
    if (!title) return res.status(400).json({ msg: "You missed some parameters: parameter1, parameter2, ..." });

    task.title = title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.modifiedAt = new Date();
    res.status(200).json({ msg: "Task updated" });
});

//Función para marcar una tarea como completada
app.patch("/tasks/:id", (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ msg: "You missed parameter 'id'"});
    const userPermissions = true;
    if (!userPermissions) return res.status(403).json({ msg: "Forbidden" });
    const task = tasks.find(task => task.id === id);
    if (!task) return res.status(404).json({ msg: "Task not found" });
    task.status = "DONE";
    res.status(200).json({ msg: "Task marked as completed" });
});

//Función para eliminar una tarea
app.delete("/tasks/:id", (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ msg: "You missed parameter 'id'"});
    const userPermissions = true;
    if (!userPermissions) return res.status(403).json({ msg: "Forbidden"});
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return res.status(404).json({ msg: "Task not found" });
    tasks.splice(taskIndex, 1);
    res.status(200).json({ msg: "Task removed successfully" });
});

//Función para obtener la información del usuario
app.get("/users", (req, res) => {
    res.status(200).json(users.map(user => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password
    })));
});

//Función para iniciar sesión de un usuario
app.post("/user/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)  return res.status(400).json({ msg: "Missing parameters: 'email' or 'password'" });
    const accesForbidden = false;
    if (!accesForbidden) return res.status(403).json({msg: "Forbidden"});
    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {return res.status(404).json({ msg: "User not found" })};
    res.status(200).json({ msg: "Login successful" });
});

const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

module.exports = { app, server };