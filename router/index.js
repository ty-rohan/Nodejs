const express = require("express");
const controller = require("../controller/index");

module.exports.routes = () => {
  const router = express.Router();
  router.post("/reg", controller.register);
  router.post("/login", controller.login);
  router.delete("/delete/:id", controller.delete);
  router.get("/all", controller.getall);
  router.put("/update", controller.update);
  router.get("/verify/:email", controller.verify);
  return router;
};
