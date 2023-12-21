const { Router } = require("express");
const { UserModel } = require("../models/UserModel");
require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRoutes = Router();

// login route
userRoutes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //input validation
    if (!email || !password) {
      return res.status(400).json({ msg: "enter all fields" });
    }

    // verifying user
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(200).json({ msg: "no user found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(200).json({ msg: "invalid credentials" });
    }

    // sending token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    return res.status(200).json({ msg: "login successful", user, token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// signup route
userRoutes.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // input validation
    if (!name || !email || !password) {
      return res.status(200).json({ msg: "enter all credentials" });
    }

    // checking duplicate
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(200).json({ msg: "user already exist" });
    }

    // save new users
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ name, password: hashedPassword, email });
    await newUser.save();
    return res.status(200).json({ msg: "user registered successfully" });
  } catch (error) {
    console.log("error during registration: ", error);
    return res.status(500).json({ error: "an error occurred" });
  }
});

module.exports = userRoutes;
