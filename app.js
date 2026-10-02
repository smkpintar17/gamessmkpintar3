/* RPG SMK PINTAR
   Frontend GitHub Pages + optional Google Apps Script backend.
   Set CONFIG.GOOGLE_APPS_SCRIPT_URL after deploying Code.gs.
*/
const CONFIG = {
  GOOGLE_APPS_SCRIPT_URL: "", // contoh: https://script.google.com/macros/s/XXXX/exec
  SCHOOL_NAME: "SMK 17 Muncar"
};

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const state = {
  user: JSON.parse(localStorage.getItem("rpgUser") || "null"),
  progress: JSON.parse(localStorage.getItem("rpgProgress") || '{"level":1,"score":0,"stars":0,"completed":[]}'),
  activeLevel: 1, lives: 3, scoreAtStart: 0
};

const quizBanks = {
 X: [
  ["Algoritma","Urutan langkah logis dan sistematis untuk menyelesaikan masalah disebut ...",["Algoritma","Database","Compiler","Browser"],0],
  ["Variabel","Manakah contoh deklarasi variabel JavaScript yang benar?",["let nama = 'Ani';","var = nama;","nama let;","string nama;"],0],
  ["HTML","Tag HTML untuk membuat tautan adalah ...",["<a>","<link>","<url>","<href>"],0],
  ["CSS","Properti CSS untuk mengubah warna teks adalah ...",["color","font-color","text-color","foreground"],0],
  ["Flowchart","Simbol belah ketupat pada flowchart umumnya digunakan untuk ...",["Keputusan/percabangan","Proses","Input","Output"],0],
  ["Git","Perintah Git untuk melihat status perubahan adalah ...",["git status","git open","git check","git scan"],0],
  ["Debugging","Proses mencari dan memperbaiki kesalahan program disebut ...",["Debugging","Rendering","Hosting","Parsing"],0],
  ["Database","Data yang disusun dalam tabel baris dan kolom cocok dengan model ...",["Relasional","Linear","Grafis","Audio"],0],
  ["JavaScript","Fungsi untuk menampilkan pesan di console adalah ...",["console.log()","print.console()","log.console()","show()"],0],
  ["Keamanan","Kata sandi yang kuat sebaiknya ...",["Panjang dan unik","Sama dengan username","Dibagikan ke teman","Menggunakan 123456"],0]
 ],
 XI: [
  ["OOP","Konsep OOP yang menyembunyikan detail implementasi disebut ...",["Encapsulation","Inheritance","Looping","Routing"],0],
  ["SQL","Perintah SQL untuk mengambil data adalah ...",["SELECT","PUSH","TAKE","GETALL"],0],
  ["API","API umumnya digunakan untuk ...",["Komunikasi antar sistem","Menggambar ikon","Mengompres gambar","Mengganti monitor"],0],
  ["GitHub","Repository digunakan untuk ...",["Menyimpan dan mengelola kode","Mengedit foto saja","Membuat password","Menghapus internet"],0],
  ["Responsive","Teknik agar tampilan menyesuaikan ukuran layar disebut ...",["Responsive design","Static design","Pixel lock","Fixed screen"],0],
  ["JSON","Format data yang umum digunakan API adalah ...",["JSON","DOCX","MP3","EXE"],0],
  ["HTTP","Kode HTTP 404 berarti ...",["Resource tidak ditemukan","Berhasil","Server sedang dibuat","Login berhasil"],0],
  ["MVC","Dalam MVC, M adalah ...",["Model","Main","Module","Markup"],0],
  ["Normalisasi","Tujuan normalisasi database antara lain ...",["Mengurangi redundansi data","Memperbesar duplikasi","Menghapus primary key","Memperlambat query"],0],
  ["Testing","Pengujian unit berfokus pada ...",["Bagian/unit kecil program","Seluruh jaringan internet","Desain logo","Hardware saja"],0]
 ],
 XII: [
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

const essayBanks = {
  51: ["Harapan","Apa harapan jujur kamu selama belajar di SMK 17 Muncar, khususnya selama menjadi siswa RPL?"],
  52: ["Keinginan","Apa keinginan atau cita-cita yang ingin kamu capai setelah memilih program keahlian RPL? Ceritakan alasannya."],
  53: ["Pengembangan","Apa yang ingin kamu kembangkan di sekolah atau di lingkungan sekitar dengan kemampuan RPL yang kamu miliki? Tuliskan ide dan langkah sederhananya."]
};

function save(){localStorage.setItem("rpgUser",JSON.stringify(state.user));localStorage.setItem("rpgProgress",JSON.stringify(state.progress));}
function esc(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
async function sha256(text){const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(text));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("");}

async function api(action,data={}){
  if(!CONFIG.GOOGLE_APPS_SCRIPT_URL) return {ok:true,offline:true};
  try{
    const res=await fetch(CONFIG.GOOGLE_APPS_SCRIPT_URL,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({action,...data})});
    return await res.json();
  }catch(e){console.warn("Google Sheets sync gagal",e);return {ok:false,error:e.message};}
}

function show(view){["authView","menuView","gameView"].forEach(id=>$("#"+id).classList.toggle("hidden",id!==view));}
function updateMenu(){
  $("#welcome").textContent=`${state.user?.name||""} • ${state.user?.className||""}`;
  $("#menuLevel").textContent=state.progress.level;
  $("#menuScore").textContent=state.progress.score;
  $("#menuStars").textContent=state.progress.stars;
  const grid=$("#levelGrid"); grid.innerHTML="";
  for(let i=1;i<=50;i++){const b=document.createElement("button");b.textContent=i;b.disabled=i>state.progress.level;b.className=i<=state.progress.level?"unlocked":"";if(i===state.progress.level)b.classList.add("current");b.onclick=()=>startGame(i);grid.appendChild(b)}
}
function enterApp(){show("menuView");updateMenu();}
function logout(){localStorage.removeItem("rpgUser");state.user=null;show("authView");}
$$(".tab").forEach(t=>t.onclick=()=>{$$(".tab").forEach(x=>x.classList.remove("active"));t.classList.add("active");$("#loginForm").classList.toggle("hidden",t.dataset.tab!=="login");$("#registerForm").classList.toggle("hidden",t.dataset.tab!=="register")});
$("#logoutBtn").onclick=logout;
$("#loginForm").onsubmit=async e=>{
 e.preventDefault();$("#loginMsg").textContent="Memeriksa...";
 const username=$("#loginUsername").value.trim().toLowerCase(), pass=await sha256($("#loginPassword").value);
 const local=JSON.parse(localStorage.getItem("rpgAccounts")||"{}");
 if(local[username] && local[username].passwordHash===pass){
   state.user=local[username].user; const p=JSON.parse(localStorage.getItem("progress_"+username)||'null'); if(p)state.progress=p; save(); enterApp();
 }else{
   const r=await api("login",{username,passwordHash:pass});
   if(r.ok && r.user){state.user=r.user;state.progress=r.progress||state.progress;save();enterApp()}else $("#loginMsg").textContent="Username/password tidak ditemukan.";
 }
};
$("#registerForm").onsubmit=async e=>{
 e.preventDefault();$("#regMsg").textContent="";
 const name=$("#regName").value.trim(), className=$("#regClass").value, username=$("#regUsername").value.trim().toLowerCase(), p1=$("#regPassword").value, p2=$("#regPassword2").value;
 if(p1!==p2)return $("#regMsg").textContent="Konfirmasi password tidak sama.";
 const local=JSON.parse(localStorage.getItem("rpgAccounts")||"{}"); if(local[username])return $("#regMsg").textContent="Username sudah digunakan di perangkat ini.";
 const user={name,className,username};const passwordHash=await sha256(p1);
 local[username]={user,passwordHash};localStorage.setItem("rpgAccounts",JSON.stringify(local));
 state.user=user;state.progress={level:1,score:0,stars:0,completed:[]};save();localStorage.setItem("progress_"+username,JSON.stringify(state.progress));
 await api("register",{...user,passwordHash,createdAt:new Date().toISOString()});
 enterApp();
};

$("#playBtn").onclick=()=>startGame(state.progress.level);
$("#backMenu").onclick=()=>{game.stop();enterApp()};
$$(".bonus-list button").forEach(b=>b.onclick=()=>startReflection(+b.dataset.level));

/* ---------- PAC-MAN style game ---------- */
const canvas=$("#gameCanvas"),ctx=canvas.getContext("2d");
const game={
 running:false,paused:false,raf:0,last:0,level:1,score:0,lives:3,map:[],pellets:0,p: null,ghosts:[],keys:{},
 stop(){this.running=false;cancelAnimationFrame(this.raf);},
 init(level){
   this.stop();this.level=level;this.score=state.progress.score;this.lives=3;this.map=makeMap(level);this.resetActors();this.running=true;this.last=performance.now();this.loop(this.last);
   $("#gameLevel").textContent=level;$("#gameScore").textContent=this.score;$("#lives").textContent=this.lives;
 },
 resetActors(){
   const R=this.map.length,C=this.map[0].length;
   this.p={x:Math.floor(C/2),y:R-2,dir:"left",want:"left",px:Math.floor(C/2),py:R-2};
   const colors=["#ff5b67","#ff9b43","#55e6ff","#ff8cf2"];
   this.ghosts=colors.slice(0,Math.min(2+Math.floor(this.level/15),4)).map((color,i)=>({x:Math.floor(C/2)+(i%2?2:-2),y:Math.floor(R/2),px:Math.floor(C/2)+(i%2?2:-2),py:Math.floor(R/2),dir:["up","left","down","right"][i],color}));
   this.pellets=this.map.flat().filter(x=>x===2).length;
 },
 loop(t){
   if(!this.running)return; const dt=Math.min(0.05,(t-this.last)/1000);this.last=t;
   if(!this.paused){updateGame(dt);drawGame()}
   this.raf=requestAnimationFrame(x=>this.loop(x));
 }
};
function makeMap(level){
 const rows=19,cols=25,a=Array.from({length:rows},()=>Array(cols).fill(2));
 // Borders and deterministic internal walls
 for(let y=0;y<rows;y++)for(let x=0;x<cols;x++)if(y===0||y===rows-1||x===0||x===cols-1)a[y][x]=1;
 const density=Math.min(.34,.12+level*.004);
 for(let y=2;y<rows-2;y+=2)for(let x=2;x<cols-2;x+=2){
   if(((x*17+y*31+level*13)%100)/100<density){a[y][x]=1;if((x+level)%3!==0)a[y][x+1]=1;if((y+level)%3===0)a[y+1][x]=1;}
 }
 // Keep spawn corridors
 for(let y=rows-3;y<=rows-2;y++)for(let x=cols/2-2;x<=cols/2+2;x++)a[y][x]=2;
 for(let y=8;y<=10;y++)for(let x=10;x<=14;x++)a[y][x]=2;
 return a;
}
const dirs={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
function canMove(x,y,d){const [dx,dy]=dirs[d],nx=x+dx,ny=y+dy;return game.map[ny]?.[nx]!==1}
function moveActor(o,dt,speed){
 const [dx,dy]=dirs[o.dir]||[0,0];o.px+=dx*speed*dt;o.py+=dy*speed*dt;
 const nx=Math.round(o.px),ny=Math.round(o.py);
 if(Math.abs(o.px-nx)<.08&&Math.abs(o.py-ny)<.08){o.px=nx;o.py=ny;
   if(o.want&&canMove(nx,ny,o.want))o.dir=o.want;
   if(!canMove(nx,ny,o.dir)){o.dir=null;}
 }
}
function updateGame(dt){
 const speed=.75+Math.min(.55,game.level*.01);
 if(game.p.want&&canMove(Math.round(game.p.px),Math.round(game.p.py),game.p.want))game.p.dir=game.p.want;
 moveActor(game.p,dt,speed);
 const px=Math.round(game.p.px),py=Math.round(game.p.py);
 if(game.map[py]?.[px]===2){game.map[py][px]=0;game.pellets--;game.score+=10;$("#gameScore").textContent=game.score}
 game.ghosts.forEach((g,i)=>{
   if(Math.round(g.px)===g.px&&Math.round(g.py)===g.py){
     const options=Object.keys(dirs).filter(d=>canMove(g.px,g.py,d));
     if(!canMove(g.px,g.py,g.dir)||Math.random()<.03+game.level*.0005){
       options.sort((a,b)=>{
         const [ax,ay]=dirs[a],[bx,by]=dirs[b];
         const da=Math.hypot(g.px+ax-px,g.py+ay-py),db=Math.hypot(g.px+bx-px,g.py+by-py);
         return (i+game.level)%3===0?da-db:db-da;
       });g.dir=options[0]||g.dir;
     }
   }
   moveActor(g,dt,speed*(.72+game.level*.003));
   if(Math.hypot(g.px-game.p.px,g.py-game.p.py)<.55)hitPlayer();
 });
 if(game.pellets<=0){game.stop();finishGameLevel()}
}
function hitPlayer(){game.lives--;$("#lives").textContent=game.lives;if(game.lives<=0){game.stop();showResult("💥 Coba Lagi",`Level ${game.level} belum selesai. Jangan menyerah!`,"retry");}else{game.p.px=Math.floor(game.map[0].length/2);game.p.py=game.map.length-2;game.p.dir="left";game.p.want="left";}}
function drawGame(){
 const R=game.map.length,C=game.map[0].length,w=canvas.width/C,h=canvas.height/R;
 ctx.clearRect(0,0,canvas.width,canvas.height);
 ctx.fillStyle="#02070e";ctx.fillRect(0,0,canvas.width,canvas.height);
 for(let y=0;y<R;y++)for(let x=0;x<C;x++){
   if(game.map[y][x]===1){ctx.fillStyle="#123c69";ctx.fillRect(x*w+1,y*h+1,w-2,h-2);ctx.fillStyle="#0c2847";ctx.fillRect(x*w+4,y*h+4,w-8,h-8)}
   else if(game.map[y][x]===2){ctx.fillStyle="#ffd95c";ctx.beginPath();ctx.arc(x*w+w/2,y*h+h/2,Math.max(2,w*.075),0,Math.PI*2);ctx.fill()}
 }
 drawPac(w,h);game.ghosts.forEach(g=>drawGhost(g,w,h));
 ctx.fillStyle="#9bb0c9";ctx.font="12px system-ui";ctx.fillText(`DATA TERSISA: ${game.pellets}`,12,canvas.height-10);
}
function drawPac(w,h){const x=game.p.px*w+w/2,y=game.p.py*h+h/2,r=Math.min(w,h)*.37;const angle={right:0,left:Math.PI,up:-Math.PI/2,down:Math.PI/2}[game.p.dir||"right"]||0;ctx.fillStyle="#ffd447";ctx.beginPath();ctx.moveTo(x,y);ctx.arc(x,y,r,angle+.35,angle+Math.PI*2-.35);ctx.closePath();ctx.fill();ctx.fillStyle="#07111f";ctx.beginPath();ctx.arc(x+r*.25,y-r*.35,r*.09,0,Math.PI*2);ctx.fill()}
function drawGhost(g,w,h){const x=g.px*w+w/2,y=g.py*h+h/2,r=Math.min(w,h)*.34;ctx.fillStyle=g.color;ctx.beginPath();ctx.arc(x,y-r*.1,r,Math.PI,0);ctx.lineTo(x+r,y+r);ctx.lineTo(x+r*.5,y+r*.6);ctx.lineTo(x,y+r);ctx.lineTo(x-r*.5,y+r*.6);ctx.lineTo(x-r,y+r);ctx.closePath();ctx.fill();ctx.fillStyle="white";ctx.beginPath();ctx.arc(x-r*.35,y-r*.15,r*.25,0,Math.PI*2);ctx.arc(x+r*.35,y-r*.15,r*.25,0,Math.PI*2);ctx.fill();ctx.fillStyle="#14243a";ctx.beginPath();ctx.arc(x-r*.3,y-r*.1,r*.11,0,Math.PI*2);ctx.arc(x+r*.3,y-r*.1,r*.11,0,Math.PI*2);ctx.fill()}
function finishGameLevel(){state.progress.score=game.score;state.progress.completed=[...new Set([...state.progress.completed,game.level])];state.progress.stars=Math.min(53,state.progress.completed.length);state.progress.level=Math.min(53,Math.max(state.progress.level,game.level+1));save();api("progress",{username:state.user.username,level:state.progress.level,score:state.progress.score,stars:state.progress.stars,completed:state.progress.completed});openQuiz(game.level)}
function startGame(level){if(level>50)return startReflection(level);show("gameView");game.init(level)}
function startReflection(level){show("gameView");game.init(Math.min(level,50));setTimeout(()=>{game.stop();openQuiz(level)},500)}
function showResult(title,text,mode){$("#resultTitle").textContent=title;$("#resultText").textContent=text;$("#resultNext").dataset.mode=mode;$("#resultNext").textContent=mode==="retry"?"Coba Lagi":"Lanjut";$("#resultModal").classList.remove("hidden")}
$("#resultNext").onclick=()=>{const m=$("#resultNext").dataset.mode;$("#resultModal").classList.add("hidden");if(m==="retry")startGame(game.level);else enterApp()};

let quiz={level:1,index:0,items:[]};
function gradeKey(){return (state.user?.className||"X RPL").split(" ")[0].toUpperCase();}
function openQuiz(level){
 quiz.level=level;quiz.index=0;
 if(level<=50){const bank=quizBanks[gradeKey()]||quizBanks.X;quiz.items=[bank[(level-1)%bank.length],bank[(level+2)%bank.length],bank[(level+5)%bank.length]];}
 else quiz.items=[["ESAI",essayBanks[level][1],[],null]];
 renderQuiz();
 $("#quizModal").classList.remove("hidden");
}
function renderQuiz(){
 const item=quiz.items[quiz.index],isEssay=quiz.level>50;
 $("#quizBadge").textContent=`LEVEL ${quiz.level}${isEssay?" • REFLEKSI":""}`;
 $("#quizProgress").textContent=`${quiz.index+1}/${quiz.items.length}`;
 $("#quizTitle").textContent=item[0];$("#quizQuestion").textContent=item[1];$("#quizMsg").textContent="";
 $("#quizOptions").innerHTML="";$("#essayAnswer").classList.toggle("hidden",!isEssay);$("#essayAnswer").value="";
 $("#submitQuiz").textContent=quiz.index===quiz.items.length-1?"Simpan & Selesai":"Jawab";
 if(!isEssay)item[2].forEach((o,i)=>{const b=document.createElement("button");b.className="quiz-option";b.textContent=o;b.onclick=()=>{$$(".quiz-option").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");b.dataset.selected=i};$("#quizOptions").appendChild(b)});
}
$("#submitQuiz").onclick=async()=>{
 const item=quiz.items[quiz.index],isEssay=quiz.level>50;
 let answer="";
 if(isEssay){answer=$("#essayAnswer").value.trim();if(answer.length<10)return $("#quizMsg").textContent="Tuliskan jawaban minimal 10 karakter agar refleksimu tersimpan."}
 else{const sel=$(".quiz-option.selected");if(!sel)return $("#quizMsg").textContent="Pilih salah satu jawaban.";answer=sel.dataset.selected}
 const correct=!isEssay && +answer===item[3];
 if(!isEssay && correct){state.progress.score+=50;state.progress.stars++;save();$("#quizMsg").textContent="✅ Benar!";}else if(!isEssay){$("#quizMsg").textContent=`Jawaban dicatat. Jawaban kunci: ${item[2][item[3]]}`;}
 await api("answer",{username:state.user.username,level:quiz.level,question:item[1],answer:isEssay?answer:item[2][+answer],correct,submittedAt:new Date().toISOString()});
 if(quiz.index<quiz.items.length-1){setTimeout(()=>{quiz.index++;renderQuiz()},450)}else{setTimeout(()=>{$("#quizModal").classList.add("hidden");state.progress.score+=isEssay?100:25;save();showResult(isEssay?"🌟 Refleksi Tersimpan":"🎉 Level Berhasil",isEssay?"Terima kasih sudah menuliskan refleksi dengan jujur. Jawabanmu menjadi bahan pengembangan diri dan sekolah.":`Level ${quiz.level} selesai. Bersiap untuk level berikutnya!`,"next")},500)}
};

/* keyboard + mobile controls */
function setDir(d){if(game.running)game.p.want=d}
window.addEventListener("keydown",e=>{const k=e.key.toLowerCase();const map={arrowup:"up",w:"up",arrowdown:"down",s:"down",arrowleft:"left",a:"left",arrowright:"right",d:"right"};if(map[k]){e.preventDefault();setDir(map[k])}if(k==="p")game.paused=!game.paused});
$$(".dpad").forEach(b=>{["pointerdown","touchstart"].forEach(ev=>b.addEventListener(ev,e=>{e.preventDefault();setDir(b.dataset.dir)},{passive:false}))});
window.addEventListener("beforeunload",()=>save());

if(state.user){enterApp()}else show("authView");
