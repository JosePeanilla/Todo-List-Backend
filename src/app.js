require("dotenv").config();
const cors = require("cors");
const express = require("express");
const { default: mongoose } = require("mongoose");

const { taskRouter } = require("./routes/taskRoutes");
const { userRouter } = require("./routes/userRoutes");

const app = express();

const port = 3000;

app.use(cors());
app.use(express.json());

const dbConnectionStringCloud = process.env.DB_CONNECTION_STRING;

mongoose.connect(dbConnectionStringCloud)
    .then(db => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));

app.get('/', (req, res) => {
    res.send('Bienvenido/a a la APP para gestionar tus tareas!');
});

app.use("/tasks", taskRouter);
app.use("/user", userRouter);

const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

module.exports = { app, server };