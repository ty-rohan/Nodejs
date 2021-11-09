const express = require("express");
const routes = require("./router/index").routes();
const { connect } = require("./helper/dbConnect");
const cors = require("cors");

const server = express();
server.use(cors());
server.use(express.urlencoded({ extended: true, limit: "20mb" }));
server.use(express.json({ limit: "20mb" }));
server.use(routes);
server.listen(8080, () => {
  console.log("Server started at port 8080");
  connect();
});
