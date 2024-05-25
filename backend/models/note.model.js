const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noteSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: [String], default: [] },
  subCategory: { type: [String], default: [] },
  
  createdOn: { type: Date, default: new Date().getTime() },
});

module.exports = mongoose.model("Note", noteSchema);
