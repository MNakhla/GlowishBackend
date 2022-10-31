const mongoose = require("mongoose");
const { reviewSchema } = require("./commonSchemas");
const Schema = mongoose.Schema;

const freelancer = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      // , required: true
    },
    password: {
      type: String,
      // , required: true
    },
    phone: { type: String, default: "" },
    portfolio: [{ type: String }], //paths to pictures
    bio: { type: String, default: "" },
    averageRating: { type: Number, default: 0 },
    appointments: [{ type: Schema.Types.ObjectId, ref: "appointment" }],
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "service",
      },
    ],
    specificDateAvailability: [
      { type: Schema.Types.ObjectId, ref: "specificDateAvailability" },
    ],
    payments: [{ type: Schema.Types.ObjectId, ref: "payment" }],
    profilePicture: { type: String },
    facebookURL: { type: String, default: "" },
    instagramURL: { type: String, default: "" },
    defaultAvailability: {
      type: Schema.Types.ObjectId,
      ref: "defaultAvailability",
    },
    deleted: { type: Boolean, default: false },
    customers: [{ type: Schema.Types.ObjectId, ref: "customer" }],
    notifications: [
      {
        message: { type: String, required: true },
        read: { type: Boolean, default: false },
        appointmentId: { type: Schema.Types.ObjectId, ref: "appointment" },
        time: { type: String },
      },
    ],
    completed: { type: Boolean, default: false },
    reviews: [{ type: reviewSchema }],
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("freelancer", freelancer);
