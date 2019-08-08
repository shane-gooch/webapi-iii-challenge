require("dotenv").config();
const api = require("./api/server.js");

const UserRouter = require("./users/userRouter");
const PostRouter = require("./posts/postRouter");

api.use("/api/users", UserRouter);
api.use("/api/users", PostRouter);

api.use(function(req, res) {
  res.status(404).send("<h1>You messed up, this URL does not exist...</h1>");
});

const port = process.env.PORT || 5000;
api.listen(port, () => console.log(`Api is running on ${port}`));
