require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");
mongoose.connect(config.connectionString);

const User = require("./models/user.model");
const Course = require("./models/course.model");
const TeacherApplication = require("./models/teacherApplication.model");
const Purchase = require("./models/purchase.model");
const Contact = require('./models/contact.model');

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });


app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

// Create Account
app.post("/create-account", async (req, res) => {
  const { fullName, birthday, gender, age, phone, address, email, password } =
    req.body;

  if (!fullName) {
    return res
      .status(400)
      .json({ error: true, message: "Full Name is required" });
  }

  if (!birthday) {
    return res
      .status(400)
      .json({ error: true, message: "Birthday is required" });
  }

  if (birthday && age) {
    const date = new Date(birthday);
    const today = new Date();
    const ageCheck = today.getFullYear() - date.getFullYear();
    const month = today.getMonth() - date.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < date.getDate())) {
      ageCheck--;
    }
    if (ageCheck != age) {
      return res
        .status(400)
        .json({ error: true, message: "Age does not match birthday" });
    }
  }

  if (!gender) {
    return res.status(400).json({ error: true, message: "Gender is required" });
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
      message: "User already exists",
    });
  }

  try {
    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 rounds of salting

    const user = new User({
      email,
      password: hashedPassword,
      fullName,
      birthday,
      gender,
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
  } catch (error) {
    console.error("Error creating account:", error);
    return res.status(500).json({ error: true, message: "Server error" });
  }
});


//edit user
app.put("/edit-user/:userId", authenticateToken, async (req, res) => {
  const { userId } = req.params;
  const { email, password, fullName, birthday, gender, age, phone, address } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    if (email) user.email = email;
    if (fullName) user.fullName = fullName;
    if (birthday) user.birthday = birthday;
    if (gender) user.gender = gender;
    if (age) user.age = age;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

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

  // Find user by email
  const userInfo = await User.findOne({ email: email });

  if (!userInfo) {
    return res.status(400).json({ message: "User not found" });
  }

  // Compare provided password with hashed password in the database
  const isPasswordValid = await bcrypt.compare(password, userInfo.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      error: true,
      message: "Invalid Credentials",
    });
  }

  // Generate access token if password is valid
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
});

//delete user
app.delete("/delete-user/:userId", authenticateToken, async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    await User.findByIdAndDelete(userId);

    return res.json({
      error: false,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

//Get All Users
app.get("/get-all-users", authenticateToken, async (req, res) => {
  const { user } = req.user;
  if (user.role !== 'admin') {
    return res.status(403).json({ error: true, message: "Unauthorized" });
  }

  try {
    const users = await User.find({});
    res.json({ error: false, users });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Server Error" });
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

//get user by id
app.get("/get-user/:userId", authenticateToken, async (req, res) => {
  const userId = req.params.userId;

  const isUser = await User.findOne({ _id: userId });
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
    price,
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

  if (!price) {
    return res.status(400).json({ error: true, message: "Price is required" });
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
      price,
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
    price,
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
    !price &&
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
    if (price) course.price = price;
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

// register to course
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
      // Register the user in the course
      course.members.push(req.body.userId);
      if (course.members.length === course.capacity) {
        course.status = "closed";
      }
      if (!user.courses.includes(courseId)) {
        user.courses.push(courseId);
      } else {
        return res.json({
          error: true,
          message: "User already registered for this course",
        });
      }

      // Create a new Purchase record
      const newPurchase = new Purchase({
        userId: user._id,
        courseId: course._id,
        courseName: course.title,
        userName: user.fullName,
        datePurchase: new Date(),
        cost: course.price,
      });

      await newPurchase.save(); // Save the purchase record
    }

    await user.save(); // Save the user update
    await course.save(); // Save the course update

    return res.json({
      error: false,
      course,
      message: "User registered and purchase recorded successfully",
    });
  } catch (error) {
    console.error("Error registering for course:", error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Get all Courses
app.get("/get-all-courses", authenticateToken, async (req, res) => {
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

// Change user role by user ID
app.put('/change-user-role/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { role } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.status(200).json({ error: false, message: "User role updated successfully" });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: true, message: "An unexpected error occurred. Please try again." });
  }
});


app.put("/remove-member/:courseId/:memberId", authenticateToken, async (req, res) => {
  const courseId = req.params.courseId;
  const memberId = req.params.memberId;
  const { user } = req.user;

  try {
    const course = await Course.findOne({ _id: courseId });

    if (!course) {
      return res.status(404).json({ error: true, message: "Course not found" });
    }
    
    if (user.role !== 'admin' && user.role !== 'teacher') {
      return res.status(403).json({ error: true, message: "Unauthorized" });
    }

    // Allow teachers to remove members only if they own the course
    if (user.role === 'teacher' && course.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ error: true, message: "Unauthorized" });
    }

    const memberIndex = course.members.indexOf(memberId);

    if (memberIndex > -1) {
      course.members.splice(memberIndex, 1);

      // Update course status if it's full and now has space
      if (course.status === "closed" && course.members.length < course.capacity) {
        course.status = "open";
      }

      await course.save();

      // Remove course from the user's course list
      const member = await User.findById(memberId);
      if (member) {
        const courseIndex = member.courses.indexOf(courseId);
        if (courseIndex > -1) {
          member.courses.splice(courseIndex, 1);
          await member.save();
        }
      }

      return res.json({
        error: false,
        course,
        message: "Member removed successfully",
      });
    } else {
      return res.status(404).json({
        error: true,
        message: "Member not found in this course",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});


// Search Courses
app.get("/search-courses", authenticateToken, async (req, res) => {
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

// In your backend file (e.g., app.js)
app.post("/apply-teacher", authenticateToken, upload.single('file'), async (req, res) => {
  const { fullName, email, phone, qualifications, experience } = req.body;
  const userId = req.user.user._id;

  if (!fullName || !email || !phone || !qualifications || !experience || !req.file) {
    return res.status(400).json({ error: true, message: "All fields are required" });
  }

  const fileUrl = `/uploads/${req.file.filename}`;

  try {
    const application = new TeacherApplication({
      userId,
      fullName,
      email,
      phone,
      qualifications,
      experience,
      fileUrl,
      status: "pending",
      appliedOn: new Date(),
    });

    await application.save();

    return res.json({ error: false, message: "Application submitted successfully" });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});



// Get all teacher applications
app.get("/get-all-teacher-applications", authenticateToken, async (req, res) => {
  const { user } = req.user;

  if (user.role !== "admin") {
    return res.status(403).json({ error: true, message: "Unauthorized" });
  }

  try {
    const applications = await TeacherApplication.find({});
    res.json({ error: false, applications });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Approve teacher application
app.put("/approve-application/:applicationId", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const applicationId = req.params.applicationId;

  if (user.role !== "admin") {
    return res.status(403).json({ error: true, message: "Unauthorized" });
  }

  try {
    const application = await TeacherApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({ error: true, message: "Application not found" });
    }

    const userToUpdate = await User.findById(application.userId);
    if (!userToUpdate) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    userToUpdate.role = "teacher";
    await userToUpdate.save();

    application.status = "approved";
    await application.save();

    res.json({ error: false, message: "Application approved and user role updated" });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

app.put("/deny-application/:applicationId", authenticateToken, async (req, res) => {
  try {
    const applicationId = req.params.applicationId;
    const application = await TeacherApplication.findById(applicationId);

    if (!application) {
      return res.status(404).json({ error: true, message: "Application not found" });
    }

    const filePath = path.join(__dirname, application.fileUrl);

    // Deny the application
    application.status = "denied";
    await application.save();

    // Delete the application
    await TeacherApplication.findByIdAndDelete(applicationId);

    // Delete the file
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
      }

      return res.json({ error: false, message: "Application denied and deleted successfully" });
    });
  } catch (error) {
    console.error('Error processing application denial:', error);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});


app.delete('/delete-application/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const application = await TeacherApplication.findOne({ userId: userId });
    if (!application) {
      return res.status(404).json({ error: true, message: 'Application not found' });
    }

    const filePath = path.join(__dirname, application.fileUrl);

    // Delete the application
    await TeacherApplication.findByIdAndDelete(application._id);

    // Delete the file
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
      }

      return res.json({ message: 'Application and associated file deleted successfully!' });
    });
  } catch (error) {
    console.error('Error deleting application:', error);
    return res.status(500).json({ error: 'An error occurred while deleting the application.' });
  }
});


// Get application status by user ID
app.get('/get-application-status/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const application = await TeacherApplication.findOne({ userId: userId });

    if (!application) {
      return res.status(200).json({ message: 'No application found', status: 'none' });
    }

    res.status(200).json({ status: application.status });
  } catch (error) {
    console.error('Error fetching application status:', error);
    res.status(500).json({ message: 'An unexpected error occurred. Please try again.' });
  }
});


app.get("/get-all-purchases", authenticateToken, async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate("userId", "fullName email") // Populates user information
      .populate("courseId", "title") // Populates course information
      .exec();

    return res.json({
      error: false,
      purchases,
      message: "All purchases retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving purchases:", error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

app.get("/search-purchases", authenticateToken, async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: true, message: "Query is required" });
  }

  try {
    
    let dateQuery = null;
    if (!isNaN(Date.parse(query))) {
      dateQuery = new Date(query);
    }

    
    const searchConditions = [
      { "courseName": { $regex: query, $options: "i" } },
      { "userName": { $regex: query, $options: "i" } },
    ];

    
    if (dateQuery) {
      searchConditions.push({ datePurchase: { $eq: dateQuery } });
    }

    const purchases = await Purchase.find({
      $or: searchConditions,
    })
      .populate("userId", "fullName") // Replace with the correct field in the User schema
      .populate("courseId", "title"); // Replace with the correct field in the Course schema

    return res.json({ error: false, purchases });
  } catch (error) {
    console.error("Error in /search-purchases route:", error);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});






app.get("/search-users", authenticateToken, async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: true, message: "Query is required" });
  }

  try {
    const users = await User.find({
      $or: [
        { fullName: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { phone: { $regex: query, $options: "i" } },
      ],
    });

    return res.json({ error: false, users });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

app.get("/search-courses", authenticateToken, async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: true, message: "Query is required" });
  }

  try {
    const courses = await Course.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { subCategory: { $regex: query, $options: "i" } },
      ],
    });

    return res.json({ error: false, courses });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

app.get("/search-applications", authenticateToken, async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: true, message: "Query is required" });
  }

  try {
    const applications = await TeacherApplication.find({
      $or: [
        { fullName: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { phone: { $regex: query, $options: "i" } },
        { qualifications: { $regex: query, $options: "i" } },
        { experience: { $regex: query, $options: "i" } },
      ],
    });

    return res.json({ error: false, applications });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Route to handle contact form submission
app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.status(201).json({ message: 'Message received. We will get back to you soon.' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving message. Please try again.' });
  }
});

//getAllContactMessages
app.get("/get-all-contact-messages", authenticateToken, async (req, res) => {
  const { user } = req.user;

  if (user.role !== "admin") {
    return res.status(403).json({ error: true, message: "Unauthorized" });
  }

  try {
    const messages = await Contact.find({});
    res.json({ error: false, messages });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// DELETE route to delete a contact message by ID
app.delete('/delete-contact/:id', async (req, res) => {
  try {
    const contactId = req.params.id;
    const deletedContact = await Contact.findByIdAndDelete(contactId);

    if (!deletedContact) {
      return res.status(404).json({ error: 'Contact message not found' });
    }

    res.json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    console.error("Error deleting contact message:", error);
    res.status(500).json({ error: 'Server error. Unable to delete contact message.' });
  }
});

app.get("/search-contact-messages", authenticateToken, async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: true, message: "Query is required" });
  }

  try {
    const contacts = await Contact.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { message: { $regex: query, $options: "i" } },
      ],
    });

    return res.json({ error: false, contacts });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});



app.listen(8000);

module.exports = app;
