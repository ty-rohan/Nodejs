const { encrypt } = require("../helper/encrypt");
const User = require("../model/user");
module.exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  const user = await User.findOne({
    email,
  });
  const pass = encrypt(password);
  if (user) {
    res.json({
      message: "user already registered",
    });
  } else {
    await User({
      username,
      email,
      password: pass,
    }).save();
    res.json({
      message: "user registered",
    });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    email,
  });
  if (!user) {
    res.json({ message: "User not found" });
  } else {
    const pass = encrypt(password);
    if (pass === user.password) {
      res.json({ message: "Password match" });
    }
  }
};
