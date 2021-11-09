const bcrypt = require("bcrypt");
const crypto = require("crypto-js");
const saltRounds = 2;

module.exports.encrypt = (password) => {
  //   const salt = bcrypt.genSaltSync(saltRounds);
  //   const hash = bcrypt.hashSync(password, salt);
  //   return hash;
  const hash = crypto.HmacSHA256(password, "sxdcfvgbhnjimok").toString();
  return hash;
};
