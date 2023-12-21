const mongoose = require("mongoose");
const { uuid } = require("uuidv4");

const userSchema = new mongoose.Schema({
  id: { type: String, default: uuid, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const UserModel = mongoose.model("user", userSchema);

module.exports = { UserModel };
