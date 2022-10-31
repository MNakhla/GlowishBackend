const mongoose = require("mongoose");
const { Schema } = mongoose;

const locationSchema = new Schema(
  {
    address: { type: String, required: true },
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
  },
  { versionKey: false }
);

const slotTimeSchema = new Schema(
  {
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { versionKey: false }
);

const reviewSchema = new Schema({
  rating: { type: Number, required: true },
  reviewTitle: { type: String, required: true },
  reviewContent: { type: String, required: true },
  customer: { type: Schema.Types.ObjectId, ref: "customer" },
});

module.exports = { locationSchema, slotTimeSchema, reviewSchema };
