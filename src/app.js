const express = require("express");
const cors = require("cors");
const logger = require("./middlewares/logger");
const { taskRouter } = require("./routes/taskRoutes");
const { userRouter } = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.get("/", (req, res) => {
    res.send("Bienvenido/a a la APP para gestionar tus tareas!");
});

app.use("/tasks", taskRouter);
app.use("/user", userRouter);

module.exports = { app };
