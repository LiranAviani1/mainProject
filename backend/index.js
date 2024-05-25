require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");
mongoose.connect(config.connectionString);

const User = require("./models/user.model");
const Curse = require("./models/curse.model");

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

// Create Account
app.post("/create-account", async (req, res) => {
  const { fullName, age, phone, address, email, password } = req.body;

  if (!fullName) {
    return res
      .status(400)
      .json({ error: true, message: "Full Name is required" });
  }

  if (!age) {
    return res.status(400).json({ error: true, message: "Age is required" });
  }

  if (!phone) {
    return res.status(400).json({ error: true, message: "Phone is required" });
  }

  if (!address) {
    return res.status(400).json({ error: true, message: "Address is required" });
  }

  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }

  if (!password) {
    return res.status(400).json({ error: true, message: "Password is required" });
  }

  const isUser = await User.findOne({ email: email });

  if (isUser) {
    return res.json({
      error: true,
      message: "User already exist",
    });
  }

  const user = new User({
    email,
    password,
    fullName,
    age,
    phone,
    address,
  });

  await user.save();

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "36000m",
  });

  return res.json({
    error: false,
    user,
    accessToken,
    message: "Registration Successful",
  });
});

//edit user
app.put("/edit-user/:userId", authenticateToken, async (req, res) => {
  const userId = req.params.userId;
  const { email, password, fullName, age, phone, address } = req.body;

  if (!email && !password && !fullName && !age && !phone && !address) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }

  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    if (email) user.email = email;
    if (password) user.password = password;
    if (fullName) user.fullName = fullName;
    if (age) user.age = age;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();

    return res.json({
      error: false,
      user,
      message: "User updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

//Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  const userInfo = await User.findOne({ email: email });

  if (!userInfo) {
    return res.status(400).json({ message: "User not found" });
  }

  if (userInfo.email == email && userInfo.password == password) {
    const user = { user: userInfo };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "36000m",
    });

    return res.json({
      error: false,
      message: "Login Successful",
      email,
      accessToken,
    });
  } else {
    return res.status(400).json({
      error: true,
      message: "Invalid Credentials",
    });
  }
});

//Get User
app.get("/get-user", authenticateToken, async (req, res) => {
  const { user } = req.user;

  const isUser = await User.findOne({ _id: user._id });

  if (!isUser) {
    return res.sendStatus(401);
  }

  return res.json({
    user: isUser,
    message: "",
  });
});

// Add Curse
app.post("/add-curse", authenticateToken, async (req, res) => {
  const { title, content, category, subCategory, dateStart, dateEnd, capacity, status } = req.body;
  const { user } = req.user;
  if (!title) {
    return res.status(400).json({ error: true, message: "Title is required" });
  }

  if (!content) {
    return res
      .status(400)
      .json({ error: true, message: "Content is required" });
  }

  if (!category) {
    return res
      .status(400)
      .json({ error: true, message: "Category is required" });
  }

  if (!subCategory) {
    return res
      .status(400)
      .json({ error: true, message: "SubCategory is required" });
  }

  if (!dateStart) {
    return res
      .status(400)
      .json({ error: true, message: "DateStart is required" });
  }

  if (!dateEnd) {
    return res
      .status(400)
      .json({ error: true, message: "DateEnd is required" });
  }

  if (!capacity) {
    return res
      .status(400)
      .json({ error: true, message: "Capacity is required" });
  }

  

  try {
    const curse = new Curse({
      title,
      content,
      category,
      subCategory,
      dateStart,
      dateEnd,
      capacity,
      members: [],
      status,
      userId: user._id,

    });

    await curse.save();

    return res.json({
      error: false,
      curse,
      message: "Curse added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Edit Curse
app.put("/edit-curse/:curseId", authenticateToken, async (req, res) => {
  const curseId = req.params.curseId;
  const { title, content, category, subCategory, dateStart, dateEnd, capacity, status} = req.body;
  const { user } = req.user;

  if (!title && !content && !category && !subCategory && !dateStart && !dateEnd && !capacity && !status) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }

  try {
    const curse = await Curse.findOne({ _id: curseId, userId: user._id });

    if (!curse) {
      return res.status(404).json({ error: true, message: "Curse not found" });
    }

    if (title) curse.title = title;
    if (content) curse.content = content;
    if (category) curse.category = category;
    if (subCategory) curse.subCategory = subCategory;
    if (dateStart) curse.dateStart = dateStart;
    if (dateEnd) curse.dateEnd = dateEnd;
    if (capacity) curse.capacity = capacity;
    if (status) curse.status = status;


    await curse.save();

    return res.json({
      error: false,
      curse,
      message: "Curse updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Get all Curses
app.get("/get-all-curses", authenticateToken, async (req, res) => {
  const { user } = req.user;

  try {
    const curses = await Curse.find({ userId: user._id }).sort({ isPinned: -1 });

    return res.json({
      error: false,
      curses,
      message: "All curses retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Delete Curse
app.delete("/delete-curse/:curseId", authenticateToken, async (req, res) => {
  const curseId = req.params.curseId;
  const { user } = req.user;

  try {
    const curse = await Curse.findOne({ _id: curseId, userId: user._id });

    if (!curse) {
      return res.status(404).json({ error: true, message: "Curse not found" });
    }

    await Curse.deleteOne({ _id: curseId, userId: user._id });

    return res.json({
      error: false,
      message: "Curse deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Search Curses
app.get("/search-curses", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const { query } = req.query;

  if (!query) {
    return res
      .status(400)
      .json({ error: true, message: "Search query is required" });
  }

  try {
    const matchingCurses = await Curse.find({
      userId: user._id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } }, // Case-insensitive title match
        { content: { $regex: new RegExp(query, "i") } }, // Case-insensitive content match
      ],
    });

    return res.json({
      error: false,
      curses: matchingCurses,
      message: "Curses matching the search query retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

app.listen(8000);

module.exports = app;
