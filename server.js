const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

// صفحه اصلی
app.get("/", (req, res) => {
  res.send("<h1>سایت موزیک فعال است</h1>");
});

// پنل ادمین
app.get("/admin", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Admin Panel</title>
        <style>
          body {
            background: #121212;
            color: white;
            font-family: sans-serif;
            text-align: center;
            padding-top: 50px;
          }
          input, button {
            padding: 10px;
            margin: 5px;
          }
          button {
            background: #1db954;
            color: white;
            border: none;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <h1>پنل مدیریت موزیک</h1>
        <form method="POST" action="/add-song">
          <input name="title" placeholder="نام آهنگ" required />
          <input name="link" placeholder="لینک آهنگ" required />
          <button type="submit">اضافه کردن</button>
        </form>
      </body>
    </html>
  `);
});

// افزودن آهنگ
app.post("/add-song", (req, res) => {
  const { title, link } = req.body;
  res.send(`آهنگ ${title} اضافه شد`);
});

app.listen(port, () => {
  console.log("Server running on port " + port);
});
