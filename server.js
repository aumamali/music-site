const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 👇 برای لود کردن فایل‌های داخل public (خیلی مهم)
app.use(express.static("public"));

let musics = [];
let comments = {};

// گرفتن همه موزیک‌ها
app.get("/musics", (req, res) => {
  res.json(musics);
});

// اضافه کردن موزیک
app.post("/add-music", (req, res) => {
  const music = {
    id: Date.now(),
    title: req.body.title,
    artist: req.body.artist,
    url: req.body.url,
    cover: req.body.cover,
    likes: 0,
    views: 0
  };

  musics.push(music);
  res.json({ message: "added", music });
});

// لایک کردن
app.post("/like/:id", (req, res) => {
  const music = musics.find(m => m.id == req.params.id);
  if (music) {
    music.likes++;
    res.json({ likes: music.likes });
  } else {
    res.status(404).send("Not found");
  }
});

// ویو خوردن
app.post("/view/:id", (req, res) => {
  const music = musics.find(m => m.id == req.params.id);
  if (music) {
    music.views++;
    res.json({ views: music.views });
  } else {
    res.status(404).send("Not found");
  }
});

// کامنت گذاشتن
app.post("/comment/:id", (req, res) => {
  const id = req.params.id;

  if (!comments[id]) comments[id] = [];

  comments[id].push({
    name: req.body.name,
    text: req.body.text
  });

  res.send("comment added");
});

// گرفتن کامنت‌ها
app.get("/comments/:id", (req, res) => {
  res.json(comments[req.params.id] || []);
});

// روشن کردن سرور
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
