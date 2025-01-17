const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String },
  password: { type: String },
  fullName: { type: String },
  birthday: { type: Date },
  gender: { type: String },
  age: { type: Number },
  phone: { type: String },
  address: { type: String },
  courses: { type: [String], default: [] },
  createdOn: { type: Date, default: new Date().getTime() },
  role: { type: String, default: "user" },
});

module.exports = mongoose.model("User", userSchema);
