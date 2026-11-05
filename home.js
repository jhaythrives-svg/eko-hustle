/* Eko Hustle · HOME layer. Load AFTER real3d.js.
   Rent a place in any district, furnish it, power it, sleep in it, pay rent or lose it. */
(function(){
"use strict";
const TIERS=[
 {n:"Couch at a friend's place",e:"🛋️",rent:0,slots:1,eb:0,hap:0},
 {n:"Room (face-me-I-face-you)",e:"🚪",rent:60000,slots:3,eb:10,hap:1},
 {n:"Self-contain",e:"🏠",rent:150000,slots:5,eb:20,hap:2},
 {n:"1-bedroom flat",e:"🏢",rent:350000,slots:7,eb:30,hap:3},
 {n:"2-bedroom flat",e:"🏬",rent:800000,slots:9,eb:40,hap:4,only:["lekki","vi","ikeja","yaba"]},
 {n:"Penthouse",e:"🌆",rent:2500000,slots:12,eb:50,hap:6,only:["lekki","vi"]}];
const DIST={ajah:.7,ojota:.75,surulere:.9,ikeja:1,yaba:1.1,lekki:1.5,vi:1.8};
const ITEMS=[
 {id:"mat",n:"Foam mattress",e:"🛏️",p:40000,st:1,d:"Sleep restores +35 energy."},
 {id:"bed",n:"Quality bed",e:"🛌",p:220000,st:3,d:"Sleep restores +60 energy.",up:"mat"},
 {id:"fan",n:"Standing fan",e:"🌀",p:35000,st:1,hap:1,pw:1,d:"+1 happiness a day (needs light)."},
 {id:"plant",n:"Plants",e:"🪴",p:25000,st:2,hap:1,d:"+1 happiness a day."},
 {id:"sofa",n:"Sofa",e:"🛋️",p:120000,st:5,hap:1,d:"+1 happiness a day. Guests are impressed."},
 {id:"tv",n:"TV",e:"📺",p:150000,st:4,hap:2,pw:1,d:"+2 happiness a day (needs light)."},
 {id:"ac",n:"Air conditioner",e:"❄️",p:380000,st:5,hap:3,pw:1,d:"+3 happiness a day (needs light)."},
 {id:"fri",n:"Fridge",e:"🧊",p:280000,st:4,pw:1,d:"Every meal gives +4 extra energy (needs light)."},
 {id:"desk",n:"Work desk + laptop",e:"💻",p:200000,st:4,pw:1,d:"+5% pay on every job (needs light)."},
 {id:"art",n:"Wall art",e:"🖼️",p:60000,st:6,d:"Pure style. Raises your Home Score."}];
const POWER=[{id:"gen",n:"Generator",e:"⛽",p:250000,fuel:5000,d:"Gives light. Petrol costs ₦5,000 a day."},{id:"sol",n:"Solar inverter",e:"☀️",p:1800000,fuel:0,d:"Free light every day. No more NEPA wahala."}];
const PAINT={cream:["Cream","#d9cfb8"],mint:["Mint","#a9d8c2"],sky:["Sky","#9cc4e4"],blush:["Blush","#e6b9c0"],gold:["Gold","#d8b45a"],char:["Charcoal","#4a525a"]};
const ITEM=id=>ITEMS.find(x=>x.id===id),NM=id=>(typeof LOCS!=="undefined"&&LOCS[id]?LOCS[id].name:id);
const R500=x=>Math.round(x/500)*500;
const H=()=>{if(!S.home)S.home={tier:0,loc:null,own:[],paint:"cream",power:"none",due:0,auto:true,sleptAt:0,eb:0,dark:false};return S.home;};
const rentOf=(t,loc)=>R500(TIERS[t].rent*(DIST[loc]||1));
const placed=()=>{const h=H();return h.own.slice(0,TIERS[h.tier].slots);};
const powerOn=()=>{const h=H();return h.power==="sol"||(h.power==="gen"&&!h.dark);};
const on=it=>H().tier>0&&placed().indexOf(it.id)>=0&&(!it.pw||powerOn());
const has=id=>{const it=ITEM(id);return !!it&&on(it);};
function score(){const h=H();let s=h.tier*10+(PAINT[h.paint]&&h.tier>0?3:0);placed().forEach(id=>s+=ITEM(id).st);if(h.power==="sol")s+=6;else if(h.power==="gen")s+=2;return s;}
function comfort(){const h=H();let c=TIERS[h.tier].hap;placed().forEach(id=>{const it=ITEM(id);if(it.hap&&on(it))c+=it.hap;});return c;}
function sleepGain(){return has("bed")?60:has("mat")?35:20;}
const left=()=>{const h=H();return Math.max(0,h.due-S.day);};

/* ---------- styles ---------- */
const css=document.createElement("style");css.textContent=".hroom{border-radius:14px;overflow:hidden;border:1px solid var(--line);margin:6px 0 10px}.hwall{padding:14px 10px 10px;display:flex;flex-wrap:wrap;gap:8px;justify-content:center;min-height:96px}.hfl{height:26px;background:linear-gradient(#5b4a3a,#3b2f25)}.hs{width:58px;height:58px;border-radius:12px;background:rgba(0,0,0,.18);display:flex;align-items:center;justify-content:center;font-size:32px;border:2px dashed rgba(255,255,255,.35);cursor:pointer}.hs.f{border:2px solid rgba(255,255,255,.25);background:rgba(255,255,255,.12)}.hs.off{filter:grayscale(1);opacity:.55}.hchip{background:#0d1317;border:1px solid var(--line);border-radius:999px;padding:6px 10px;font-size:11px;color:#8fa3ad;margin:0 4px 6px 0}.hchip.on{border-color:var(--green);color:#e8f0ec}";document.head.appendChild(css);

/* ---------- screens ---------- */
const HS={d:null};
window.openHome=function(tab){const h=H();tab=tab||"room";
  const body=tab==="move"?moveHtml():tab==="shop"?shopHtml():tab==="paint"?paintHtml():roomHtml();
  openModal(`<h3>🏠 My Home</h3>${tabBar([["room","🏠 Room"],["move","🔑 Move"],["shop","🛍️ Furnish"],["paint","🎨 Paint"]],tab,"openHome")}${body}<button class="opt" onclick="closeModal()" style="text-align:center">Close</button>`);};
function roomHtml(){const h=H(),T=TIERS[h.tier],pl=placed(),wall=(PAINT[h.paint]||PAINT.cream)[1];
  let slots="";for(let i=0;i<T.slots;i++){const it=pl[i]?ITEM(pl[i]):null;slots+=it?`<div class="hs f ${it.pw&&!powerOn()?"off":""}" title="${it.n}">${it.e}</div>`:`<div class="hs" onclick="openHome('shop')">＋</div>`;}
  const stored=h.own.length-pl.length;
  const rentLine=h.tier===0?`<div class="rw">You are staying on a friend's couch. It is free, but there is no space. Rent your own place in the Move tab.</div>`:
    `<div class="opt" style="${left()<=3?"border-color:var(--gold)":""}"><b>🔑 Rent ₦${fmtMoney(rentOf(h.tier,h.loc))} a month</b> · ${NM(h.loc)}<span class="sub">${left()>0?"Next rent in "+left()+" day"+(left()===1?"":"s"):"Rent is due now. Pay within "+Math.max(0,h.due+3-S.day)+" days or you lose the place."}</span><div style="display:flex;gap:6px;margin-top:8px"><button class="btn primary" style="flex:1;padding:8px" onclick="homePay()">Pay rent now</button><button class="btn" style="flex:1;padding:8px" onclick="homeAuto()">${h.auto?"Auto-pay: On":"Auto-pay: Off"}</button></div></div>`;
  const sleepOk=h.tier===0||h.loc===S.location,cd=Math.max(0,6*36e5-(Date.now()-(h.sleptAt||0)));
  return `<div class="rw"><b>${T.e} ${T.n}</b>${h.tier?" · "+NM(h.loc):""}<br><span style="color:var(--muted)">Home Score <b style="color:var(--gold)">${score()}</b> · +${comfort()} happiness a day · +${T.eb} max energy</span></div>
  <div class="hroom" style="background:${wall}"><div class="hwall">${slots}</div><div class="hfl"></div></div>
  ${stored>0?`<div class="fxsub">${stored} item${stored>1?"s":""} in storage (no space). Move to a bigger place to use them.</div>`:""}
  ${h.tier>0?`<div style="margin-bottom:6px"><span class="hchip ${powerOn()?"on":""}">${h.power==="none"?"💡 No light (NEPA)":powerOn()?(h.power==="sol"?"☀️ Solar on":"⛽ Generator on"):"⛽ Out of fuel"}</span></div>`:""}
  ${rentLine}
  <button class="opt ${sleepOk&&cd===0?"":"locked"}" onclick="homeSleep()">🛏️ Sleep<span class="sub">${!sleepOk?"Go to your place in "+NM(h.loc)+" first.":cd>0?"Rested. Sleep again in "+fmtDur(cd)+".":"+"+sleepGain()+" energy and a better mood."}</span></button>`;}
function moveHtml(){const h=H(),d=HS.d||(HS.d=S.location);
  const chips=Object.keys(DIST).map(k=>`<button class="fxc ${k===d?"on":""}" onclick="HS_set('${k}')">${NM(k)}</button>`).join(" ");
  const rows=TIERS.map((T,i)=>{if(!i||(T.only&&T.only.indexOf(d)<0))return"";const r=rentOf(i,d),cost=r+R500(r*.1),cur=h.tier===i&&h.loc===d;
    return `<button class="opt ${cur||S.cash<cost?"locked":""}" onclick="homeMove(${i},'${d}')">${T.e} ${T.n} ${cur?"✅":""}<span class="sub">₦${fmtMoney(r)} a month · move in ₦${fmtMoney(cost)} (first month + 10% agent) · ${T.slots} spaces · +${T.eb} max energy</span></button>`;}).join("");
  return `<div class="fxsub">Pick a district. Rent is cheaper in Ajah and Ojota, and dearer in Lekki and VI.</div><div style="margin-bottom:8px">${chips}</div>${rows||"<div class='rw'>Nothing here yet.</div>"}${h.tier>0?`<button class="opt" onclick="homeMove(0,null)">🛋️ Move out to a friend's couch (free)<span class="sub">Your furniture goes into storage.</span></button>`:""}`;}
function shopHtml(){const h=H();if(h.tier===0)return `<div class="rw">You need your own place first. Open the Move tab.</div>`;
  const full=h.own.length>=TIERS[h.tier].slots;
  const items=ITEMS.filter(it=>h.own.indexOf(it.id)<0&&(!it.up||h.own.indexOf(it.up)>=0||true)).map(it=>{const upg=it.up&&h.own.indexOf(it.up)>=0,blocked=full&&!upg,poor=S.cash<it.p;
    return `<button class="opt ${blocked||poor?"locked":""}" onclick="homeBuy('${it.id}')">${it.e} ${it.n}${upg?" (upgrade)":""}<span class="sub">₦${fmtMoney(it.p)} · ${it.d}${blocked?" · No space":""}</span></button>`;}).join("");
  const pw=POWER.filter(p=>h.power!==p.id&&!(p.id==="gen"&&h.power==="sol")).map(p=>`<button class="opt ${S.cash<p.p?"locked":""}" onclick="homePower('${p.id}')">${p.e} ${p.n}<span class="sub">₦${fmtMoney(p.p)} · ${p.d}</span></button>`).join("");
  return `<div class="fxsub">Spaces used ${h.own.length}/${TIERS[h.tier].slots}. Things marked "needs light" only work when you have a generator or solar.</div><div class="section-title" style="margin-top:6px">Light</div>${pw||"<div class='rw'>Best power already installed.</div>"}<div class="section-title">Furniture</div>${items||"<div class='rw'>You own everything. Big man.</div>"}`;}
function paintHtml(){const h=H();if(h.tier===0)return `<div class="rw">Rent a place first, then make it yours.</div>`;
  return `<div class="fxsub">Walls cost ₦20,000 a coat. Your building outside changes colour too.</div>`+Object.keys(PAINT).map(k=>`<button class="opt ${S.cash<20000||h.paint===k?"locked":""}" onclick="homePaint('${k}')"><span style="display:inline-block;width:16px;height:16px;border-radius:4px;background:${PAINT[k][1]};vertical-align:middle;margin-right:8px"></span>${PAINT[k][0]} ${h.paint===k?"✅":""}<span class="sub">₦20,000</span></button>`).join("");}
window.HS_set=function(k){HS.d=k;openHome("move");};

/* ---------- actions ---------- */
function setEnergyBonus(h,eb){S.maxEnergy=Math.max(100,S.maxEnergy+eb-(h.eb||0));h.eb=eb;S.energy=Math.min(S.energy,S.maxEnergy);}
window.homeMove=function(t,loc){const h=H();if(t===0){setEnergyBonus(h,0);h.tier=0;h.loc=null;addLog("🛋️ You moved out to a friend's couch.");toast("Moved out. Your furniture is in storage.");save();renderGame();openHome("room");return;}
  if(TIERS[t].only&&TIERS[t].only.indexOf(loc)<0)return toast(TIERS[t].n+" is not available in "+NM(loc)+".");
  const r=rentOf(t,loc),cost=r+R500(r*.1);if(S.cash<cost)return toast("You need ₦"+fmtMoney(cost)+" to move in.");
  const first=h.tier===0&&!h.everRented;S.cash-=cost;h.tier=t;h.loc=loc;h.due=S.day+30;h.everRented=1;setEnergyBonus(h,TIERS[t].eb);
  addLog(`🔑 Moved into a ${TIERS[t].n} in ${NM(loc)}. -₦${fmtMoney(cost)}.`);if(first)addXp(80);burst();sfx(2);track("home_move",{t,loc});
  showCharacter("ada",first?"Your first place! Now furnish it, pay the rent on time, and keep hustling.":"New place, new level. Make it yours.",6000);save();renderGame();openHome("room");};
window.homePay=function(){const h=H(),r=rentOf(h.tier,h.loc);if(h.tier===0)return;if(S.cash<r)return toast("You need ₦"+fmtMoney(r)+" for rent.");S.cash-=r;h.due=Math.max(h.due,S.day)+30;addLog("🔑 Rent paid: -₦"+fmtMoney(r));sfx(1);save();renderGame();openHome("room");};
window.homeAuto=function(){const h=H();h.auto=!h.auto;save();openHome("room");};
window.homeBuy=function(id){const h=H(),it=ITEM(id);if(!it||h.tier===0)return;const upg=it.up&&h.own.indexOf(it.up)>=0;
  if(h.own.length>=TIERS[h.tier].slots&&!upg)return toast("No space. Move to a bigger place.");if(S.cash<it.p)return toast("Not enough cash.");
  S.cash-=it.p;if(upg)h.own[h.own.indexOf(it.up)]=id;else h.own.push(id);addXp(20);addLog(`🛍️ Bought ${it.n}: -₦${fmtMoney(it.p)}`);sfx(2);track("home_buy",{id});save();renderGame();openHome("shop");};
window.homePower=function(id){const h=H(),p=POWER.find(x=>x.id===id);if(!p||h.tier===0)return;if(S.cash<p.p)return toast("Not enough cash.");S.cash-=p.p;h.power=id;h.dark=false;addXp(30);addLog(`${p.e} ${p.n} installed: -₦${fmtMoney(p.p)}`);burst();sfx(2);save();renderGame();openHome("shop");};
window.homePaint=function(k){const h=H();if(S.cash<20000)return toast("Not enough cash.");S.cash-=20000;h.paint=k;sfx(1);save();renderGame();openHome("paint");};
window.homeSleep=function(){const h=H(),cd=6*36e5-(Date.now()-(h.sleptAt||0));if(h.tier>0&&h.loc!==S.location)return toast("Go to your place in "+NM(h.loc)+" first.");if(cd>0)return toast("You just slept. Try again later.");
  const g=sleepGain();S.energy=Math.min(S.maxEnergy,S.energy+g);S.happiness=Math.min(100,S.happiness+3);h.sleptAt=Date.now();addLog("🛏️ Slept: +"+g+" energy.");sfx(2);try{pose("av","save",1500);}catch(e){}save();renderGame();openHome("room");};

/* ---------- days pass: rent, petrol, comfort ---------- */
function homeDaily(from,to){const h=H();let hap=0;
  for(let d=from;d<=to;d++){if(h.tier===0)continue;
    if(h.power==="gen"){const f=POWER[0].fuel;if(S.cash>=f){S.cash-=f;h.dark=false;}else h.dark=true;}
    hap+=comfort();
    if(d>=h.due){const r=rentOf(h.tier,h.loc);
      if(h.auto&&S.cash>=r){S.cash-=r;h.due=d+30;addLog("🔑 Rent auto-paid: -₦"+fmtMoney(r));}
      else if(d>h.due+3){setEnergyBonus(h,0);h.tier=0;h.loc=null;addLog("🚪 You could not pay rent and lost your place. Your furniture is in storage.");try{toast("🚪 Evicted! You missed rent. Furniture is in storage.");showCharacter("chinedu","Landlord don lock your door? Rent no dey wait for anybody.",6000);}catch(e){}}
      else if(d===h.due)try{toast("🔑 Rent is due. Pay it in My Home.");}catch(e){}}}
  if(hap)S.happiness=Math.min(100,S.happiness+hap);}
const _cr=window.checkReset;
window.checkReset=function(){const d0=S&&S.day;_cr.apply(this,arguments);if(S&&d0&&S.day>d0){try{homeDaily(d0+1,S.day);save();}catch(e){console.warn("home",e);}}};

/* ---------- things the furniture really does ---------- */
const _em=window.eduMult;if(typeof _em==="function")window.eduMult=function(){let m=_em.apply(this,arguments);try{if(has("desk"))m+=.05;}catch(e){}return m;};
const _eat=window.eat;if(typeof _eat==="function")window.eat=function(i){const e0=S.energy,r=_eat.apply(this,arguments);try{if(S.energy>e0&&has("fri")){S.energy=Math.min(S.maxEnergy,S.energy+4);save();renderGame();}}catch(e){}return r;};
const _om=window.openMore;
window.openMore=function(){const r=_om.apply(this,arguments);try{const m=document.querySelector(".modal"),b=document.createElement("button"),h=H();b.className="opt";b.innerHTML="🏠 My Home"+(h.tier>0&&left()<=3?" ⚠️ rent due soon":"");b.onclick=()=>openHome();m.insertBefore(b,m.children[2]);}catch(e){}return r;};
setInterval(()=>{try{if(!S||S.home||S.level<3||S.homeHint)return;if(S.cash>=90000&&!document.querySelector(".modal")){S.homeHint=1;showCharacter("ada","You can afford your own room now. Open More, then My Home, and start setting up your life.",7000);toast("🏠 You can rent your own place now (More → My Home)");save();}}catch(e){}},8000);

/* ---------- 3D: your building appears in your district ---------- */
const E=window.EH3D;let hm=null;
function lab(t){const c=document.createElement("canvas");c.width=256;c.height=64;const g=c.getContext("2d");g.font="bold 30px sans-serif";g.textAlign="center";g.fillStyle="rgba(0,0,0,.55)";g.fillRect(0,8,256,48);g.fillStyle="#fbbf24";g.fillText(t,128,43);const s=new E.T.Sprite(new E.T.SpriteMaterial({map:new E.T.CanvasTexture(c),depthTest:false,transparent:true}));s.scale.set(4.4,1.1,1);s.renderOrder=9;return s;}
function drop(){if(!hm)return;E.sc.remove(hm.g,hm.m,hm.l);const i=E.spots.indexOf(hm.s);if(i>=0)E.spots.splice(i,1);const j=E.COL.indexOf(hm.c);if(j>=0)E.COL.splice(j,1);hm=null;}
function homeSync(){if(!E||!E.T||!E.P||typeof S==="undefined"||!S)return;const h=S.home,want=h&&h.tier>0&&h.loc&&E.Z[h.loc]?h.loc+"|"+h.paint+"|"+h.tier:null;
  if(hm&&hm.key===want)return;drop();if(!want)return;const T=E.T,z=E.Z[h.loc],cx=z[0]+11.5,cz=z[1]-1,hh=2.6+h.tier*.7,g=new T.Group();
  const body=new T.Mesh(new T.BoxGeometry(4,hh,4),new T.MeshLambertMaterial({color:(PAINT[h.paint]||PAINT.cream)[1]}));body.position.y=hh/2;
  const roof=new T.Mesh(new T.BoxGeometry(4.5,.4,4.5),new T.MeshLambertMaterial({color:0x5b4a3a}));roof.position.y=hh+.2;
  const door=new T.Mesh(new T.BoxGeometry(.9,1.7,.1),new T.MeshLambertMaterial({color:0x3b2f25}));door.position.set(-2.01,.85,0);door.rotation.y=PI2;
  g.add(body,roof,door);g.position.set(cx,0,cz);g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});E.sc.add(g);
  const m=new T.Mesh(new T.CylinderGeometry(1.6,1.6,.15,20),new T.MeshBasicMaterial({color:0x2fbf86,transparent:true,opacity:.6}));m.position.set(z[0]+9,.2,cz);E.sc.add(m);
  const l=lab("🏠 Home");l.position.set(z[0]+9,3.4,cz);E.sc.add(l);const s={x:z[0]+9,z:cz,txt:"🏠 Home",fn:()=>openHome(),m,l},c=[cx,cz,2.7,2.7];E.spots.push(s);E.COL.push(c);hm={key:want,g,m,l,s,c};}
const PI2=Math.PI/2;
setInterval(()=>{try{homeSync();}catch(e){}},1500);
window.homeScore=score;
})();
