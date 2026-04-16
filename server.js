const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// فایل‌های استاتیک
app.use(express.static(path.join(__dirname, "public")));

// صفحه اصلی سایت
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// صفحه ادمین
app.get("/admin", (req, res) => {
  res.send("Admin panel is working!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
