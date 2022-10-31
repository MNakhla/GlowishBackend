const mongoose = require("mongoose");
const { locationSchema } = require("./commonSchemas");
const { Schema } = mongoose;

const appointment = new Schema(
  {
    date: { type: Date, required: true },
    location: { type: locationSchema, required: true },
    freelancer: {
      type: mongoose.Types.ObjectId,
      ref: "freelancer",
      required: true,
    },
    customer: {
      type: mongoose.Types.ObjectId,
      ref: "customer",
      required: true,
    },
    services: {
      type: [{ type: mongoose.Types.ObjectId, ref: "service" }],
      required: true,
    },
    price: { type: Number, required: true },
    cancelled: { type: Boolean, default: false },
    rating: Number,
    payment: { type: Schema.Types.ObjectId, ref: "payment" },
    review: String,
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { versionKey: false }
);

module.exports = mongoose.model("appointment", appointment);
