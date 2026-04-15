<!DOCTYPE html>
<html lang="fa">
<head>
<meta charset="UTF-8">
<title>Admin Panel</title>

<style>
body {
  background: #121212;
  color: white;
  font-family: sans-serif;
  text-align: center;
}

input {
  padding: 10px;
  margin: 5px;
}

button {
  padding: 10px;
  background: #1db954;
  border: none;
  color: white;
  cursor: pointer;
}
</style>
</head>

<body>

<h2>🔐 ورود ادمین</h2>

<div id="loginBox">
  <input id="password" type="password" placeholder="رمز">
  <button onclick="login()">ورود</button>
</div>

<div id="panel" style="display:none;">
  <h2>🎵 افزودن موزیک</h2>

  <input id="title" placeholder="اسم موزیک"><br>
  <input id="url" placeholder="لینک موزیک"><br>

  <button onclick="addMusic()">اضافه کن</button>
</div>

<script>
const API = "https://music-site-1-e21b.onrender.com";

function login() {
  const password = document.getElementById("password").value;

  fetch(API + "/admin-login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      document.getElementById("loginBox").style.display = "none";
      document.getElementById("panel").style.display = "block";
    } else {
      alert("رمز اشتباهه!");
    }
  });
}

function addMusic() {
  const title = document.getElementById("title").value;
  const url = document.getElementById("url").value;

  fetch(API + "/add-music", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ title, url })
  });

  alert("اضافه شد!");
}
</script>

</body>
</html>
