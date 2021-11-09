const { Schema, model } = require("mongoose");
const user = new Schema({
  username: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
});

module.exports = model("user", user);
