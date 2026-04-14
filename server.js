// 🔥 MUSIC SITE (LIKE LIMIT + COMMENTS USER + ADMIN DELETE COMMENT) 🔥

const express = require('express'); const multer = require('multer'); const cors = require('cors'); const fs = require('fs'); const path = require('path');

const app = express(); app.use(cors()); app.use(express.json()); app.use(express.static('public')); app.use('/uploads', express.static('uploads'));

const ADMIN_PASSWORD = "SaLeNcE.313(1386/5/3)";

// ===== STORAGE ===== const storage = multer.diskStorage({ destination: (req, file, cb) => cb(null, 'uploads/'), filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)) }); const upload = multer({ storage });

// ===== DB ===== const DB_FILE = 'db.json'; if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, '[]'); const readDB = () => JSON.parse(fs.readFileSync(DB_FILE)); const writeDB = (d) => fs.writeFileSync(DB_FILE, JSON.stringify(d, null, 2));

// ===== UPLOAD ===== app.post('/upload', upload.fields([{ name:'music' },{ name:'cover' }]), (req,res)=>{ const db = readDB();

const music = req.files['music'][0]; const cover = req.files['cover'] ? req.files['cover'][0] : null;

const item = { id: Date.now(), title: req.body.title, artist: req.body.artist, url: /uploads/${music.filename}, cover: cover ? /uploads/${cover.filename} : null, likes: 0, likedBy: [], views: 0, comments: [] };

db.push(item); writeDB(db); res.json(item); });

// ===== GET ===== app.get('/music',(req,res)=> res.json(readDB()));

// ===== LIKE (ONE PER USER/IP) ===== app.post('/like/:id',(req,res)=>{ const db = readDB(); const m = db.find(x=>x.id==req.params.id); const ip = req.ip;

if(m && !m.likedBy.includes(ip)){ m.likes++; m.likedBy.push(ip); writeDB(db); }

res.json(m); });

// ===== VIEW ===== app.post('/view/:id',(req,res)=>{ const db = readDB(); const m = db.find(x=>x.id==req.params.id); if(m){ m.views++; writeDB(db); } res.json(m); });

// ===== COMMENT WITH USERNAME ===== app.post('/comment',(req,res)=>{ const {id,text,user} = req.body; const db = readDB(); const m = db.find(x=>x.id==id);

if(m){ m.comments.push({ user, text, cid: Date.now() }); writeDB(db); }

res.json(m); });

// ===== DELETE COMMENT (ADMIN) ===== app.post('/delete-comment',(req,res)=>{ const {musicId, cid, password} = req.body; if(password!==ADMIN_PASSWORD) return res.status(403).send();

const db = readDB(); const m = db.find(x=>x.id==musicId);

if(m){ m.comments = m.comments.filter(c=>c.cid!=cid); writeDB(db); }

res.json({ok:true}); });

// ===== DELETE MUSIC ===== app.post('/delete',(req,res)=>{ const {id,password} = req.body; if(password!==ADMIN_PASSWORD) return res.status(403).send();

let db = readDB(); db = db.filter(x=>x.id!=id); writeDB(db); res.json({ok:true}); });

app.listen(3000,()=>console.log('running'));

// ===== FRONTEND (SPOTIFY STYLE) ===== /*

<!DOCTYPE html><html lang="fa">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>DJ Mohammed Reza</title><style>
body{margin:0;background:#121212;color:#fff;font-family:sans-serif}
.header{padding:20px;font-size:22px;font-weight:bold}
.container{padding:15px}
input,button{width:100%;padding:10px;margin:5px 0;border-radius:8px;border:none}
button{background:#1db954;color:#fff}

.card{display:flex;gap:10px;background:#181818;padding:10px;border-radius:12px;margin:10px 0;align-items:center}
.card img{width:60px;height:60px;border-radius:8px;object-fit:cover}
.info{flex:1}
.title{font-size:16px;font-weight:bold}
.artist{font-size:12px;color:#aaa}
.actions{font-size:12px}
audio{width:100%;margin-top:5px}
</style></head>
<body><div class="header">🎧 Djmohammedreza</div><div class="container">
<input id="title" placeholder="نام موزیک">
<input id="artist" placeholder="خواننده">
<input type="file" id="music">
<input type="file" id="cover">
<button onclick="upload()">آپلود</button><input id="search" placeholder="جستجو" oninput="load()"><div id="list"></div>
</div><script>
async function load(){
 let r=await fetch('/music');
 let d=await r.json();
 let q=search.value.toLowerCase();
 if(q) d=d.filter(m=>m.title.toLowerCase().includes(q)||m.artist.toLowerCase().includes(q));

 list.innerHTML=d.map(m=>`
 <div class="card">
 ${m.cover?`<img src="${m.cover}">`:''}
 <div class="info">
 <div class="title">${m.title}</div>
 <div class="artist">${m.artist}</div>
 <audio controls src="${m.url}" onplay="view(${m.id})"></audio>
 <div class="actions">👁 ${m.views} ❤️ ${m.likes}</div>
 <button onclick="like(${m.id})">لایک</button>
 <a href="${m.url}" download>دانلود</a>
 
 ${m.comments.map(c=>`<div>💬 <b>${c.user}:</b> ${c.text}</div>`).join('')}
 <input id="u${m.id}" placeholder="نام">
 <input id="c${m.id}" placeholder="کامنت">
 <button onclick="comment(${m.id})">ارسال</button>
 </div>
 </div>
 `).join('');
}

async function upload(){
 let fd=new FormData();
 fd.append('title',title.value);
 fd.append('artist',artist.value);
 fd.append('music',music.files[0]);
 fd.append('cover',cover.files[0]);
 await fetch('/upload',{method:'POST',body:fd});
 load();
}

async function like(id){await fetch('/like/'+id,{method:'POST'});load();}
async function view(id){await fetch('/view/'+id,{method:'POST'});} 
async function comment(id){
 let user=document.getElementById('u'+id).value;
 let text=document.getElementById('c'+id).value;
 await fetch('/comment',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,text,user})});
 load();
}

load();
</script></body>
</html>
*/// ===== ADMIN PANEL ===== /*

<!DOCTYPE html><html lang="fa">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin</title>
</head>
<body style="background:#000;color:#fff;text-align:center"><h2>🔐 پنل مدیریت</h2>
<input type="password" id="pass" placeholder="رمز">
<div id="list"></div><script>
async function load(){
 const res = await fetch('/music');
 const data = await res.json();

 list.innerHTML = data.map(m=>`
 <div>
 <p>${m.title}</p>
 ${m.comments.map(c=>`<p>${c.user}: ${c.text} <button onclick="delComment(${m.id},${c.cid})">❌</button></p>`).join('')}
 </div>
 `).join('');
}

async function delComment(mid,cid){
 const password = pass.value;
 await fetch('/delete-comment',{
 method:'POST',
 headers:{'Content-Type':'application/json'},
 body:JSON.stringify({musicId:mid,cid,password})
 });
 load();
}

load();
</script></body>
</html>
*/
