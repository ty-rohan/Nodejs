const mongoose = require("mongoose");
require("dotenv").config();

module.exports.connect = async () => {
  await mongoose.connect(process.env.DB);
  console.log("connected to db");
};
