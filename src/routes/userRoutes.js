const { Router } = require("express");
const controller = require("../controllers/userController");

const router = Router();

router.post("/", controller.createUser);
router.get("/", controller.getUser);
router.post("/login", controller.userLogin);

module.exports = { userRouter: router };
