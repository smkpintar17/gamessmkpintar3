const CONFIG={SHEET_WEB_APP_URL:"PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE",STORAGE_KEY:"smk_pintar_players_v1"};
const classes=["X RPL","XI RPL","XII RPL"];
const levelData=[
["Level 1","RPL Starter","Mudah","Pengenalan coding & komputer","Apa yang dimaksud dengan algoritma?",["Langkah-langkah logis untuk menyelesaikan masalah","Nama perangkat keras","Bahasa pemrograman saja","Jaringan internet"],0],
["Level 2","Logic Runner","Mudah","Urutan logika dasar","Simbol flowchart untuk keputusan biasanya adalah...",["Persegi panjang","Jajar genjang","Belah ketupat","Oval"],2],
["Level 3","HTML Quest","Mudah","Dasar web","Tag HTML untuk membuat judul terbesar adalah...",["<h1>","<p>","<img>","<br>"],0],
["Level 4","CSS Dash","Mudah","Styling web","CSS digunakan terutama untuk...",["Mengatur tampilan halaman","Menyimpan database","Menjalankan server","Menghapus file"],0],
["Level 5","JavaScript Jump","Sedang","Interaksi web","JavaScript pada halaman web banyak digunakan untuk...",["Membuat interaksi dinamis","Mengganti RAM","Mencetak kabel","Menggambar casing"],0],
["Level 6","Variable Valley","Sedang","Variabel","Variabel digunakan untuk...",["Menyimpan nilai/data","Mematikan monitor","Membuat kabel","Menghapus browser"],0],
["Level 7","Loop Labyrinth","Sedang","Perulangan","Perulangan berguna ketika...",["Instruksi perlu dijalankan berkali-kali","Komputer mati","Tidak ada data","Tidak ada kondisi"],0],
["Level 8","Function Forest","Sedang","Function","Keuntungan function adalah...",["Kode dapat dipakai kembali","Monitor lebih besar","Internet lebih cepat","Keyboard menjadi wireless"],0],
["Level 9","OOP Arena","Sedang","OOP","Class dalam OOP dapat dipahami sebagai...",["Cetak biru objek","Kabel jaringan","Folder gambar","Sistem operasi"],0],
["Level 10","Database Cave","Sedang","Database","SQL SELECT digunakan untuk...",["Mengambil data","Menggambar UI","Mengedit video","Mengatur mouse"],0],
["Level 11","ERD Explorer","Sedang","ERD","ERD digunakan untuk memodelkan...",["Entitas dan relasi data","Warna website","Animasi game","Kecepatan internet"],0],
["Level 12","SQL Challenge","Sedang","SQL","Primary key berfungsi sebagai...",["Identitas unik record","Password Wi-Fi","Warna tabel","Nama server"],0],
["Level 13","UI/UX City","Sedang","UI/UX","UI lebih dekat dengan...",["Tampilan dan elemen antarmuka","Struktur database","Kabel LAN","Kode mesin"],0],
["Level 14","UX Mission","Sulit","User experience","UX berfokus pada...",["Pengalaman pengguna saat memakai produk","Ukuran monitor","Nama domain saja","Jenis printer"],0],
["Level 15","Network Run","Sulit","Jaringan","Perangkat yang menghubungkan beberapa jaringan adalah...",["Router","Keyboard","Scanner","Speaker"],0],
["Level 16","Git Galaxy","Sulit","Version control","Git digunakan untuk...",["Mengelola versi kode","Mengedit foto saja","Memperbaiki monitor","Mencetak dokumen"],0],
["Level 17","Debug Dungeon","Sulit","Debugging","Debugging adalah proses...",["Mencari dan memperbaiki kesalahan program","Membeli laptop","Membuat logo","Mengganti meja"],0],
["Level 18","Deploy Tower","Sulit","Deployment","Deployment berarti...",["Menempatkan aplikasi agar dapat digunakan","Menghapus source code","Membuat kabel","Menggambar ERD"],0],
["Level 19","Project Sprint","Sangat Sulit","Analisis kebutuhan","Langkah awal pengembangan sistem yang baik adalah...",["Memahami kebutuhan pengguna","Langsung coding tanpa analisis","Membeli server","Membuat poster"],0],
["Level 20","RPL Master","Sangat Sulit","Integrasi RPL","Dalam proyek RPL, testing dilakukan untuk...",["Memastikan sistem bekerja sesuai kebutuhan","Mengganti nama sekolah","Menghapus database","Mengurangi fitur tanpa alasan"],0]
];
const bonusData=[
["Level 21","Refleksi Sekolah","BONUS","Esai refleksi","Apa harapan dan keinginan Anda secara jujur untuk SMK 17 Muncar agar sekolah menjadi lebih baik?"],
["Level 22","Refleksi RPL","BONUS","Esai pengembangan","Apa yang ingin Anda kembangkan di SMK 17 Muncar melalui Program Keahlian RPL? Jelaskan ide, keterampilan, atau produk yang ingin Anda wujudkan."],
["Level 23","Rencana Masa Depan","BONUS","Esai pribadi","Setelah belajar RPL, kemampuan apa yang ingin Anda kuasai dan bagaimana Anda ingin berkontribusi untuk sekolah serta masa depan Anda?"]
];

let players=JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY)||"{}");
let current=null, selectedAnswer=null, levelRunning=false, game=null;

const $=id=>document.getElementById(id);
function savePlayers(){localStorage.setItem(CONFIG.STORAGE_KEY,JSON.stringify(players))}
function hashLike(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(16)}
function show(id){document.querySelectorAll(".screen").forEach(x=>x.classList.add("hidden"));$(id).classList.remove("hidden")}
function difficulty(n){return n<=5?"Pemula":n<=10?"Menengah":n<=15?"Lanjutan":n<=20?"Ahli":"Refleksi"}
function updateHeader(){ $("playerBadge").textContent=`${current.name} • ${current.className}`;$("playerBadge").classList.remove("hidden")}
function renderDashboard(){
 show("dashboardScreen");updateHeader();
 $("welcomeName").textContent=current.name;$("welcomeClass").textContent=current.className;
 const done=current.progress.filter(Boolean).length;$("progressStat").textContent=`${done}/23`;$("scoreStat").textContent=current.score;
 $("difficultyStat").textContent=difficulty(Math.min(done+1,23));
 const grid=$("levelGrid");grid.innerHTML="";
 for(let n=1;n<=23;n++){const b=document.createElement("button");b.className="level "+(current.progress[n-1]?"done ":"")+(n>20?"bonus ":"");
   const unlocked=n===1||current.progress[n-2];b.classList.toggle("locked",!unlocked);
   b.innerHTML=`${current.progress[n-1]?"✓ ":""}LEVEL ${n}<br><small>${n<=20?levelData[n-1][2]:"REFLEKSI"}</small>`;
   b.onclick=()=>unlocked&&startLevel(n);grid.appendChild(b)}
}
function register(e){e.preventDefault();const name=$("regName").value.trim(),className=$("regClass").value,username=$("regUsername").value.trim().toLowerCase(),password=$("regPassword").value;
 if(!name||!classes.includes(className)||!username||!password)return;
 if(players[username]){$("registerMsg").textContent="Username sudah digunakan.";return}
 players[username]={name,className,pass:hashLike(password),progress:Array(23).fill(false),score:0,answers:[]};savePlayers();current=players[username];localStorage.setItem("smk_current_user",username);
 $("registerMsg").textContent="Berhasil. Login otomatis...";setTimeout(renderDashboard,300)
}
function login(e){e.preventDefault();const u=$("loginUsername").value.trim().toLowerCase(),p=hashLike($("loginPassword").value),x=players[u];
 if(!x||x.pass!==p){$("loginMsg").textContent="Username atau password salah.";return}
 current=x;localStorage.setItem("smk_current_user",u);renderDashboard()
}
function startLevel(n){
 currentLevel=n;selectedAnswer=null;levelRunning=true;
 if(n<=20){const d=levelData[n-1];$("levelLabel").textContent=`LEVEL ${n} • ${d[2]}`;$("levelTitle").textContent=d[1];$("difficultyLabel").textContent=d[2];$("gameInfo").textContent=d[3]+" — gunakan ← → dan tombol ● untuk melompat.";
   show("gameScreen");startCanvasGame(n)
 }else{showQuestion(n)}
}
let currentLevel=1;
function startCanvasGame(n){
 const c=$("gameCanvas"),ctx=c.getContext("2d"),speed=2+n*.18,gravity=.55,jump=-10;
 let px=60,py=380,vy=0,keys={},obstacles=[],coins=[],goalX=2500,cam=0,done=false;
 for(let x=350;x<goalX;x+=180+Math.random()*120) obstacles.push({x,y:430,w:35+Math.random()*30,h:70+Math.random()*60});
 for(let x=220;x<goalX;x+=260) coins.push({x,y:250+Math.random()*120,taken:false});
 function key(e,v){keys[e.code]=v;if(["ArrowLeft","ArrowRight","Space"].includes(e.code))e.preventDefault()}
 addEventListener("keydown",e=>key(e,true));addEventListener("keyup",e=>key(e,false));
 function loop(){
  if(!levelRunning)return;
  ctx.clearRect(0,0,c.width,c.height);ctx.fillStyle="#08111f";ctx.fillRect(0,0,c.width,c.height);
  const difficultyFactor=1+(n/20);let dx=0;if(keys.ArrowRight)dx=4*difficultyFactor;if(keys.ArrowLeft)dx=-4*difficultyFactor;px=Math.max(20,px+dx);
  if((keys.Space||keys.ArrowUp)&&py>=380)vy=jump;vy+=gravity;py+=vy;if(py>380){py=380;vy=0}
  cam=Math.max(0,px-180);
  ctx.save();ctx.translate(-cam,0);
  ctx.fillStyle="#1e293b";ctx.fillRect(0,450,goalX+500,50);
  ctx.fillStyle="#38bdf8";ctx.fillRect(px,py,36,48);
  ctx.fillStyle="#f59e0b";coins.forEach(o=>{if(!o.taken){ctx.beginPath();ctx.arc(o.x,o.y,10,0,Math.PI*2);ctx.fill();if(Math.abs(px-o.x)<28&&Math.abs(py-o.y)<35){o.taken=true;current.score+=5}}});
  ctx.fillStyle="#ef4444";obstacles.forEach(o=>{ctx.fillRect(o.x,o.y,o.w,o.h);if(px+30>o.x&&px<o.x+o.w&&py+42>o.y){px=60;current.score=Math.max(0,current.score-3)}});
  ctx.fillStyle="#22c55e";ctx.fillRect(goalX,340,40,110);ctx.restore();
  $("levelProgress").style.width=Math.min(100,(px/goalX)*100)+"%";
  if(px>=goalX){levelRunning=false;players[localStorage.getItem("smk_current_user")]=current;savePlayers();showQuestion(n);return}
  requestAnimationFrame(loop)
 } loop()
}
function showQuestion(n){
 $("questionLevel").textContent=`LEVEL ${n}`;
 $("questionTitle").textContent=n<=20?"🎯 Tantangan Pengetahuan":"📝 Level Refleksi & Esai";
 $("questionMsg").textContent="";$("essayAnswer").value="";
 const answers=$("answers");answers.innerHTML="";
 if(n<=20){$("questionText").textContent=levelData[n-1][4];levelData[n-1][5].forEach((a,i)=>{const b=document.createElement("button");b.className="answer";b.textContent=a;b.onclick=()=>{selectedAnswer=i;document.querySelectorAll(".answer").forEach(x=>x.classList.remove("selected"));b.classList.add("selected")};answers.appendChild(b)});$("essayAnswer").classList.add("hidden")}
 else {$("questionText").textContent=bonusData[n-21][4];$("essayAnswer").classList.remove("hidden")}
 show("questionScreen")
}
async function submitAnswer(){
 const n=currentLevel;
 if(n<=20&&selectedAnswer===null){$("questionMsg").textContent="Pilih jawaban terlebih dahulu.";return}
 let correct=n<=20?selectedAnswer===levelData[n-1][6]:true;
 let answer=n<=20?levelData[n-1][5][selectedAnswer]:$("essayAnswer").value.trim();
 if(n>20&&!answer){$("questionMsg").textContent="Jawaban esai wajib diisi.";return}
 current.progress[n-1]=true;if(correct)current.score+=20;
 current.answers.push({level:n,answer,correct,time:new Date().toISOString()});
 players[localStorage.getItem("smk_current_user")]=current;savePlayers();await sendToSheet({type:"learning_result",username:localStorage.getItem("smk_current_user"),name:current.name,className:current.className,level:n,answer,correct,score:current.score});
 $("resultTitle").textContent=correct?"LEVEL BERHASIL!":"LEVEL SELESAI";
 $("resultText").textContent=n<23?"Jawaban tersimpan. Lanjutkan ke level berikutnya.":"Terima kasih sudah menyampaikan refleksi secara jujur untuk SMK 17 Muncar.";
 $("resultScore").textContent=`Skor: ${current.score}`;$("nextBtn").textContent=n<23?`LANJUT LEVEL ${n+1}`:"KEMBALI KE DASHBOARD";show("resultScreen")
}
async function sendToSheet(payload){
 if(!CONFIG.SHEET_WEB_APP_URL||CONFIG.SHEET_WEB_APP_URL.includes("PASTE_"))return;
 try{await fetch(CONFIG.SHEET_WEB_APP_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)})}catch(e){console.warn("Sheets:",e)}
}
document.querySelectorAll(".tab").forEach(t=>t.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));t.classList.add("active");$("loginForm").classList.toggle("hidden",t.dataset.tab!=="login");$("registerForm").classList.toggle("hidden",t.dataset.tab!=="register")});
$("registerForm").onsubmit=register;$("loginForm").onsubmit=login;
$("logoutBtn").onclick=()=>{localStorage.removeItem("smk_current_user");current=null;$("playerBadge").classList.add("hidden");show("authScreen")};
$("backDashboard").onclick=()=>{levelRunning=false;renderDashboard()};
$("submitAnswer").onclick=submitAnswer;
$("nextBtn").onclick=()=>currentLevel<23?startLevel(currentLevel+1):renderDashboard();
document.querySelectorAll(".mobile-controls button").forEach(b=>{const k=b.dataset.key;b.onpointerdown=()=>{window.dispatchEvent(new KeyboardEvent("keydown",{code:k}))};b.onpointerup=()=>{window.dispatchEvent(new KeyboardEvent("keyup",{code:k}))}});
window.addEventListener("load",()=>{const u=localStorage.getItem("smk_current_user");if(u&&players[u]){current=players[u];renderDashboard()}else show("authScreen")});
