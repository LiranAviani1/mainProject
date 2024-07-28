const mongoose = require("mongoose");

const TeacherApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  qualifications: { type: String, required: true },
  experience: { type: String, required: true },
  status: { type: String, default: "pending" },
  appliedOn: { type: Date, default: Date.now },
});

const TeacherApplication = mongoose.model("TeacherApplication", TeacherApplicationSchema);

module.exports = TeacherApplication;
