/* Eko Hustle · Living Lagos 3D layer. Load after the main script and three.js r128. */
(function(){
"use strict";
const T=window.THREE;if(!T){console.warn("three.js missing");return;}
const Z={ojota:[-62,-38],yaba:[-22,-62],ikeja:[28,-58],surulere:[62,-12],vi:[44,44],lekki:[2,62],ajah:[-50,36]},ZN=Object.keys(Z);
const PADC={ojota:0x4a4420,yaba:0x1d3b38,ikeja:0x4a3a1a,surulere:0x3d2240,vi:0x24313f,lekki:0x1f3d2c,ajah:0x3a3329};
const STY={ojota:[8,3,8],yaba:[10,6,18],ikeja:[10,4,9],surulere:[8,4,10],vi:[12,18,45],lekki:[8,6,16],ajah:[12,2,4]};
const LOOK={m:{skin:0x8a5a3c,hair:0x14100e,top:0x2b2f36,pants:0x3b6fb6,st:0},f:{skin:0xa0683f,hair:0x14100e,top:0x2b2f36,pants:0x3b6fb6,st:1},
 tunde:{skin:0x7a4d33,hair:0x14100e,top:0x2f8f6b,pants:0x2a2f36,st:0},chinedu:{skin:0x9a6540,hair:0x14100e,top:0xb83a3a,pants:0xe8e2d4,st:0},
 chief:{skin:0x6e4530,hair:0xd9d4c8,top:0xd9a93a,pants:0xc9993a,st:2},ada:{skin:0x8f5a3a,hair:0x14100e,top:0x9b4dca,pants:0x2a2f36,st:1},
 x:{skin:0x8a5a3c,hair:0x14100e,top:0x667788,pants:0x2a2f36,st:0}};
let sd=11;const rnd=()=>(sd=(sd*9301+49297)%233280)/233280,PI=Math.PI;
const mats={},M=c=>mats[c]||(mats[c]=new T.MeshLambertMaterial({color:c}));
/* DOM */
const css=document.createElement("style");
css.textContent="body.in-game .scwrap .scene{display:none}#c3d.full{position:fixed!important;inset:0;z-index:45!important;border-radius:0!important}#c3d canvas{position:absolute;inset:0;width:100%;height:100%;display:block}.c3b{position:absolute;z-index:3;border:1px solid #2a4033;background:rgba(0,0,0,.6);color:#e8f0ec;border-radius:999px;padding:8px 12px;font:700 12px sans-serif}#c3js{position:absolute;z-index:3;left:14px;bottom:14px;width:104px;height:104px;border-radius:50%;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.2);touch-action:none}#c3k{position:absolute;left:32px;top:32px;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.4)}";
document.head.appendChild(css);
const box=document.createElement("div");box.id="c3d";box.style.cssText="position:absolute;inset:0;z-index:9;overflow:hidden;border-radius:12px;touch-action:none;background:#000";
box.innerHTML='<div id="c3h" class="c3b" style="left:8px;top:8px;border-radius:10px"></div><button class="c3b" id="c3ride" style="right:50px;top:64px;display:none">🚗</button><button class="c3b" id="c3f" style="right:8px;top:64px">⛶</button><div id="c3js"><div id="c3k"></div></div><button class="c3b" id="c3a" style="right:12px;bottom:18px;display:none;padding:14px 18px;background:rgba(233,185,73,.95);color:#1a0f00;font-size:15px"></button><div id="c3t" class="c3b" style="left:8px;right:8px;top:44px;display:none;border-radius:10px;font-weight:600"></div>';
const $=id=>box.querySelector("#"+id);
/* three */
const lite=()=>document.body.classList.contains("lite");
const R=new T.WebGLRenderer({antialias:false});R.setPixelRatio(lite()?1:Math.min(devicePixelRatio||1,1.5));box.insertBefore(R.domElement,box.firstChild);
const sc=new T.Scene(),cam=new T.PerspectiveCamera(52,1,.5,320),sun=new T.DirectionalLight(0xffffff,1),amb=new T.HemisphereLight(0xbcd8ff,0x303030,.7);
sun.position.set(40,70,25);sc.add(sun,amb);sc.fog=new T.Fog(0x7fb2d6,50,170);sc.background=new T.Color(0x7fb2d6);
new ResizeObserver(()=>{const w=box.clientWidth,h=box.clientHeight;if(w&&h){R.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();}}).observe(box);
function tex(lit){const c=document.createElement("canvas");c.width=c.height=64;const g=c.getContext("2d");g.fillStyle=lit?"#000":"#cfd6dc";g.fillRect(0,0,64,64);let r=3;for(let y=4;y<64;y+=16)for(let x=4;x<64;x+=16){r=(r*7+5)%11;g.fillStyle=lit?(r<5?"#ffd58a":"#000"):"#3b4a58";g.fillRect(x,y,8,9);}const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;return t;}
const tA=tex(0),tE=tex(1),WM=[],COL=[],bm={};
function bld(x,z,w,h,d,col,par,nocol){const g=new T.BoxGeometry(w,h,d),uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*w/5,uv.getY(i)*h/5);
  const m=bm[col]||(bm[col]=new T.MeshLambertMaterial({color:col,map:tA,emissiveMap:tE,emissive:0}));if(WM.indexOf(m)<0)WM.push(m);
  const o=new T.Mesh(g,m);o.position.set(x,h/2,z);(par||sc).add(o);if(!nocol)COL.push([x,z,w/2+.7,d/2+.7]);return o;}
function lab(txt,col,s){const c=document.createElement("canvas");c.width=256;c.height=64;const g=c.getContext("2d");g.font="bold 30px sans-serif";g.textAlign="center";g.fillStyle="rgba(0,0,0,.55)";g.fillRect(0,8,256,48);g.fillStyle=col||"#fff";g.fillText(txt,128,43);
  const sp=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(c),depthTest:false,transparent:true}));sp.scale.set(s*4,s,1);sp.renderOrder=9;return sp;}
function person(o){const g=new T.Group(),sk=new T.MeshLambertMaterial({color:o.skin}),tp=new T.MeshLambertMaterial({color:o.top}),pn=M(o.pants),hr=M(o.hair);
  const bx=(w,h,d,m,x,y,z,p)=>{const s=new T.Mesh(new T.BoxGeometry(w,h,d),m);s.position.set(x,y,z);(p||g).add(s);return s;};
  const body=new T.Group();g.add(body);bx(.72,.95,.4,tp,0,1.6,0,body);bx(.74,.2,.42,pn,0,1.05,0,body);
  const head=new T.Group();head.position.y=2.3;body.add(head);head.add(new T.Mesh(new T.SphereGeometry(.31,12,10),sk));
  const hs=new T.Mesh(new T.SphereGeometry(.33,10,8),hr);hs.scale.set(1,o.st===1?1:.55,1);hs.position.set(0,o.st===1?.12:.14,-.03);head.add(hs);
  if(o.st===1){const pf=new T.Mesh(new T.SphereGeometry(.2,8,8),hr);pf.position.set(0,.4,-.12);head.add(pf);}
  if(o.st===2)bx(.7,.12,.7,tp,0,.3,0,head);
  bx(.06,.06,.04,M(0x111111),-.11,.04,.29,head);bx(.06,.06,.04,M(0x111111),.11,.04,.29,head);
  const arm=x=>{const p=new T.Group();p.position.set(x,1.95,0);body.add(p);bx(.2,.85,.2,tp,0,-.42,0,p);bx(.18,.18,.18,sk,0,-.92,0,p);return p;};
  const leg=x=>{const p=new T.Group();p.position.set(x,1.08,0);g.add(p);bx(.28,1,.28,pn,0,-.5,0,p);bx(.3,.14,.42,M(0xf4f4f2),0,-1.04,.06,p);return p;};
  g.userData={body,head,aL:arm(-.48),aR:arm(.48),lL:leg(-.18),lR:leg(.18),ph:rnd()*6,o:rnd()*6,tp};return g;}
function anim(p,v,pose,t,dt){const u=p.userData;if(v>.2)u.ph+=dt*(3+v*1.6);const s=Math.sin(u.ph)*.8*Math.min(1,v/2.5);
  u.lL.rotation.x=s;u.lR.rotation.x=-s;u.aL.rotation.x=-s*.9;u.aR.rotation.x=s*.9;u.aL.rotation.z=-.06;u.aR.rotation.z=.06;u.head.rotation.x=0;u.body.rotation.z=0;
  u.body.position.y=v>.2?Math.abs(Math.sin(u.ph))*.07:Math.sin(t*2+u.o)*.012;
  if(v>.5||!pose)return;const w=Math.sin(t*9);
  if(pose==="wave"){u.aR.rotation.x=0;u.aR.rotation.z=2.6+w*.4;}
  else if(pose==="talk"){u.aR.rotation.x=-.9+w*.3;u.head.rotation.x=w*.06;}
  else if(pose==="phone"){u.aR.rotation.x=-1.9;u.head.rotation.x=.3;}
  else if(pose==="work"){u.aL.rotation.x=u.aR.rotation.x=-1.2+w*.4;}
  else if(pose==="eat"||pose==="save"){u.aR.rotation.x=-1.6+w*.35;u.head.rotation.x=.1;}
  else if(pose==="cheer"){u.aL.rotation.z=-2.8;u.aR.rotation.z=2.8;u.body.position.y=Math.abs(w)*.4;}
  else if(pose==="hit"){u.body.rotation.z=Math.sin(t*35)*.2;}}
function car(col,big){const g=new T.Group(),b=new T.Mesh(new T.BoxGeometry(2,1.1,big?5.5:3.8),M(col));b.position.y=.9;const c=new T.Mesh(new T.BoxGeometry(1.8,.8,big?4.4:2),M(0x1d2a36));c.position.set(0,1.75,big?0:-.3);g.add(b,c);
  if(big){const s=new T.Mesh(new T.BoxGeometry(2.02,.25,5.6),M(0x111111));s.position.y=1;g.add(s);}
  [[-1,1],[1,1],[-1,-1],[1,-1]].forEach(w=>{const t=new T.Mesh(new T.BoxGeometry(.3,.7,.7),M(0x050505));t.position.set(w[0],.35,w[1]*(big?1.8:1.2));g.add(t);});return g;}
/* world */
const spots=[],propG=new T.Group(),PD=[],VH=[];let P,ZONE,built=0;
function spot(x,z,txt,fn,col){const m=new T.Mesh(new T.CylinderGeometry(1.6,1.6,.15,20),new T.MeshBasicMaterial({color:col||0xe9b949,transparent:true,opacity:.6}));m.position.set(x,.2,z);sc.add(m);
  const l=lab(txt,"#fbbf24",1.1);l.position.set(x,3.4,z);sc.add(l);const s={x,z,txt,fn,m,l};spots.push(s);return s;}
function rmSpot(s){sc.remove(s.m,s.l);spots.splice(spots.indexOf(s),1);}
function road(x1,z1,x2,z2){const dx=x2-x1,dz=z2-z1,L=Math.hypot(dx,dz);[[7,.1,0x1b1f23,.06],[.3,.12,0x6b6240,.1]].forEach(a=>{const m=new T.Mesh(new T.BoxGeometry(L,a[1],a[0]),M(a[2]));m.position.set((x1+x2)/2,a[3],(z1+z2)/2);m.rotation.y=-Math.atan2(dz,dx);sc.add(m);});}
function district(id){const[cx,cz]=Z[id],hx=Math.atan2(-cz,-cx),[n,a,b]=STY[id],cols=[0x8a9aa8,0xb08a6a,0x6f7f8f,0x9a8f7a,0x7a6a8a];
  const pad=new T.Mesh(new T.BoxGeometry(44,.2,44),M(PADC[id]));pad.position.set(cx,.05,cz);sc.add(pad);
  for(let i=0,k=0;i<n&&k<90;k++){const an=rnd()*2*PI,d=((an-hx+3*PI)%(2*PI))-PI;if(Math.abs(d)<.5)continue;const r=14+rnd()*6;bld(cx+Math.cos(an)*r,cz+Math.sin(an)*r,4+rnd()*4,a+rnd()*(b-a),4+rnd()*4,cols[i%5]);i++;}
  if(id==="ojota")for(let i=0;i<4;i++){const c=car(0xf2c200,1);c.rotation.y=PI/2;c.position.set(cx-9+i*6,0,cz-11);sc.add(c);COL.push([cx-9+i*6,cz-11,3.4,1.7]);}
  if(id==="yaba"){const t=new T.Mesh(new T.CylinderGeometry(.4,.8,32,6),M(0x222a30));t.position.set(cx+11,16,cz-11);sc.add(t);const l=new T.Mesh(new T.SphereGeometry(.7,8,8),new T.MeshBasicMaterial({color:0xff3b3b}));l.position.set(cx+11,32,cz-11);sc.add(l);}
  if(id==="ikeja")for(let i=0;i<6;i++){const s=new T.Mesh(new T.BoxGeometry(2.6,2,2.6),M(0x8a6a4a));s.position.set(cx-9+i*3.6,1,cz-11);const r=new T.Mesh(new T.BoxGeometry(3.2,.25,3.2),M([0xc0392b,0xe9b949,0x2de2c1][i%3]));r.position.set(cx-9+i*3.6,2.3,cz-11);sc.add(s,r);COL.push([cx-9+i*3.6,cz-11,1.9,1.9]);}
  if(id==="surulere"){const s=new T.Mesh(new T.CylinderGeometry(8,8,4,24,1,true),new T.MeshLambertMaterial({color:0x8a8f96,side:T.DoubleSide}));s.position.set(cx-12,2,cz-12);sc.add(s);COL.push([cx-12,cz-12,9,9]);}
  if(id==="vi")bld(cx+10,cz-10,8,62,8,0x5b7f9f);
  if(id==="lekki"){const w=new T.Mesh(new T.BoxGeometry(110,.1,40),new T.MeshLambertMaterial({color:0x1b4f72}));w.position.set(cx,.12,cz+36);sc.add(w);COL.push([cx,cz+38,60,16]);
    const dk=new T.Mesh(new T.BoxGeometry(80,.7,5),M(0x555b61));dk.position.set(cx,3,cz+30);sc.add(dk);[-14,14].forEach(o=>{const p=new T.Mesh(new T.CylinderGeometry(.5,.8,24,6),M(0x9aa3ab));p.position.set(cx+o,12,cz+30);sc.add(p);});}
  const nm=lab(LOCS[id].emoji+" "+LOCS[id].name,"#e8f0ec",1.5);nm.position.set(cx,12,cz);sc.add(nm);
  spot(cx+7,cz+6,"💼 Work",()=>openWork());spot(cx-7,cz+6,"🍴 Eat",()=>openFood());}
function build(){
  const g=new T.Mesh(new T.PlaneGeometry(500,500),M(0x35423a));g.rotation.x=-PI/2;sc.add(g);
  const hub=new T.Mesh(new T.CylinderGeometry(14,14,.2,28),M(0x2b3238));hub.position.y=.08;sc.add(hub);
  ZN.forEach(id=>{road(0,0,Z[id][0],Z[id][1]);district(id);});
  const ada=person(LOOK.ada);ada.position.set(0,0,6);ada.rotation.y=PI;sc.add(ada);ada.userData.auto=1;
  spot(0,6,"💬 Ada",()=>{const c=CHAPTERS[S.chap||0];showCharacter("ada",c?c.t+". "+c.say:"You are a Legend of Eko.",6000);openFreedom();},0xc084fc);
  const ch=person(LOOK.chinedu);ch.position.set(-6,0,5);ch.rotation.y=PI*.8;sc.add(ch);ch.userData.auto=1;
  spot(-6,5,"😏 Chinedu",()=>{let w=0;try{w=rival().w;}catch(e){}showCharacter("chinedu","Still chasing me? I'm at ₦"+fmtMoney(w)+". Catch up.",5000);},0xef5b69);
  const pl=lab("🏠 My Properties","#fbbf24",1.2);pl.position.set(17.6,9,-13.2);sc.add(pl);sc.add(propG);
  for(let i=0;i<ZN.length*3;i++)mkPed(i);for(let i=0;i<12;i++)mkVeh(i);mkAB();
  if(window.matchMedia&&0){}
  P=person(LOOK[S.look==="f"?"f":"m"]);sc.add(P);P.rotation.order="YXZ";ZONE=S.location;const[cx,cz]=Z[ZONE];P.position.set(cx,0,cz+11);P.userData.v=0;
  const rg=new T.BufferGeometry(),pos=new Float32Array(900);for(let i=0;i<300;i++){pos[i*3]=(rnd()-.5)*60;pos[i*3+1]=rnd()*30;pos[i*3+2]=(rnd()-.5)*60;}
  rg.setAttribute("position",new T.BufferAttribute(pos,3));rain=new T.Points(rg,new T.PointsMaterial({color:0xaec6e0,size:.25}));rain.visible=false;sc.add(rain);built=1;}
let rain;
const rp=(id,u,off)=>{const[cx,cz]=Z[id],L=Math.hypot(cx,cz);return[cx*u-cz/L*off,cz*u+cx/L*off];};
function mkPed(i){const PAL=[0xb83a3a,0x2f8f6b,0x3b6fb6,0xd9a93a,0x9b4dca,0xe8e2d4,0xe9a23b];
  const p=person({skin:[0x8a5a3c,0x6e4530,0x9a6540,0xa0683f][i%4],hair:0x14100e,top:PAL[i%7],pants:[0x2a2f36,0x3b6fb6,0x4a3f35][i%3],st:i%3===0?1:0});sc.add(p);
  const o={p,id:ZN[i%7],u:rnd(),tu:rnd(),sp:1.4+rnd()*1.2,off:(rnd()-.5)*5,pause:0,boost:0,sh:0};const q=rp(o.id,o.u,o.off);p.position.set(q[0],0,q[1]);PD.push(o);}
function mkVeh(i){const big=i%3!==2,c=car(big?0xf2c200:0x2f8f6b,big);sc.add(c);VH.push({c,id:ZN[i%7],u:rnd(),dir:i%2?1:-1,sp:7+rnd()*5,L:Math.hypot(...Z[ZN[i%7]]),big,cv:0,bt:0,stop:0,hk:0});}
function props(){propG.clear();let i=0;const bs=[17.6,-13.2],dr=[.6,.8];
  (S.assets||[]).forEach(id=>{const a=ASSETS.find(z=>z.id===id);if(!a||a.type!=="house")return;const h=Math.min(14,4+a.cost/1e6*.4);bld(bs[0]+dr[0]*i*9,bs[1]+dr[1]*i*9,5,h,5,0xb08a6a,propG,1);
    const f=new T.Mesh(new T.BoxGeometry(.2,2,.2),M(0xe9b949));f.position.set(bs[0]+dr[0]*i*9,h+1,bs[1]+dr[1]*i*9);propG.add(f);i++;});
  const AW={pepper:0xc0392b,shop:0x2de2c1,pos:0xe9b949,haul:0x9b59b6};Object.keys(S.biz||{}).forEach(id=>{if(!(S.biz[id]>0)||!AW[id])return;const x=bs[0]+dr[0]*i*9,z=bs[1]+dr[1]*i*9;bld(x,z,4,3,4,0x8a9aa8,propG,1);const r=new T.Mesh(new T.BoxGeometry(4.6,.3,4.6),M(AW[id]));r.position.set(x,3.2,z);propG.add(r);i++;});
  const best=["suv","camry","keke"].find(k=>(S.assets||[]).includes(k));if(best){const c=car({suv:0x1f4e7a,camry:0x8b1d2c,keke:0xe9b949}[best],0);c.position.set(bs[0]-6,0,bs[1]-4);c.rotation.y=.6;propG.add(c);}}
/* input */
const J={x:0,y:0},K={};let yaw=0,ap=null,apT=0,cool=0,hitCool=0,pk="",down=0,BP=[],told=0;
const fl=document.createElement("div");fl.style.cssText="position:absolute;inset:0;z-index:2;background:rgba(239,68,68,.45);opacity:0;pointer-events:none;transition:opacity .7s";box.appendChild(fl);
const PH=["Oga watch am! 😠","Abeg! 😤","You no get eye? 😡","Ehn! Waka well!"],bc={};
function shout(o,t){t=t||PH[Math.floor(Math.random()*4)];bc[t]=bc[t]||lab(t,"#fff",1).material;const s=new T.Sprite(bc[t]);s.scale.set(4.4,1.1,1);s.position.y=3.3;s.renderOrder=9;o.p.add(s);setTimeout(()=>o.p.remove(s),1400);}
function bump(o){const n=performance.now();if(n<o.pause)return;o.pause=n+1400;shout(o);BP=BP.filter(t=>n-t<30000);BP.push(n);
  if(BP.length>=3){BP=[];S.reputation=Math.max(0,S.reputation-1);addLog("😠 You kept shoving people. -1 Rep.");toast("😠 Lagos people are talking. -1 Rep");save();}}
function runOver(o,fx,fz){const n=performance.now(),dmg=Math.round(5+o.cv),med=Math.min(S.cash,Math.round(dailyCost()*.4));hitCool=n+3500;o.stop=n+2500;
  S.health=clamp(S.health-dmg);S.energy=clamp(S.energy-15,0,S.maxEnergy);S.happiness=clamp(S.happiness-5);S.cash-=med;down=n+(S.health<=0?4000:1800);if(S.health<=0)S.energy=0;
  const kx=P.position.x+fx*2.5,kz=P.position.z+fz*2.5;if(!hit(kx,kz)){P.position.x=kx;P.position.z=kz;}
  fl.style.opacity=1;setTimeout(()=>fl.style.opacity=0,80);honk(o,1);thud();buzz([100,50,100]);
  toast("🚑 Hit by a vehicle! -"+dmg+" health, -₦"+fmtMoney(med)+" medical");addLog("🚑 Hit by a vehicle: -"+dmg+" health, -₦"+fmtMoney(med)+" medical bills.");track("road_hit");
  if(!told){told=1;showCharacter("ada","Hospital bills eat your cash. Stay on the roadside and cross when it is clear.",6000);}save();renderGame();}
(function(){const js=$("c3js"),k=$("c3k");let id=null;const mv=e=>{const r=js.getBoundingClientRect();let dx=e.clientX-r.left-52,dy=e.clientY-r.top-52;const l=Math.hypot(dx,dy),m=40;if(l>m){dx*=m/l;dy*=m/l;}k.style.transform="translate("+dx+"px,"+dy+"px)";J.x=dx/m;J.y=-dy/m;};
  js.onpointerdown=e=>{id=e.pointerId;js.setPointerCapture(id);mv(e);e.stopPropagation();};js.onpointermove=e=>{if(e.pointerId===id)mv(e);};js.onpointerup=js.onpointercancel=()=>{id=null;J.x=J.y=0;k.style.transform="";};
  let dx=null,did=null;R.domElement.onpointerdown=e=>{did=e.pointerId;dx=e.clientX;};R.domElement.onpointermove=e=>{if(e.pointerId===did&&dx!=null){yaw-=(e.clientX-dx)*.01;dx=e.clientX;}};R.domElement.onpointerup=()=>{dx=null;};
  const kk={w:"w",arrowup:"w",s:"s",arrowdown:"s",a:"a",arrowleft:"a",d:"d",arrowright:"d"};addEventListener("keydown",e=>{if(e.key&&kk[e.key.toLowerCase()])K[kk[e.key.toLowerCase()]]=1;});addEventListener("keyup",e=>{if(e.key&&kk[e.key.toLowerCase()])K[kk[e.key.toLowerCase()]]=0;});
  $("c3f").onclick=()=>{box.classList.toggle("full");};
  $("c3ride").onclick=()=>{S.ride=S.ride===false?true:false;try{save();}catch(e){}};          
  $("c3a").onclick=()=>{if(P&&near)near.fn();};})();
let near=null;
const hit=(x,z)=>{for(let i=0;i<COL.length;i++){const c=COL[i];if(Math.abs(x-c[0])<c[2]&&Math.abs(z-c[1])<c[3])return 1;}return 0;};
function act(p,ms){if(p==="walk"||p==="idle"||!P||P.userData.v>.5)return;ap=({lift:"work",type:"work",tap:"work",save:"eat"})[p]||p;apT=performance.now()+(ms||1500);}
function say(k,t){if(!box.classList.contains("full"))return;const e=$("c3t");e.textContent=String(k).toUpperCase()+": "+t;e.style.display="block";clearTimeout(say._t);say._t=setTimeout(()=>e.style.display="none",5000);}
function enter(id){const l=LOCS[id],c=travelCost(l),e=travelEnergy(),[cx,cz]=Z[id];
  if(S.cash<c||S.energy<e){cool=performance.now()+2500;toast(S.cash<c?"You need ₦"+fmtMoney(c)+" fare for "+l.name:"Too tired for "+l.name+". Eat first.");const d=Math.hypot(P.position.x-cx,P.position.z-cz)||1;P.position.x=cx+(P.position.x-cx)/d*24;P.position.z=cz+(P.position.z-cz)/d*24;return;}
  ZONE=id;cool=performance.now()+1500;doTravelCore(id);}
const cD=new T.Color(0x7fb2d6),cU=new T.Color(0xc0714f),cN=new T.Color(0x060a14),cc=new T.Color();
function sec(){
  const f=phase(hourF());cc.copy(cD).lerp(cN,f.ni);if(f.du>.3)cc.lerp(cU,(f.du-.3)*.9);sc.background.copy(cc);sc.fog.color.copy(cc);sun.intensity=1.05-f.ni*.9;amb.intensity=.75-f.ni*.5;WM.forEach(m=>m.emissive.setRGB(f.wl,f.wl*.85,f.wl*.5));
  const li=Object.keys(LOCS).indexOf(S.location);rain.visible=(S.day*7+li)%5===0;
  const key=(S.assets||[]).join()+JSON.stringify(S.biz||{});if(key!==pk){pk=key;props();}
  P.userData.tp.color.set(vipOn()?0xe9b949:LOOK[S.look==="f"?"f":"m"].top);
  if(S.location!==ZONE&&Z[S.location]){ZONE=S.location;const[cx,cz]=Z[ZONE];if(Math.hypot(P.position.x-cx,P.position.z-cz)>20)P.position.set(cx,0,cz+11);}
  const want={};(S.appointments||[]).forEach(a=>{if(a.status==="ready"&&Z[a.loc])want[a.id]=a;});
  Object.keys(NP).forEach(k=>{if(!want[k]){sc.remove(NP[k].p);rmSpot(NP[k].s);delete NP[k];}});
  Object.keys(want).forEach(k=>{if(NP[k])return;const a=want[k],[cx,cz]=Z[a.loc],t=a.id.indexOf("tunde")===0?"tunde":a.id.indexOf("chief")===0?"chief":"x",p=person(LOOK[t]);p.position.set(cx+3,0,cz+10);p.userData.auto=1;sc.add(p);
    NP[k]={p,s:spot(cx+3,cz+10,"❗ "+(t==="x"?"Contact":t==="tunde"?"Tunde":"Chief"),()=>claimAppt(a.id),0x22c55e)};});
  $("c3h").textContent="₦"+fmtMoney(S.cash)+" · ⚡"+S.energy+" · "+LOCS[ZONE].name+(f.ni>.6?" 🌙":"")+(S.health<30?" 🤕":"");}
  const hasCar=(S.assets||[]).some(i=>i==="keke"||i==="camry"||i==="suv");const rb=$("c3ride");if(rb){if(hasCar){rb.style.display="block";rb.textContent=S.ride!==false?"🚶":"🚗";}else{rb.style.display="none";}} 
const NP={};let last=performance.now(),tt=0,acc=0;
function step(dt){
  const now=performance.now(),busy=!!$modal.firstChild||now<down;let jx=J.x+(K.d?1:0)-(K.a?1:0),jy=J.y+(K.w?1:0)-(K.s?1:0);const l=Math.hypot(jx,jy);if(l>1){jx/=l;jy/=l;}if(busy)jx=jy=0;
  const spd=((S.assets||[]).some(i=>i==="keke"||i==="camry"||i==="suv")&&S.ride!==false?10:6.5)*(S.health<30?.7:1),vx=(-Math.sin(yaw)*jy+Math.cos(yaw)*jx)*spd,vz=(-Math.cos(yaw)*jy-Math.sin(yaw)*jx)*spd;
  const px=P.position.x+vx*dt,pz=P.position.z+vz*dt;if(!hit(px,P.position.z))P.position.x=Math.max(-120,Math.min(120,px));if(!hit(P.position.x,pz))P.position.z=Math.max(-120,Math.min(120,pz));
  const v=Math.hypot(vx,vz);P.userData.v=v;if(v>.3){const d=((Math.atan2(vx,vz)-P.rotation.y+3*PI)%(2*PI))-PI;P.rotation.y+=d*Math.min(1,dt*10);}
  const pose=performance.now()<apT?ap:null;anim(P,v,pose,tt,dt);if(now<down){P.rotation.x=-1.45;P.position.y=.3;}else if(P.rotation.x){P.rotation.x=0;P.position.y=0;}
  scene_others(dt);
  near=null;let nd=3.4;spots.forEach(s=>{const d=Math.hypot(P.position.x-s.x,P.position.z-s.z);s.m.scale.setScalar(1+Math.sin(tt*4)*.08);if(d<nd){nd=d;near=s;}});
  const b=$("c3a");if(near&&!busy){b.style.display="block";b.textContent=near.txt;}else b.style.display="none";
  if(performance.now()>cool)for(const id of ZN){if(id===ZONE)continue;const[cx,cz]=Z[id];if(Math.hypot(P.position.x-cx,P.position.z-cz)<18){enter(id);break;}}
  const cx=P.position.x+Math.sin(yaw)*14,cz=P.position.z+Math.cos(yaw)*14;cam.position.x+=(cx-cam.position.x)*Math.min(1,dt*6);cam.position.y+=(11-cam.position.y)*Math.min(1,dt*6);cam.position.z+=(cz-cam.position.z)*Math.min(1,dt*6);cam.lookAt(P.position.x,1.6,P.position.z);
  if(rain.visible){rain.position.set(P.position.x,0,P.position.z);const a=rain.geometry.attributes.position;for(let i=0;i<300;i++){let y=a.getY(i)-dt*28;if(y<0)y=30;a.setY(i,y);}a.needsUpdate=true;}
  if(!busy&&now>abCool)for(const b of AB){if(b.id===ZONE&&Math.hypot(P.position.x-b.p.position.x,P.position.z-b.p.position.z)<3.2){abCool=now+100000;areaBoys();break;}}
  audioStep();acc+=dt;if(acc>1){acc=0;sec();audioSec();}}
function scene_others(dt){const now=performance.now();
  PD.forEach(o=>{const t=rp(o.id,o.tu,o.off),p=o.p,dx=t[0]-p.position.x,dz=t[1]-p.position.z,d=Math.hypot(dx,dz);
    if(now<o.pause){anim(p,0,null,tt,dt);return;}
    if(d<.6){o.tu=rnd();o.off=(rnd()-.5)*5;if(o.tu<.15&&rnd()<.5){o.id=ZN[Math.floor(rnd()*7)];}anim(p,0,null,tt,dt);return;}
    const sp=now<o.boost?5:o.sp;p.position.x+=dx/d*sp*dt;p.position.z+=dz/d*sp*dt;const a=((Math.atan2(dx,dz)-p.rotation.y+3*PI)%(2*PI))-PI;p.rotation.y+=a*Math.min(1,dt*8);anim(p,sp,null,tt,dt);});
  for(let i=0;i<PD.length;i++){const a=PD[i].p;let dx=a.position.x-P.position.x,dz=a.position.z-P.position.z,d=Math.hypot(dx,dz);
    if(d<.9&&d>.001&&now>down){const k=(.9-d)/2/d;a.position.x+=dx*k;a.position.z+=dz*k;if(!hit(P.position.x-dx*k,P.position.z-dz*k)){P.position.x-=dx*k;P.position.z-=dz*k;}bump(PD[i]);}
    for(let j=i+1;j<PD.length;j++){const b=PD[j].p;dx=a.position.x-b.position.x;dz=a.position.z-b.position.z;d=Math.hypot(dx,dz);if(d<.7&&d>.001){const k=(.7-d)/2/d;a.position.x+=dx*k;a.position.z+=dz*k;b.position.x-=dx*k;b.position.z-=dz*k;}}}
  VH.forEach((o,i)=>{const[cx,cz]=Z[o.id],fx=cx/o.L*o.dir,fz=cz/o.L*o.dir,px=o.c.position.x,pz=o.c.position.z;let blk=0,who="";
    const chk=(x,z,w)=>{const rx=x-px,rz=z-pz,al=rx*fx+rz*fz,la=Math.abs(-rx*fz+rz*fx);if(al>.5&&al<8&&la<2.2){blk=1;who=who||w;}};
    chk(P.position.x,P.position.z,"p");PD.forEach(d=>chk(d.p.position.x,d.p.position.z,"d"));VH.forEach((v,j)=>{if(j<i)chk(v.c.position.x,v.c.position.z,"v");});
    PD.forEach(d=>{const rx=d.p.position.x-px,rz=d.p.position.z-pz,al=rx*fx+rz*fz,ls=-rx*fz+rz*fx;if(o.cv>3&&al>1&&al<12&&Math.abs(ls)<2.6&&now>d.boost){d.boost=now+1800;d.off=(ls>=0?1:-1)*4.6;if(now>d.sh){d.sh=now+6000;shout(d,"Ewoo! 😱");}}});
    o.bt=blk?o.bt+dt:0;const tg=(now<o.stop||o.bt>.35)?0:o.sp;o.cv+=Math.max(-14*dt,Math.min(6*dt,tg-o.cv));
    if(o.bt>.35&&who!=="v"&&now>o.hk){o.hk=now+2500;honk(o);if(who==="p"&&o.cv>5)screech();}
    o.u+=o.dir*o.cv*dt/o.L;if(o.u>.97){o.u=.97;o.dir=-1;}if(o.u<.1){o.u=.1;o.dir=1;}
    const q=rp(o.id,o.u,o.dir>0?2:-2);o.c.position.set(q[0],0,q[1]);o.c.rotation.y=Math.atan2(cx*o.dir,cz*o.dir);
    const rx=P.position.x-q[0],rz=P.position.z-q[1],al=rx*fx+rz*fz,la=Math.abs(-rx*fz+rz*fx);
    if(Math.abs(al)<(o.big?3.2:2.4)&&la<1.5&&now>down){if(o.cv>2.5&&now>hitCool)runOver(o,fx,fz);else if(o.cv<=2.5){const d=Math.hypot(rx,rz)||1;P.position.x+=rx/d*dt*6;P.position.z+=rz/d*dt*6;}}});
  sc.children.forEach(c=>{if(c.userData&&c.userData.auto)anim(c,0,Math.sin(tt*.4+c.userData.o)>.9?"wave":null,tt,dt);});
  Object.keys(NP).forEach(k=>anim(NP[k].p,0,Math.sin(tt*.6+NP[k].p.userData.o)>.7?"wave":null,tt,dt));}
function loop(now){requestAnimationFrame(loop);if(document.hidden||typeof S==="undefined"||!S||!box.isConnected)return;if(!built)build();const dt=Math.min(.05,(now-last)/1000);last=now;tt+=dt;step(dt);if(window.EH3D&&EH3D.tick)EH3D.tick(dt,tt);R.render(sc,cam);}
/* area boys */
const AB=[];let abCool=0;
function mkAB(){["ojota","ikeja","surulere"].forEach(id=>{const[cx,cz]=Z[id];[[-4,2],[-2.8,3.4],[-5.2,3.6]].forEach((o,i)=>{const p=person({skin:[0x6e4530,0x8a5a3c,0x7a4d33][i],hair:0x14100e,top:[0x1d1d1d,0x7a2d2d,0x2a3b52][i],pants:0x3a3a3a,st:0});
  p.position.set(cx+o[0],0,cz+o[1]);p.rotation.y=PI*.7;p.userData.auto=1;sc.add(p);COL.push([cx+o[0],cz+o[1],1.2,1.2]);if(!i){const l=lab("😠 Area boys","#ef5b69",.9);l.position.y=3.8;p.add(l);}AB.push({p,id});});});}
function areaBoys(){const ev=EVENTS.find(e=>e.id==="alaye");if(!ev)return;currentEvent=ev;let f=1;
  AB.forEach(b=>{if(b.id!==ZONE)return;b.p.rotation.y=Math.atan2(P.position.x-b.p.position.x,P.position.z-b.p.position.z);if(f){f=0;shout(b,"Oga! Anything for the boys?");}});
  showCharacter("avatar",ev.text,0);openModal('<h3>'+esc(ev.title)+'</h3><p style="color:#c8d6ce;font-size:14px;margin:0 0 12px">'+esc(ev.text)+'</p>'+ev.choices.map((c,i)=>'<button class="opt" onclick="pickChoice('+i+')">'+esc(c.label)+'</button>').join(""));}
/* sound */
const AU={on:0},AP={ojota:[.5,.7,0,0],yaba:[.3,.3,0,0],ikeja:[.4,.9,0,0],surulere:[.3,.6,0,0],vi:[.35,.15,.12,0],lekki:[.2,.15,.1,.9],ajah:[.12,.2,.1,0]};
const pan=(x,z)=>Math.max(-1,Math.min(1,((x-cam.position.x)*Math.cos(yaw)-(z-cam.position.z)*Math.sin(yaw))/22));
function rdy(){if(!AU.on)audioInit();return AU.on;}
function audioInit(){const a=ax();if(!a||AU.on)return;AU.on=1;const bus=a.createGain();bus.gain.value=.9;bus.connect(MG);AU.bus=bus;
  const len=a.sampleRate*1.1,ib=a.createBuffer(2,len,a.sampleRate);for(let c=0;c<2;c++){const d=ib.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.5);}
  const cv=a.createConvolver();cv.buffer=ib;const rg=a.createGain();rg.gain.value=.22;cv.connect(rg);rg.connect(bus);AU.rev=cv;
  const wb=a.createBuffer(1,a.sampleRate*2,a.sampleRate),bb=a.createBuffer(1,a.sampleRate*2,a.sampleRate),wd=wb.getChannelData(0),bd=bb.getChannelData(0);let l=0;
  for(let i=0;i<wd.length;i++){wd[i]=Math.random()*2-1;l=l*.97+wd[i]*.2;bd[i]=l*1.2;}AU.wb=wb;
  const bed=(b,ty,f,q)=>{const s=a.createBufferSource(),fl=a.createBiquadFilter(),g=a.createGain();s.buffer=b;s.loop=true;fl.type=ty;fl.frequency.value=f;if(q)fl.Q.value=q;g.gain.value=0;s.connect(fl);fl.connect(g);g.connect(bus);s.start();return g;};
  AU.traffic=bed(bb,"lowpass",420);AU.crowd=bed(wb,"bandpass",900,.8);AU.wind=bed(bb,"lowpass",250);AU.water=bed(wb,"bandpass",500,.5);AU.rain=bed(wb,"highpass",3500);
  AU.eng=[0,1,2].map(()=>{const o=a.createOscillator(),o2=a.createOscillator(),f=a.createBiquadFilter(),g=a.createGain(),p=a.createStereoPanner();o.type="sawtooth";o2.type="square";f.type="lowpass";f.frequency.value=260;g.gain.value=0;o.connect(f);o2.connect(f);f.connect(g);g.connect(p);p.connect(bus);o.start();o2.start();return{o,o2,g,p};});}
function noiseHit(d,v,fq,fq2){if(!rdy())return;const a=AX,t=a.currentTime,s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();s.buffer=AU.wb;f.type="bandpass";f.Q.value=.9;f.frequency.setValueAtTime(fq,t);if(fq2)f.frequency.exponentialRampToValueAtTime(fq2,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);s.connect(f);f.connect(g);g.connect(AU.bus);s.start(t,Math.random()*1.5,d+.02);}
const screech=()=>noiseHit(.45,.1,2600,1500);
function thud(){if(!rdy())return;const a=AX,t=a.currentTime,o=a.createOscillator(),g=a.createGain();o.frequency.setValueAtTime(110,t);o.frequency.exponentialRampToValueAtTime(38,t+.3);g.gain.setValueAtTime(.4,t);g.gain.exponentialRampToValueAtTime(.001,t+.35);o.connect(g);g.connect(AU.bus);o.start(t);o.stop(t+.4);noiseHit(.25,.3,900);}
function honk(o,long){if(!rdy()||S.mute)return;const a=AX,t=a.currentTime,d=o?Math.hypot(o.c.position.x-P.position.x,o.c.position.z-P.position.z):12,k=Math.max(0,1-d/45);if(k<.02)return;
  const g=a.createGain(),f=a.createBiquadFilter(),p=a.createStereoPanner(),b=o&&!o.big?1.25:1,e=t+(long?.7:.32);f.type="lowpass";f.frequency.value=1500;p.pan.value=o?pan(o.c.position.x,o.c.position.z):0;
  [420*b,525*b].forEach(fq=>{const os=a.createOscillator();os.type="sawtooth";os.frequency.value=fq*(.99+Math.random()*.02);os.connect(f);os.start(t);os.stop(e);});
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.12*k,t+.02);g.gain.setValueAtTime(.12*k,e-.07);g.gain.linearRampToValueAtTime(0,e);f.connect(g);g.connect(p);p.connect(AU.bus);}
function bell(f,t,d,v){if(!rdy())return;const a=AX,o=a.createOscillator(),o2=a.createOscillator(),g=a.createGain(),g2=a.createGain(),T0=a.currentTime+t;o.frequency.value=f;o2.frequency.value=f*2.76;g2.gain.value=.18;
  g.gain.setValueAtTime(0,T0);g.gain.linearRampToValueAtTime(v,T0+.008);g.gain.exponentialRampToValueAtTime(.0008,T0+d);o.connect(g);o2.connect(g2);g2.connect(g);g.connect(AU.bus);g.connect(AU.rev);o.start(T0);o2.start(T0);o.stop(T0+d+.05);o2.stop(T0+d+.05);}
SND.click=()=>noiseHit(.03,.05,2500);SND.coin=()=>{bell(1175,0,.5,.12);bell(1568,.07,.6,.1);};SND.win=()=>[523,659,784,1047].forEach((f,i)=>bell(f,i*.09,.8,.1));
SND.level=()=>[523,659,784,1047,1319,1568].forEach((f,i)=>bell(f,i*.09,1.1,.11));SND.notify=()=>{bell(880,0,.4,.1);bell(1320,.12,.5,.1);};
SND.fail=()=>{bell(196,0,.5,.07);bell(147,.12,.7,.07);};SND.whoosh=()=>noiseHit(.4,.07,500,1400);SND.horn=()=>honk(null);
window.ambUpdate=function(){try{rdy();}catch(e){}};box.addEventListener("pointerup",()=>rdy(),true);
function audioStep(){if(!AU.on||!AX)return;const a=AX,t=a.currentTime,off=S.mute||S.amb===false,ve=VH.map(o=>({o,d:Math.hypot(o.c.position.x-P.position.x,o.c.position.z-P.position.z)})).sort((x,y)=>x.d-y.d);
  AU.eng.forEach((e,i)=>{const v=ve[i];if(!v||off){e.g.gain.setTargetAtTime(0,t,.1);return;}const o=v.o,k=Math.max(0,1-v.d/38),f=o.big?44+o.cv*5:75+o.cv*9;
    e.g.gain.setTargetAtTime(.1*k*k*(.35+o.cv/12),t,.1);e.o.frequency.setTargetAtTime(f,t,.15);e.o2.frequency.setTargetAtTime(f*.5,t,.15);e.p.pan.setTargetAtTime(pan(o.c.position.x,o.c.position.z),t,.1);});
  const st=Math.floor(P.userData.ph/PI);if(st!==AU.st){AU.st=st;if(P.userData.v>.5&&performance.now()>=down&&!off&&!(window.EH3D&&EH3D.driving))noiseHit(.08,.1,500+Math.random()*500);}}
function audioSec(){if(!AU.on||!AX)return;const t=AX.currentTime,off=S.mute||S.amb===false,p=AP[ZONE]||AP.ojota,ni=phase(hourF()).ni,m=off?0:1;
  AU.traffic.gain.setTargetAtTime(m*.22*p[0]*(1-ni*.4),t,1.2);AU.crowd.gain.setTargetAtTime(m*.1*p[1]*(1-ni*.6),t,1.2);AU.wind.gain.setTargetAtTime(m*.18*p[2],t,1.2);AU.water.gain.setTargetAtTime(m*.1*p[3],t,1.2);AU.rain.gain.setTargetAtTime(rain.visible?m*.05:0,t,1);
  if(!off&&ni>.6&&(ZONE==="ajah"||ZONE==="lekki"))for(let i=0;i<3;i++)tn(4300+Math.random()*200,i*.09,.04,"sine",.008);}
/* hooks into the game */
function mount(){const w=document.querySelector(".scwrap");if(w&&box.parentNode!==w)w.appendChild(box);}
const _rg=window.renderGame;window.renderGame=function(){const r=_rg.apply(this,arguments);try{mount();}catch(e){}return r;};
const _po=window.pose;window.pose=function(w,p,ms){try{if(w==="av")act(p,ms);}catch(e){}return _po.apply(this,arguments);};
const _sc=window.showCharacter;window.showCharacter=function(k,t,h){try{say(k,t);}catch(e){}return _sc.apply(this,arguments);};
window.EH3D={T,sc,cam,box,Z,ZN,VH,spots,R,sun,amb,WM,COL,PD,AB,get rain(){return rain},get hitCool(){return hitCool},set hitCool(v){hitCool=v},get P(){return P},get yaw(){return yaw},get ZONE(){return ZONE}}; 
try{mount();}catch(e){}requestAnimationFrame(loop);
})();
