const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let musics = [];
let comments = {};
let views = {};

// گرفتن موزیک‌ها
app.get("/musics", (req, res) => {
  res.json(musics);
});

// اضافه کردن موزیک (ادمین)
app.post("/add-music", (req, res) => {
  musics.push({
    ...req.body,
    likes: 0,
    id: Date.now()
  });
  res.send("ok");
});

// لایک (هر نفر فقط یکبار)
let likedUsers = {};

app.post("/like/:id", (req, res) => {
  const user = req.body.user;
  const id = req.params.id;

  if (!likedUsers[id]) likedUsers[id] = [];

  if (likedUsers[id].includes(user)) {
    return res.send("already liked");
  }

  likedUsers[id].push(user);

  musics = musics.map(m => {
    if (m.id == id) m.likes++;
    return m;
  });

  res.send("liked");
});

// ویو
app.post("/view/:id", (req, res) => {
  const id = req.params.id;

  if (!views[id]) views[id] = 0;
  views[id]++;

  res.send("viewed");
});

app.get("/views/:id", (req, res) => {
  res.json({ views: views[req.params.id] || 0 });
});

// کامنت
app.post("/comment/:id", (req, res) => {
  const id = req.params.id;
  const { name, text } = req.body;

  if (!comments[id]) comments[id] = [];

  comments[id].push({ name, text });

  res.send("ok");
});

app.get("/comments/:id", (req, res) => {
  res.json(comments[req.params.id] || []);
});

app.listen(3000, () => {
  console.log("Server running...");
});
