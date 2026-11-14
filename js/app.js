"use strict";
const $=s=>document.querySelector(s),RM=matchMedia("(prefers-reduced-motion:reduce)").matches;
const GB="https://www.behance.net/gallery/",IB="https://mir-s3-cdn-cf.behance.net/projects/404/";
function fb(i){const d=document.createElement("div");d.className="ph";d.textContent=i.alt;i.replaceWith(d)}
const cov=p=>p.l||(LOCAL_COVERS?`images/work/${p.id}.${p.i.split(".").pop()}`:IB+p.i);
const img=p=>`<img src="${cov(p)}" data-b="${p.i?IB+p.i:""}" alt="${p.t}" loading="lazy" decoding="async" onerror="if(!this.dataset.r&&this.dataset.b){this.dataset.r=1;this.src=this.dataset.b}else fb(this)">`;
const tile=(p,i)=>`<a class="tile rv" style="--d:${(i%3)*.12}s" href="#case-${p.id}" data-k="${p.k}"><span class="art">${img(p)}</span><span class="cap"><b>${p.t}</b><small>${p.k}</small></span></a>`;
$("#featured").innerHTML=P.slice(0,9).map(tile).join("");$("#all").innerHTML=P.map(tile).join("");
const cats=["All",...new Set(P.map(p=>p.k))];
$("#filters").innerHTML=cats.map((c,i)=>`<button aria-pressed="${i==0}" data-c="${c}">${c}</button>`).join("");
$("#filters").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;
document.querySelectorAll("#filters button").forEach(x=>x.setAttribute("aria-pressed",x===b));
document.querySelectorAll("#all .tile").forEach((t,i)=>{const h=b.dataset.c!=="All"&&t.dataset.k!==b.dataset.c;t.classList.toggle("hide",h);t.classList.remove("in");void t.offsetWidth;t.style.setProperty("--d",(i%3)*.08+"s");requestAnimationFrame(()=>t.classList.add("in"))})});
$("#tk").innerHTML="Logos ● Flyers ● Posters ● Social media management ● Brand identity ● ".repeat(8);
/* hero headline: each letter changes weight and width near the pointer */
const lines=["Brands","that get","remembered."];let ci=0;
$("#h1").innerHTML=lines.map(l=>`<span class="ln" aria-hidden="true">${[...l].map(ch=>ch===" "?" ":`<span class="ch" style="--i:${ci++}">${ch}</span>`).join("")}</span>`).join("");
const chs=[...document.querySelectorAll(".ch")];
function near(x,y){chs.forEach(c=>{const r=c.getBoundingClientRect(),d=Math.hypot(x-(r.left+r.width/2),y-(r.top+r.height/2)),t=Math.max(0,1-d/260);c.style.setProperty("--w",Math.round(300+t*500));c.style.setProperty("--x",Math.round(100-t*25))})}
/* hero canvas: a calm one-colour dot field that parts around the pointer */
const cv=$("#cv"),cx=cv.getContext("2d"),hero=document.querySelector(".hero");let W,H,dp,mx=-999,my=-999,tk=0,vis=true;
function size(){dp=Math.min(devicePixelRatio||1,innerWidth<820?1.5:2);W=cv.width=cv.clientWidth*dp;H=cv.height=cv.clientHeight*dp}
size();addEventListener("resize",size);
let nq=0,qx=0,qy=0;hero.addEventListener("pointermove",e=>{const r=cv.getBoundingClientRect();mx=(e.clientX-r.left)*dp;my=(e.clientY-r.top)*dp;qx=e.clientX;qy=e.clientY;if(!RM&&!nq){nq=1;requestAnimationFrame(()=>{nq=0;near(qx,qy)})}});
hero.addEventListener("pointerleave",()=>{mx=my=-999;chs.forEach(c=>{c.style.setProperty("--w",300);c.style.setProperty("--x",100)})});
new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(hero);
function loop(){requestAnimationFrame(loop);if(!vis||document.hidden)return;tk++;if(innerWidth<820&&tk&1)return;cx.clearRect(0,0,W,H);const g=(innerWidth<820?48:34)*dp,R=170*dp,t=tk/50;
for(let y=g/2;y<H;y+=g)for(let x=g/2;x<W;x+=g){let px=x,py=y,r=1.3,a=.2;
if(!RM)a+=Math.sin(x/(g*3)+t)*Math.cos(y/(g*3)-t)*.07;
const dx=x-mx,dy=y-my,d=Math.hypot(dx,dy);
if(d<R){const k=(1-d/R)**2;px+=dx/(d||1)*k*26*dp;py+=dy/(d||1)*k*26*dp;r+=k*3.2;a+=k*.6}
cx.fillStyle=`rgba(120,150,245,${a})`;cx.beginPath();cx.arc(px,py,r*dp,0,7);cx.fill()}}
loop();
const stg=$("#stage");hero.addEventListener("pointermove",e=>{if(RM)return;const r=stg.getBoundingClientRect(),c=v=>Math.max(-1,Math.min(1,v));stg.style.setProperty("--px",c((e.clientX-r.left)/r.width*2-1));stg.style.setProperty("--py",c((e.clientY-r.top)/r.height*2-1))});
/* nav pill, scroll ring, magnetic links */
const links=[...document.querySelectorAll("#links a")],pill=$("#pill"),dock=$("#dock");
function place(pg){const a=links.find(l=>l.getAttribute("href")==="#"+pg);$("#hire").toggleAttribute("aria-current",pg==="contact");if(!a){pill.style.width="0px";links.forEach(l=>l.removeAttribute("aria-current"));return}pill.style.width=a.offsetWidth+"px";pill.style.transform=`translateX(${a.offsetLeft}px)`;links.forEach(l=>l.removeAttribute("aria-current"));a.setAttribute("aria-current","page")}
links.forEach(a=>{a.addEventListener("pointermove",e=>{const r=a.getBoundingClientRect();a.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.18}px,${(e.clientY-r.top-r.height/2)*.25}px)`});a.addEventListener("pointerleave",()=>a.style.transform="")});
addEventListener("scroll",()=>{const m=document.documentElement.scrollHeight-innerHeight;$("#ring").style.strokeDashoffset=81.7*(1-(m>0?scrollY/m:0));dock.classList.toggle("sc",scrollY>40)},{passive:true});
/* reveal on scroll */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12});
function reveal(){document.querySelectorAll(".page.on .rv").forEach(e=>{e.classList.remove("in");io.unobserve(e)});void document.body.offsetWidth;document.querySelectorAll(".page.on .rv").forEach(e=>io.observe(e))}
/* routing with curtain transition */
function showCase(id){const i=P.findIndex(p=>p.id===id);if(i<0)return false;const p=P[i],n=P[(i+1)%P.length];
$("#case").innerHTML=`<a class="rv" href="#work" style="font-weight:600">Back to all work</a><div class="case-top" style="margin-top:24px"><div class="art rv" style="--d:.1s">${img(p)}</div><div><h2 class="rv" style="--d:.2s">${p.t}</h2><p class="lead rv" style="--d:.3s">${p.d}</p><dl class="rv" style="--d:.4s"><dt>Category</dt><dd>${p.k}</dd></dl><a class="cta rv" style="--d:.5s" href="${GB+p.u}" target="_blank" rel="noopener">View on Behance</a></div></div><a class="nextlink rv" href="#case-${n.id}">Next: ${n.t}</a>`;return true}
let cur0=null;
let RT=location.hash.slice(1);
function swap(){let h=RT||"home",pg=h;
if(h.startsWith("case-"))pg=showCase(h.slice(5))?"case":"work";else if(!["home","work","about","contact"].includes(h))pg="home";
document.querySelectorAll(".page").forEach(e=>e.classList.toggle("on",e.id==="p-"+pg));place(pg==="case"?"work":pg);
document.title=(pg==="case"?P.find(p=>"case-"+p.id===h).t+" — ":"")+"Malambo Hakabwandi — Graphic Designer";scrollTo({top:0,behavior:"instant"});reveal();size()}
const cvn=$("#curtain");
let busy=false,shown="";
function go(){if(RM||cur0===null){cur0=1;shown=RT;swap();return}
if(busy)return;busy=true;cvn.classList.remove("out");cvn.classList.add("cv");
setTimeout(()=>{shown=RT;swap();cvn.classList.add("out");cvn.classList.remove("cv");setTimeout(()=>{cvn.classList.remove("out");busy=false;if(RT!==shown)go()},800)},850)}
const sync=()=>{const n=location.hash.slice(1);if(n!==RT){RT=n;go()}};addEventListener("hashchange",sync);addEventListener("popstate",sync);
/* in-page links work even where the address bar can't change (previews, sandboxed frames) */
document.addEventListener("click",e=>{const a=e.target.closest('a[href^="#"]');if(!a||e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey)return;e.preventDefault();const h=a.getAttribute("href").slice(1);if(h===RT)return;RT=h;try{history.pushState(null,"","#"+h)}catch(_){}go()});go();document.fonts.ready.then(()=>place((RT||"home").startsWith("case-")?"work":RT||"home"));addEventListener("resize",()=>place((RT||"home").startsWith("case-")?"work":RT||"home"));
/* contact */
$("#send").onclick=()=>{const n=$("#n").value.trim(),p=$("#e").value.trim(),m=$("#m").value.trim();
if(!n||!m||p.replace(/\D/g,"").length<7){$("#msg").textContent="Add your name, your WhatsApp number and your project details first.";return}
const url="https://wa.me/260765646089?text="+encodeURIComponent(`Hi Malambo, I'm ${n}.\nI need: ${$("#t").value}\n\n${m}\n\nMy number: ${p}`);
const a=document.createElement("a");a.href=url;a.target="_blank";a.rel="noopener";document.body.appendChild(a);a.click();a.remove();
$("#msg").innerHTML=`Opening WhatsApp. If nothing happens, <a href="${url}" target="_blank" rel="noopener">tap here to send</a>.`};
