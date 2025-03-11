const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: "user" } // Default role is 'user'
});

module.exports = mongoose.model("User", UserSchema);
