@import url('https://fonts.googleapis.com/css2?family=Audiowide&family=Orbitron:wght@500;600;700;800;900&family=Rajdhani:wght@500;600;700&display=swap');

:root{--void:#000;--obs:#010204;--black:#020407;--blue:#00d9ff;--electric:#0077ff;--ice:#9cffff;--red:#ff164f;--hot:#ff003c;--green:#00ffad;--white:#f5ffff;--steel:#91b6c1;--dim:#476d79;--line:#154957}
*{box-sizing:border-box}
html,body{margin:0;min-height:100%;background:#000;color:var(--white);font-family:Rajdhani,Segoe UI,sans-serif}
body{overflow-x:hidden;background:radial-gradient(ellipse at 75% 5%,#063545 0,transparent 23%),radial-gradient(ellipse at 10% 90%,#04192a 0,transparent 20%),#000}
body:before{content:"";position:fixed;inset:0;pointer-events:none;z-index:999;background:repeating-linear-gradient(0deg,transparent 0,transparent 2px,rgba(0,217,255,.035) 3px),repeating-linear-gradient(90deg,transparent 0,transparent 79px,rgba(0,217,255,.018) 80px);mix-blend-mode:screen}
body:after{content:"";position:fixed;inset:0;pointer-events:none;z-index:998;box-shadow:inset 0 0 180px #000,inset 0 0 50px #001722}

header{height:86px;display:flex;align-items:center;justify-content:space-between;padding:0 27px;background:#000;border-bottom:1px solid #1d5d70;position:sticky;top:0;z-index:20;overflow:hidden}
header:before{content:"";position:absolute;left:0;bottom:0;width:78%;height:2px;background:linear-gradient(90deg,var(--blue),var(--electric),transparent);box-shadow:0 0 25px var(--blue)}
header:after{content:"// EDGE-TO-CLOUD // ZERO-TRUST TELEMETRY //";position:absolute;right:27px;bottom:5px;color:#326471;font:900 6px Orbitron;letter-spacing:2px}
.brand{display:flex;align-items:center;gap:15px;z-index:2}
.sigil{width:52px;height:52px;display:grid;place-items:center;color:var(--ice);font:900 20px Orbitron;border:2px solid var(--blue);box-shadow:0 0 26px #00d9ff66,inset 0 0 25px #00d9ff18;clip-path:polygon(22% 0,78% 0,100% 22%,100% 78%,78% 100%,22% 100%,0 78%,0 22%);animation:pulseSlow 1.7s infinite}
.brand h1{font:900 21px Audiowide,Orbitron;margin:0;letter-spacing:3px;color:#fff;text-shadow:0 0 12px #00d9ff99,0 0 30px #00d9ff33}
.brand h1 span{color:#ff315e;text-shadow:0 0 15px #ff164faa}
.brand small{display:block;color:#87c2cd;letter-spacing:3px;font:900 8px Orbitron;margin-top:5px;text-shadow:0 0 8px #00d9ff55}
.status{display:flex;gap:16px;align-items:center;font:900 9px Orbitron;letter-spacing:1.4px;z-index:2}
.live{color:var(--green);text-shadow:0 0 11px var(--green)}
.live i{display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--green);box-shadow:0 0 17px var(--green);margin-right:7px;animation:pulse .7s infinite}
.threattag{color:#ff6380;border:1px solid #a52345;padding:9px 13px;background:#19030a;box-shadow:0 0 25px #ff164f20;clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%);text-shadow:0 0 10px #ff164f}

.layout{display:grid;grid-template-columns:286px 1fr;min-height:calc(100vh - 86px)}
aside{background:#000204;border-right:1px solid #1a5262;padding:17px 11px;position:relative;overflow:hidden}
aside:before{content:"";position:absolute;right:-2px;top:0;height:100%;width:2px;background:linear-gradient(transparent,var(--blue),var(--electric),transparent);box-shadow:0 0 15px var(--blue)}
.navtitle{font:900 8px Orbitron;color:#75aeba;letter-spacing:2.8px;padding:15px 12px 7px;text-shadow:0 0 9px #00d9ff55;display:flex;gap:8px;align-items:center}
.navtitle:before{content:"";width:18px;height:2px;background:var(--blue);box-shadow:0 0 12px var(--blue)}
nav button{width:100%;border:1px solid transparent;background:transparent;color:#a9c6cd;text-align:left;padding:12px 14px;margin:2px 0;font:900 11px Rajdhani;letter-spacing:1.7px;cursor:pointer;position:relative;transition:.14s;clip-path:polygon(0 0,94% 0,100% 18%,100% 82%,94% 100%,6% 100%,0 82%);text-shadow:0 0 5px #00d9ff22}
nav button:after{content:"◆";position:absolute;right:9px;top:8px;color:#397888;font-size:5px}
nav button:hover{color:#fff;background:#06212b;border-color:#237082;text-shadow:0 0 11px var(--blue);transform:translateX(2px)}
nav button.active{color:#fff;background:linear-gradient(90deg,#07313e,#040d13);border-color:#2c8295;text-shadow:0 0 12px var(--blue),0 0 25px #00d9ff55;box-shadow:inset 5px 0 var(--blue),0 0 25px #00d9ff15}
nav button.active:before{content:"◈";position:absolute;left:4px;color:var(--blue);font-size:7px;text-shadow:0 0 10px var(--blue)}
.mini{margin:18px 8px;padding:14px;border:1px solid #205768;background:#020609;font-size:9px;color:#80a8b3;position:relative;clip-path:polygon(0 0,96% 0,100% 14%,100% 100%,4% 100%,0 86%);box-shadow:inset 0 0 30px #00d9ff07}
.mini:after{content:"STATUS: NOMINAL";position:absolute;right:8px;top:9px;color:var(--green);font:900 7px Orbitron;text-shadow:0 0 10px var(--green)}
.mini b{color:#c6ffff;font-family:Orbitron;text-shadow:0 0 8px var(--blue)}
.mini .dot{height:4px;background:#102c37;margin-top:9px}
.mini .dot span{display:block;height:100%;width:87%;background:linear-gradient(90deg,var(--electric),var(--blue));box-shadow:0 0 14px var(--blue)}

main{padding:29px 32px;max-width:1750px;width:100%;margin:auto;position:relative}
main:before{content:"";position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(#0b2b36 1px,transparent 1px),linear-gradient(90deg,#0b2b36 1px,transparent 1px);background-size:40px 40px;opacity:.22;mask-image:linear-gradient(to bottom,#000,transparent 90%)}
main:after{content:"// IIoT SENTINEL // INTERACTIVE DEMO ENVIRONMENT //";position:absolute;right:35px;top:7px;color:#163c48;font:900 6px Orbitron;letter-spacing:2px}
.hero{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:25px;position:relative}
.hero:before{content:"";position:absolute;left:-32px;bottom:-12px;width:470px;height:2px;background:linear-gradient(90deg,var(--red),var(--blue),transparent);box-shadow:0 0 18px var(--blue)}
.eyebrow{font:900 8px Orbitron;color:#83bdc8;letter-spacing:4px;margin-bottom:9px;text-shadow:0 0 9px #00d9ff55}
.hero h2{font:900 32px Audiowide,Orbitron;margin:0;text-transform:uppercase;letter-spacing:1.5px;color:#fff;text-shadow:0 0 14px #00d9ff88,0 0 35px #00d9ff22;animation:flicker 7s infinite}
.hero p{margin:8px 0 0;color:#9abdc5;font-size:13px;font-weight:700}
.btn{border:1px solid #3997aa;background:#03151d;color:#9cffff;padding:12px 18px;font:900 9px Orbitron;letter-spacing:1.6px;cursor:pointer;box-shadow:inset 0 0 25px #00d9ff18,0 0 17px #00d9ff12;clip-path:polygon(9px 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%,0 9px);text-shadow:0 0 10px var(--blue)}
.btn:hover{background:#08313d;box-shadow:0 0 30px #00d9ff45;transform:translateY(-1px)}
.danger{color:#ff6c8a;border-color:#a52348;background:#1c030b;text-shadow:0 0 10px #ff164f}
.danger:hover{background:#390813;box-shadow:0 0 35px #ff164f45}

.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:13px;margin-bottom:15px}
.card{position:relative;background:linear-gradient(145deg,#07141c,#010305);border:1px solid #1d5969;padding:19px;overflow:hidden;clip-path:polygon(0 0,91% 0,100% 14%,100% 86%,91% 100%,9% 100%,0 86%);box-shadow:inset 0 0 45px #00d9ff06,0 0 13px #000}
.card:before{content:"";position:absolute;left:0;top:0;width:65px;height:3px;background:var(--blue);box-shadow:0 0 18px var(--blue)}
.card.red:before{background:var(--red);box-shadow:0 0 18px var(--red)}
.label{font:900 8px Orbitron;color:#86b1bb;letter-spacing:2px}
.value{font:900 27px Orbitron;margin-top:9px;color:#fff;text-shadow:0 0 15px #00d9ff77}
.cyan{color:var(--ice);text-shadow:0 0 18px #00d9ffaa}
.green{color:var(--green);text-shadow:0 0 17px #00ffadbb}
.redtxt{color:#ff5879;text-shadow:0 0 18px #ff174faa}
.amber{color:#ffd05c;text-shadow:0 0 15px #ff9700aa}

.grid{display:grid;grid-template-columns:1.45fr .55fr;gap:15px}
.panel{background:linear-gradient(145deg,#07131b,#010407);border:1px solid #1b5262;padding:18px;margin-bottom:15px;position:relative;clip-path:polygon(0 0,97% 0,100% 5%,100% 95%,97% 100%,3% 100%,0 95%);box-shadow:inset 0 0 50px #00d9ff04,0 0 15px #000}
.panel:before{content:"";position:absolute;left:0;top:0;width:43px;height:2px;background:var(--blue);box-shadow:0 0 16px var(--blue)}
.panel h3{font:900 11px Orbitron;letter-spacing:1.8px;margin:0 0 16px;color:#f0ffff;text-shadow:0 0 11px #00d9ff66}
.subline{color:#82aab4;font-size:10px;margin:-8px 0 15px;font-weight:700}

table{width:100%;border-collapse:collapse;font-size:11px}
th{text-align:left;color:#76aab5;font:900 7px Orbitron;letter-spacing:1.2px;padding:10px;border-bottom:1px solid #205365;text-shadow:0 0 7px #00d9ff33}
td{padding:11px 9px;border-bottom:1px solid #102f39;color:#d0e5e9;font-weight:700}
tr:hover{background:#092731;box-shadow:inset 3px 0 var(--blue)}
td:first-child{font-family:Orbitron;color:#8bb2bb;font-size:8px}
.pill{font:900 7px Orbitron;padding:5px 8px;letter-spacing:.8px;clip-path:polygon(4px 0,100% 0,calc(100% - 4px) 100%,0 100%)}
.pbad{color:#ff8399;background:#350713;border:1px solid #a02042;text-shadow:0 0 8px #ff174f}
.pwarn{color:#ffda70;background:#302405;border:1px solid #805f18}
.pgood{color:#63ffd0;background:#032d20;border:1px solid #19815f;text-shadow:0 0 8px #00ffad}

.pipeline{display:grid;grid-template-columns:repeat(8,1fr);gap:7px}
.stage{height:84px;background:linear-gradient(145deg,#071b24,#010507);border:1px solid #1d5b6c;display:flex;flex-direction:column;align-items:center;justify-content:center;font:900 8px Orbitron;color:#acd5dc;position:relative;clip-path:polygon(0 0,89% 0,100% 17%,100% 83%,89% 100%,11% 100%,0 83%);text-shadow:0 0 8px #00d9ff33;box-shadow:inset 0 0 18px #00d9ff06}
.stage b{color:var(--green);font-size:15px;margin-bottom:8px;text-shadow:0 0 16px var(--green)}

.kv{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.kv div{border:1px solid #174957;background:#02070a;padding:11px;clip-path:polygon(0 0,94% 0,100% 22%,100% 100%,6% 100%,0 78%);box-shadow:inset 0 0 18px #00d9ff05}
.kv small{display:block;color:#79a6b0;font:900 7px Orbitron;margin-bottom:6px}
.kv strong{font-size:11px;color:#ecffff;text-shadow:0 0 8px #00d9ff44}

.bar{height:6px;background:#102f39;margin-top:8px;position:relative;overflow:hidden}
.fill{height:100%;background:linear-gradient(90deg,#075dff,var(--blue),var(--ice));box-shadow:0 0 15px var(--blue)}
.fill.red{background:linear-gradient(90deg,#9c0036,var(--red),#ff6b86);box-shadow:0 0 15px var(--red)}

.radar{height:250px;position:relative;display:grid;place-items:center;background:radial-gradient(circle,#09313e 0,#06171e 38%,#010305 72%);overflow:hidden;border:1px solid #1d5c6c;clip-path:polygon(0 8%,8% 0,92% 0,100% 8%,100% 92%,92% 100%,8% 100%,0 92%);box-shadow:inset 0 0 55px #00d9ff0d}
.radar:before,.radar:after{content:"";position:absolute;border:1px solid #1d6575;border-radius:50%;box-shadow:0 0 15px #00d9ff15}
.radar:before{width:180px;height:180px}
.radar:after{width:105px;height:105px}
.sweep{position:absolute;width:125px;height:2px;background:linear-gradient(90deg,transparent,var(--green));transform-origin:left center;animation:sweep 2.5s linear infinite;left:50%;top:50%;box-shadow:0 0 14px var(--green)}
.cross{position:absolute;background:#1c5664}
.cross.x{width:100%;height:1px}
.cross.y{height:100%;width:1px}
.blip{position:absolute;width:9px;height:9px;background:var(--red);border-radius:50%;box-shadow:0 0 20px var(--red);animation:pulse .8s infinite}
.b1{left:65%;top:34%}
.b2{left:29%;top:63%;background:var(--blue);box-shadow:0 0 20px var(--blue)}

.timeline{border-left:2px solid #1d5261;margin-left:7px;padding-left:15px}
.event{margin-bottom:17px;position:relative}
.event:before{content:"";position:absolute;left:-21px;top:3px;width:7px;height:7px;background:var(--blue);box-shadow:0 0 13px var(--blue)}
.event.d:before{background:var(--red);box-shadow:0 0 13px var(--red)}
.time{font:900 7px Orbitron;color:#7eacb6}
.event p{font-size:11px;margin:5px 0;color:#d0e5e9;font-weight:700}

.log{font:10px Consolas,monospace;color:#a2c5cd;background:#000203;border:1px solid #17404c;padding:13px;line-height:1.9;min-height:150px;box-shadow:inset 0 0 40px #00d9ff06}
.log .r{color:#ff6783;text-shadow:0 0 9px #ff174f}
.log .g{color:#57ffc5;text-shadow:0 0 9px #00ffad}
.log .c{color:#6beeff;text-shadow:0 0 9px #00d9ff}

.modal{position:fixed;inset:0;background:#000f;display:none;align-items:center;justify-content:center;z-index:100}
.modalbox{width:min(710px,92vw);background:#020608;border:1px solid var(--red);box-shadow:0 0 110px #ff174f45,0 20px 110px #000;padding:28px;position:relative;clip-path:polygon(0 0,98% 0,100% 8%,100% 92%,98% 100%,2% 100%,0 92%)}
.modalbox:before{content:"// THREAT EVENT DETECTED //";font:900 8px Orbitron;color:var(--red);letter-spacing:3px;text-shadow:0 0 12px var(--red)}
.modalbox h2{font:900 25px Audiowide,Orbitron;color:#ff718c;margin:15px 0;text-shadow:0 0 17px #ff174faa}
.modalbox pre{background:#000203;border:1px solid #491522;padding:15px;color:#d0e8ec;font-size:11px;overflow-x:auto}

footer{padding:11px;text-align:center;color:#63909b;font:900 7px Orbitron;letter-spacing:1.8px;text-shadow:0 0 7px #00d9ff33}

@keyframes pulse{50%{opacity:.25;transform:scale(.72)}}
@keyframes sweep{to{transform:rotate(360deg)}}
@keyframes pulseSlow{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}
@keyframes flicker{0%,93%,100%{opacity:1}94%{opacity:.78}95%{opacity:1}97%{opacity:.9}}

@media(prefers-reduced-motion:reduce){*{animation:none!important}}

@media(max-width:950px){.layout{grid-template-columns:1fr}aside{display:none}.cards{grid-template-columns:repeat(2,1fr)}.grid{grid-template-columns:1fr}.pipeline{grid-template-columns:repeat(4,1fr)}}
@media(max-width:600px){main{padding:18px}.cards{grid-template-columns:1fr}.hero{display:block}.hero .btn{margin-top:15px}}
