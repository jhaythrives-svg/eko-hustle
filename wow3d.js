/* Eko Hustle · WOW layer. Load AFTER city3d.js. Needs window.EH3D (2 small edits in city3d.js). */
(function(){
"use strict";
const E=window.EH3D;if(!E){console.warn("EH3D missing");return;}
const T=E.T,PI=Math.PI,box=E.box,sc=E.sc,cam=E.cam;
const nightNow=()=>{try{return phase(hourF()).ni;}catch(e){return 0;}};

/* ---------- CSS ---------- */
const css=document.createElement("style");
css.textContent=
"#w3title{position:absolute;inset:0;z-index:20;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none;color:#fff;text-align:center;animation:w3t 5.2s ease-in forwards}"+
"#w3title b{font:800 40px/1 sans-serif;letter-spacing:8px;text-shadow:0 4px 24px #000}#w3title b i{color:#2fbf86;font-style:normal}"+
"#w3title span{font:600 12px sans-serif;letter-spacing:4px;margin-top:10px;opacity:.85;text-transform:uppercase;text-shadow:0 2px 8px #000}"+
"@keyframes w3t{0%{opacity:0;transform:scale(.94)}12%{opacity:1;transform:scale(1)}72%{opacity:1}100%{opacity:0;transform:scale(1.06)}}"+
"#w3ban{position:absolute;left:0;right:0;top:22%;z-index:19;text-align:center;pointer-events:none;color:#fff;opacity:0}"+
"#w3ban b{display:block;font:800 26px sans-serif;letter-spacing:5px;text-transform:uppercase;text-shadow:0 3px 16px #000}"+
"#w3ban span{display:block;font:600 12px sans-serif;margin-top:6px;color:#e9b949;letter-spacing:1px;text-shadow:0 2px 8px #000}"+
"#w3ban.go{animation:w3b 3.4s ease-out}@keyframes w3b{0%{opacity:0;transform:translateY(14px)}15%{opacity:1;transform:none}75%{opacity:1}100%{opacity:0;transform:translateY(-8px)}}"+
"#w3map{position:absolute;right:8px;top:48px;z-index:3;width:92px;height:92px;border-radius:50%;border:1px solid rgba(255,255,255,.25);background:rgba(0,0,0,.55)}";
document.head.appendChild(css);

/* ---------- Intro cinematic + title ---------- */
const title=document.createElement("div");title.id="w3title";
title.innerHTML="<b>EKO <i>HUSTLE</i></b><span>Lagos never sleeps</span>";
const ban=document.createElement("div");ban.id="w3ban";
box.appendChild(title);box.appendChild(ban);
let intro=0,introT=0,lastLoc=null;
box.addEventListener("pointerdown",()=>{if(intro===1)introT=99;},true);
setTimeout(()=>{if(title.parentNode)title.remove();},5400);

function banner(){
  const l=LOCS[S.location];if(!l)return;
  ban.className="";ban.innerHTML="<b>"+l.emoji+" "+l.name+"</b><span>"+l.desc+"</span>";
  void ban.offsetWidth;ban.className="go";
}

/* ---------- Minimap ---------- */
const mm=document.createElement("canvas");mm.id="w3map";mm.width=mm.height=184;box.appendChild(mm);
const mg=mm.getContext("2d");
const DC={ojota:"#8a8030",yaba:"#2a6b66",ikeja:"#8a6a2a",surulere:"#7a3f80",vi:"#3f5a73",lekki:"#2f7a4c",ajah:"#6a5f4a"};
function drawMap(){
  const W=184,c=W/2,k=c/92,P=E.P;if(!P)return;
  mg.clearRect(0,0,W,W);mg.save();mg.beginPath();mg.arc(c,c,c-2,0,PI*2);mg.clip();
  mg.fillStyle="rgba(20,30,26,.9)";mg.fillRect(0,0,W,W);
  const X=x=>c+x*k,Y=z=>c+z*k;
  mg.strokeStyle="rgba(255,255,255,.18)";mg.lineWidth=2;
  E.ZN.forEach(id=>{mg.beginPath();mg.moveTo(c,c);mg.lineTo(X(E.Z[id][0]),Y(E.Z[id][1]));mg.stroke();});
  E.ZN.forEach(id=>{const p=E.Z[id];mg.fillStyle=DC[id];mg.globalAlpha=id===E.ZONE?1:.7;mg.beginPath();mg.arc(X(p[0]),Y(p[1]),id===E.ZONE?13:9,0,PI*2);mg.fill();
    if(id===E.ZONE){mg.strokeStyle="#fff";mg.lineWidth=1.5;mg.stroke();}mg.globalAlpha=1;});
  E.spots.forEach(s=>{if(Math.hypot(s.x-P.position.x,s.z-P.position.z)>70)return;mg.fillStyle="#fbbf24";mg.beginPath();mg.arc(X(s.x),Y(s.z),2.2,0,PI*2);mg.fill();});
  /* player arrow, pointing the way the camera looks */
  const fx=-Math.sin(E.yaw),fz=-Math.cos(E.yaw),px=X(P.position.x),py=Y(P.position.z);
  mg.fillStyle="#2fbf86";mg.strokeStyle="#fff";mg.lineWidth=1.5;mg.beginPath();
  mg.moveTo(px+fx*8,py+fz*8);mg.lineTo(px-fx*5-fz*5,py-fz*5+fx*5);mg.lineTo(px-fx*5+fz*5,py-fz*5-fx*5);mg.closePath();mg.fill();mg.stroke();
  mg.restore();
}

/* ---------- Birds (day) ---------- */
const birds=new T.Group();sc.add(birds);const BM=new T.MeshBasicMaterial({color:0x1b2a36,side:T.DoubleSide});
const BG=new T.PlaneGeometry(1.1,.35);const B=[];
for(let i=0;i<12;i++){const g=new T.Group(),w1=new T.Mesh(BG,BM),w2=new T.Mesh(BG,BM);w1.position.x=-.55;w2.position.x=.55;g.add(w1,w2);
  birds.add(g);B.push({g,w1,w2,a:Math.random()*PI*2,r:25+Math.random()*45,h:26+Math.random()*16,s:.18+Math.random()*.15,f:8+Math.random()*4});}

/* ---------- Headlight beams ---------- */
const BEAMM=new T.MeshBasicMaterial({color:0xfff0c0,transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,fog:false});
const BEAMG=new T.ConeGeometry(2.4,10,14,1,true);BEAMG.translate(0,-5,0);BEAMG.rotateX(-PI/2);
E.VH.forEach(o=>{const m=new T.Mesh(BEAMG,BEAMM);m.position.set(0,.9,(o.big?2.8:2)+.3);o.c.add(m);});

/* ---------- Particles: dust + VIP gold ---------- */
const cv=document.createElement("canvas");cv.width=cv.height=32;{const g=cv.getContext("2d"),r=g.createRadialGradient(16,16,0,16,16,16);r.addColorStop(0,"rgba(255,255,255,1)");r.addColorStop(1,"rgba(255,255,255,0)");g.fillStyle=r;g.fillRect(0,0,32,32);}
const PTX=new T.CanvasTexture(cv),PA=[];
function emit(gold,x,y,z,vx,vy,vz,sz,life){
  if(PA.length>70)return;
  const m=new T.SpriteMaterial({map:PTX,color:gold?0xffd34d:0xb8aa94,blending:gold?T.AdditiveBlending:T.NormalBlending,transparent:true,depthWrite:false,fog:false,opacity:.8});
  const s=new T.Sprite(m);s.position.set(x,y,z);s.scale.set(sz,sz,1);sc.add(s);PA.push({s,m,gold,vx,vy,vz,l:life,L:life,sz});
}
let pAcc=0,vAcc=0,nCache=0,nT=0,mapT=0;

/* ---------- Per-frame ---------- */
E.tick=function(dt,tt){
  const P=E.P;if(!P)return;
  /* arrival banner */
  if(lastLoc===null)lastLoc=S.location;else if(S.location!==lastLoc){lastLoc=S.location;banner();}
  /* intro flyover (once per page load) */
  if(!intro){intro=1;introT=0;}
  if(intro===1){
    introT+=dt;const u=Math.min(1,introT/5),e=u*u*(3-2*u),a=E.yaw+(1-e)*PI*1.1,r=14+(1-e)*72,h=11+(1-e)*42;
    cam.position.set(P.position.x+Math.sin(a)*r,h,P.position.z+Math.cos(a)*r);
    cam.lookAt(P.position.x,1.6+(1-e)*8,P.position.z);
    if(u>=1){intro=2;title.remove();}
  }
  /* night factor */
  nT+=dt;if(nT>.5){nT=0;nCache=nightNow();}
  BEAMM.opacity=Math.max(0,(nCache-.25))*.2;
  birds.visible=nCache<.5;
  if(birds.visible)B.forEach(b=>{b.a+=b.s*dt;b.g.position.set(Math.cos(b.a)*b.r,b.h+Math.sin(b.a*3)*1.5,Math.sin(b.a)*b.r);b.g.rotation.y=-b.a;
    const f=Math.sin(tt*b.f)*.7;b.w1.rotation.z=f;b.w2.rotation.z=-f;});
  /* dust while running */
  const v=P.userData.v||0;pAcc+=dt;
  if(v>4&&pAcc>.1){pAcc=0;emit(0,P.position.x+(Math.random()-.5)*.5,.15,P.position.z+(Math.random()-.5)*.5,(Math.random()-.5)*.6,.5,(Math.random()-.5)*.6,.7,.6);}
  /* VIP golden aura */
  vAcc+=dt;
  let vip=false;try{vip=vipOn();}catch(e){}
  if(vip&&vAcc>.07){vAcc=0;const a=Math.random()*PI*2;emit(1,P.position.x+Math.cos(a)*.8,.3+Math.random()*.6,P.position.z+Math.sin(a)*.8,0,1.4+Math.random(),0,.55,1.1);}
  /* update particles */
  for(let i=PA.length-1;i>=0;i--){const p=PA[i];p.l-=dt;if(p.l<=0){sc.remove(p.s);p.m.dispose();PA.splice(i,1);continue;}
    const k=p.l/p.L;p.s.position.x+=p.vx*dt;p.s.position.y+=p.vy*dt;p.s.position.z+=p.vz*dt;
    const sz=p.gold?p.sz*k:p.sz*(2-k);p.s.scale.set(sz,sz,1);p.m.opacity=k*(p.gold?.9:.45);}
  /* minimap ~10fps */
  mapT+=dt;if(mapT>.1){mapT=0;drawMap();}
};
})();
