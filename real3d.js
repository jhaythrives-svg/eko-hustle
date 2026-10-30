/* Eko Hustle · REAL layer: shadows, sky dome, tone mapping, Lagos detail, live game sync.
   Load AFTER city3d.js and wow3d.js. Needs the expanded window.EH3D line. */
(function(){
"use strict";
const E=window.EH3D;if(!E||!E.sun){console.warn("real3d: EH3D incomplete");return;}
const T=E.T,PI=Math.PI,sc=E.sc,cam=E.cam,R=E.R,sun=E.sun,box=E.box;
const lite=()=>document.body.classList.contains("lite");
const LITE=lite();

/* ---------- Renderer: filmic look + real shadows ---------- */
R.toneMapping=T.ACESFilmicToneMapping;R.toneMappingExposure=1.25;
if(!LITE){
  R.shadowMap.enabled=true;R.shadowMap.type=T.PCFSoftShadowMap;
  sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.bias=-.0008;
  const c=sun.shadow.camera;c.left=c.bottom=-48;c.right=c.top=48;c.near=1;c.far=220;
  sc.add(sun.target);
}
const seen=new WeakSet();
function flagShadows(){
  sc.traverse(o=>{
    if(!o.isMesh||seen.has(o))return;seen.add(o);
    const m=o.material;if(!m||!m.isMeshLambertMaterial)return;
    o.receiveShadow=true;const g=o.geometry;if(!g.boundingBox)g.computeBoundingBox();
    const b=g.boundingBox,hy=(b.max.y-b.min.y)*o.scale.y,wx=b.max.x-b.min.x;
    if(hy>.45&&wx<40)o.castShadow=true;
  });
}

/* ---------- Sky dome (gradient synced to the game clock) ---------- */
const skyU={top:{value:new T.Color(0x2e6bc7)},bot:{value:new T.Color(0x7fb2d6)}};
const dome=new T.Mesh(new T.SphereGeometry(250,16,12),new T.ShaderMaterial({uniforms:skyU,side:T.BackSide,depthWrite:false,fog:false,
  vertexShader:"varying vec3 vP;void main(){vP=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
  fragmentShader:"uniform vec3 top;uniform vec3 bot;varying vec3 vP;void main(){float h=clamp(vP.y,0.,1.);gl_FragColor=vec4(mix(bot,top,pow(h,.55)),1.);}"}));
dome.renderOrder=-10;dome.frustumCulled=false;sc.add(dome);
const dayTop=new T.Color(0x2e6bc7),nightTop=new T.Color(0x02050d),duskTop=new T.Color(0x47407f),tmp=new T.Color();

/* ---------- Ground texture (replaces the flat green plane) ---------- */
let ground=null;
function mkGround(){
  const c=document.createElement("canvas");c.width=c.height=128;const g=c.getContext("2d");
  g.fillStyle="#35423a";g.fillRect(0,0,128,128);
  for(let i=0;i<900;i++){const v=Math.random();g.fillStyle=v<.5?"rgba(0,0,0,.10)":"rgba(255,255,255,.05)";g.fillRect(Math.random()*128,Math.random()*128,2,2);}
  const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(70,70);
  sc.children.forEach(o=>{if(!ground&&o.isMesh&&o.geometry.type==="PlaneGeometry"&&o.geometry.parameters.width===500){
    ground=o;o.material=new T.MeshLambertMaterial({color:0xffffff,map:t});o.receiveShadow=true;}});
}

/* ---------- Lagos detail: Geepee tanks, AC units, palms, trees ---------- */
let deco=0;
function rr(s){const x=Math.sin(s*127.1)*43758.5453;return x-Math.floor(x);}
function buildDeco(){
  const tankG=new T.CylinderGeometry(.9,.9,1.5,10),tankM=new T.MeshLambertMaterial({color:0x15191c}),
        acG=new T.BoxGeometry(1.2,.6,.8),acM=new T.MeshLambertMaterial({color:0xb8bec4}),
        legG=new T.BoxGeometry(1.4,.5,1.4),legM=new T.MeshLambertMaterial({color:0x6b6f73});
  let n=0;
  sc.children.slice().forEach(o=>{
    if(!o.isMesh||o.geometry.type!=="BoxGeometry"||!o.material.emissiveMap)return;
    const p=o.geometry.parameters;if(p.height<6||p.width>12)return;
    const r=rr(o.position.x*3.1+o.position.z*1.7);
    const top=o.position.y*2;
    if(r<.55){const x=o.position.x+(rr(r*91)-.5)*p.width*.4,z=o.position.z+(rr(r*57)-.5)*p.depth*.4;
      const lg=new T.Mesh(legG,legM);lg.position.set(x,top+.25,z);const tk=new T.Mesh(tankG,tankM);tk.position.set(x,top+1.25,z);sc.add(lg,tk);n++;}
    if(r>.3){const ac=new T.Mesh(acG,acM);ac.position.set(o.position.x+p.width*.3,top+.3,o.position.z-p.depth*.25);sc.add(ac);}
  });
  /* trees along the roads */
  const trunkG=new T.CylinderGeometry(.18,.3,5,6),trunkM=new T.MeshLambertMaterial({color:0x6b4a2b}),
        frondG=new T.BoxGeometry(3.2,.08,.55),frondM=new T.MeshLambertMaterial({color:0x2f8a3e,side:T.DoubleSide}),
        leafG=new T.IcosahedronGeometry(2,0),leafM=new T.MeshLambertMaterial({color:0x2b6b34});
  const palmZ={lekki:1,vi:1,ajah:1,ikeja:1};
  E.ZN.forEach((id,zi)=>{
    const cx=E.Z[id][0],cz=E.Z[id][1],L=Math.hypot(cx,cz);let k=0;
    for(let d=LITE?24:17;d<L-26;d+=LITE?14:9,k++){
      const off=(k%2?1:-1)*(8+rr(d+zi)*2),u=d/L,x=cx*u-cz/L*off,z=cz*u+cx/L*off;
      const tr=new T.Mesh(trunkG,trunkM);tr.position.set(x,2.5,z);sc.add(tr);
      if(palmZ[id]){for(let f=0;f<6;f++){const fr=new T.Mesh(frondG,frondM),a=f/6*PI*2;fr.position.set(x+Math.cos(a)*1.4,5.1,z+Math.sin(a)*1.4);fr.rotation.y=-a;fr.rotation.z=-.35;sc.add(fr);}}
      else{const lf=new T.Mesh(leafG,leafM);lf.position.set(x,6,z);lf.scale.y=.85;sc.add(lf);}
      E.COL.push([x,z,.7,.7]);
    }
  });
}

/* ---------- Game-sync visuals ---------- */
let P=null,mood=null,ring=null,moodKey="",moodTex={};
function moodSprite(e){
  if(!moodTex[e]){const c=document.createElement("canvas");c.width=c.height=64;const g=c.getContext("2d");g.font="46px sans-serif";g.textAlign="center";g.fillText(e,32,50);moodTex[e]=new T.CanvasTexture(c);}
  return moodTex[e];
}
function setupPlayer(){
  mood=new T.Sprite(new T.SpriteMaterial({map:moodSprite("😊"),transparent:true,depthTest:false}));mood.scale.set(1.3,1.3,1);mood.position.y=3.5;mood.renderOrder=9;mood.visible=false;P.add(mood);
  ring=new T.Mesh(new T.RingGeometry(.95,1.2,28),new T.MeshBasicMaterial({color:0xcd7f32,transparent:true,opacity:.7,side:T.DoubleSide,depthWrite:false}));
  ring.rotation.x=-PI/2;ring.position.y=.06;ring.visible=false;P.add(ring);
}
function moodNow(){
  if(S.health<30)return"🤕";if(S.energy<20)return"😴";if(S.happiness<35)return"😞";if(S.happiness>85)return"😄";
  try{if(vipOn())return"👑";}catch(e){}return"";
}
const TIERS=[[30,0x6fe3ff],[20,0xe9b949],[10,0xc9d1d9],[5,0xcd7f32]];
function syncPlayer(tt){
  const m=moodNow();
  if(m!==moodKey){moodKey=m;mood.visible=!!m;if(m)mood.material.map=moodSprite(m);mood.material.needsUpdate=true;}
  if(mood.visible)mood.position.y=3.5+Math.sin(tt*3)*.08;
  const t=TIERS.find(x=>S.level>=x[0]);ring.visible=!!t;if(t){ring.material.color.setHex(t[1]);ring.rotation.z=tt*.8;}
  if(S.energy<20&&P.userData.v<.5&&P.rotation.x===0)P.userData.head.rotation.x=.35;
}

/* ---------- Appointment pillars (guide you to the next district) ---------- */
const pillars={};
E.ZN.forEach(id=>{
  const m=new T.Mesh(new T.CylinderGeometry(1.2,1.2,100,12,1,true),new T.MeshBasicMaterial({color:0x22c55e,transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false,fog:false}));
  m.position.set(E.Z[id][0],50,E.Z[id][1]);m.visible=false;sc.add(m);pillars[id]=m;
});

/* ---------- Per-frame ---------- */
const prev=E.tick;let nT=0,shT=0,du=0,ni=0,rainK=0;
E.tick=function(dt,tt){
  if(prev)prev(dt,tt);
  P=E.P;if(!P)return;
  if(!deco){deco=1;try{mkGround();buildDeco();setupPlayer();}catch(e){console.warn("real3d setup",e);}if(!mood)return;}
  if(!mood)return;
  /* sun follows the real clock; shadows fall the right way */
  const h=hourF(),a=((h-6)/12)*PI;
  sun.position.set(P.position.x+Math.cos(a)*65,Math.max(14,Math.abs(Math.sin(a))*75),P.position.z+28);
  sun.target.position.set(P.position.x,0,P.position.z);
  nT+=dt;if(nT>.5){nT=0;const f=phase(h);du=f.du;ni=f.ni;sun.color.setRGB(1-.35*ni,1-.2*du-.15*ni,1-.55*du);}
  shT+=dt;if(shT>1.2){shT=0;if(!LITE)flagShadows();}
  /* sky dome */
  dome.position.copy(cam.position);
  tmp.copy(dayTop).lerp(nightTop,ni);if(du>.3)tmp.lerp(duskTop,Math.min(1,du*.6));
  skyU.top.value.copy(tmp);skyU.bot.value.copy(sc.fog.color);
  /* rain: thicker fog, wet dark ground */
  const rn=E.rain&&E.rain.visible?1:0;rainK+=(rn-rainK)*Math.min(1,dt*.8);
  sc.fog.far=170-rainK*65;sc.fog.near=50-rainK*22;
  if(ground)ground.material.color.setScalar(1-rainK*.35);
  /* game sync */
  syncPlayer(tt);
  const want={};(S.appointments||[]).forEach(x=>{if(x.status==="ready")want[x.loc]=1;});
  E.ZN.forEach(id=>{const p=pillars[id],on=want[id]&&S.location!==id;p.visible=!!on;if(on)p.material.opacity=.16+Math.sin(tt*3)*.06;});
};

/* soft vignette for a filmic frame */
const vg=document.createElement("div");vg.style.cssText="position:absolute;inset:0;z-index:2;pointer-events:none;background:radial-gradient(ellipse at 50% 55%,transparent 58%,rgba(0,0,0,.45))";
box.appendChild(vg);
})();
