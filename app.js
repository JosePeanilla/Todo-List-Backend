const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

const tasksRoutes = require("./routes/tasks");
const userRoutes = require("./routes/users");

app.use("/tasks", tasksRoutes);
app.use("/user", userRoutes);

const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

module.exports = { app, server };
