const functions = require("firebase-functions");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(bodyParser.json());
app.use(cors());

const { getPosts, getSinglePost, addPost, updatePost, deletePost} = require("./src/posts/index")

app.get("/posts", getPosts);
app.get("/post/:postId", getSinglePost);

app.post("/posts", addPost);
app.patch("/posts/:postId", updatePost);
app.delete("/posts/:postId", deletePost);


exports.app = functions.https.onRequest(app);
