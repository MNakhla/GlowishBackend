require("dotenv").config();
const AUTH_SECRET = process.env.AUTH_SECRET;

module.exports = {
  authSecret: AUTH_SECRET,
  expiration: 21600, // 6 hours
};
