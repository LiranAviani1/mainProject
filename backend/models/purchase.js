const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const purchaseSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  courseName: { type: String, required: true },
  userName: { type: String, required: true },
  datePurchase: { type: Date, default: Date.now },
  cost: { type: Number, required: true },
});

module.exports = mongoose.model("Purchase", purchaseSchema);
