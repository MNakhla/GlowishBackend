const mongoose = require("mongoose");
const { locationSchema, hourStatusSchema } = require("./commonSchemas");
const { Schema } = mongoose;

const specificDateAvailability = new Schema(
  {
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "freelancer" },
    schedule: {
      //a day's schedule is an array of 12 hours starting 00 and ending 23,
      //each hour is comprised of four 15 min slots (eg. 07:00, 07:15, 07:30, 07:45),
      //each slot has a status of "disabled", "available", or "booked"
      //whenever an appointment is booked or the freelancer changes the day's availability from its default;
      //the day's schedule is recorded in this model
      type: [[]],
      required: true,
    },
    centerLocation: {
      type: locationSchema,
      required: true,
    },
    areaRadius: { type: Number }, //km
    date: { type: Date, required: true },
    locationStatus: {
      type: String,
      enum: ["OnTheMove", "AtSalon"],
    },
    offDay: { type: Boolean, required: true },
  },
  { versionKey: false }
);

module.exports = mongoose.model(
  "specificDateAvailability",
  specificDateAvailability
);
