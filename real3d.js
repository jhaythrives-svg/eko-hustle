/* Eko Hustle · REAL layer v2 (replaces real3d.js). Load AFTER city3d.js and wow3d.js.
   Sun/moon light + soft shadows, sky/stars/clouds, wet weather + thunder, sidewalks, lane lines, lamps, palms, rooftops,
   Freedom Tower that grows with your Freedom %, fireworks + coin pops, Owambe outfits, job props, mood bubble,
   level ring, appointment pillars, car lights, travel fade, auto quality. Drive/walk is handled by city3d.js. */
(function(){
"use strict";
const E=window.EH3D;
if(!E||!E.R||!E.sun||!E.WM||!E.COL||!E.AB){console.warn("real3d: run patch_city3d.py first");return;}
const T=E.T,R=E.R,sc=E.sc,cam=E.cam,box=E.box,sun=E.sun,amb=E.amb,Z=E.Z,ZN=E.ZN,COL=E.COL,PI=Math.PI;
const cl=(v,a,b)=>Math.max(a,Math.min(b,v)),lp=(a,b,t)=>a+(b-a)*t,K=h=>new T.Color(h);
const cvs=(w,h,fn)=>{const c=document.createElement("canvas");c.width=w;c.height=h;fn(c.getContext("2d"),w,h);return c;};
const mats={},M=c=>mats[c]||(mats[c]=new T.MeshLambertMaterial({color:c}));
const BK=(w,h,d,c,par,x,y,z)=>{const m=new T.Mesh(new T.BoxGeometry(w,h,d),typeof c==="object"?c:M(c));m.position.set(x,y,z);if(par)par.add(m);return m;};
const GT=new T.CanvasTexture(cvs(64,64,g=>{const r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,"rgba(255,255,255,1)");r.addColorStop(.35,"rgba(255,255,255,.35)");r.addColorStop(1,"rgba(255,255,255,0)");g.fillStyle=r;g.fillRect(0,0,64,64);}));
function lab(txt,col,s){const t=new T.CanvasTexture(cvs(256,64,g=>{g.font="bold 30px sans-serif";g.textAlign="center";g.fillStyle="rgba(0,0,0,.55)";g.fillRect(0,8,256,48);g.fillStyle=col||"#fff";g.fillText(txt,128,43);})),sp=new T.Sprite(new T.SpriteMaterial({map:t,depthTest:false,transparent:true}));sp.scale.set(s*4,s,1);sp.renderOrder=9;return sp;}
function inst(geo,mat,items,cast){const n=items.length,m=new T.InstancedMesh(geo,mat,Math.max(1,n)),d=new T.Object3D();
  items.forEach((it,i)=>{d.position.set(it.x,it.y,it.z);d.rotation.set(0,it.ry||0,it.rz||0);d.scale.set(it.sx||1,it.sy||1,it.sz||1);d.updateMatrix();m.setMatrixAt(i,d.matrix);if(it.c!=null)m.setColorAt(i,K(it.c));});
  m.count=n;m.instanceMatrix.needsUpdate=true;if(m.instanceColor)m.instanceColor.needsUpdate=true;m.castShadow=!!cast;m.receiveShadow=true;m.frustumCulled=false;sc.add(m);return m;}
const blocked=(x,z,m)=>{for(let i=0;i<COL.length;i++){const c=COL[i];if(Math.abs(x-c[0])<c[2]+m&&Math.abs(z-c[1])<c[3]+m)return 1;}return 0;};

/* ---------- UI: travel fade + ride button ---------- */
const css=document.createElement("style");css.textContent="#r3f{position:absolute;inset:0;z-index:18;background:#000;opacity:0;pointer-events:none}#r3v{position:absolute;inset:0;z-index:2;pointer-events:none;background:radial-gradient(ellipse at 50% 55%,transparent 58%,rgba(0,0,0,.42))}";document.head.appendChild(css);
const fade=document.createElement("div");fade.id="r3f";box.appendChild(fade);
const vg=document.createElement("div");vg.id="r3v";box.appendChild(vg);

/* ---------- state ---------- */
let ready=0,bad=0,Q=2,wet=0,thunder=0,nextTh=0,tt=0,sT=0,shT=0,myLoc=null,lastFw=0,fN=0,fT0=0,low=0,hidden=0;
let skyG,skyM,stars,sunS,moonS,GR,GC,lampP,signM,beamM,FT,curOut=null,lastFt=-1,fol,mood,ring,moodKey="";
const clouds=[],PR={},OF={},pillars={},moodC={},K1=K(0),K2=K(0),K3=K(0),V1=new T.Vector3(),V2=new T.Vector3(),V3=new T.Vector3();
const cD=K(0x9fc4e6),cU=K(0xe58f58),cN=K(0x0a1020),tD=K(0x3b78c4),tU=K(0x3b3f7e),tN=K(0x02040a),gR=K(0x6b7580);

/* ---------- quality ---------- */
function applyQ(){sun.castShadow=Q>0;const m=Q>1?2048:1024;if(sun.shadow.mapSize.x!==m){sun.shadow.mapSize.set(m,m);if(sun.shadow.map){sun.shadow.map.dispose();sun.shadow.map=null;}}
  R.setPixelRatio(Q===0?1:Math.min(window.devicePixelRatio||1,1.5));if(box.clientWidth)R.setSize(box.clientWidth,box.clientHeight,false);}
function governor(){const n=performance.now();if(document.hidden)hidden=1;fN++;if(!fT0){fT0=n;fN=0;return;}
  if(n-fT0<4000)return;const f=fN/((n-fT0)/1000);fT0=n;fN=0;if(hidden||tt<8){hidden=0;return;}
  low=f<24?low+1:0;if(low>=2&&Q>0){Q--;low=0;try{localStorage.setItem("eh_q3d",Q);}catch(e){}applyQ();try{toast("📱 3D set to a lighter look to keep it smooth");track("q3d",{q:Q,fps:Math.round(f)});}catch(e){}}}

/* ---------- sky, stars, sun, moon, clouds ---------- */
function mkSky(){
  skyG=new T.Group();sc.add(skyG);
  skyM=new T.ShaderMaterial({side:T.BackSide,depthWrite:false,fog:false,uniforms:{top:{value:K(0x3b78c4)},hor:{value:K(0x9fc4e6)},sunDir:{value:new T.Vector3(0,1,0)},sunCol:{value:K(0)}},
    vertexShader:"varying vec3 vP;void main(){vP=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",
    fragmentShader:"uniform vec3 top;uniform vec3 hor;uniform vec3 sunCol;uniform vec3 sunDir;varying vec3 vP;void main(){float h=clamp(vP.y,0.0,1.0);vec3 c=mix(hor,top,pow(h,0.5));float s=max(dot(normalize(vP),sunDir),0.0);c+=sunCol*(pow(s,48.0)*0.9+pow(s,5.0)*0.22);gl_FragColor=vec4(c,1.0);}"});
  const dome=new T.Mesh(new T.SphereGeometry(300,24,14),skyM);dome.frustumCulled=false;dome.renderOrder=-10;skyG.add(dome);
  const sp=new Float32Array(1800);for(let i=0;i<600;i++){const th=Math.random()*2*PI,y=.04+Math.random()*.96,r=Math.sqrt(1-y*y);sp[i*3]=Math.cos(th)*r*280;sp[i*3+1]=y*280;sp[i*3+2]=Math.sin(th)*r*280;}
  const sg=new T.BufferGeometry();sg.setAttribute("position",new T.BufferAttribute(sp,3));
  stars=new T.Points(sg,new T.PointsMaterial({color:0xffffff,size:1.7,sizeAttenuation:false,transparent:true,opacity:0,fog:false,depthWrite:false}));stars.frustumCulled=false;skyG.add(stars);
  sunS=new T.Sprite(new T.SpriteMaterial({map:GT,color:0xffe3a0,blending:T.AdditiveBlending,depthWrite:false,transparent:true,fog:false}));sunS.scale.set(75,75,1);skyG.add(sunS);
  moonS=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(cvs(64,64,g=>{g.fillStyle="#f4f1e6";g.beginPath();g.arc(32,32,28,0,7);g.fill();g.fillStyle="rgba(150,160,175,.45)";[[22,24,6],[38,38,8],[40,20,4]].forEach(a=>{g.beginPath();g.arc(a[0],a[1],a[2],0,7);g.fill();});})),transparent:true,depthWrite:false,fog:false}));moonS.scale.set(24,24,1);skyG.add(moonS);
  const ct=new T.CanvasTexture(cvs(128,64,g=>{for(let i=0;i<9;i++){const x=24+Math.random()*80,y=26+Math.random()*14,r=14+Math.random()*14,gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,"rgba(255,255,255,.55)");gr.addColorStop(1,"rgba(255,255,255,0)");g.fillStyle=gr;g.fillRect(0,0,128,64);}}));
  for(let i=0;i<10;i++){const s=new T.Sprite(new T.SpriteMaterial({map:ct,transparent:true,depthWrite:false,fog:false,opacity:.6}));s.scale.set(90+Math.random()*70,40+Math.random()*25,1);clouds.push({s,a:Math.random()*PI*2,r:90+Math.random()*130,h:70+Math.random()*40,v:.004+Math.random()*.006});skyG.add(s);}
}
function light(dt){
  const h=hourF(),f=phase(h),an=((h-5.5)/13.5)*PI,ex=Math.sin(an),dayK=cl(ex*2.5,0,1),P=E.P;
  V1.set(Math.cos(an)*220,Math.sin(an)*200,-110);V2.set(-Math.cos(an)*220,-Math.sin(an)*200,-110);
  wet+=((E.rain&&E.rain.visible?1:0)-wet)*Math.min(1,dt*.6);
  K1.copy(cD).lerp(cN,f.ni);if(f.du>.3)K1.lerp(cU,cl((f.du-.3)*1.3,0,1)*.85);K1.lerp(gR,wet*.55*(1-f.ni*.6));
  K2.copy(tD).lerp(tN,f.ni);if(f.du>.3)K2.lerp(tU,cl((f.du-.3)*1.3,0,1));K2.lerp(gR,wet*.5*(1-f.ni*.7));
  const sv=ex>0?V1:V2,U=skyM.uniforms;U.hor.value.copy(K1);U.top.value.copy(K2);U.sunDir.value.copy(sv).normalize();U.sunCol.value.setRGB(1,.75,.45).multiplyScalar(cl(ex*2,0,1)*(1-wet*.8));
  sc.fog.color.copy(K1);sc.background.copy(K1);sc.fog.near=lp(55,22,wet);sc.fog.far=lp(185,105,wet);
  V3.copy(sv).normalize();V3.y=Math.max(V3.y,.22);V3.normalize();sun.position.copy(P.position).addScaledVector(V3,110);sun.target.position.copy(P.position);
  K3.setRGB(1,.94,.84).lerp(K2.setRGB(1,.6,.32),cl(f.du*1.3,0,1)).lerp(K2.setRGB(.5,.6,.95),1-dayK);sun.color.copy(K3);
  sun.intensity=lp(.55,1.25,dayK)*(1-wet*.45);
  amb.color.setRGB(.78,.88,1).lerp(K2.setRGB(.2,.27,.52),f.ni);amb.groundColor.setRGB(.36,.32,.26).lerp(K2.setRGB(.05,.05,.09),f.ni);
  amb.intensity=lp(.5,.62,1-f.ni)*(1-wet*.2);
  if(wet>.6&&tt>nextTh){thunder=1.4;nextTh=tt+8+Math.random()*14;setTimeout(()=>{try{if(!S.mute)nz(0,1.6,.3,140,"lowpass");}catch(e){}},500+Math.random()*1200);}
  thunder=Math.max(0,thunder-dt*5);if(thunder>0&&Math.sin(tt*70)>0)amb.intensity+=thunder*1.2;
  E.WM.forEach(m=>m.emissive.setRGB(f.wl,f.wl*.85,f.wl*.5));
  if(GR)GR.material.color.copy(GC).multiplyScalar(1-wet*.38);
  skyG.position.copy(cam.position);
  stars.material.opacity=Math.max(0,(f.ni-.3)/.7)*(1-wet);
  sunS.position.copy(V1);sunS.material.opacity=cl(V1.y/40,0,1)*(1-wet*.8);moonS.position.copy(V2);moonS.material.opacity=cl(V2.y/40,0,1)*(1-wet*.7);
  clouds.forEach(o=>{o.a+=o.v*dt;o.s.position.set(Math.cos(o.a)*o.r,o.h,Math.sin(o.a)*o.r);const m=o.s.material;m.color.setRGB(1,1,1).lerp(K2.setRGB(1,.62,.45),cl(f.du*1.2,0,1)*.7).lerp(K2.setRGB(.12,.16,.28),f.ni*.9).lerp(K2.setRGB(.55,.58,.62),wet*.7);m.opacity=(.62*(1-f.ni*.75)+wet*.3);});
  if(lampP)lampP.material.opacity=Math.min(.95,f.wl*1.1);
  if(beamM)beamM.opacity=Math.max(0,f.ni-.25)*.11*(1-wet*.3);
  if(signM)signM.color.setScalar(.5+.5*f.ni);
  if(FT){FT.mat.emissive.setRGB(f.wl,f.wl*.85,f.wl*.5);}
}

/* ---------- ground, streets, lamps, trees, rooftops ---------- */
function groundTex(){GR=sc.children.find(o=>o.isMesh&&o.geometry.type==="PlaneGeometry"&&o.geometry.parameters.width===500);if(!GR)return;
  const t=new T.CanvasTexture(cvs(256,256,(c,w,h)=>{c.fillStyle="#c9d1c6";c.fillRect(0,0,w,h);for(let i=0;i<2600;i++){const v=150+Math.random()*90|0;c.fillStyle="rgba("+v+","+(v+8)+","+(v-6)+",.45)";c.fillRect(Math.random()*w,Math.random()*h,2+Math.random()*3,2+Math.random()*3);}for(let i=0;i<40;i++){c.fillStyle="rgba(120,100,70,.18)";c.beginPath();c.arc(Math.random()*w,Math.random()*h,6+Math.random()*14,0,7);c.fill();}}));
  t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(70,70);t.anisotropy=4;GR.material.map=t;GR.material.needsUpdate=true;GC=GR.material.color.clone();}
const SC=[0xe9b949,0x2de2c1,0xff4fa3,0xc0392b,0x7ad0ff,0xa4e05a];
function statics(){
  const bl=sc.children.filter(o=>o.isMesh&&o.geometry.type==="BoxGeometry"&&o.material&&o.material.emissiveMap);
  const laneC=new T.CanvasTexture(cvs(256,64,(g,w,h)=>{g.fillStyle="#e8e8e8";g.fillRect(0,3,w,3);g.fillRect(0,h-6,w,3);g.fillStyle="#f2c230";for(let x=0;x<w;x+=128)g.fillRect(x,h/2-2,70,4);}));
  const sw=M(0x6f7378),poles=[],glows=[],trees=[],PALM={lekki:1,vi:1,ajah:1,ikeja:1},keep=(x,z)=>blocked(x,z,1.2)||Math.hypot(x,z)<22||Math.hypot(x-13,z-24)<9||ZN.some(q=>[[0,11],[7,6],[-7,6],[3,10]].some(o=>Math.hypot(x-(Z[q][0]+o[0]),z-(Z[q][1]+o[1]))<4.5));
  ZN.forEach(id=>{const[cx,cz]=Z[id],L=Math.hypot(cx,cz),ux=cx/L,uz=cz/L,px=-uz,pz=ux,yaw=-Math.atan2(cz,cx),s0=16,s1=L-24,len=s1-s0,mid=(s0+s1)/2;
    const t=laneC.clone();t.needsUpdate=true;t.wrapS=T.RepeatWrapping;t.repeat.set(len/8,1);
    const lm=new T.Mesh(new T.PlaneGeometry(len,6.6),new T.MeshLambertMaterial({map:t,transparent:true,alphaTest:.5,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}));
    lm.rotation.order="YXZ";lm.rotation.set(-PI/2,yaw,0);lm.position.set(ux*mid,.19,uz*mid);lm.receiveShadow=true;sc.add(lm);
    [-1,1].forEach(sg=>{const s=BK(len,.3,2.4,sw,sc,ux*mid+px*sg*5.2,.15,uz*mid+pz*sg*5.2);s.rotation.y=yaw;s.receiveShadow=true;});
    for(let s=s0+5,i=0;s<s1;s+=15,i++){const sg=i%2?1:-1,x=ux*s+px*sg*6.9,z=uz*s+pz*sg*6.9;poles.push({x,y:3,z});glows.push(x,6.1,z);}
    for(let s=s0+9;s<s1;s+=14)[-1,1].forEach(sg=>{const o=9.4+Math.random()*1.2,x=ux*s+px*sg*o,z=uz*s+pz*sg*o;if(!keep(x,z))trees.push({x,z,palm:PALM[id]});});
    const hx=Math.atan2(-cz,-cx);for(let k=0;k<9;k++){const an=Math.random()*2*PI;if(Math.abs(((an-hx+3*PI)%(2*PI))-PI)<.6)continue;const r=7+Math.random()*5,x=cx+Math.cos(an)*r,z=cz+Math.sin(an)*r;if(!keep(x,z))trees.push({x,z,palm:PALM[id]});}
  });
  inst(new T.CylinderGeometry(.1,.14,6,6),M(0x2a3138),poles,true);
  const gg=new T.BufferGeometry();gg.setAttribute("position",new T.BufferAttribute(new Float32Array(glows),3));
  lampP=new T.Points(gg,new T.PointsMaterial({map:GT,color:0xffd9a0,size:9,blending:T.AdditiveBlending,depthWrite:false,transparent:true,opacity:0,fog:false}));lampP.frustumCulled=false;sc.add(lampP);
  const GC1=[0x2f7a45,0x3c8a4e,0x27663b,0x4a8f3f],tr=[],cr=[],pt=[],pf=[];
  trees.forEach(t=>{COL.push([t.x,t.z,.6,.6]);if(t.palm){pt.push({x:t.x,y:2.6,z:t.z});for(let f=0;f<6;f++){const a=f/6*PI*2+Math.random();pf.push({x:t.x+Math.cos(a)*1.4,y:5.2,z:t.z+Math.sin(a)*1.4,sx:3.2,sy:.08,sz:.55,ry:-a,rz:-.35});}return;}const s=.8+Math.random()*.6;tr.push({x:t.x,y:1.5,z:t.z});cr.push({x:t.x,y:3.5+s*.9,z:t.z,sx:s,sy:s,sz:s,ry:Math.random()*3,c:GC1[(Math.random()*4)|0]});});
  inst(new T.CylinderGeometry(.18,.28,3,6),M(0x5a3d26),tr,true);inst(new T.IcosahedronGeometry(1.8,0),new T.MeshLambertMaterial({color:0xffffff}),cr,true);
  inst(new T.CylinderGeometry(.16,.26,5.2,6),M(0x6b4a2b),pt,true);inst(new T.BoxGeometry(1,1,1),new T.MeshLambertMaterial({color:0x2f8a3e,side:T.DoubleSide}),pf,false);
  const sd=(()=>{let s=3;return()=>(s=(s*9301+49297)%233280)/233280;})(),par=[],tank=[],ac=[],ant=[],sgn=[];
  bl.forEach(b=>{const p=b.geometry.parameters,w=p.width,h=p.height,d=p.depth,x=b.position.x,z=b.position.z;
    par.push({x,y:h+.25,z,sx:w+.5,sy:.5,sz:d+.5,c:0x4a4f55});
    if(sd()<.5)tank.push({x:x+(sd()-.5)*w*.5,y:h+1.3,z:z+(sd()-.5)*d*.5,c:sd()<.5?0x1d2227:0x2a5db0});
    for(let i=0,n=1+(sd()*2|0);i<n;i++)ac.push({x:x+(sd()-.5)*w*.6,y:h+.9,z:z+(sd()-.5)*d*.6,sx:1.1,sy:.8,sz:.9,ry:sd()*3,c:0x9aa1a8});
    if(h>12)ant.push({x:x+w*.3,y:h+2.5,z:z-d*.3});
    if(h<=24){let bd=ZN[0],bx=1e9;ZN.forEach(id=>{const dd=Math.hypot(x-Z[id][0],z-Z[id][1]);if(dd<bx){bx=dd;bd=id;}});const dx=Z[bd][0]-x,dz=Z[bd][1]-z,c=SC[(sd()*SC.length)|0];
      sgn.push(Math.abs(dx)>Math.abs(dz)?{x:x+Math.sign(dx)*(w/2+.12),y:3.1,z,sx:.2,sy:.75,sz:d*.7,c}:{x,y:3.1,z:z+Math.sign(dz)*(d/2+.12),sx:w*.7,sy:.75,sz:.2,c});}
  });
  const UB=new T.BoxGeometry(1,1,1),LW=()=>new T.MeshLambertMaterial({color:0xffffff});
  inst(UB,LW(),par,false);inst(new T.CylinderGeometry(.9,.9,1.6,10),LW(),tank,true);inst(UB,LW(),ac,false);inst(new T.CylinderGeometry(.06,.1,5,5),M(0x555b61),ant,false);
  signM=new T.MeshBasicMaterial({color:0xffffff});inst(UB,signM,sgn,false);
  beamM=new T.MeshBasicMaterial({color:0xfff0c0,transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,fog:false});
}
let BEAMG;
function lightCar(c,big){if(c.userData._l)return;c.userData._l=1;const f=big?2.78:1.92,hl=new T.MeshBasicMaterial({color:0xfff4d0}),tl=new T.MeshBasicMaterial({color:0xff2a2a});
  [-.7,.7].forEach(x=>{BK(.36,.22,.1,hl,c,x,.95,f);BK(.36,.22,.1,tl,c,x,.95,-f);});
  if(!BEAMG){BEAMG=new T.ConeGeometry(2.2,12,12,1,true);BEAMG.translate(0,-6,0);BEAMG.rotateX(-PI/2);}
  const b=new T.Mesh(BEAMG,beamM);b.position.set(0,.9,f);c.add(b);}
function lightCars(){E.VH.forEach(o=>lightCar(o.c,o.big));
  const pc=sc.children.find(o=>o.isGroup&&o.userData&&o.userData.type);if(pc){const b=pc.children[0];lightCar(pc,!!(b&&b.geometry&&b.geometry.parameters&&b.geometry.parameters.depth>5));}}

/* ---------- Freedom Tower: grows with your Freedom % ---------- */
function mkTower(){
  const g=new T.Group();g.position.set(13,0,24);sc.add(g);
  const base=new T.Mesh(new T.CylinderGeometry(6.5,7.2,.5,24),M(0x8f989f));base.position.y=.25;g.add(base);
  const wt=new T.CanvasTexture(cvs(64,64,(c,w,h)=>{c.fillStyle="#7fa6c6";c.fillRect(0,0,w,h);c.fillStyle="#2e4a63";for(let y=6;y<h;y+=16)for(let x=4;x<w;x+=16)c.fillRect(x,y,10,9);})),
    we=new T.CanvasTexture(cvs(64,64,(c,w,h)=>{c.fillStyle="#000";c.fillRect(0,0,w,h);c.fillStyle="#ffd58a";for(let y=6;y<h;y+=16)for(let x=4;x<w;x+=16)if(Math.random()<.6)c.fillRect(x,y,10,9);}));
  [wt,we].forEach(t=>{t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(1.5,1);});
  const mat=new T.MeshLambertMaterial({color:0xcfe1ee,map:wt,emissiveMap:we,emissive:0x000000}),segs=[];
  for(let i=0;i<20;i++){const w=lp(6.4,3.4,i/19),s=new T.Mesh(new T.BoxGeometry(1,1,1),mat);s.scale.set(w,4,w);s.position.y=.5+i*4+2;s.visible=false;s.castShadow=true;s.receiveShadow=true;g.add(s);segs.push(s);}
  const crown=new T.Mesh(new T.ConeGeometry(2.2,6,4),new T.MeshLambertMaterial({color:0xe9b949,emissive:0x6b4f10}));crown.visible=false;g.add(crown);
  const bm=new T.Mesh(new T.CylinderGeometry(.5,.5,160,8,1,true),new T.MeshBasicMaterial({color:0xffd34d,transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false,fog:false}));bm.position.y=80;g.add(bm);
  FT={g,mat,segs,crown,bm,cur:1,tgt:1,pct:0,l:null};
  const m=new T.Mesh(new T.CylinderGeometry(1.6,1.6,.15,20),new T.MeshBasicMaterial({color:0xffd34d,transparent:true,opacity:.6}));m.position.set(13,.2,18.6);sc.add(m);
  const l=lab("🕊️ Freedom Tower","#fbbf24",1.1);l.position.set(13,3.4,18.6);sc.add(l);E.spots.push({x:13,z:18.6,txt:"🕊️ Freedom Tower",fn:()=>openFreedom(),m,l});
  COL.push([13,24,3.8,3.8]);
}
function towerSync(){let p=0;try{p=Math.max(0,freedomPct());}catch(e){}FT.pct=p;FT.tgt=p<=0?1:Math.min(20,1+Math.floor(Math.min(p,100)/100*19));
  const r=Math.round(p);if(r!==lastFt){lastFt=r;if(FT.l)FT.g.remove(FT.l);FT.l=lab("🕊️ Freedom "+r+"%","#fbbf24",1.3);FT.g.add(FT.l);}}
function towerAnim(dt){FT.cur+=(FT.tgt-FT.cur)*Math.min(1,dt*1.5);let top=0;
  FT.segs.forEach((s,i)=>{const k=cl(FT.cur-i,0,1);s.visible=k>.01;const w=s.scale.x;s.scale.y=Math.max(.01,4*k);s.position.y=.5+i*4+2*k;if(k>.01)top=.5+i*4+4*k;});
  FT.crown.visible=FT.pct>=100;FT.crown.position.y=top+3;FT.bm.material.opacity=FT.pct>=100?.2+Math.sin(tt*2)*.05:0;
  if(FT.l)FT.l.position.y=top+(FT.pct>=100?9:5);}

/* ---------- people: shadows, sidewalks, outfits, hand props, ride ---------- */
const BLOB=new T.MeshBasicMaterial({color:0,transparent:true,opacity:.38,depthWrite:false}),BG=new T.CircleGeometry(.75,10);
function shade(o){if(o.userData._s)return;o.userData._s=1;const person=!!(o.userData&&o.userData.body),isP=o===E.P;
  if(person&&!isP){const b=new T.Mesh(BG,BLOB);b.rotation.x=-PI/2;b.position.y=.07;o.add(b);}
  o.traverse(m=>{if(!m.isMesh||m.isInstancedMesh||!m.material||!m.material.isMeshLambertMaterial)return;const g=m.geometry;m.receiveShadow=true;
    m.castShadow=(!person||isP)&&g.type!=="PlaneGeometry"&&!(g.parameters&&g.parameters.height<.5);});}
function mkProps(){const u=E.P.userData,g=(par,x,y,z)=>{const o=new T.Group();o.position.set(x,y,z);o.visible=false;par.add(o);return o;};
  PR.type=g(u.body,0,1.45,.55);BK(.7,.05,.5,0x9aa3ab,PR.type,0,-.1,0);BK(.7,.45,.04,0x2b323a,PR.type,0,.12,-.22).rotation.x=-.25;
  PR.lift=g(u.body,0,1.3,.55);BK(.7,.5,.5,0xb98a55,PR.lift,0,0,0);BK(.08,.5,.52,0xd8b98a,PR.lift,0,0,0);
  PR.tap=g(u.aR,0,-.95,.15);BK(.22,.3,.1,0x24384a,PR.tap,0,0,0);BK(.16,.1,.02,0x7fd1ff,PR.tap,0,.05,.06);
  PR.phone=g(u.aR,0,-.95,.12);BK(.12,.22,.04,0x111820,PR.phone,0,0,0);
  PR.eat=g(u.aR,0,-.95,.12);PR.eat.add(new T.Mesh(new T.CylinderGeometry(.12,.09,.1,8),M(0xd98b3a)));
  PR.save=g(u.aR,0,-.95,.12);PR.save.add(new T.Mesh(new T.CylinderGeometry(.1,.1,.04,10),M(0xe9b949)));}
let propT=0;
function showProp(p,ms){if(!PR[p]||!E.P||!E.P.visible||E.P.userData.v>.5)return;Object.keys(PR).forEach(k=>PR[k].visible=false);PR[p].visible=true;clearTimeout(propT);propT=setTimeout(()=>{PR[p].visible=false;},Math.max(900,ms||1500));}
const OC={Corporate:0x1b2230,"Aso Ebi":0xd946ef,Agbada:0xf3efe6};
function mkOutfit(){const u=E.P.userData;
  OF.tie=BK(.1,.5,.03,0xc0392b,u.body,0,1.62,.22);OF.gele=new T.Mesh(new T.SphereGeometry(.34,10,8),M(0xff5fd2));OF.gele.scale.set(1.15,.7,1.15);OF.gele.position.y=.36;u.head.add(OF.gele);
  OF.fila=BK(.6,.24,.6,0xc0392b,u.head,0,.32,0);OF.robe=BK(1.0,1.15,.62,0x3b7be0,u.body,0,1.3,0);OF.cap=BK(.6,.24,.6,0xf3efe6,u.head,0,.32,0);
  Object.keys(OF).forEach(k=>OF[k].visible=false);}
function outfitSync(){const o=S.outfit&&Date.now()-S.outfit.t<864e5?S.outfit.n:null,u=E.P.userData;
  if(o!==curOut){curOut=o;Object.keys(OF).forEach(k=>OF[k].visible=false);if(o==="Corporate")OF.tie.visible=true;else if(o==="Aso Ebi"){(S.look==="f"?OF.gele:OF.fila).visible=true;}else if(o==="Agbada"){OF.robe.visible=true;OF.cap.visible=true;}}
  if(o)u.tp.color.setHex(OC[o]);
  u.body.rotation.x=(S.health<30||S.energy<12)?.15:0;}
function moodTex(e){if(!moodC[e])moodC[e]=new T.CanvasTexture(cvs(64,64,g=>{g.font="46px sans-serif";g.textAlign="center";g.fillText(e,32,50);}));return moodC[e];}
function mkFollow(){fol=new T.Group();sc.add(fol);
  mood=new T.Sprite(new T.SpriteMaterial({map:moodTex("😊"),transparent:true,depthTest:false}));mood.scale.set(1.3,1.3,1);mood.renderOrder=9;mood.visible=false;fol.add(mood);
  ring=new T.Mesh(new T.RingGeometry(.95,1.2,28),new T.MeshBasicMaterial({color:0xcd7f32,transparent:true,opacity:.7,side:T.DoubleSide,depthWrite:false}));ring.rotation.x=-PI/2;ring.position.y=.08;ring.visible=false;fol.add(ring);}
const TIERS=[[30,0x6fe3ff],[20,0xe9b949],[10,0xc9d1d9],[5,0xcd7f32]];
function moodNow(){if(S.health<30)return"🤕";if(S.energy<20)return"😴";if(S.happiness<35)return"😞";if(S.happiness>85)return"😄";try{if(vipOn())return"👑";}catch(e){}return"";}
function followSync(){const P=E.P;fol.position.set(P.position.x,0,P.position.z);
  const m=moodNow();if(m!==moodKey){moodKey=m;mood.visible=!!m;if(m){mood.material.map=moodTex(m);mood.material.needsUpdate=true;}}
  mood.position.y=(P.visible?3.5:4.8)+Math.sin(tt*3)*.08;
  const t=TIERS.find(x=>S.level>=x[0]);ring.visible=!!t;if(t){ring.material.color.setHex(t[1]);ring.rotation.z=tt*.8;}}
function mkPillars(){ZN.forEach(id=>{const m=new T.Mesh(new T.CylinderGeometry(1.2,1.2,100,12,1,true),new T.MeshBasicMaterial({color:0x22c55e,transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false,fog:false}));m.position.set(Z[id][0],50,Z[id][1]);m.visible=false;sc.add(m);pillars[id]=m;});}
let npcP=null;
function npcSpot(){const a=(S.appointments||[]).find(x=>x.status==="ready"&&x.loc===S.location&&Z[x.loc]);return a?{a,x:Z[a.loc][0]+3,z:Z[a.loc][1]+10}:null;}
function npcSync(){if(!npcP){npcP=new T.Mesh(new T.CylinderGeometry(.55,.55,70,10,1,true),new T.MeshBasicMaterial({color:0xffd34d,transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false,fog:false}));npcP.visible=false;sc.add(npcP);}
  const n=npcSpot(),P=E.P;if(!n||Math.hypot(P.position.x-n.x,P.position.z-n.z)<6){npcP.visible=false;return;}
  npcP.visible=true;npcP.position.set(n.x,35,n.z);npcP.material.opacity=.22+Math.sin(tt*4)*.08;}
function pillarSync(){npcSync();const want={};(S.appointments||[]).forEach(x=>{if(x.status==="ready")want[x.loc]=1;});
  ZN.forEach(id=>{const p=pillars[id],on=want[id]&&S.location!==id;p.visible=!!on;if(on)p.material.opacity=.16+Math.sin(tt*3)*.06;});}

/* ---------- fireworks + coin pops (one Points object) ---------- */
const NPT=700,pp=new Float32Array(NPT*3),pc=new Float32Array(NPT*3),pv=new Float32Array(NPT*3),pb=new Float32Array(NPT*3),pl=new Float32Array(NPT),pL=new Float32Array(NPT),pg=new Float32Array(NPT);let pi_=0,pg_;
const FWC=[[1,.83,.3],[1,1,1],[.2,.85,.6],[.58,.77,.99],[1,.42,.6]];
function mkPts(){const g=new T.BufferGeometry();g.setAttribute("position",new T.BufferAttribute(pp,3));g.setAttribute("color",new T.BufferAttribute(pc,3));pg_=g;
  const p=new T.Points(g,new T.PointsMaterial({size:1.8,map:GT,vertexColors:true,transparent:true,blending:T.AdditiveBlending,depthWrite:false,fog:false}));p.frustumCulled=false;sc.add(p);}
function spawn(n,x,y,z,spd,up,life,g,rgb){for(let i=0;i<n;i++){const k=pi_=(pi_+1)%NPT,th=Math.random()*2*PI,ph=Math.acos(Math.random()*2-1),s=spd*(.5+Math.random()*.5),c=rgb||FWC[(Math.random()*FWC.length)|0];
  pp[k*3]=x;pp[k*3+1]=y;pp[k*3+2]=z;pv[k*3]=Math.cos(th)*Math.sin(ph)*s;pv[k*3+1]=Math.cos(ph)*s+up;pv[k*3+2]=Math.sin(th)*Math.sin(ph)*s;pl[k]=pL[k]=life*(.7+Math.random()*.5);pg[k]=g;pb[k*3]=c[0];pb[k*3+1]=c[1];pb[k*3+2]=c[2];}}
function ptsStep(dt){for(let i=0;i<NPT;i++){if(pl[i]<=0){pc[i*3]=pc[i*3+1]=pc[i*3+2]=0;continue;}pl[i]-=dt;pv[i*3+1]-=pg[i]*dt;pp[i*3]+=pv[i*3]*dt;pp[i*3+1]+=pv[i*3+1]*dt;pp[i*3+2]+=pv[i*3+2]*dt;const k=Math.max(0,pl[i]/pL[i]);pc[i*3]=pb[i*3]*k;pc[i*3+1]=pb[i*3+1]*k;pc[i*3+2]=pb[i*3+2]*k;}
  pg_.attributes.position.needsUpdate=true;pg_.attributes.color.needsUpdate=true;}
function fireworks(n){const t=performance.now(),P=E.P;if(!P||(t-lastFw<500&&n<2))return;lastFw=t;for(let k=0;k<n;k++)setTimeout(()=>{if(Q===0&&k>1)return;spawn(Q===0?30:70,P.position.x+(Math.random()-.5)*30,20+Math.random()*12,P.position.z+(Math.random()-.5)*30-10,11,0,1.8,7);},k*320);}
function coins(n){const P=E.P;if(P)spawn(Math.min(26,n),P.position.x,2.6,P.position.z,4,6,1.1,14,[1,.8,.2]);}
const _b=window.burst;window.burst=function(){try{fireworks(1);}catch(e){}return _b.apply(this,arguments);};
const _c=window.celebrate;window.celebrate=function(){try{fireworks(6);}catch(e){}return _c.apply(this,arguments);};
const _f=window.floatText;window.floatText=function(t){try{const n=parseInt(String(t).replace(/\D/g,""));if(String(t).charAt(0)==="+"&&n>0)coins(6+Math.round(n/1500));}catch(e){}return _f.apply(this,arguments);};
const _p=window.pose;window.pose=function(w,p,ms){try{if(w==="av")showProp(p,ms);}catch(e){}return _p.apply(this,arguments);};
const _o=window.attendOwambe;if(_o)window.attendOwambe=function(cost,outfit){const c=S.cash,r=_o.apply(this,arguments);try{if(S.cash<c)S.outfit={n:outfit,t:Date.now()};}catch(e){}return r;};

/* ---------- init + per-frame ---------- */
function init(){ready=1;
  const weak=(navigator.hardwareConcurrency||8)<=4||(navigator.deviceMemory||8)<=3;let q=null;try{q=localStorage.getItem("eh_q3d");}catch(e){}
  Q=q!==null?+q:document.body.classList.contains("lite")?0:weak?1:2;
  R.toneMapping=T.ACESFilmicToneMapping;R.toneMappingExposure=1.25;R.shadowMap.enabled=true;R.shadowMap.type=T.PCFSoftShadowMap;
  sc.add(sun.target);const s=sun.shadow.camera;s.left=-50;s.right=50;s.top=50;s.bottom=-50;s.near=5;s.far=260;sun.shadow.bias=-.0006;sun.shadow.normalBias=.4;applyQ();
  groundTex();mkSky();statics();mkTower();mkPts();mkProps();mkOutfit();mkFollow();mkPillars();myLoc=S.location;
  window.R3D={get q(){return Q;},set q(v){Q=v;applyQ();}};}
function step(dt){
  if(!ready){if(!E.P||!E.PD.length)return;init();}
  tt+=dt;const P=E.P;light(dt);ptsStep(dt);if(FT)towerAnim(dt);followSync();
  E.PD.forEach(o=>{if(Math.abs(o.off)<4.6)o.off=(o.off<0?-1:1)*(o._l||(o._l=4.9+Math.random()*1.4));});
  sT+=dt;if(sT>1){sT=0;sc.children.forEach(shade);lightCars();towerSync();outfitSync();}
  pillarSync();
  if(S.location!==myLoc&&trip)myLoc=S.location;
  if(S.location!==myLoc){myLoc=S.location;fade.style.transition="none";fade.style.opacity=.95;void fade.offsetWidth;setTimeout(()=>{fade.style.transition="opacity .9s ease";fade.style.opacity=0;},450);}
  tripStep(dt);
  governor();
}
/* ---------- Move > Travel is now a real trip along the roads (same rules as walking in) ---------- */
let trip=null,bus=null;const canYaw=!!(Object.getOwnPropertyDescriptor(E,"yaw")||{}).set;
function mkBus(){const g=new T.Group();BK(2.2,1.2,5.6,0xf2c200,g,0,.9,0);BK(2.24,.26,5.64,0x111111,g,0,.95,0);BK(2,.75,4.7,0x1d2a36,g,0,1.85,-.1);BK(2.2,.18,5.2,0xf2c200,g,0,2.3,-.1);
  [[-1.05,1.8],[1.05,1.8],[-1.05,-1.8],[1.05,-1.8]].forEach(w=>{const m=new T.Mesh(new T.CylinderGeometry(.45,.45,.3,10),M(0x050505));m.rotation.z=PI/2;m.position.set(w[0],.45,w[1]);g.add(m);});
  g.visible=false;sc.add(g);lightCar(g,true);shade(g);g.traverse(m=>{if(m.isMesh)m.castShadow=true;});return g;}
function startTrip(id){const P=E.P,a=Z[S.location]||Z[E.ZONE],b=Z[id],la=Math.hypot(a[0],a[1]),lb=Math.hypot(b[0],b[1]),rp=(zc,L,q)=>[zc[0]/L*q,zc[1]/L*q];
  const fa=Math.atan2(a[1],a[0]),fb=Math.atan2(b[1],b[0]),df=((fb-fa+3*PI)%(2*PI))-PI,n=Math.max(1,Math.ceil(Math.abs(df)/(PI/6))),arc=[];
  for(let i=0;i<=n;i++){const f=fa+df*i/n;arc.push([Math.cos(f)*12.5,Math.sin(f)*12.5]);}
  const wp=[[a[0],a[1]],rp(a,la,Math.max(18,la-24)),rp(a,la,16)].concat(arc,[rp(b,lb,16),rp(b,lb,Math.max(18,lb-24)),rp(b,lb,Math.max(18,lb-16))]);
  const own=(S.assets||[]).some(i=>i==="keke"||i==="camry"||i==="suv")&&S.ride!==false;
  trip={id,wp,i:0,own,t:0,h:P.rotation.y,pos:new T.Vector3(P.position.x,0,P.position.z)};
  if(!own){if(!bus)bus=mkBus();bus.visible=true;}
  try{toast("🚌 On the way to "+LOCS[id].name+"…");}catch(e){}}
function endTrip(){const id=trip.id;if(bus)bus.visible=false;trip=null;if(S.location!==id){try{doTravelCore(id);}catch(e){}}}
function tripStep(dt){if(!trip)return;const P=E.P,w=trip.wp[trip.i],dx=w[0]-trip.pos.x,dz=w[1]-trip.pos.z,d=Math.hypot(dx,dz),now=performance.now();trip.t+=dt;
  if(trip.t>30){endTrip();return;}
  if(d<2){trip.i++;if(trip.i>=trip.wp.length){endTrip();return;}}
  else{const st=Math.min(d,24*dt);trip.pos.x+=dx/d*st;trip.pos.z+=dz/d*st;const h=Math.atan2(dx,dz);trip.h+=(((h-trip.h+3*PI)%(2*PI))-PI)*Math.min(1,dt*6);}
  P.position.set(trip.pos.x,0,trip.pos.z);P.rotation.y=trip.h;P.userData.v=0;E.hitCool=now+1000;
  if(bus&&!trip.own){P.visible=false;bus.position.copy(P.position);bus.rotation.y=trip.h;}
  if(canYaw){const tg=trip.h+PI;E.yaw+=(((tg-E.yaw+3*PI)%(2*PI))-PI)*Math.min(1,dt*2.5);}
  E.VH.forEach(o=>{if(Math.hypot(o.c.position.x-P.position.x,o.c.position.z-P.position.z)<11)o.stop=now+700;});}
const _ca=window.claimAppt;
window.claimAppt=function(id){
  if(document.body.classList.contains("w3d")&&ready&&E.P){const a=(S.appointments||[]).find(x=>x.id===id);
    if(a&&a.status==="ready"&&S.location===a.loc&&Z[a.loc]){const P=E.P,d=Math.hypot(P.position.x-(Z[a.loc][0]+3),P.position.z-(Z[a.loc][1]+10));
      if(d>6){const who=id.indexOf("tunde")===0?"Tunde":id.indexOf("chief")===0?"the Chief":"your contact";
        try{closeModal();toast("🚶 Walk up to "+who+" at the gold beam. Check your minimap.");}catch(e){}return;}}}
  return _ca.apply(this,arguments);};
const _dt=window.doTravel;
window.doTravel=function(id){
  if(!document.body.classList.contains("w3d")||!E.P||!ready||typeof _dt!=="function")return _dt.apply(this,arguments);
  const l=LOCS[id];if(!l||id===S.location)return;
  if(trip)return toast("You are already on the way.");
  if(S.cash<travelCost(l))return toast("Not enough cash.");
  if(S.energy<travelEnergy())return toast("Too tired to travel.");
  closeModal();startTrip(id);};

/* ---------- random street events now match what the 3D world shows ---------- */
const rainNow=()=>{try{return(S.day*7+Object.keys(LOCS).indexOf(S.location))%5===0;}catch(e){return false;}};
const AREA={ojota:1,ikeja:1,surulere:1};let lastEv="";
window.triggerEvent=function(){
  renderGame();
  const w3=document.body.classList.contains("w3d"),rn=rainNow();
  /* rain event only when it is really raining; area boys only appear by walking up to them in 3D */
  let pool=EVENTS.filter(e=>e.id==="rain"?rn:e.id==="alaye"?(!w3&&!!AREA[S.location]):true);
  if(rn&&Math.random()<.45){const r=EVENTS.find(e=>e.id==="rain");if(r)pool=[r];}
  const alt=pool.filter(e=>e.id!==lastEv);if(alt.length)pool=alt;
  const ev=pool[Math.floor(Math.random()*pool.length)];lastEv=ev.id;currentEvent=ev;
  showCharacter('avatar',ev.text,0);
  openModal('<h3>'+esc(ev.title)+'</h3><p style="color:#c8d6ce;font-size:14px;margin:0 0 12px">'+esc(ev.text)+'</p>'+ev.choices.map((c,i)=>'<button class="opt" onclick="pickChoice('+i+')">'+esc(c.label)+'</button>').join(""));
};
try{SHOCKS[1][1]="Someone snatched your phone in the crowd.";}catch(e){}
const prev=E.tick;
E.tick=function(dt,t){if(prev){try{prev(dt,t);}catch(e){}}if(bad>4)return;try{step(dt);}catch(e){bad++;console.error("real3d",e);if(bad>4){try{track("r3d_error",{m:String(e&&e.message).slice(0,60)});}catch(x){}}}};
})();
