/* RPG SMK PINTAR - FINAL
   URL Apps Script harus URL biasa, bukan Markdown.
*/
const CONFIG = {
  GOOGLE_APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbxLqOWDGYNOkjDgxknnlc2t5yyRvUJLV9X2sWoiwLs7K2oWtCuRQ2gOpTSCAaKmBmrnvA/exec",
  SCHOOL_NAME: "SMK 17 Muncar",
  GAME_NAME: "RPG SMK PINTAR"
};

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const DEFAULT_PROGRESS = {level:1,score:0,stars:0,completed:[]};

const state = {
  user: JSON.parse(localStorage.getItem("rpgUser") || "null"),
  progress: JSON.parse(localStorage.getItem("rpgProgress") || JSON.stringify(DEFAULT_PROGRESS))
};

function normalizeProgress(p){
  return {
    level: Math.max(1,Math.min(53,Number(p?.level)||1)),
    score: Math.max(0,Number(p?.score)||0),
    stars: Math.max(0,Number(p?.stars)||0),
    completed: Array.isArray(p?.completed) ? p.completed.map(Number).filter(n=>n>=1&&n<=53) : []
  };
}
state.progress=normalizeProgress(state.progress);

function saveState(){
  localStorage.setItem("rpgUser",JSON.stringify(state.user));
  localStorage.setItem("rpgProgress",JSON.stringify(state.progress));
  if(state.user?.username) localStorage.setItem("progress_"+state.user.username,JSON.stringify(state.progress));
}
function msg(id,text){const e=$("#"+id);if(e)e.textContent=text||"";}
async function sha256(text){
  const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(text));
  return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("");
}
async function api(action,data={}){
  if(!CONFIG.GOOGLE_APPS_SCRIPT_URL || CONFIG.GOOGLE_APPS_SCRIPT_URL.includes("GANTI")) return {ok:true,offline:true};
  try{
    const r=await fetch(CONFIG.GOOGLE_APPS_SCRIPT_URL,{
      method:"POST",
      headers:{"Content-Type":"text/plain;charset=utf-8"},
      body:JSON.stringify({action,...data})
    });
    const t=await r.text();
    try{return JSON.parse(t)}catch{return {ok:false,error:"Respons Apps Script bukan JSON."}}
  }catch(e){
    console.warn("Google Sheets sync gagal:",e);
    return {ok:false,error:e.message};
  }
}

/* ================= SOAL ================= */
const quizBanks={
X:[
["Algoritma","Urutan langkah logis dan sistematis untuk menyelesaikan masalah disebut ...",["Algoritma","Database","Compiler","Browser"],0],
["Variabel","Manakah deklarasi variabel JavaScript yang benar?",["let nama = 'Ani';","var = nama;","nama let;","string nama;"],0],
["HTML","Tag HTML untuk membuat tautan adalah ...",["<a>","<link>","<url>","<href>"],0],
["CSS","Properti CSS untuk mengubah warna teks adalah ...",["color","font-color","text-color","foreground"],0],
["Flowchart","Simbol belah ketupat pada flowchart digunakan untuk ...",["Keputusan/percabangan","Proses","Input","Output"],0],
["Git","Perintah Git untuk melihat status perubahan adalah ...",["git status","git open","git check","git scan"],0],
["Debugging","Proses mencari dan memperbaiki kesalahan program disebut ...",["Debugging","Rendering","Hosting","Parsing"],0],
["Database","Data dalam tabel baris dan kolom cocok dengan model ...",["Relasional","Linear","Grafis","Audio"],0],
["JavaScript","Fungsi JavaScript untuk menampilkan pesan di console adalah ...",["console.log()","print.console()","log.console()","show()"],0],
["Keamanan","Kata sandi yang kuat sebaiknya ...",["Panjang dan unik","Sama dengan username","Dibagikan ke teman","Menggunakan 123456"],0]
],
XI:[
["OOP","Konsep OOP yang menyembunyikan detail implementasi disebut ...",["Encapsulation","Inheritance","Looping","Routing"],0],
["SQL","Perintah SQL untuk mengambil data adalah ...",["SELECT","PUSH","TAKE","GETALL"],0],
["API","API umumnya digunakan untuk ...",["Komunikasi antar sistem","Menggambar ikon","Mengompres gambar","Mengganti monitor"],0],
["GitHub","Repository digunakan untuk ...",["Menyimpan dan mengelola kode","Mengedit foto saja","Membuat password","Menghapus internet"],0],
["Responsive","Teknik agar tampilan menyesuaikan ukuran layar disebut ...",["Responsive design","Static design","Pixel lock","Fixed screen"],0],
["JSON","Format data yang umum digunakan API adalah ...",["JSON","DOCX","MP3","EXE"],0],
["HTTP","Kode HTTP 404 berarti ...",["Resource tidak ditemukan","Berhasil","Server sedang dibuat","Login berhasil"],0],
["MVC","Dalam MVC, huruf M berarti ...",["Model","Main","Module","Markup"],0],
["Normalisasi","Tujuan normalisasi database antara lain ...",["Mengurangi redundansi data","Memperbesar duplikasi","Menghapus primary key","Memperlambat query"],0],
["Testing","Pengujian unit berfokus pada ...",["Bagian/unit kecil program","Seluruh jaringan internet","Desain logo","Hardware saja"],0]
],
XII:[
["Arsitektur","Pemisahan frontend dan backend membantu ...",["Memisahkan tanggung jawab sistem","Menghilangkan database","Menghapus testing","Mengurangi keamanan"],0],
["Deployment","Deployment adalah proses ...",["Menempatkan aplikasi agar dapat digunakan","Menulis algoritma di kertas","Menghapus source code","Membuat kabel"],0],
["CI/CD","CI/CD membantu mengotomatisasi ...",["Build, test, dan delivery/deployment","Pembuatan keyboard","Desain poster","Pengisian baterai"],0],
["Security","Praktik menyimpan password yang tepat adalah ...",["Hashing dengan algoritma yang sesuai","Plain text","Di URL","Di nama file"],0],
["SQL Injection","Salah satu pencegahan SQL injection adalah ...",["Parameterized query/prepared statement","Menambah warna tombol","Menghapus CSS","Mematikan monitor"],0],
["Version Control","Branch pada Git berguna untuk ...",["Mengembangkan perubahan secara terpisah","Menghapus repository","Mengganti bahasa komputer","Membuat database otomatis"],0],
["Cloud","Cloud computing memungkinkan ...",["Pemanfaatan sumber daya komputasi melalui jaringan","Hanya menyimpan file di flashdisk","Tanpa jaringan sama sekali","Menghapus server"],0],
["Agile","Scrum merupakan ...",["Framework pengembangan produk secara iteratif","Bahasa pemrograman","Database","Browser"],0],
["UX","UX berfokus pada ...",["Pengalaman pengguna","Ukuran hard disk","Kecepatan CPU saja","Nama domain saja"],0],
["Portfolio","Portofolio RPL yang baik sebaiknya menunjukkan ...",["Proyek, proses, dan kemampuan yang nyata","Hanya foto diri","Password akun","Nilai tanpa karya"],0]
]};
const essayBanks={
51:["Harapan","Apa harapan jujur kamu selama belajar di SMK 17 Muncar, khususnya selama menjadi siswa RPL?"],
52:["Keinginan","Apa keinginan atau cita-cita yang ingin kamu capai setelah memilih program keahlian RPL? Ceritakan alasannya."],
53:["Pengembangan","Apa yang ingin kamu kembangkan di sekolah atau di lingkungan sekitar dengan kemampuan RPL yang kamu miliki? Tuliskan ide dan langkah sederhananya."]
};

/* ================= AUTH & MENU ================= */
function showView(id){["authView","menuView","gameView"].forEach(x=>$("#"+x)?.classList.toggle("hidden",x!==id));}
function updateMenu(){
  if(!state.user)return;
  $("#welcome").textContent=`${state.user.name||""} • ${state.user.className||""}`;
  $("#menuLevel").textContent=state.progress.level;
  $("#menuScore").textContent=state.progress.score;
  $("#menuStars").textContent=state.progress.stars;
  const grid=$("#levelGrid"); if(!grid)return;
  grid.innerHTML="";
  for(let n=1;n<=50;n++){
    const b=document.createElement("button");
    b.type="button";b.textContent=n;
    const unlocked=n<=state.progress.level||state.progress.completed.includes(n);
    b.disabled=!unlocked;
    if(unlocked)b.classList.add("unlocked");
    if(n===state.progress.level)b.classList.add("current");
    b.onclick=()=>startGame(n);
    grid.appendChild(b);
  }
}
function enterApp(){updateMenu();showView("menuView");}
function logout(){game.stop();state.user=null;localStorage.removeItem("rpgUser");showView("authView");}

$$(".tab").forEach(t=>t.onclick=()=>{
  $$(".tab").forEach(x=>x.classList.remove("active"));
  t.classList.add("active");
  $("#loginForm")?.classList.toggle("hidden",t.dataset.tab!=="login");
  $("#registerForm")?.classList.toggle("hidden",t.dataset.tab!=="register");
});
$("#logoutBtn")?.addEventListener("click",logout);

$("#loginForm")?.addEventListener("submit",async e=>{
  e.preventDefault();msg("loginMsg","Memeriksa akun...");
  const username=$("#loginUsername").value.trim().toLowerCase();
  const passwordHash=await sha256($("#loginPassword").value);
  const accounts=JSON.parse(localStorage.getItem("rpgAccounts")||"{}");

  if(accounts[username]?.passwordHash===passwordHash){
    state.user=accounts[username].user;
    state.progress=normalizeProgress(JSON.parse(localStorage.getItem("progress_"+username)||"null")||DEFAULT_PROGRESS);
    saveState();enterApp();return;
  }

  const r=await api("login",{username,passwordHash});
  if(r.ok&&r.user){
    state.user=r.user;state.progress=normalizeProgress(r.progress||DEFAULT_PROGRESS);
    saveState();enterApp();
  }else msg("loginMsg",r.error||"Username atau password salah.");
});

$("#registerForm")?.addEventListener("submit",async e=>{
  e.preventDefault();msg("regMsg","");
  const name=$("#regName").value.trim();
  const className=$("#regClass").value;
  const username=$("#regUsername").value.trim().toLowerCase();
  const password=$("#regPassword").value;
  const confirmation=$("#regPassword2").value;

  if(!name||!className||!username||!password)return msg("regMsg","Semua data wajib diisi.");
  if(password.length<6)return msg("regMsg","Password minimal 6 karakter.");
  if(password!==confirmation)return msg("regMsg","Konfirmasi password tidak sama.");
  if(!/^[A-Za-z0-9._-]+$/.test(username))return msg("regMsg","Format username tidak valid.");

  const accounts=JSON.parse(localStorage.getItem("rpgAccounts")||"{}");
  if(accounts[username])return msg("regMsg","Username sudah digunakan di perangkat ini.");

  const user={name,className,username};
  const passwordHash=await sha256(password);
  accounts[username]={user,passwordHash};
  localStorage.setItem("rpgAccounts",JSON.stringify(accounts));

  state.user=user;state.progress=normalizeProgress(DEFAULT_PROGRESS);saveState();

  const r=await api("register",{...user,passwordHash,createdAt:new Date().toISOString()});
  if(!r.ok&&!r.offline)console.warn("Registrasi online gagal:",r.error);
  enterApp();
});

$("#playBtn")?.addEventListener("click",()=>startGame(state.progress.level<=50?state.progress.level:1));
$("#backMenu")?.addEventListener("click",()=>{game.stop();enterApp();});
$$(".bonus-list button").forEach(b=>b.addEventListener("click",()=>startReflection(Number(b.dataset.level))));

/* ================= GAME ================= */
const canvas=$("#gameCanvas");
const ctx=canvas.getContext("2d");
const DIRS={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
const OPPOSITE={up:"down",down:"up",left:"right",right:"left"};

const game={
  running:false,paused:false,raf:0,lastTime:0,level:1,score:0,lives:3,
  map:[],rows:21,cols:25,pellets:0,player:null,ghosts:[],
  stop(){this.running=false;if(this.raf){cancelAnimationFrame(this.raf);this.raf=0;}},
  init(level){
    this.stop();this.level=Math.max(1,Math.min(50,level));this.score=state.progress.score;this.lives=3;this.paused=false;
    this.map=createMap(this.level);this.resetActors();this.running=true;this.lastTime=performance.now();updateGameHud();
    this.raf=requestAnimationFrame(gameLoop);
  },
  resetActors(){
    const center={x:Math.floor(this.cols/2),y:this.rows-2};
    const ps=nearestOpenCell(this.map,center);
    this.player=createActor(ps.x,ps.y,"left");
    const colors=["#ff4f64","#ff9f43","#4ddfff","#ff79d2"];
    const gs=[
      {x:Math.floor(this.cols/2)-2,y:Math.floor(this.rows/2)},
      {x:Math.floor(this.cols/2)+2,y:Math.floor(this.rows/2)},
      {x:Math.floor(this.cols/2)-2,y:Math.floor(this.rows/2)+2},
      {x:Math.floor(this.cols/2)+2,y:Math.floor(this.rows/2)+2}
    ];
    this.ghosts=colors.slice(0,Math.min(2+Math.floor(this.level/12),4)).map((color,i)=>{
      const s=nearestOpenCell(this.map,gs[i]);
      return {...createActor(s.x,s.y,["up","left","down","right"][i]),color,mode:i%3,decisionTimer:.2};
    });
    this.pellets=this.map.flat().filter(c=>c===2).length;
  }
};

function createActor(x,y,dir){return{x,y,px:x,py:y,dir,want:dir,moving:true};}
function gameLoop(t){
  if(!game.running)return;
  const dt=Math.min(.035,Math.max(0,(t-game.lastTime)/1000));game.lastTime=t;
  if(!game.paused){updateGame(dt);drawGame();}
  game.raf=requestAnimationFrame(gameLoop);
}
function createMap(level){
  const rows=21,cols=25;
  const map=Array.from({length:rows},()=>Array(cols).fill(2));
  for(let y=0;y<rows;y++){map[y][0]=1;map[y][cols-1]=1;}
  for(let x=0;x<cols;x++){map[0][x]=1;map[rows-1][x]=1;}

  const density=Math.min(.42,.10+level*.006);
  for(let y=2;y<rows-2;y+=2)for(let x=2;x<cols-2;x+=2){
    const v=((x*17+y*31+level*13)%100)/100;
    if(v<density){
      map[y][x]=1;
      if((x+y+level)%3!==0)map[y][x+1]=1;
      if((x*3+level)%4===0)map[y+1][x]=1;
    }
  }

  const cx=Math.floor(cols/2),cy=Math.floor(rows/2);
  for(let y=cy-2;y<=cy+2;y++)for(let x=cx-4;x<=cx+4;x++)if(map[y]?.[x]!==undefined)map[y][x]=2;
  for(let y=rows-4;y<=rows-2;y++)for(let x=cx-4;x<=cx+4;x++)if(map[y]?.[x]!==undefined)map[y][x]=2;

  for(let x=1;x<cols-1;x++){map[1][x]=2;map[rows-2][x]=2;}
  for(let y=1;y<rows-1;y++){map[y][1]=2;map[y][cols-2]=2;}

  return map;
}
function findOpenCells(map){
  const a=[];for(let y=1;y<map.length-1;y++)for(let x=1;x<map[0].length-1;x++)if(map[y][x]!==1)a.push({x,y});return a;
}
function nearestOpenCell(map,target){
  const a=findOpenCells(map);
  a.sort((p,q)=>(Math.abs(p.x-target.x)+Math.abs(p.y-target.y))-(Math.abs(q.x-target.x)+Math.abs(q.y-target.y)));
  return a[0]||{x:1,y:1};
}
function isWall(x,y){return y<0||y>=game.map.length||x<0||x>=game.map[0].length||game.map[y][x]===1;}
function canMove(x,y,d){
  const v=DIRS[d];if(!v)return false;
  return !isWall(Math.round(x)+v[0],Math.round(y)+v[1]);
}
function isCentered(a){return Math.abs(a.px-Math.round(a.px))<.08&&Math.abs(a.py-Math.round(a.py))<.08;}
function snap(a){a.px=Math.round(a.px);a.py=Math.round(a.py);a.x=a.px;a.y=a.py;}
function moveActor(a,dt,speed){
  const v=DIRS[a.dir];if(!v){a.moving=false;return;}
  a.moving=true;a.px+=v[0]*speed*dt;a.py+=v[1]*speed*dt;
  const tx=Math.round(a.px),ty=Math.round(a.py);
  if(isWall(tx,ty)){snap(a);if(!canMove(a.x,a.y,a.dir)){a.dir=null;a.moving=false;}}
  if(isCentered(a)){
    snap(a);
    if(a.want&&canMove(a.x,a.y,a.want))a.dir=a.want;
    if(!a.dir||!canMove(a.x,a.y,a.dir)){a.dir=null;a.moving=false;}
  }
}
function availableDirections(x,y){
  return Object.keys(DIRS).filter(d=>canMove(x,y,d));
}
function chooseGhostDirection(g,index){
  let options=availableDirections(Math.round(g.px),Math.round(g.py));
  if(!options.length)return;
  const reverse=OPPOSITE[g.dir];
  const filtered=options.filter(d=>d!==reverse);
  if(filtered.length)options=filtered;

  const px=Math.round(game.player.px),py=Math.round(game.player.py);
  options.sort((a,b)=>{
    const av=DIRS[a],bv=DIRS[b];
    const ad=Math.hypot(g.px+av[0]-px,g.py+av[1]-py);
    const bd=Math.hypot(g.px+bv[0]-px,g.py+bv[1]-py);
    if(g.mode===1)return bd-ad;
    if(g.mode===2&&(game.level+index)%3===0)return Math.random()-.5;
    return ad-bd;
  });
  g.dir=options[0];
}
function updateGhosts(dt,playerSpeed){
  game.ghosts.forEach((g,i)=>{
    if(isCentered(g)){
      snap(g);g.decisionTimer-=dt;
      if(!g.dir||!canMove(g.x,g.y,g.dir)||g.decisionTimer<=0){
        chooseGhostDirection(g,i);
        g.decisionTimer=Math.max(.20,.65-game.level*.006);
      }
    }
    moveActor(g,dt,playerSpeed*(.64+Math.min(.18,game.level*.003)));
  });
}
function updateGame(dt){
  const speed=.78+Math.min(.60,game.level*.010);
  if(isCentered(game.player)&&game.player.want&&canMove(game.player.x,game.player.y,game.player.want))game.player.dir=game.player.want;
  moveActor(game.player,dt,speed);

  const px=Math.round(game.player.px),py=Math.round(game.player.py);
  if(game.map[py]?.[px]===2){game.map[py][px]=0;game.pellets--;game.score+=10;$("#gameScore").textContent=game.score;}

  updateGhosts(dt,speed);
  checkGhostCollision();

  if(game.pellets<=0)completeGameLevel();
}
function checkGhostCollision(){
  for(const g of game.ghosts){
    if(Math.hypot(g.px-game.player.px,g.py-game.player.py)<.55){loseLife();break;}
  }
}
function loseLife(){
  game.lives--;updateGameHud();
  if(game.lives<=0){
    game.stop();
    showResult("💥 GAME OVER",`Level ${game.level} belum selesai. Coba lagi dan kumpulkan semua data!`,"retry");
    return;
  }
  const ps=nearestOpenCell(game.map,{x:Math.floor(game.cols/2),y:game.rows-2});
  Object.assign(game.player,{px:ps.x,py:ps.y,x:ps.x,y:ps.y,dir:"left",want:"left"});
  game.ghosts.forEach((g,i)=>{
    const s=nearestOpenCell(game.map,{x:Math.floor(game.cols/2)+(i%2?3:-3),y:Math.floor(game.rows/2)});
    Object.assign(g,{px:s.x,py:s.y,x:s.x,y:s.y,dir:["up","left","down","right"][i],decisionTimer:.4});
  });
}
function updateGameHud(){$("#gameLevel").textContent=game.level;$("#gameScore").textContent=game.score;$("#lives").textContent=game.lives;}

function drawGame(){
  const rows=game.map.length,cols=game.map[0].length,w=canvas.width/cols,h=canvas.height/rows;
  ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle="#02060c";ctx.fillRect(0,0,canvas.width,canvas.height);
  for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
    if(game.map[y][x]===1){
      ctx.fillStyle="#123c69";ctx.fillRect(x*w+1,y*h+1,w-2,h-2);
      ctx.fillStyle="#0b2847";ctx.fillRect(x*w+4,y*h+4,w-8,h-8);
    }else if(game.map[y][x]===2){
      ctx.fillStyle="#ffd95c";ctx.beginPath();ctx.arc(x*w+w/2,y*h+h/2,Math.max(2,w*.075),0,Math.PI*2);ctx.fill();
    }
  }
  drawPlayer(w,h);game.ghosts.forEach(g=>drawGhost(g,w,h));
  ctx.fillStyle="#9bb0c9";ctx.font="bold 12px system-ui";ctx.fillText(`DATA TERSISA: ${game.pellets}`,12,canvas.height-10);
  if(game.paused){
    ctx.fillStyle="rgba(0,0,0,.7)";ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="#fff";ctx.font="bold 34px system-ui";ctx.textAlign="center";ctx.fillText("JEDA",canvas.width/2,canvas.height/2);
    ctx.font="14px system-ui";ctx.fillText("Tekan P untuk melanjutkan",canvas.width/2,canvas.height/2+30);ctx.textAlign="left";
  }
}
function drawPlayer(w,h){
  const x=game.player.px*w+w/2,y=game.player.py*h+h/2,r=Math.min(w,h)*.37;
  const angle={right:0,left:Math.PI,up:-Math.PI/2,down:Math.PI/2}[game.player.dir||"right"]||0;
  ctx.fillStyle="#ffd447";ctx.beginPath();ctx.moveTo(x,y);ctx.arc(x,y,r,angle+.35,angle+Math.PI*2-.35);ctx.closePath();ctx.fill();
  ctx.fillStyle="#07111f";ctx.beginPath();ctx.arc(x+r*.25,y-r*.35,r*.09,0,Math.PI*2);ctx.fill();
}
function drawGhost(g,w,h){
  const x=g.px*w+w/2,y=g.py*h+h/2,r=Math.min(w,h)*.34;
  ctx.fillStyle=g.color;ctx.beginPath();ctx.arc(x,y-r*.1,r,Math.PI,0);
  ctx.lineTo(x+r,y+r);ctx.lineTo(x+r*.5,y+r*.6);ctx.lineTo(x,y+r);ctx.lineTo(x-r*.5,y+r*.6);ctx.lineTo(x-r,y+r);ctx.closePath();ctx.fill();
  ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(x-r*.35,y-r*.15,r*.25,0,Math.PI*2);ctx.arc(x+r*.35,y-r*.15,r*.25,0,Math.PI*2);ctx.fill();
  const v=DIRS[g.dir]||[0,0];ctx.fillStyle="#14243a";ctx.beginPath();
  ctx.arc(x-r*.35+v[0]*r*.08,y-r*.15+v[1]*r*.08,r*.11,0,Math.PI*2);
  ctx.arc(x+r*.35+v[0]*r*.08,y-r*.15+v[1]*r*.08,r*.11,0,Math.PI*2);ctx.fill();
}

/* ================= LEVEL & KUIS ================= */
async function completeGameLevel(){
  if(!game.running)return;game.stop();
  const done=new Set(state.progress.completed);done.add(game.level);
  state.progress.score=game.score;
  state.progress.completed=[...done].sort((a,b)=>a-b);
  state.progress.stars=Math.min(53,state.progress.stars+1);
  state.progress.level=Math.max(state.progress.level,game.level<50?game.level+1:51);
  saveState();

  await api("progress",{username:state.user.username,level:state.progress.level,score:state.progress.score,stars:state.progress.stars,completed:state.progress.completed});
  openQuiz(game.level);
}
function startGame(level){if(level>=51)return startReflection(level);showView("gameView");game.init(level);}
function startReflection(level){game.stop();openQuiz(Math.max(51,Math.min(53,level)));}
function showResult(title,text,mode){
  $("#resultTitle").textContent=title;$("#resultText").textContent=text;
  $("#resultNext").dataset.mode=mode;$("#resultNext").textContent=mode==="retry"?"Coba Lagi":"Kembali ke Menu";
  $("#resultModal").classList.remove("hidden");
}
$("#resultNext")?.addEventListener("click",()=>{
  const mode=$("#resultNext").dataset.mode;$("#resultModal").classList.add("hidden");
  if(mode==="retry")startGame(game.level);else enterApp();
});

const quizState={level:1,index:0,items:[]};
function gradeKey(){return(state.user?.className||"X RPL").split(" ")[0].toUpperCase();}
function createQuiz(level){
  if(level>50)return[{type:"essay",title:essayBanks[level][0],question:essayBanks[level][1]}];
  const bank=quizBanks[gradeKey()]||quizBanks.X;
  return[bank[(level-1)%bank.length],bank[(level+2)%bank.length],bank[(level+5)%bank.length]];
}
function openQuiz(level){quizState.level=level;quizState.index=0;quizState.items=createQuiz(level);renderQuiz();$("#quizModal").classList.remove("hidden");}
function renderQuiz(){
  const item=quizState.items[quizState.index],essay=item.type==="essay";
  $("#quizBadge").textContent=`LEVEL ${quizState.level}${essay?" • REFLEKSI":""}`;
  $("#quizProgress").textContent=`${quizState.index+1}/${quizState.items.length}`;
  $("#quizTitle").textContent=essay?item.title:item[0];
  $("#quizQuestion").textContent=essay?item.question:item[1];
  $("#quizOptions").innerHTML="";$("#essayAnswer").value="";$("#essayAnswer").classList.toggle("hidden",!essay);msg("quizMsg","");
  $("#submitQuiz").textContent=quizState.index===quizState.items.length-1?"Simpan & Selesai":"Jawab";

  if(!essay)item[2].forEach((option,i)=>{
    const b=document.createElement("button");b.type="button";b.className="quiz-option";b.textContent=option;b.dataset.selected="";
    b.onclick=()=>{$$(".quiz-option").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");b.dataset.selected=String(i);};
    $("#quizOptions").appendChild(b);
  });
}
$("#submitQuiz")?.addEventListener("click",async()=>{
  const item=quizState.items[quizState.index],essay=item.type==="essay";
  let answer="",correct=false,answerText="";

  if(essay){
    answer=$("#essayAnswer").value.trim();
    if(answer.length<10)return msg("quizMsg","Tuliskan jawaban minimal 10 karakter.");
    answerText=answer;
  }else{
    const selected=$(".quiz-option.selected");
    if(!selected)return msg("quizMsg","Pilih salah satu jawaban.");
    answer=Number(selected.dataset.selected);correct=answer===item[3];answerText=item[2][answer];
    if(correct){state.progress.score+=50;state.progress.stars++;msg("quizMsg","✅ Jawaban benar! +50 poin");}
    else msg("quizMsg",`Jawaban dicatat. Kunci: ${item[2][item[3]]}`);
    saveState();
  }

  await api("answer",{username:state.user.username,level:quizState.level,question:essay?item.question:item[1],answer:answerText,correct,submittedAt:new Date().toISOString()});

  if(quizState.index<quizState.items.length-1){setTimeout(()=>{quizState.index++;renderQuiz();},650);return;}

  setTimeout(()=>{
    $("#quizModal").classList.add("hidden");
    state.progress.score+=essay?100:25;
    if(quizState.level===50)state.progress.level=Math.max(state.progress.level,51);
    if(quizState.level>=51&&quizState.level<53)state.progress.level=Math.max(state.progress.level,quizState.level+1);
    saveState();

    const finalEssay=quizState.level===53;
    showResult(
      essay?(finalEssay?"🏆 Semua Refleksi Selesai":"🌟 Refleksi Tersimpan"):"🎉 Level Berhasil",
      essay?(finalEssay?"Terima kasih sudah menuliskan harapan, keinginan, dan rencana pengembanganmu dengan jujur.":"Jawaban refleksimu sudah tersimpan. Lanjutkan ke refleksi berikutnya."):`Level ${quizState.level} selesai. Bersiap untuk level berikutnya!`,
      "next"
    );
  },700);
});

/* ================= KONTROL ================= */
function setDirection(d){
  if(!game.running)return;
  game.player.want=d;
  if(isCentered(game.player)&&canMove(game.player.x,game.player.y,d))game.player.dir=d;
}
window.addEventListener("keydown",e=>{
  const k=e.key.toLowerCase();
  const m={arrowup:"up",w:"up",arrowdown:"down",s:"down",arrowleft:"left",a:"left",arrowright:"right",d:"right"};
  if(m[k]){e.preventDefault();setDirection(m[k]);}
  if(k==="p"&&game.running)game.paused=!game.paused;
  if(k==="escape"&&game.running){game.stop();enterApp();}
});
$$(".dpad").forEach(b=>{
  const h=e=>{e.preventDefault();setDirection(b.dataset.dir);};
  b.addEventListener("pointerdown",h);
  b.addEventListener("touchstart",h,{passive:false});
});
window.addEventListener("beforeunload",saveState);

if(state.user)enterApp();else showView("authView");
