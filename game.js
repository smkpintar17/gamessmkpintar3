(() => {
  "use strict";
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
  const CONFIG = window.APP_CONFIG || {};
  const STORAGE = "rpg_smk_pintar_v1";

  let state = loadState();
  let currentLevel = 1, currentQuestion = null, selectedOption = null;
  let quizLocked = false, game = null, timerHandle = null;

  function loadState(){
    try { return JSON.parse(localStorage.getItem(STORAGE)) || {users:{}, current:null}; }
    catch(e){ return {users:{}, current:null}; }
  }
  function saveState(){ localStorage.setItem(STORAGE, JSON.stringify(state)); }
  function currentUser(){ return state.current ? state.users[state.current] : null; }

  function toast(msg, ok=true){
    const el=$("#toast"); el.textContent=msg; el.className="toast show "+(ok?"ok":"bad");
    setTimeout(()=>el.className="toast",2500);
  }
  function showOnly(id){
    ["homeScreen","gameScreen","quizScreen","resultScreen"].forEach(x=>$("#"+x).classList.toggle("hidden",x!==id));
  }
  function enterApp(){
    const u=currentUser();
    if(!u){ $("#authView").classList.remove("hidden"); $("#gameView").classList.add("hidden"); return; }
    $("#authView").classList.add("hidden"); $("#gameView").classList.remove("hidden");
    $("#playerName").textContent=u.name; $("#playerClass").textContent=u.className;
    $("#welcomeName").textContent=u.name.split(" ")[0];
    renderMap(); showOnly("homeScreen");
  }

  // Auth
  $$(".tab").forEach(btn=>btn.onclick=()=>{
    $$(".tab").forEach(x=>x.classList.remove("active")); btn.classList.add("active");
    const reg=btn.dataset.auth==="register";
    $("#loginForm").classList.toggle("hidden",reg); $("#registerForm").classList.toggle("hidden",!reg);
  });
  $("#registerForm").onsubmit=async e=>{
    e.preventDefault();
    const name=$("#regName").value.trim(), cls=$("#regClass").value, user=$("#regUser").value.trim().toLowerCase(), p=$("#regPass").value, p2=$("#regPass2").value;
    if(p!==p2) return toast("Konfirmasi password tidak sama.",false);
    if(state.users[user]) return toast("Username sudah digunakan di perangkat ini.",false);
    state.users[user]={name,className:cls,password:p,unlocked:1,score:0,solved:0,answers:[],reflections:{},createdAt:new Date().toISOString()};
    state.current=user; saveState(); await sync("register", state.users[user]);
    toast("Akun berhasil dibuat!"); enterApp();
  };
  $("#loginForm").onsubmit=async e=>{
    e.preventDefault();
    const user=$("#loginUser").value.trim().toLowerCase(), p=$("#loginPass").value;
    const u=state.users[user];
    if(!u || u.password!==p) return toast("Username atau password salah.",false);
    state.current=user; saveState(); await sync("login",u); enterApp();
  };
  $("#logoutBtn").onclick=()=>{state.current=null;saveState();location.reload()};

  // Auto login when account was previously active
  if(state.current && state.users[state.current]) enterApp();

  function renderMap(){
    const u=currentUser(), grid=$("#levelGrid"); grid.innerHTML="";
    for(let i=1;i<=53;i++){
      const unlocked=i<=u.unlocked;
      const done=(u.answers||[]).some(a=>a.level===i);
      const b=document.createElement("button");
      b.className="level "+(unlocked?"":"locked")+" "+(done?"done":"");
      b.innerHTML=`<strong>${i}</strong><span>${i<=50?"Misi":"Bonus"}</span>${!unlocked?"🔒":done?"✓":""}`;
      b.disabled=!unlocked; b.onclick=()=>startLevel(i);
      grid.appendChild(b);
    }
    $("#statLevel").textContent=u.unlocked;
    $("#statScore").textContent=u.score;
    $("#statSolved").textContent=u.solved;
    $("#progressText").textContent=`${u.solved}/53 tantangan tersimpan`;
  }

  function startLevel(level){
    currentLevel=level;
    if(level<=50) startArcade(level);
    else showQuiz(level);
  }

  // 2D arcade: collect chips, avoid meteors. Difficulty scales 1..50.
  function startArcade(level){
    showOnly("gameScreen");
    const diff=level/50, canvas=$("#gameCanvas"), ctx=canvas.getContext("2d");
    const W=canvas.width,H=canvas.height;
    const target=Math.min(7+Math.floor(level/4),19), speed=2.2+diff*2.8, meteorCount=3+Math.floor(level/6);
    $("#levelTitle").textContent=`Level ${level}`;
    $("#levelDesc").textContent=` — ${level<10?"Pemula":level<25?"Menengah":level<40?"Mahir":"Master"}`;
    $("#missionText").textContent=`Kumpulkan ${target} chip energi dan selamat sampai misi selesai.`;
    let keys={}, bullets=[], chips=[], meteors=[], particles=[], score=0, lives=3, elapsed=0;
    let player={x:W/2,y:H-60,w:44,h:30,dx:0};
    for(let i=0;i<target;i++) chips.push({x:40+Math.random()*(W-80),y:70+Math.random()*(H-170),r:10,phase:Math.random()*6});
    for(let i=0;i<meteorCount;i++) meteors.push({x:20+Math.random()*(W-40),y:-Math.random()*H,r:13+Math.random()*9,vy:1.4+diff*2.2+Math.random()*1.4,vx:(Math.random()-.5)*1.5});
    cancelAnimationFrame(game?.raf||0); clearInterval(timerHandle);
    game={raf:0,done:false};
    $("#lives").textContent=lives; $("#gameScore").textContent=0; $("#timer").textContent=Math.max(30,65-Math.floor(level*.5));
    const limit=Number($("#timer").textContent);
    function shoot(){ if(game.done)return; bullets.push({x:player.x,y:player.y-18,vy:-7.5}); }
    const keydown=e=>{keys[e.key.toLowerCase()]=true;if(e.code==="Space"){e.preventDefault();shoot()}};
    const keyup=e=>keys[e.key.toLowerCase()]=false;
    window.addEventListener("keydown",keydown);window.addEventListener("keyup",keyup);
    canvas.onpointerdown=shoot;
    const cleanup=()=>{window.removeEventListener("keydown",keydown);window.removeEventListener("keyup",keyup);canvas.onpointerdown=null;clearInterval(timerHandle)};
    timerHandle=setInterval(()=>{elapsed++;$("#timer").textContent=Math.max(0,limit-elapsed);if(elapsed>=limit) finish(false)},1000);

    function hit(a,b){return Math.hypot(a.x-b.x,a.y-b.y)<a.r+b.r}
    function burst(x,y){for(let i=0;i<10;i++)particles.push({x,y,vx:(Math.random()-.5)*5,vy:(Math.random()-.5)*5,t:25})}
    function finish(win){
      if(game.done)return; game.done=true; cleanup(); cancelAnimationFrame(game.raf);
      if(win){currentUser().score+=score+level*5; unlock(level+1); saveState(); sync("level", {level,score:score+level*5,win:true}); setTimeout(()=>showQuiz(level),300);}
      else {lives=0; $("#lives").textContent=0; showResult(false,level,"Waktu habis atau energi habis. Coba lagi dan perhatikan pola meteor.");}
    }
    function update(){
      if(game.done)return;
      player.dx=(keys["arrowleft"]||keys["a"]?-1:0)+(keys["arrowright"]||keys["d"]?1:0);
      player.x=clamp(player.x+player.dx*5,28,W-28);
      bullets.forEach(b=>b.y+=b.vy); bullets=bullets.filter(b=>b.y>-20);
      chips.forEach(c=>c.phase+=.08);
      meteors.forEach(m=>{m.y+=m.vy;m.x+=m.vx;if(m.y>H+30){m.y=-30;m.x=Math.random()*W}});
      bullets.forEach((b,bi)=>meteors.forEach(m=>{if(Math.hypot(b.x-m.x,b.y-m.y)<m.r+4){bullets.splice(bi,1);m.y=-30;m.x=Math.random()*W;score+=5;burst(m.x,m.y)}}));
      chips=chips.filter(c=>{if(Math.hypot(player.x-c.x,player.y-c.y)<c.r+24){score+=10;burst(c.x,c.y);return false}return true});
      meteors.forEach(m=>{if(Math.hypot(player.x-m.x,player.y-m.y)<m.r+20){m.y=-40;m.x=Math.random()*W;lives--;$("#lives").textContent=lives;burst(player.x,player.y);if(lives<=0)finish(false)}});
      $("#gameScore").textContent=score;
      if(chips.length===0)finish(true);
    }
    function draw(){
      ctx.clearRect(0,0,W,H);
      const grd=ctx.createLinearGradient(0,0,0,H);grd.addColorStop(0,"#071a36");grd.addColorStop(1,"#102b4e");ctx.fillStyle=grd;ctx.fillRect(0,0,W,H);
      ctx.fillStyle="rgba(255,255,255,.5)";for(let i=0;i<70;i++){const x=(i*137)%W,y=(i*71+elapsed*8)%H;ctx.fillRect(x,y,2,2)}
      chips.forEach(c=>{ctx.beginPath();ctx.arc(c.x,c.y,c.r+Math.sin(c.phase)*2,0,7);ctx.fillStyle="#36e0a0";ctx.fill();ctx.strokeStyle="#baffea";ctx.stroke()});
      meteors.forEach(m=>{ctx.beginPath();ctx.arc(m.x,m.y,m.r,0,7);ctx.fillStyle="#ff6b6b";ctx.fill();ctx.fillStyle="#ffd2a6";ctx.beginPath();ctx.arc(m.x-4,m.y-4,m.r/3,0,7);ctx.fill()});
      bullets.forEach(b=>{ctx.fillStyle="#ffe66d";ctx.fillRect(b.x-2,b.y-10,4,12)});
      ctx.save();ctx.translate(player.x,player.y);ctx.fillStyle="#5aa9ff";ctx.beginPath();ctx.moveTo(0,-22);ctx.lineTo(22,20);ctx.lineTo(0,12);ctx.lineTo(-22,20);ctx.closePath();ctx.fill();ctx.fillStyle="#d8f3ff";ctx.beginPath();ctx.arc(0,-4,7,0,7);ctx.fill();ctx.restore();
      particles.forEach(p=>{ctx.fillStyle="rgba(255,230,109,"+(p.t/25)+")";ctx.fillRect(p.x,p.y,3,3);p.x+=p.vx;p.y+=p.vy;p.t--});particles=particles.filter(p=>p.t>0);
      update(); if(!game.done)game.raf=requestAnimationFrame(draw);
    }
    draw();
  }

  function unlock(n){const u=currentUser();if(n<=53)u.unlocked=Math.max(u.unlocked,n);saveState()}
  $("#backMap").onclick=()=>{cancelAnimationFrame(game?.raf||0);clearInterval(timerHandle);renderMap();showOnly("homeScreen")};

  function showQuiz(level){
    quizLocked=false; selectedOption=null; showOnly("quizScreen");
    $("#quizLevel").textContent=level<=50?`LEVEL ${level} • KUIS ${currentUser().className}`:`LEVEL ${level} • REFLEKSI`;
    $("#quizScore").textContent=`Skor: ${currentUser().score}`;
    const opts=$("#quizOptions"), essay=$("#essayAnswer");opts.innerHTML="";essay.value="";
    if(level<=50){
      currentQuestion=questionFor(level,currentUser().className);
      $("#quizTitle").textContent="🧠 Tantangan RPL";
      $("#quizQuestion").textContent=currentQuestion[0];essay.classList.add("hidden");
      currentQuestion[1].forEach((o,i)=>{const b=document.createElement("button");b.className="option";b.textContent=`${String.fromCharCode(65+i)}. ${o}`;b.onclick=()=>{selectedOption=i;$$(".option").forEach(x=>x.classList.remove("selected"));b.classList.add("selected")};opts.appendChild(b)});
    }else{
      currentQuestion=REFLECTIONS[level-51]; $("#quizTitle").textContent=`🌱 Level ${level}: ${level===51?"Harapan Sekolah":level===52?"Mimpi RPL":"Komitmen Diri"}`;
      $("#quizQuestion").textContent=currentQuestion;essay.classList.remove("hidden");
    }
    $("#quizFeedback").classList.add("hidden"); $("#submitQuiz").textContent=level>=51?"Simpan Refleksi":"Kirim Jawaban";
  }

  $("#submitQuiz").onclick=async()=>{
    if(quizLocked)return;
    const level=currentLevel,u=currentUser();
    let correct=false, answer="";
    if(level<=50){
      if(selectedOption===null)return toast("Pilih salah satu jawaban.",false);
      correct=selectedOption===currentQuestion[2]; answer=currentQuestion[1][selectedOption];
    }else{
      answer=$("#essayAnswer").value.trim();
      if(answer.length<15)return toast("Tuliskan refleksi minimal 15 karakter.",false);
      correct=true;
    }
    quizLocked=true;
    const already=(u.answers||[]).some(a=>a.level===level);
    if(!already){
      u.answers.push({level,answer,correct,at:new Date().toISOString()});
      if(level<=50 && correct)u.score+=10;
      if(level>=51)u.score+=15;
      if(level<53)unlock(level+1);
      u.solved++;
    }
    if(level>=51)u.reflections[level]=answer;
    saveState(); await sync("quiz",{level,answer,correct,score:u.score});
    const fb=$("#quizFeedback");fb.classList.remove("hidden");
    fb.className="feedback "+(correct?"good":"warn");
    fb.textContent=level>=51?"Refleksi tersimpan. Terima kasih sudah menuliskannya dengan jujur.":correct?"Benar! +10 poin.":"Belum tepat. Jawaban tersimpan; pelajari kembali materi dan lanjutkan petualangan.";
    $("#submitQuiz").textContent="Lanjut";
    $("#submitQuiz").onclick=()=>{quizLocked=false; if(level<53){renderMap();showOnly("homeScreen")}else{showResult(true,53,"Seluruh petualangan sampai level refleksi selesai. Hebat!")}};
  };

  function showResult(win,level,text){
    showOnly("resultScreen");$("#resultTitle").textContent=win?"Misi Berhasil!":"Coba Lagi";
    $("#resultText").textContent=text;
    $("#nextLevel").textContent=win?(level<53?`Lanjut ke Level ${level+1}`:"Kembali ke Peta"):"Ulangi Level";
    $("#nextLevel").onclick=()=>win?(level<53?startLevel(level+1):renderMap()):startLevel(level);
  }

  async function sync(type,payload){
    const url=CONFIG.SHEETS_API_URL;
    if(!url)return;
    try{
      await fetch(url,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},
        body:JSON.stringify({type,game:CONFIG.GAME_NAME,school:CONFIG.SCHOOL_NAME,username:state.current,student:payload?.name||currentUser()?.name,className:currentUser()?.className,...payload})});
      $("#connectionDot").textContent="●";$("#connectionText").textContent="Sinkronisasi Google Sheets aktif";
    }catch(e){console.warn("Sheets sync failed",e);$("#connectionText").textContent="Mode offline (sinkronisasi gagal)"}
  }

  // Make clicks outside map return from result cleanly.
  window.addEventListener("beforeunload",()=>saveState());
})();