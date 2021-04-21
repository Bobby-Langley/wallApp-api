const admin = require("firebase-admin");
const serviceAccount = require("../../credentials.json");

let db;

function dbAuth() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    db = admin.firestore();
  }
}

exports.getPosts = (req, res) => {
  dbAuth();
  db.collection("posts")
    .get()
    .then((collection) => {
      const posts = collection.docs.map((doc) => {
        let post = doc.data();
        post.id = doc.id;
        return post;
      });
      res.status(200).json(posts);
    })
    .catch((err) => res.status(500).send("GET POSTS FAILED: " + err));
};

exports.addPost = (req, res) => {
  dbAuth();
  let newPost = req.body;
  let now = admin.firestore.FieldValue.serverTimestamp();
  newPost.updated = now;
  newPost.created = now;

  db.collection("posts")
    .add(newPost)
    .then(() => {
      this.getPosts(req, res);
    })
    .catch((err) => res.status(500).send("POST FAILED" + err));
};

exports.updatePost = (req, res) => {
  if (!req.body || !req.params.postId) {
    res.status(400).send("Invalid request");
  }
  dbAuth();
  db.collection("posts")
    .doc(req.params.postId)
    .update(req.body)
    .then(() => this.getSinglePost(req, res))
    .catch((err) => res.status(500).send("UPDATE FAILED: " + err));
};

exports.deletePost = (req, res) => {
  if (!req.params.postId) {
    res.status(400).send("Invalid request, no postId");
  }
  dbAuth();
  db.collection("posts")
    .doc(req.params.postId)
    .delete()
    .then(() => {
        this.getPosts(req, res) &&
      res.status(200).send("Success, post deleted");
    })

    .catch((err) => res.status(500).send("DELETE FAILED: " + err));
};

exports.getSinglePost = (req, res) => {
  if (!req.params.postId) {
    res.status(400).send("Invalid Request, no postId");
  }
  dbAuth();
  db.collection("posts")
    .doc(req.params.postId)
    .get()
    .then((doc) => {
      let post = doc.data();
      post.id = doc.id;
      res.status(200).json({
        status: "success",
        data: post,
        message: "Post retrieved",
        statusCode: 200,
      });
    })
    .catch((err) => res.status(500).send("get post failed:", err));
};
