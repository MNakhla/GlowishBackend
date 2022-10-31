const mongoose = require("mongoose");
const { Schema } = mongoose;

const customer = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String },
    profilePicture: { type: String },
    appointments: [{ type: Schema.Types.ObjectId, ref: "appointment" }],
    payments: [{ type: Schema.Types.ObjectId, ref: "payment" }],
    deleted: { type: Boolean, default: false },
    notifications: [
      {
        message: { type: String, required: true },
        read: { type: Boolean, default: false },
        appointmentId: { type: Schema.Types.ObjectId, ref: "appointment" },
        time: { type: String },
      },
    ],
  },
  { versionKey: false }
);

module.exports = mongoose.model("customer", customer);
