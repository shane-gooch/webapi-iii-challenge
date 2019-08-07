const express = require("express");
const helmet = require("helmet");

const UserRouter = require("./users/userRouter");

const server = express();

//global Middleware
server.use(express.json());
server.use(helmet());

server.use(function(req, res, next) {
  console.log(`[${new Date()}] ${req.method} to ${req.url} }`);
  next();
});
//custom Middleware
// function logger(req, res, next) {
//   console.log(req);
//   console.log(
//     `[${new Date().toISOString}] ${req.method} to ${req.url} from ${req.get(
//       "Origin"
//     )}`
//   );
//   next();
// }

server.use("/api/users", UserRouter);

server.use(function(req, res) {
  res.status(404).send("<h1>You messed up, this URL does not exist...</h1>");
});
server.listen(5000, () => console.log("Api is running on 5000"));
