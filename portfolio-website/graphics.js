/* Original procedural network scene; decorative, never presented as live security data. */
(()=>{
'use strict';
const canvas=document.querySelector('#network-globe'),button=document.querySelector('.motion-toggle');
if(!canvas||!button)return;
const ctx=canvas.getContext('2d');if(!ctx){button.hidden=true;return;}
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let width=0,height=0,frame=0,last=0,angle=0,paused=reduced.matches,visible=true;
let pointer={x:0,y:0},target={x:0,y:0};
const points=Array.from({length:84},(_,i)=>{const y=1-(i/83)*2,r=Math.sqrt(1-y*y),phi=i*Math.PI*(3-Math.sqrt(5));return{x:Math.cos(phi)*r,y,z:Math.sin(phi)*r};});
const stars=Array.from({length:45},(_,i)=>({x:((i*7919)%997)/997,y:((i*3571)%991)/991,size:.5+(i%3)*.4}));
function resize(){const box=canvas.getBoundingClientRect();width=box.width;height=box.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw();}
function draw(){if(!width||!height)return;ctx.clearRect(0,0,width,height);const cx=width*.5+pointer.x*12,cy=height*.48+pointer.y*10,radius=Math.min(width*.46,height*.43);
 const glow=ctx.createRadialGradient(cx,cy,radius*.1,cx,cy,radius*1.25);glow.addColorStop(0,'rgba(190,170,130,.13)');glow.addColorStop(1,'rgba(190,170,130,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
 stars.forEach((s,i)=>{const x=(s.x*width+Math.sin(angle*.4+i)*7+width)%width,y=(s.y*height-angle*(5+i%4)+height*100)%height;ctx.fillStyle=`rgba(238,229,211,${.2+(i%4)*.1})`;ctx.beginPath();ctx.arc(x,y,s.size,0,Math.PI*2);ctx.fill();});
 const projected=points.map(p=>{const x=p.x*Math.cos(angle)-p.z*Math.sin(angle),z=p.x*Math.sin(angle)+p.z*Math.cos(angle);const tilt=.2+pointer.y*.12,y=p.y*Math.cos(tilt)-z*Math.sin(tilt),depth=p.y*Math.sin(tilt)+z*Math.cos(tilt);return{x:cx+x*radius,y:cy+y*radius,z:depth};});
 for(let i=0;i<points.length;i++){for(let j=i+1;j<points.length;j++){const a=points[i],b=points[j],dist=(a.x-b.x)**2+(a.y-b.y)**2+(a.z-b.z)**2;if(dist>.22)continue;const p=projected[i],q=projected[j],alpha=.07+((p.z+q.z+2)/4)*.22;ctx.strokeStyle=`rgba(224,209,180,${alpha})`;ctx.lineWidth=.65;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();if((i+j)%17===0){const t=(angle*.35+i*.17)%1;ctx.fillStyle='rgba(255,244,219,.8)';ctx.beginPath();ctx.arc(p.x+(q.x-p.x)*t,p.y+(q.y-p.y)*t,1.9,0,Math.PI*2);ctx.fill();}}}
 projected.forEach((p,i)=>{ctx.fillStyle=`rgba(242,229,202,${.25+(p.z+1)*.3})`;ctx.beginPath();ctx.arc(p.x,p.y,1+(p.z+1)*.7,0,Math.PI*2);ctx.fill();});
 ctx.save();ctx.translate(cx,cy);ctx.rotate(-.45+pointer.x*.04);ctx.scale(1,.35);ctx.strokeStyle='rgba(238,229,211,.35)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,radius*1.1,angle,angle+Math.PI*1.5);ctx.stroke();ctx.restore();}
function tick(now){frame=0;if(paused||!visible||document.hidden)return;const dt=Math.min((now-last)||16,40);last=now;angle+=dt*.00012;pointer.x+=(target.x-pointer.x)*.035;pointer.y+=(target.y-pointer.y)*.035;draw();frame=requestAnimationFrame(tick);}
function start(){last=0;if(!frame&&!paused&&visible&&!document.hidden)frame=requestAnimationFrame(tick);}
function stop(){cancelAnimationFrame(frame);frame=0;}
function sync(){button.setAttribute('aria-pressed',String(paused));button.textContent=paused?'Play graphics ▷':'Pause graphics Ⅱ';paused?stop():start();draw();}
button.addEventListener('click',()=>{paused=!paused;sync();});
reduced.addEventListener('change',e=>{paused=e.matches;sync();});
canvas.parentElement.addEventListener('pointermove',e=>{const b=canvas.parentElement.getBoundingClientRect();target={x:(e.clientX-b.left)/b.width*2-1,y:(e.clientY-b.top)/b.height*2-1};},{passive:true});
canvas.parentElement.addEventListener('pointerleave',()=>{target={x:0,y:0};});
document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;visible?start():stop();}).observe(canvas);
new ResizeObserver(resize).observe(canvas);sync();
})();
