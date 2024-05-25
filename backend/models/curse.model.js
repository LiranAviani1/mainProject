const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const curseSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true},
  subCategory: { type: String, required: true},
  dateStart: { type: Date, default: new Date().getTime() },
  dateEnd: { type: Date, default: new Date().getTime() },
  capacity: { type: Number, default: 0 },
  members: { type: [String], default: [] },
  status: { type: String, default: "open" },
  userId: { type: String, required: true },
});

module.exports = mongoose.model("Curse", curseSchema);
