const router = require("express").Router();
const Users = require("./userDb.js");
const Posts = require("../posts/postDb.js");

router.post("/", validateUser, (req, res) => {
  const newUser = req.body;
  Users.insertUser(newUser)
    .then(newUser => {
      res.status(201).json(newUser);
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "Could not add user to databaes" });
    });
});

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  const user_id = req.params.id;
  const text = req.body.text;
  const PostInto = { user_id, text };
  Posts.insertPost(PostInto)
    .then(newPost => {
      res.status(201).json(newPost);
    })
    .catch(err => {
      res.status(500).json({ message: "Could not add post to database" });
    });
});

router.get("/", (req, res) => {
  Users.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res
        .status(500)
        .json({ errorMessage: "Could not get users from database" });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  const { id } = req.params;
  Users.getById(id)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res
        .status(500)
        .json({ errorMessage: "Could not get user from database" });
    });
});

router.get("/:id/posts", validateUserId, (req, res) => {
  const { id } = req.params;
  Users.getUserPosts(id)
    .then(userPosts => {
      res.status(200).json(userPosts);
    })
    .catch(err => {
      res
        .status(500)
        .json({ errorMessage: "Could not get users post from database" });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  const { id } = req.params;
  Users.remove(id)
    .then(id => {
      res.status(200).json({ errorMessage: "The post has been deleted! " });
    })
    .catch(err => {
      res
        .status(500)
        .json({ errorMessage: "Could not delete user from database" });
    });
});

router.put("/:id", validateUserId, validateUser, (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  Users.getById(id)
    .then(user => {
      console.log(user);
      if (user) {
        Users.update(id, changes).then(updated => {
          Users.getById(id).then(updatedUser => {
            res.status(200).json(updatedUser);
          });
        });
      } else {
        res.status(400).json({ error: "The specified ID does not exist" });
      }
    })
    .catch(err => {
      res.status(err => {
        res
          .status(400)
          .json({ errorMessage: "Could not update user in database" });
      });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  const id = req.params.id;

  Users.getById(id)
    .then(userInfo => {
      if (userInfo) {
        req.user = userInfo;
      } else {
        res.status(400).json({ message: "Invalid user id" });
      }
    })
    .catch(next);
  next();
}

function validateUser(req, res, next) {
  const user = req.body;
  console.log(user);
  if (!user.name) {
    return res.status(400).json({ message: "Missing required name field" });
  }
  next();
}

function validatePost(req, res, next) {
  const post = req.body;

  if (!post.text) {
    return res.status(400).json({ message: "Missing required text field" });
  }
  next();
}

module.exports = router;
