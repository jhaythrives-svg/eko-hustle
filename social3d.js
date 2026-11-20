/* Eko Hustle · SOCIAL layer. Load AFTER home.js. Needs step18-visit.sql to be run once.
   See other players in the city and in homes in real time, wave and cheer, and visit friends' homes. */
(function(){
"use strict";
const E=window.EH3D;if(!E||!E.T)return;
const T=E.T,PI=Math.PI,SO={fail:0,off:false,busy:false,key:"",remote:new Map(),emote:null,emoteAt:0,code:null,tt:0};
const ok=()=>typeof sb!=="undefined"&&sb&&typeof session!=="undefined"&&session&&session.user&&typeof S!=="undefined"&&S&&E.P&&window.H3;
const hash=s=>{let h=7;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h;};
function lab(txt){const c=document.createElement("canvas");c.width=256;c.height=64;const g=c.getContext("2d");g.font="bold 30px sans-serif";g.textAlign="center";g.fillStyle="rgba(0,0,0,.55)";g.fillRect(0,8,256,48);g.fillStyle="#e8f0ec";g.fillText(txt,128,43);
  const sp=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(c),depthTest:false,transparent:true}));sp.scale.set(3.6,.9,1);sp.renderOrder=9;return sp;}
function mkRemote(r){const g=new T.Group(),h=hash(String(r.c)),sk=[0x8a5a3c,0x6e4530,0x9a6540,0xa0683f,0x7a4d33][h%5],tp=[0xb83a3a,0x2f8f6b,0x3b6fb6,0xd9a93a,0x9b4dca,0xe9a23b,0x14b8a6][(h>>3)%7];
  const lm=c=>new T.MeshLambertMaterial({color:c}),bx=(w,hh,d,c,x,y,z,p)=>{const m=new T.Mesh(new T.BoxGeometry(w,hh,d),lm(c));m.position.set(x,y,z);(p||g).add(m);return m;};
  const body=new T.Group();g.add(body);bx(.72,.95,.4,tp,0,1.6,0,body);bx(.74,.2,.42,0x2a2f36,0,1.05,0,body);
  const head=new T.Mesh(new T.SphereGeometry(.31,12,10),lm(sk));head.position.y=2.3;body.add(head);
  const fem=r.look==="f",hair=new T.Mesh(new T.SphereGeometry(.33,10,8),lm(0x14100e));hair.scale.set(1,fem?1:.55,1);hair.position.set(0,fem?2.42:2.44,-.03);body.add(hair);
  if(fem){const pf=new T.Mesh(new T.SphereGeometry(.2,8,8),lm(0x14100e));pf.position.set(0,2.7,-.12);body.add(pf);}
  const arm=x=>{const p=new T.Group();p.position.set(x,1.95,0);body.add(p);bx(.2,.85,.2,tp,0,-.42,0,p);bx(.18,.18,.18,sk,0,-.92,0,p);return p;},leg=x=>{const p=new T.Group();p.position.set(x,1.08,0);g.add(p);bx(.28,1,.28,0x3b6fb6,0,-.5,0,p);bx(.3,.14,.42,0xf4f4f2,0,-1.04,.06,p);return p;};
  g.userData={body,aL:arm(-.48),aR:arm(.48),lL:leg(-.18),lR:leg(.18),ph:Math.random()*6,tx:0,tz:0,pose:null};
  const l=lab(String(r.h||"Hustler").slice(0,18));l.position.y=3.7;g.add(l);return g;}
function dropAll(){SO.remote.forEach(a=>E.sc.remove(a));SO.remote.clear();}
function scene(){const H=window.H3;if(H.inside()){const st=H.state(),own=st.cfg.owner==="me",code=own?SO.code:st.cfg.owner;return code?{id:"home:"+code,local:true,own,owner:st.cfg.owner}:null;}return{id:"city:"+S.location,local:false};}
function getCode(){if(SO.code)return SO.code;try{if(FR&&FR.d&&FR.d.code){SO.code=FR.d.code;return SO.code;}}catch(e){}
  if(!SO.asked){SO.asked=1;sb.rpc("fr_state").then(r=>{if(r&&r.data&&r.data.code)SO.code=r.data.code;});}return null;}
function apply(sc,list){if(SO.key!==sc.id){dropAll();SO.key=sc.id;}
  const c=window.H3.center,seen={};list.slice(0,14).forEach(r=>{seen[r.c]=1;let a=SO.remote.get(r.c);const tx=sc.local?c[0]+r.x:r.x,tz=sc.local?c[1]+r.z:r.z;
    if(!a){a=mkRemote(r);a.position.set(tx,0,tz);E.sc.add(a);SO.remote.set(r.c,a);if(sc.local&&sc.own){try{toast("👋 "+String(r.h).slice(0,18)+" entered your home");}catch(e){}}}
    const u=a.userData;u.tx=tx;u.tz=tz;u.pose=r.pose||null;u.ry=r.ry;});
  SO.remote.forEach((a,k)=>{if(!seen[k]){E.sc.remove(a);SO.remote.delete(k);}});}
async function poll(){if(SO.busy||SO.off||document.hidden||!ok()||S.social===false||document.body.classList.contains("w3d")===false)return;
  const sc=scene();if(!sc)return;if(sc.local&&sc.own&&!getCode())return;SO.busy=true;
  try{const P=E.P,c=window.H3.center,x=sc.local?P.position.x-c[0]:P.position.x,z=sc.local?P.position.z-c[1]:P.position.z,pose=(performance.now()-SO.emoteAt<4000)?SO.emote:null;
    const r=await sb.rpc("pres_sync",{p_scene:sc.id,p_x:x,p_z:z,p_ry:P.rotation.y,p_pose:pose});
    if(r.error){SO.fail++;const m=String(r.error.message||"");
      if(/Not allowed/i.test(m)&&window.H3.inside()){window.H3.exit();try{toast("You can no longer visit this home.");}catch(e){}}
      else if(/schema cache|does not exist|Could not find|permission denied/i.test(m)||SO.fail>6)SO.off=true;return;}
    SO.fail=0;apply(sc,Array.isArray(r.data)?r.data:[]);
  }catch(e){SO.fail++;if(SO.fail>6)SO.off=true;}finally{SO.busy=false;}}
setInterval(poll,2000);
/* ---- smooth movement + animation of the other players ---- */
const prev=E.tick;
E.tick=function(dt,t){if(prev)prev(dt,t);try{SO.tt+=dt;SO.remote.forEach(a=>{const u=a.userData,dx=u.tx-a.position.x,dz=u.tz-a.position.z,d=Math.hypot(dx,dz);let sp=0;
    if(d>40){a.position.x=u.tx;a.position.z=u.tz;}else if(d>.15){sp=Math.min(14,d/1.2);a.position.x+=dx/d*sp*dt;a.position.z+=dz/d*sp*dt;const h=Math.atan2(dx,dz);a.rotation.y+=(((h-a.rotation.y+3*PI)%(2*PI))-PI)*Math.min(1,dt*8);}
    if(sp>.2)u.ph+=dt*(3+sp*1.6);const s=Math.sin(u.ph)*.8*Math.min(1,sp/2.5);u.lL.rotation.x=s;u.lR.rotation.x=-s;u.aL.rotation.x=-s*.9;u.aR.rotation.x=s*.9;u.aL.rotation.z=-.06;u.aR.rotation.z=.06;u.body.position.y=0;
    if(sp<.5&&u.pose){const w=Math.sin(SO.tt*9);if(u.pose==="wave"){u.aR.rotation.x=0;u.aR.rotation.z=2.6+w*.4;}else{u.aL.rotation.z=-2.8;u.aR.rotation.z=2.8;u.body.position.y=Math.abs(w)*.35;}}});}catch(e){}};
/* ---- wave and cheer buttons ---- */
const bar=document.createElement("div");bar.style.cssText="position:absolute;z-index:3;left:14px;bottom:128px;display:flex;gap:6px";
bar.innerHTML='<button class="c3b" id="soW" style="position:static;padding:8px 12px">👋</button><button class="c3b" id="soC" style="position:static;padding:8px 12px">🎉</button>';E.box.appendChild(bar);
const emote=k=>{SO.emote=k;SO.emoteAt=performance.now();try{window.pose("av",k,3500);}catch(e){}if(typeof sfx==="function")sfx(1);};
bar.querySelector("#soW").onclick=()=>emote("wave");bar.querySelector("#soC").onclick=()=>emote("cheer");
setInterval(()=>{bar.style.display=(typeof S!=="undefined"&&S&&S.social!==false)?"flex":"none";},1500);
/* ---- visit a friend's home ---- */
window.visitHome=async function(code){const H=window.H3;if(!H||!E.P)return toast("Visiting works in the 3D city.");if(H.inside())return toast("Go outside first.");
  if(typeof sb==="undefined"||!sb||!session||!session.user)return toast("Visiting needs an online connection.");
  code=String(code||"").trim().toUpperCase();if(!/^[A-Z0-9]{6}$/.test(code))return toast("Enter a 6-character friend code.");
  const r=await sb.rpc("home_view",{p_code:code});if(r.error){const m=String(r.error.message||"");return toast(/schema cache|Could not find|does not exist/i.test(m)?"Visiting is not switched on yet.":m.slice(0,90));}
  const d=r.data||{},own=(Array.isArray(d.own)?d.own:[]).filter(x=>H.valid.items.indexOf(x)>=0).slice(0,12);
  closeModal();H.enter({tier:Math.max(1,Math.min(5,d.tier|0)),paint:H.valid.paint.indexOf(d.paint)>=0?d.paint:"cream",own,power:["none","gen","sol"].indexOf(d.power)>=0?d.power:"none",dark:!!d.dark,owner:String(d.code||code),handle:String(d.handle||"a friend").slice(0,18)});
  try{track("home_visit");}catch(e){}};
const _fp=window.frPaint;
if(typeof _fp==="function")window.frPaint=function(){_fp.apply(this,arguments);try{const el=document.getElementById("frbody"),d=FR.d;if(!el||!d)return;
  el.insertAdjacentHTML("beforeend",'<div class="section-title">Visit a home</div>'+(d.friends.length?d.friends.map(f=>'<button class="opt" onclick="visitHome(\''+f.code+'\')">🏠 '+esc(f.handle)+'\'s place</button>').join(""):'<div class="rw" style="color:var(--muted)">Add friends to visit their homes.</div>')+
  '<div style="display:flex;gap:6px;margin:8px 0"><input id="vCode" placeholder="Friend code" maxlength="6" style="text-transform:uppercase;flex:1;background:var(--card);border:1px solid var(--line);border-radius:10px;padding:10px;color:var(--text);font-size:15px"/><button class="btn" style="padding:8px 14px" onclick="visitHome(document.getElementById(\'vCode\').value)">Visit</button></div><div class="fxsub">You can enter a home when its owner has added your friend code.</div>');}catch(e){}};
/* ---- settings switch and privacy note ---- */
const _os=window.openSettings;
if(typeof _os==="function")window.openSettings=function(){const r=_os.apply(this,arguments);try{const m=document.querySelector(".modal"),b=document.createElement("button");b.className="opt";b.textContent=S.social===false?"👥 Other players: Off":"👥 Other players: On";
  b.onclick=()=>{S.social=S.social===false?true:false;try{save();}catch(e){}if(S.social===false){dropAll();SO.key="";try{sb.rpc("pres_leave");}catch(e){}}openSettings();};m.insertBefore(b,m.children[1]);}catch(e){}return r;};
const _sp=window.showPrivacy;
if(typeof _sp==="function")window.showPrivacy=function(){const r=_sp.apply(this,arguments);try{const d=document.querySelector(".modal div");if(d)d.insertAdjacentHTML("beforeend","<p><b>Seeing other players:</b> in the 3D city, players in the same place can see your display name and where you are standing. In a home, only the owner and friends the owner added can see you. This is kept for seconds only, and you can switch it off in Settings.</p>");}catch(e){}return r;};
document.addEventListener("visibilitychange",()=>{if(document.hidden&&ok()&&!SO.off)try{sb.rpc("pres_leave");}catch(e){}});
window.SOCIAL={remote:SO.remote,state:SO,poll};
})();
