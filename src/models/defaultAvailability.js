const mongoose = require("mongoose");
const { locationSchema, slotTimeSchema } = require("./commonSchemas");
const { Schema } = mongoose;

const defaultAvailability = new Schema(
  {
    locationStatus: {
      type: String,
      enum: ["OnTheMove", "AtSalon"],
      required: true,
    },
    centerLocation: {
      type: locationSchema,
      required: true,
    },
    workingHours: {
      type: slotTimeSchema,
      required: true,
    },
    lunchBreakHours: {
      type: slotTimeSchema,
    },

    offDays: [
      {
        type: String,
        enum: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        default: ["Sun", "Sat"],
      },
    ], //default: Sun 0, Sat 6
    areaRadius: { type: Number },
    freelancer: { type: Schema.Types.ObjectId, ref: "freelancer" },
  },
  { versionKey: false }
);

module.exports = mongoose.model("defaultAvailability", defaultAvailability);
