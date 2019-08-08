const express = require("express");
const helmet = require("helmet");

const UserRouter = require("./users/userRouter");
const PostRouter = require("./posts/postRouter");

const server = express();

//global Middleware
server.use(express.json());
server.use(helmet());

server.use(function(req, res, next) {
  console.log(`[${new Date()}] ${req.method} to ${req.url} }`);
  next();
});

server.use("/api/users", UserRouter);
server.use("/api/users", PostRouter);

server.use(function(req, res) {
  res.status(404).send("<h1>You messed up, this URL does not exist...</h1>");
});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Api is running on ${port}`));
