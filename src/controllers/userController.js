const userService = require("../services/userService");

const createUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password)
        return res.status(400).json({ msg: "Missing parameters" });

    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) return res.status(409).json({ msg: "Email already used" });

    const newUser = await userService.createUser({ firstName, lastName, email, password });
    res.status(201).json({ msg: "User created", id: newUser.id });
};

const getUser = async (req, res) => {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
};

const userLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "Missing email or password" });

    const user = await userService.findUserByEmail(email);
    if (!user) return res.status(404).json({ msg: "User not found" });
    if (user.password !== password) return res.status(403).json({ msg: "Invalid credentials" });

    res.status(200).json({ msg: "Login successful" });
};

module.exports = {
    createUser,
    getUser,
    userLogin,
};
