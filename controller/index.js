const { encrypt } = require("../helper/encrypt");
const User = require("../model/user");
var jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

//  user registration
module.exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({
      email,
    });
    const pass = encrypt(password);
    if (user) {
      res.json({
        message: "user already registered",
        success: false,
      });
    } else {
      await User({
        username,
        email,
        password: pass,
      }).save();
      let testAccount = await nodemailer.createTestAccount();
      // create reusable transporter object using the default SMTP transport
      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: testAccount.pass, // sender address
        to: email, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world", // plain text body
        html: `<a href='localhost:8080/verify?email=${email}'><button>Click to verify</button></a>`, // html body
      });
      res.json({
        message:
          "user registered successfully please check your email to verify",
        data: {
          username: username,
          email: email,
        },
        success: true,
      });
    }
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
};

//  User login
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email,
    });
    if (!user) {
      res.json({ message: "User not found", success: false });
    } else {
      if (user.varified) {
        const pass = encrypt(password);
        if (pass === user.password) {
          const token = jwt.sign({ user }, "shhhhh");
          res.header("token", token);
          res.json({
            message: "Login successful",
            data: {
              username: user.username,
              email: email,
            },
            success: true,
          });
        }
      } else {
        res.json({ message: "User is not varified", success: false });
      }
    }
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
};

//  User delete
module.exports.delete = async (req, res) => {
  try {
    const userid = req.body;
    const user = await User.find({
      _id: userid,
    });
    if (user.length) {
      const { deletedCount } = await User.deleteMany({ _id: userid });
      if (deletedCount > 0) {
        res.json({
          message: "User deleted",
          success: true,
        });
      } else {
        res.json({
          message: "User not found",
          success: false,
        });
      }
    } else {
      res.json({ messqage: "User not found", success: false });
    }
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
};

//  All User
module.exports.getall = async (req, res) => {
  try {
    const user = await User.find();
    if (user.length) {
      const tempUser = [];
      user &&
        user.map(item => {
          tempUser.push({
            id: item._id,
            username: item.username,
            email: item.email,
          });
        });
      res.json({
        data: tempUser,
        success: true,
      });
    } else {
      res.json({ message: "No user found", success: false });
    }
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
};

//  User update
module.exports.update = async (req, res) => {
  try {
    const { id, email, password, username } = req.body;
    const user = await User.findOne({ _id: id });
    if (user) {
      user.email = email ? email : user.email;
      const hashPass = encrypt(password);
      user.password = password ? hashPass : user.password;
      user.username = username ? username : user.username;
      await user.save();
      let updated_user = await User.findOne({ _id: id });
      res.json({
        message: "Successfully Updated",
        data: {
          id: updated_user._id,
          username: updated_user.username,
          email: updated_user.email,
        },
        success: true,
      });
    } else {
      res.json({ message: "User not found", success: false });
    }
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
};

//  Email verifiaction
module.exports.verify = async (req, res) => {
  const { email } = req.query;
  const user = await User.findOne({ email });
  if (user) {
    user.varified = true;
    const tempUser = await user.save();
    res.json({
      message: "Email has been verified",
      data: tempUser,
      success: true,
    });
  }
};
