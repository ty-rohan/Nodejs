const express = require("express");
const controller = require("../controller/index");

module.exports.routes = () => {
  const router = express.Router();
  router.post("/reg", controller.register);
  router.post("/login", controller.login);
  return router;
};
