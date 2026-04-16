const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let songs = [];

// صفحه اصلی سایت
app.get('/', (req, res) => {
  let songsHtml = songs.map(song => `
    <div style="margin:10px;padding:10px;background:#1e1e1e;border-radius:8px;">
      <h3>${song.name}</h3>
      <audio controls src="${song.url}"></audio>
    </div>
  `).join('');

  res.send(`
    <html>
      <head>
        <title>Music Site</title>
        <style>
          body {
            background:#121212;
            color:white;
            font-family:sans-serif;
            text-align:center;
            padding:20px;
          }
          h1 {
            color:#1db954;
          }
        </style>
      </head>
      <body>
        <h1>🎵 Music Site</h1>
        ${songsHtml || "<p>No songs added yet</p>"}
      </body>
    </html>
  `);
});

// پنل ادمین
app.get('/admin', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Admin Panel</title>
        <style>
          body {
            background:#121212;
            color:white;
            font-family:sans-serif;
            text-align:center;
            padding:20px;
          }
          input {
            padding:10px;
            margin:5px;
            width:250px;
          }
          button {
            padding:10px 20px;
            margin:5px;
            background:#1db954;
            color:white;
            border:none;
            cursor:pointer;
          }
        </style>
      </head>
      <body>
        <h1>Admin Panel</h1>
        <form method="POST" action="/add-song">
          <input name="name" placeholder="Song Name" required /><br>
          <input name="url" placeholder="Song URL" required /><br>
          <button type="submit">Add Song</button>
        </form>
      </body>
    </html>
  `);
});

// افزودن آهنگ
app.post('/add-song', (req, res) => {
  const { name, url } = req.body;
  songs.push({ name, url });
  res.redirect('/admin');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
