const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let musics = [];
let comments = {};

// گرفتن موزیک‌ها
app.get("/musics", (req, res) => {
  res.json(musics);
});

// اضافه کردن موزیک
app.post("/add-music", (req, res) => {
  musics.push({ ...req.body, likes: 0 });
  res.send("ok");
});

// لایک
app.post("/like/:id", (req, res) => {
  musics[req.params.id].likes++;
  res.send("liked");
});

// کامنت
app.post("/comment/:id", (req, res) => {
  let id = req.params.id;
  if (!comments[id]) comments[id] = [];
  comments[id].push(req.body);
  res.send("comment added");
});

// گرفتن کامنت
app.get("/comments/:id", (req, res) => {
  res.json(comments[req.params.id] || []);
});

app.listen(3000, () => console.log("Server running on 3000"));
