const router = require("express").Router();
const Posts = require("../posts/postDb.js");

router.get("/:id/posts", (req, res) => {
  Posts.get().then(posts => {
    res.status(200).json(posts);
  });
});

router.get("/:id/posts/:id", validatePostId, (req, res) => {
  const { id } = req.params;
  Posts.getById(id).then(post => {
    res.status(200).json(post);
  });
});

router.delete("/:id/posts/:id", (req, res) => {
  const { id } = req.params;
  Posts.remove(id).then(post => {
    res.status(200).json({ message: "The post has been deleted" });
  });
});

router.put("/:id/posts/:id", validatePost, (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  Posts.update(id, changes).then(updated => {
    Posts.getById(id).then(updatedPost => {
      res.status(200).json(updatedPost);
    });
  });
});

// custom middleware

function validatePostId(req, res, next) {
  const { id } = req.params;
  Posts.getById(id).then(postInfo => {
    console.log(postInfo);
    if (postInfo) {
      req.user = postInfo;
    } else {
      res.status(400).json({ message: "Invalid post id" });
    }
  });
  next();
}

function validatePost(req, res, next) {
  const post = req.body;
  if (!post.hasOwnProperty("text")) {
    return res.status(400).json({ message: "Missing text data" });
  }
  if (!post.hasOwnProperty("user_id")) {
    return res.status(400).json({ message: "Missing user id" });
  }
  next();
}

module.exports = router;
