require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");
mongoose.connect(config.connectionString);

const User = require("./models/user.model");
const Course = require("./models/course.model");

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
    return res
      .status(400)
      .json({ error: true, message: "Address is required" });
  }

  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }

  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Password is required" });
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
    courses: [],
    role: "user",
    createdOn: new Date().getTime(),
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

// Add Course
app.post("/add-course", authenticateToken, async (req, res) => {
  const {
    title,
    content,
    category,
    subCategory,
    dateStart,
    dateEnd,
    capacity,
    status,
  } = req.body;
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
    const course = new Course({
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

    await course.save();

    return res.json({
      error: false,
      course,
      message: "Course added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Edit Course
app.put("/edit-course/:courseId", authenticateToken, async (req, res) => {
  const courseId = req.params.courseId;
  const {
    title,
    content,
    category,
    subCategory,
    dateStart,
    dateEnd,
    capacity,
    status,
  } = req.body;
  const { user } = req.user;

  if (
    !title &&
    !content &&
    !category &&
    !subCategory &&
    !dateStart &&
    !dateEnd &&
    !capacity &&
    !status
  ) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }

  try {
    const course = await Course.findOne({ _id: courseId });

    if (!course) {
      return res.status(404).json({ error: true, message: "Course not found" });
    }

    if (title) course.title = title;
    if (content) course.content = content;
    if (category) course.category = category;
    if (subCategory) course.subCategory = subCategory;
    if (dateStart) course.dateStart = dateStart;
    if (dateEnd) course.dateEnd = dateEnd;
    if (capacity) course.capacity = capacity;
    if (status) course.status = status;

    await course.save();

    return res.json({
      error: false,
      course,
      message: "Course updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// update course
app.put("/register-course/:courseId", authenticateToken, async (req, res) => {
  const courseId = req.params.courseId;

  try {
    const user = await User.findOne({ _id: req.body.userId });
    const course = await Course.findOne({ _id: courseId });

    if (!course) {
      return res.status(404).json({ error: true, message: "Course not found" });
    }

    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    if (course.members.includes(req.body.userId)) {
      return res.json({
        error: true,
        message: "User already registered for this course",
      });
    } else if (course.members.length >= course.capacity) {
      return res.json({
        error: true,
        message: "Course is full",
      });
    } else if (course.status === "closed") {
      return res.json({
        error: true,
        message: "Course is closed",
      });
    } else {
      course.members.push(req.body.userId);
      if (!user.courses.includes(courseId)) {
        user.courses.push(courseId);
      } else {
        return res.json({
          error: true,
          message: "User already registered for this course",
        });
      }
    }

    await user.save();
    await course.save();

    return res.json({
      error: false,
      course,
      message: "Course updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Get all Courses
app.get("/get-all-courses", authenticateToken, async (req, res) => {
  const { user } = req.user;

  try {
    const courses = await Course.find().exec();

    return res.json({
      error: false,
      courses,
      message: "All courses retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Delete Course
app.delete("/delete-course/:courseId", authenticateToken, async (req, res) => {
  const courseId = req.params.courseId;
  const { user } = req.user;

  try {
    const course = await Course.findOne({ _id: courseId });

    if (!course) {
      return res.status(404).json({ error: true, message: "Course not found" });
    }

    await Course.deleteOne({ _id: courseId });

    return res.json({
      error: false,
      message: "Course deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Search Courses
app.get("/search-courses", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const { query } = req.query;

  if (!query) {
    return res
      .status(400)
      .json({ error: true, message: "Search query is required" });
  }

  try {
    const matchingCourses = await Course.find({
      $or: [
        { title: { $regex: new RegExp(query, "i") } }, // Case-insensitive title match
        { content: { $regex: new RegExp(query, "i") } }, // Case-insensitive content match
        { category: { $regex: new RegExp(query, "i") } }, // Case-insensitive category match
        { subCategory: { $regex: new RegExp(query, "i") } }, // Case-insensitive subCategory match
      ],
    });

    return res.json({
      error: false,
      courses: matchingCourses,
      message: "Courses matching the search query retrieved successfully",
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
