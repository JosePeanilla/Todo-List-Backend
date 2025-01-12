const mongoose = require("mongoose");
const UserModel = require("../models/user");

const createUser = async (req, res)  => {
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
    }

    const getUser = async (req, res) => {
        const users = await UserModel.find().lean();
        res.status(200).json(users);
    }

    const userLogin = async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ msg: "Missing parameters: 'email' or 'password'" });
        const user = await UserModel.findOne({ email }).lean();
        if (!user) return res.status(404).json({ msg: "User not found" });
        if (user.password !== password) return res.status(403).json({ msg: "Forbidden" });
        res.status(200).json({ msg: "Login successful" });
    }

    module.exports = {
        createUser,
        getUser,
        userLogin
    }
    