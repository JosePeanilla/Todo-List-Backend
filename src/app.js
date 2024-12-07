const express = require("express");
const { default: mongoose } = require("mongoose");
const TaskModel = require("./models/task");
const UserModel = require("./models/user");

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

//Función para obtener una lista de tareas incompletas
app.get("/tasks", async (req, res) => {
    const incompleteTasks = await TaskModel.find({ status: { $ne: "DONE" } }).lean();
    res.status(200).json(
        incompleteTasks.map(task => ({
            ...task,
            createdAt: task.createdAt || new Date().toISOString(),
            modifiedAt: task.modifiedAt || new Date().toISOString(),
        }))
    );
});

//Función para obtener una tarea por su ID
app.get("/tasks/:id", async (req,res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid ID format" });
    }
    const task = await TaskModel.findById(id).lean();
    if (!task) {
        return res.status(404).json({ msg: "Task not found" });
    }  
    res.status(200).json(task);
});

//Función para crear una nueva tarea
app.post("/task", async (req, res) => {
    const { title, description, status, dueDate, user } = req.body;
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
app.put("/tasks/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, dueDate, status, user } = req.body;
    if (!title || !description || !dueDate || !status) return res.status(400).json({ msg: "You missed some parameters: parameter1, parameter2, ..." });
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
});

//Función para marcar una tarea como completada
app.patch("/tasks/:id?", async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ msg: "You missed parameter 'id'"});
    const updatedTask = await TaskModel.findByIdAndUpdate(id, {
        status: "DONE",
        modifiedAt: new Date()
    }, { new: true });
    if (!updatedTask) return res.status(404).json({ msg: "Task not found" });
    res.status(200).json({ msg: "Task marked as completed" });
});

//Función para eliminar una tarea
app.delete("/tasks/:id?", async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ msg: "You missed parameter 'id'" });
    const task = await TaskModel.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ msg: "Task not found" });
    res.status(200).json({ msg: "Task removed successfully" });
});

//Función para crear un nuevo usuario
app.post("/user", async (req, res)  => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) return res.status(400).json({ msg: "You missed some parameters: parameter1, parameter2, ..." });
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) return res.status(409).json({ msg: "Email already in use" });
    const newUser = new UserModel({
        firstName,
        lastName,
        email,
        password
    });
    await newUser.save();
    res.status(201).json({ msg: "User created", id: newUser.id });
    });

//Función para obtener la información del usuario
app.get("/user", async (req, res) => {
    const users = await UserModel.find().lean();
    res.status(200).json(users);
});

//Función para iniciar sesión de un usuario
app.post("/user/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "Missing parameters: 'email' or 'password'" });
    const user = await UserModel.findOne({ email }).lean();
    if (!user) return res.status(404).json({ msg: "User not found" });
    if (user.password !== password) return res.status(403).json({ msg: "Forbidden" });
    res.status(200).json({ msg: "Login successful" });
});

const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

module.exports = { app, server };