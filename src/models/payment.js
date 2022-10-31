const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const payment = new Schema({
  paymentIntentId: { type: String },
  date: { type: Date },
  amount: { type: Number },
  paymentStatus: {
    type: String,
    enum: ["succeeded", "early_cancellation", "late_cancellation"],
  },
  appointment: { type: ObjectId, ref: "appointment" },
  freelancer: { type: ObjectId, ref: "freelancer" },
  customer: { type: ObjectId, ref: "customer" },
});

module.exports = mongoose.model("payment", payment);
