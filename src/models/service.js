const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const service = new Schema(
  {
    serviceCategory: {
      type: String,
      enum: ["Hair", "Makeup", "Nails"],
      required: true,
    },
    name: { type: String },
    price: { type: Number },
    estimatedTime: { type: Number },
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "freelancer" },
  },
  { versionKey: false }
);

module.exports = mongoose.model("service", service);
