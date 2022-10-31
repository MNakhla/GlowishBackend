// mogodb connection
const mongoose = require("mongoose");
require("dotenv").config();
const MONGODB_URL = process.env.MONGODB_URL;

const connectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: false,
};

const connectToDb = () => {
  mongoose
    .connect(MONGODB_URL, connectOptions)
    .then((con) => {
      console.log("Connected to MongoDB");
      return con;
    })
    .catch((error) => console.log(error));
};

module.exports = connectToDb;
