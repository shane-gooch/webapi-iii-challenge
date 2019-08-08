const express = require("express");
const helmet = require("helmet");

const server = express();

server.use(helmet());
server.use(helmet());
server.use(express.json());

server.use(function(req, res, next) {
  console.log(`[${new Date()}] ${req.method} to ${req.url} }`);
  next();
});

server.get("/", (req, res) => {
  res.status(200).json({ environment: process.env.environment });
});

module.exports = server;
