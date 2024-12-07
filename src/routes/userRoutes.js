const { createUser, getUser, userLogin } = require("../controllers/userController");

const router = require("express").Router();

router.post("/", createUser);
router.get("/", getUser);
router.post("/login", userLogin);

module.exports = {
    userRouter: router
}