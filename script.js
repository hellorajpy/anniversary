/* ====== সেটআপ ====== */
const $ = id => document.getElementById(id);
const bn = n => n.toLocaleString("bn-IN");
try { if (sessionStorage.getItem("bloom")) document.body.classList.add("bloom"); } catch (e) { }
$("herName").textContent = HER_NAME;
function typeLetter() {
  const el = $("letterText"), txt = LETTER + " " + YOUR_NAME;
  const G = (window.Intl && Intl.Segmenter) ? [...new Intl.Segmenter("bn", { granularity: "grapheme" }).segment(txt)].map(x => x.segment) : Array.from(txt);
  el.innerHTML = ""; const sp = document.createElement("span"), pen = document.createElement("span"); pen.className = "pen"; pen.textContent = "✒️"; el.append(sp, pen);
  let i = 0; const iv = setInterval(() => { i++; sp.textContent = G.slice(0, i).join(""); if (i >= G.length) { clearInterval(iv); pen.remove(); } }, 42);
  el.onclick = () => { if (i < G.length - 1) i = G.length - 1; };
}
$("envelope").onclick = () => { $("letterText").classList.add("open"); $("envelope").classList.add("opened"); heart(); setTimeout(typeLetter, 900); };
function escH(t) { return t.replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch])); }
$("orbMsg").textContent = ORB_TEXT; $("scText").textContent = SCRATCH_TEXT;
$("sign").textContent = "— " + YOUR_NAME;

/* কাউন্টডাউন */
function tick() {
  const diff = ANNIV - now();
  const c = $("countdown");
  if (diff <= 0) { c.innerHTML = '<div class="msg">আজ আমাদের প্রেমের উৎসব, রাধে রাধে 💙</div>'; return; }
  const d = Math.floor(diff / 864e5), h = Math.floor(diff / 36e5) % 24, m = Math.floor(diff / 6e4) % 60, s = Math.floor(diff / 1e3) % 60;
  c.innerHTML = [["দিন", d], ["ঘণ্টা", h], ["মিনিট", m], ["সেকেন্ড", s]].map(([l, v]) => `<div><b>${bn(v)}</b>${l}</div>`).join("");
}
tick(); setInterval(tick, 1000);

/* গ্যালারি */
const ph = i => "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${["#9ec5ff", "#ffe29a", "#a8e6d6", "#c9b8ff", "#ffd0e0", "#bfe3ff"][i % 6]}'/><stop offset='1' stop-color='#fff8e6'/></linearGradient></defs><rect width='600' height='600' fill='url(#g)'/><text x='300' y='320' font-size='120' text-anchor='middle'>💞</text><text x='300' y='430' font-size='28' text-anchor='middle' fill='#0b2a5b' font-family='sans-serif'>photos/${i + 1}.jpg যোগ করো</text></svg>`);
const imgs = []; let LBI = 0;
PHOTOS.forEach((p, i) => {
  const f = document.createElement("figure");
  f.style.setProperty("--r", (i % 2 ? 1.5 : -1.5) + "deg");
  f.innerHTML = `<img src="${p.src}" alt="${p.title}" loading="lazy"><figcaption>${p.title}</figcaption>`;
  const img = f.querySelector("img");
  img.onerror = () => { img.onerror = null; img.src = ph(i); };
  f.onclick = () => showLB(i); imgs[i] = img;
  $("grid").appendChild(f);
});
function showLB(i) {
  const n = PHOTOS.length; LBI = (i + n) % n; const p = PHOTOS[LBI];
  $("lbImg").src = imgs[LBI].src; $("lbTitle").textContent = p.title; $("lbText").textContent = p.text; $("lbCount").textContent = bn(LBI + 1) + " / " + bn(n);
  if (!$("lightbox").classList.contains("open")) { $("lightbox").classList.add("open"); history.pushState({ lb: 1 }, ""); }
}
$("lbPrev").onclick = () => showLB(LBI - 1); $("lbNext").onclick = () => showLB(LBI + 1);
(function () {
  let x0 = null; const lb = $("lightbox");
  lb.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(dx) > 50) showLB(LBI + (dx < 0 ? 1 : -1)); }, { passive: true });
})();
document.addEventListener("keydown", e => { if (!$("lightbox").classList.contains("open")) return; if (e.key === "ArrowRight") showLB(LBI + 1); if (e.key === "ArrowLeft") showLB(LBI - 1); });
function closeLB() { if (!$("lightbox").classList.contains("open")) return; if (history.state && history.state.lb) history.back(); else $("lightbox").classList.remove("open"); }
$("close").onclick = closeLB;
$("lightbox").onclick = e => { if (e.target.id === "lightbox") closeLB(); };
document.addEventListener("keydown", e => { if (e.key === "Escape") closeLB(); });

/* প্লেয়ারের নিচের অংশ (সিক বার, সময়, বোতাম) নতুন করে সাজানো, যাতে বোতামগুলো সবসময় ঠিক জায়গায় ও ঠিক আকারে থাকে */
(function () {
  const f = document.querySelector("#np .np-foot"); if (!f) return;
  f.innerHTML = '<div class="seekwrap"><canvas id="waveCv"></canvas><input type="range" id="seek" value="0" min="0" max="100" step="0.1"></div>'
    + '<div class="times"><span id="cT">০:০০</span><span id="dT">০:০০</span></div>'
    + '<div class="ctrl"><button type="button" id="prev" aria-label="আগের"></button><button type="button" id="play" class="big" aria-label="চালাও"></button><button type="button" id="next" aria-label="পরের"></button></div>';
  const st = document.createElement("style");
  st.textContent = `
#np{display:grid!important;grid-template-rows:auto minmax(0,1fr) auto;height:100vh;height:100dvh}
#np .ly{min-height:0}
#np .np-foot{display:block!important;width:100%;max-width:760px;margin:0 auto;box-sizing:border-box}
#np .seekwrap{position:relative;height:34px;margin:.3rem 0}
#np .times{display:flex!important;justify-content:space-between;width:100%;font-size:.85rem;opacity:.85}
#np .ctrl{display:flex!important;justify-content:center;align-items:center;gap:1.4rem;width:100%;margin-top:.6rem}
#np .ctrl button{flex:0 0 auto!important;display:grid!important;place-items:center;width:56px!important;height:56px!important;min-width:56px!important;padding:0!important;margin:0!important;border:1px solid #ffffff40;background:#ffffff26;color:#fff;border-radius:50% 14% 50% 14%;backdrop-filter:blur(8px)}
#np .ctrl #next{border-radius:14% 50% 14% 50%}
#np .ctrl button svg{display:block;width:26px!important;height:26px!important;fill:#fff}
#np .ctrl .big{position:relative;width:92px!important;height:92px!important;min-width:92px!important;border:0;background:none;border-radius:0;backdrop-filter:none;filter:drop-shadow(0 8px 18px #e2a42b99)}
#np .ctrl .big::before,#np .ctrl .big::after{content:"";position:absolute;inset:12px;border-radius:30%;background:linear-gradient(135deg,#ffe08a,#e2a42b)}
#np .ctrl .big::after{transform:rotate(45deg)}
#np .ctrl .big svg{position:relative;z-index:1;width:36px!important;height:36px!important;fill:#3a2300}`;
  document.head.appendChild(st);
})();

/* গানের তালিকা ও YouTube Music ধাঁচের প্লেয়ার */
const audio = $("audio"); let cur = -1, LY = [], els = [], act = -1;
const IC = { play: '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>', pause: '<svg viewBox="0 0 24 24"><path d="M7 5h4v14H7zm6 0h4v14h-4z"/></svg>', prev: '<svg viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>', next: '<svg viewBox="0 0 24 24"><path d="M16 6h2v12h-2zM6 18l8.5-6L6 6z"/></svg>', down: '<svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>' };
$("prev").innerHTML = IC.prev; $("next").innerHTML = IC.next; $("npClose").innerHTML = IC.down; $("play").innerHTML = $("miniPlay").innerHTML = IC.play;
const esc = t => t.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const covPh = i => "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${["#2a6fd0", "#d9487a", "#1aa38a", "#7b5cd6", "#e2a42b", "#1d4f9f"][i % 6]}'/><stop offset='1' stop-color='#0b2a5b'/></linearGradient></defs><rect width='600' height='600' fill='url(#g)'/><text x='300' y='350' font-size='160' text-anchor='middle'>💞</text></svg>`);
function resolveCover(s, i, cb) {
  if (s._c) return cb(s._c);
  const tries = [s.cover, PHOTOS.length ? PHOTOS[i % PHOTOS.length].src : null].filter(Boolean);
  (function next() { if (!tries.length) { s._c = covPh(i); return cb(s._c); } const u = tries.shift(), im = new Image(); im.onload = () => { s._c = u; cb(u); }; im.onerror = next; im.src = u; })();
}
function renderSongs() {
  $("songs").innerHTML = "";
  SONGS.forEach((s, i) => {
    const d = document.createElement("div"); d.className = "song" + (i === cur ? " on" : "");
    d.innerHTML = `<div class="art"><img alt=""><span class="pl">${IC.play}</span><i class="eq"><b></b><b></b><b></b></i></div><b>${esc(s.title)}</b><small>${esc(s.artist)}</small>`;
    resolveCover(s, i, src => d.querySelector("img").src = src);
    d.onclick = () => i === cur ? openNP() : load(i, true);
    $("songs").appendChild(d);
  });
}
const fmt = t => { t = Math.floor(t || 0); const s = t % 60; return bn(Math.floor(t / 60)) + ":" + (s < 10 ? bn(0) : "") + bn(s); };
function spread() { const n = LY.length, d = audio.duration || n * 6; LY.forEach((x, i) => { if (x.auto) x.t = i * d / n; }); }
/* গানের কথা পড়ার নিয়ম: [সেকেন্ড,"লাইন"] তালিকা, শুধু "লাইন" তালিকা, অথবা backtick-এ পুরো লেখা (LRC হলে সময়সহ) */
function parseLyrics(src) {
  if (typeof src !== "string") return src || [];
  const out = [];
  src.replace(/^\uFEFF/, "").split(/\r?\n/).forEach(raw => {
    let line = raw.trim(); if (!line) return;
    if (/^\[(ti|ar|al|au|by|offset|length|re|ve|id|la):/i.test(line)) return;
    const times = []; let m;
    while ((m = line.match(/^\[(\d+):(\d+(?:[.:]\d+)?)\]\s*/))) { times.push(+m[1] * 60 + parseFloat(m[2].replace(":", "."))); line = line.slice(m[0].length); }
    line = line.replace(/<\d+:\d+(?:[.:]\d+)?>/g, "").trim();
    if (times.length) { if (line) times.forEach(t => out.push([t, line])); } else out.push(line);
  });
  const timed = out.filter(Array.isArray);
  if (timed.length) { timed.sort((a, b) => a[0] - b[0]); return timed; }
  return out;
}
function buildLy(s) {
  const ly = $("ly"); ly.innerHTML = ""; els = []; LY = []; act = -1;
  let src = s.lyrics || s.lrc; /* lyrics: [সেকেন্ড,"লাইন"] তালিকা, অথবা backtick-এ পুরো লেখা (LRC হলে [00:12.50] লাইন সময়সহ মিলে চলবে) */
  src = parseLyrics(src);
  if (!(src && src.length)) { ly.innerHTML = '<p class="none">এই সুরের কথাগুলো এখনও লেখা হয়নি 🎵</p>'; return; }
  LY = src.map(x => Array.isArray(x) ? { t: x[0] + (s.offset || 0), l: x[1] } : { t: 0, l: x, auto: true }); spread();
  LY.forEach(x => { const p = document.createElement("p"); p.textContent = x.l; p.onclick = () => { audio.currentTime = x.t; audio.play(); }; ly.appendChild(p); els.push(p); });
}
function syncMini() { $("mini").classList.toggle("show", cur >= 0 && !$("np").classList.contains("open")); }
function openNP() { if (!$("np").classList.contains("open")) history.pushState({ np: 1 }, ""); $("np").classList.add("open"); document.body.style.overflow = "hidden"; syncMini(); }
function hideNP() { $("np").classList.remove("open"); document.body.style.overflow = ""; syncMini(); }
function closeNP() { if (!$("np").classList.contains("open")) return; if (history.state && history.state.np) history.back(); else hideNP(); }
window.addEventListener("popstate", () => { $("lightbox").classList.remove("open"); hideNP(); });
function load(i, go) {
  cur = (i + SONGS.length) % SONGS.length; const s = SONGS[cur];
  audio.src = s.src; $("tTitle").textContent = $("miniTitle").textContent = s.title; $("tArtist").textContent = s.artist;
  resolveCover(s, cur, src => { $("npBg").style.backgroundImage = `url("${src}")`; $("miniImg").src = src; setMedia(s, src); });
  buildLy(s); renderSongs(); openNP(); $("ly").scrollTop = 0;
  if (go) audio.play().catch(() => { if (!audio.error) $("tArtist").textContent = "চালানো যায়নি, আবার প্লে বোতামে ট্যাপ করো"; });
}
function setMedia(s, src) {
  if (!("mediaSession" in navigator)) return;
  try { navigator.mediaSession.metadata = new MediaMetadata({ title: s.title, artist: s.artist, album: "আমাদের দুই মাস", artwork: [{ src: new URL(src, location.href).href, sizes: "512x512" }] }); } catch (e) { }
}
if ("mediaSession" in navigator) {
  const set = (a, f) => { try { navigator.mediaSession.setActionHandler(a, f); } catch (e) { } };
  set("play", () => audio.play()); set("pause", () => audio.pause());
  set("previoustrack", () => load(cur - 1, true)); set("nexttrack", () => load(cur + 1, true));
  set("seekto", d => { audio.currentTime = d.seekTime; });
}
const toggle = () => { if (cur < 0) load(0, true); else audio.paused ? audio.play() : audio.pause(); };
$("play").onclick = toggle; $("miniPlay").onclick = e => { e.stopPropagation(); toggle(); };
$("mini").onclick = openNP; $("npClose").onclick = closeNP;
$("prev").onclick = () => load(cur - 1, true); $("next").onclick = () => load(cur + 1, true);
document.addEventListener("keydown", e => { if (e.key === "Escape") closeNP(); });
audio.onplay = () => { $("play").innerHTML = $("miniPlay").innerHTML = IC.pause; document.body.classList.add("playing"); fluteDuck(true); };
audio.onpause = () => { $("play").innerHTML = $("miniPlay").innerHTML = IC.play; document.body.classList.remove("playing"); fluteDuck(false); };
audio.onended = () => load(cur + 1, true);
audio.onerror = () => {
  const e = audio.error, f = decodeURIComponent((audio.src || "").split("/").slice(-2).join("/"));
  $("tArtist").textContent = "⚠ " + (e && e.code === 4 ? "ফাইল পাওয়া যায়নি, বা এই ফরম্যাট চলছে না: " : "সমস্যা হয়েছে: ") + f;
  console.warn("গানের ত্রুটি:", e && e.code, e && e.message, audio.src);
};
audio.onloadedmetadata = () => { $("dT").textContent = fmt(audio.duration); spread(); };
const setP = v => $("seek").style.setProperty("--p", v + "%");
audio.ontimeupdate = () => {
  if (audio.duration) { const p = audio.currentTime / audio.duration * 100; $("seek").value = p; setP(p); }
  $("cT").textContent = fmt(audio.currentTime);
  let a = -1; LY.forEach((x, k) => { if (x.t <= audio.currentTime + .2) a = k; });
  if (a !== act) {
    act = a; els.forEach((e, k) => e.classList.toggle("on", k === a));
    const e = els[a], ly = $("ly"); if (e) ly.scrollTo({ top: e.offsetTop - ly.clientHeight / 2 + e.clientHeight / 2, behavior: "smooth" });
  }
};
$("seek").oninput = e => { setP(e.target.value); if (audio.duration) audio.currentTime = e.target.value / 100 * audio.duration; };
$("songFile").onchange = e => {
  const n = e.target.files.length;
  [...e.target.files].forEach(f => SONGS.push({ title: f.name.replace(/\.[^.]+$/, ""), artist: "তোমার বাছাই করা সুর", src: URL.createObjectURL(f) }));
  if (cur < 0) load(SONGS.length - n, true); else renderSongs();
};
renderSongs();

/* মাখনের হাঁড়ি */
let last = -1;
$("jarBtn").onclick = () => {
  let i; do { i = Math.floor(Math.random() * REASONS.length); } while (i === last && REASONS.length > 1);
  last = i; $("note").textContent = REASONS[i]; $("jarBtn").classList.remove("shake"); void $("jarBtn").offsetWidth; $("jarBtn").classList.add("shake"); for (let k = 0; k < 8; k++) heart();
};

/* ভাসমান ফুল ও ময়ূরপাখা */
function heart() {
  if (!document.body.classList.contains("bloom") || document.hidden) return;
  const b = document.createElement("div"); b.className = "bfly";
  b.style.cssText = `left:${Math.random() * 92}vw;--s:${20 + Math.random() * 18}px;--d:${9 + Math.random() * 7}s;--h:${Math.floor(Math.random() * 360)}deg;--w:${30 + Math.random() * 50}px`;
  b.innerHTML = '<span class="sw"><span class="fl">🦋</span></span>';
  $("petals").appendChild(b); setTimeout(() => b.remove(), 17000);
}
setInterval(heart, 2200);

/* Scroll reveal */
document.querySelectorAll("section").forEach(s => s.classList.add("reveal"));
const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add("in")), { threshold: .12 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

/* বাঁশি: নিজের বাঁশির ফাইল দিতে চাইলে content.js-এ FLUTE_SRC */
let ac, master, fluteOn = false, ducked = false, timer, fa = null;
const SCALE = [440, 493.88, 587.33, 659.25, 739.99, 880, 987.77]; let idx = 3;
function note(freq, dur) {
  const t = ac.currentTime, g = ac.createGain();
  const o1 = ac.createOscillator(), o2 = ac.createOscillator(), lfo = ac.createOscillator(), lg = ac.createGain();
  o1.type = "sine"; o2.type = "sine"; o1.frequency.value = freq; o2.frequency.value = freq * 2;
  lfo.frequency.value = 5; lg.gain.value = freq * 0.006; lfo.connect(lg); lg.connect(o1.frequency); lg.connect(o2.frequency);
  const g2 = ac.createGain(); g2.gain.value = .12; o2.connect(g2); g2.connect(g); o1.connect(g); g.connect(master);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.22, t + .35); g.gain.linearRampToValueAtTime(.15, t + dur * .6); g.gain.linearRampToValueAtTime(0, t + dur);
  [o1, o2, lfo].forEach(o => { o.start(t); o.stop(t + dur + .1) });
}
function loop() {
  if (!fluteOn || fa) return;
  idx = Math.max(0, Math.min(SCALE.length - 1, idx + [-2, -1, -1, 0, 1, 1, 2][Math.floor(Math.random() * 7)]));
  const dur = 1.6 + Math.random() * 1.8; note(SCALE[idx], dur);
  timer = setTimeout(loop, (dur * 0.8 + (Math.random() < .3 ? 1.5 : 0.2)) * 1000);
}
function fadeA(v) { if (!fa) return; clearInterval(fa._t); fa._t = setInterval(() => { const d = v - fa.volume; if (Math.abs(d) < .03) { fa.volume = v; clearInterval(fa._t); } else fa.volume = Math.max(0, Math.min(1, fa.volume + Math.sign(d) * .03)); }, 60); }
function initAudio() {
  if (FLUTE_SRC) { if (!fa) { fa = new Audio(FLUTE_SRC); fa.loop = true; fa.volume = 0; } return; }
  if (ac) return;
  ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.gain.value = 0;
  const d = ac.createDelay(); d.delayTime.value = .42; const fb = ac.createGain(); fb.gain.value = .45;
  master.connect(ac.destination); master.connect(d); d.connect(fb); fb.connect(d); d.connect(ac.destination);
}
function startFlute() {
  initAudio(); fluteOn = true; $("fluteBtn").classList.remove("off");
  if (fa) { fa.play().catch(() => { }); fadeA(ducked ? 0 : .7); return; }
  ac.resume(); master.gain.setTargetAtTime(ducked ? 0 : .6, ac.currentTime, 1); clearTimeout(timer); loop();
}
function stopFlute() {
  fluteOn = false; clearTimeout(timer); $("fluteBtn").classList.add("off");
  if (fa) { fadeA(0); setTimeout(() => { if (!fluteOn) fa.pause(); }, 900); } else if (master) master.gain.setTargetAtTime(0, ac.currentTime, .3);
}
function fluteDuck(on) { ducked = on; if (!fluteOn) return; if (fa) fadeA(on ? 0 : .7); else if (master) master.gain.setTargetAtTime(on ? 0 : .6, ac.currentTime, .6); }
$("fluteBtn").onclick = () => fluteOn ? stopFlute() : startFlute();
$("enter").onclick = () => { $("intro").classList.add("gone"); initAudio(); if (document.body.classList.contains("bloom")) startFlute(); else $("fluteBtn").classList.add("off"); };

/* স্ক্রিন বন্ধ বা অ্যাপ বদলালে বাঁশি থামে, ফিরলে আবার বাজে */
document.addEventListener("visibilitychange", () => { if (document.hidden) { if (ac) ac.suspend(); if (fa) fa.pause(); } else if (fluteOn) { if (ac) ac.resume(); if (fa) fa.play().catch(() => { }); } });

/* ✨ আঙুলের ছোঁয়ায় সোনালি আলোর ঝিলিক */
(function () {
  const c = document.createElement("canvas"); c.id = "fx"; document.body.appendChild(c);
  const x = c.getContext("2d"); let W, H, P = [], run = false; const COL = ["#ffd36b", "#ffb3cf", "#8cc4ff", "#fff2c2"];
  const size = () => { const d = devicePixelRatio || 1; W = innerWidth; H = innerHeight; c.width = W * d; c.height = H * d; x.setTransform(d, 0, 0, d, 0, 0); }; size(); addEventListener("resize", size);
  function add(px, py, n, sp) {
    if (!document.body.classList.contains("bloom")) return;
    for (let i = 0; i < n; i++) { const a = Math.random() * 6.28, s = Math.random() * sp; P.push({ x: px, y: py, vx: Math.cos(a) * s, vy: Math.sin(a) * s - .3, l: 1, r: 1.5 + Math.random() * 2.5, c: COL[Math.random() * 4 | 0] }); }
    if (P.length > 260) P.splice(0, P.length - 260);
    if (!run) { run = true; requestAnimationFrame(f); }
  }
  function f() {
    x.clearRect(0, 0, W, H); P = P.filter(p => p.l > 0);
    P.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .02; p.l -= .02; x.globalAlpha = Math.max(p.l, 0); x.fillStyle = p.c; x.shadowColor = p.c; x.shadowBlur = 8; x.beginPath(); x.arc(p.x, p.y, p.r, 0, 6.28); x.fill(); });
    x.globalAlpha = 1; if (P.length) requestAnimationFrame(f); else run = false;
  }
  addEventListener("pointermove", e => add(e.clientX, e.clientY, 2, 1.2), { passive: true });
  addEventListener("pointerdown", e => add(e.clientX, e.clientY, 16, 3.5), { passive: true });
})();

/* 🌈 কৃষ্ণ-রাধার মিলনে পুরো সাইট রঙিন হয়ে ওঠে (ট্যাব বন্ধ না করা পর্যন্ত থাকে) */
function bloomHint() { const e = $("orbHint"); if (e) e.textContent = "রঙ ফিরে এসেছে… ওদের আবার মিলিয়ে দেখো ✨"; }
if (document.body.classList.contains("bloom")) bloomHint();
function bloom(px, py) {
  const b = document.body; if (b.classList.contains("bloom")) return;
  b.classList.add("morph", "bloom"); try { sessionStorage.setItem("bloom", "1"); } catch (e) { }
  setTimeout(() => b.classList.remove("morph"), 3500); bloomHint();
  const f = document.createElement("div"); f.className = "flash"; f.style.left = px + "px"; f.style.top = py + "px"; document.body.appendChild(f);
  f.animate([{ transform: "translate(-50%,-50%) scale(0)", opacity: 1 }, { transform: "translate(-50%,-50%) scale(45)", opacity: 0 }], { duration: 2400, easing: "ease-out" }).onfinish = () => f.remove();
  startFlute(); for (let k = 0; k < 24; k++) setTimeout(heart, k * 130);
}

/* 💙💗 দুটি মন, এক সুর: দুই আলোকে কাছে আনলেই মিলন */
(function () {
  const cv = $("orbCv"), cx = cv.getContext("2d"); let W = 0, H = 0, t = 0, drag = null, merged = false, go = false, running = false, P = [];
  const A = { c: "#5aaeff", n: "কৃষ্ণ" }, B = { c: "#ff86b6", n: "রাধা" };
  function place() { A.bx = W * .2; A.by = H * .5; B.bx = W * .8; B.by = H * .5;[A, B].forEach(o => { o.x = o.bx; o.y = o.by; }); }
  function size() { if (cv.clientWidth === W) return; const d = devicePixelRatio || 1; W = cv.clientWidth; H = cv.clientHeight; cv.width = W * d; cv.height = H * d; cx.setTransform(d, 0, 0, d, 0, 0); place(); }
  size(); addEventListener("resize", size);
  const pos = e => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  cv.onpointerdown = e => { if (merged) return; const p = pos(e); drag = [A, B].find(o => Math.hypot(o.x - p.x, o.y - p.y) < 55) || null; if (drag) cv.setPointerCapture(e.pointerId); };
  cv.onpointermove = e => { if (!drag) return; const p = pos(e); drag.x = Math.max(20, Math.min(W - 20, p.x)); drag.y = Math.max(20, Math.min(H - 20, p.y)); };
  cv.onpointerup = cv.onpointercancel = () => { drag = null; };
  function burst(px, py) { for (let i = 0; i < 90; i++) { const a = Math.random() * 6.28, s = 1 + Math.random() * 4; P.push({ x: px, y: py, vx: Math.cos(a) * s, vy: Math.sin(a) * s, l: 1, c: ["#ffd36b", "#5aaeff", "#ff86b6", "#ffffff"][i % 4] }); } }
  function join() {
    merged = true; drag = null; const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2; A.x = B.x = mx; A.y = B.y = my; burst(mx, my);
    $("orbMsg").classList.add("show"); { const r = cv.getBoundingClientRect(); bloom(r.left + mx, r.top + my); }
    try { if (ac && fluteOn && !ducked) { note(587.33, 3); note(739.99, 3); note(880, 3); } } catch (e) { }
    setTimeout(() => { merged = false; $("orbMsg").classList.remove("show"); place(); }, 7000);
  }
  function orb(o, r) { const g = cx.createRadialGradient(o.x, o.y, 0, o.x, o.y, r * 2.2); g.addColorStop(0, "#fff"); g.addColorStop(.25, o.c); g.addColorStop(1, "transparent"); cx.fillStyle = g; cx.beginPath(); cx.arc(o.x, o.y, r * 2.2, 0, 6.28); cx.fill(); }
  function frame() {
    if (!go) { running = false; return; }
    t++; cx.clearRect(0, 0, W, H);
    if (!merged) {
      [A, B].forEach((o, i) => { if (o === drag) return; if (drag) { o.x += (drag.x - o.x) * .012; o.y += (drag.y - o.y) * .012; } else { o.x += (o.bx - o.x) * .04; o.y += (o.by + Math.sin(t / 35 + i * 3) * 14 - o.y) * .04; } });
      const d = Math.hypot(A.x - B.x, A.y - B.y), near = Math.max(0, 1 - d / (W * .7));
      cx.strokeStyle = `rgba(255,211,107,${.15 + near * .8})`; cx.lineWidth = 1 + near * 5; cx.shadowColor = "#ffd36b"; cx.shadowBlur = 14 * near;
      cx.beginPath(); cx.moveTo(A.x, A.y); cx.lineTo(B.x, B.y); cx.stroke(); cx.shadowBlur = 0;
      orb(A, 16 + near * 6); orb(B, 16 + near * 6);
      cx.fillStyle = "#ffffffcc"; cx.font = "14px 'Hind Siliguri',sans-serif"; cx.textAlign = "center"; cx.fillText(A.n, A.x, A.y + 46); cx.fillText(B.n, B.x, B.y + 46);
      if (d < 42) join();
    } else {
      orb(A, 28 + Math.sin(t / 8) * 5); cx.strokeStyle = "#ffd36b88"; cx.lineWidth = 2; cx.beginPath(); cx.arc(A.x, A.y, 50 + (t % 60), 0, 6.28); cx.stroke();
    }
    P = P.filter(p => p.l > 0); P.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .03; p.l -= .012; cx.globalAlpha = Math.max(p.l, 0); cx.fillStyle = p.c; cx.beginPath(); cx.arc(p.x, p.y, 2.2, 0, 6.28); cx.fill(); }); cx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }
  new IntersectionObserver(es => { go = es[0].isIntersecting; if (go && !running) { running = true; requestAnimationFrame(frame); } }).observe(cv);
})();

/* 🪙 আঁচড় কেটে গোপন কথা দেখো */
(function () {
  const cv = $("scCv"), cx = cv.getContext("2d"); let W = 0, H = 0, done = false, down = false, n = 0;
  function init() {
    if (done || cv.clientWidth === W) return; const d = devicePixelRatio || 1; W = cv.clientWidth; H = cv.clientHeight; cv.width = W * d; cv.height = H * d; cx.setTransform(d, 0, 0, d, 0, 0);
    cx.globalCompositeOperation = "source-over"; const g = cx.createLinearGradient(0, 0, W, H); g.addColorStop(0, "#f6d57a"); g.addColorStop(.5, "#e2a42b"); g.addColorStop(1, "#f6d57a"); cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    cx.fillStyle = "#ffffff88"; for (let i = 0; i < 40; i++) { cx.beginPath(); cx.arc(Math.random() * W, Math.random() * H, 1 + Math.random() * 2, 0, 6.28); cx.fill(); }
    cx.fillStyle = "#7a4a00"; cx.font = "600 22px 'Tiro Bangla',serif"; cx.textAlign = "center"; cx.fillText("🦚 আঁচড় কাটো 🦚", W / 2, H / 2 + 8);
    cx.globalCompositeOperation = "destination-out";
  }
  init(); addEventListener("resize", init);
  function scratch(e) {
    if (!down || done) return; const r = cv.getBoundingClientRect(); cx.beginPath(); cx.arc(e.clientX - r.left, e.clientY - r.top, 24, 0, 6.28); cx.fill();
    if (++n % 12 === 0) check();
  }
  function check() {
    const d = cx.getImageData(0, 0, cv.width, cv.height).data; let c = 0, t = 0;
    for (let i = 3; i < d.length; i += 160) { t++; if (d[i] < 40) c++; }
    if (c / t > .5) { done = true; cv.style.opacity = 0; cv.style.pointerEvents = "none"; for (let k = 0; k < 14; k++) heart(); }
  }
  cv.onpointerdown = e => { down = true; cv.setPointerCapture(e.pointerId); scratch(e); };
  cv.onpointermove = scratch; cv.onpointerup = cv.onpointercancel = () => { down = false; if (!done) check(); };
})();

/* 〰️ গান বাজলে সিক বার ঢেউ খেলে */
(function () {
  const wv = $("waveCv"), wx = wv.getContext("2d"); let W = 0, H = 0, amp = 0, ph = 0;
  function size() { const d = devicePixelRatio || 1; W = wv.clientWidth; H = wv.clientHeight; if (!W) return; wv.width = W * d; wv.height = H * d; wx.setTransform(d, 0, 0, d, 0, 0); }
  function draw() {
    requestAnimationFrame(draw);
    if (!$("np").classList.contains("open")) return;
    if (!W || wv.clientWidth !== W) size(); if (!W) return;
    const playing = !audio.paused && !audio.ended; amp += ((playing ? 5.5 : 0) - amp) * .08; ph += playing ? .14 : .02;
    const p = audio.duration ? audio.currentTime / audio.duration : 0, x1 = Math.max(8, Math.min(W - 8, p * W)), y = H / 2;
    wx.clearRect(0, 0, W, H); wx.lineCap = "round"; wx.lineWidth = 4;
    wx.strokeStyle = "#ffffff55"; wx.shadowBlur = 0; wx.beginPath(); wx.moveTo(x1, y); wx.lineTo(W - 4, y); wx.stroke();
    wx.strokeStyle = "#ffd36b"; wx.shadowColor = "#ffd36b"; wx.shadowBlur = 8; wx.beginPath();
    for (let x = 4; x <= x1; x += 2) { const yy = y + Math.sin(x / 9 - ph) * amp; x === 4 ? wx.moveTo(x, yy) : wx.lineTo(x, yy); } wx.stroke();
    wx.fillStyle = "#fff"; wx.shadowBlur = 14; wx.beginPath(); wx.arc(x1, y + Math.sin(x1 / 9 - ph) * amp, 8, 0, 6.28); wx.fill();
  }
  draw();
})();

/* 🙏 আরাধ্যার জন্য তিন অঞ্জলি: দীপাঞ্জলি, নাম জপ, পুষ্পাঞ্জলি */
(function () {
  const DT = typeof DIYA_TEXT !== "undefined" ? DIYA_TEXT : "সাত জনমের সাতটি প্রদীপ জ্বলল, সব আলো তোমার চরণে, আমার আরাধ্যা 🙏";
  const JT = typeof JAPA_TEXT !== "undefined" ? JAPA_TEXT : "একশো আট বার তোমার নাম নিলাম, তবু মন ভরে না, আমার দেবী 🙏";
  const FT = typeof FLOWER_TEXT !== "undefined" ? FLOWER_TEXT : "একশো আট ফুলের অঞ্জলি, তুমি আমার আরাধ্যা 🌸";
  const NAME = typeof HER_NAME !== "undefined" ? HER_NAME : "";

  const st = document.createElement("style");
  st.textContent = `
.puja-card{position:relative;max-width:560px;margin:1rem auto;border-radius:22px;border:1px solid #e2a42b88;box-shadow:0 12px 36px #0b2a5b33;overflow:hidden}
.puja-card::after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% 100%,#ffcf6baa,transparent 65%);opacity:0;transition:opacity 2s;pointer-events:none}
#diya.all .puja-card::after{opacity:1}
#diya .puja-card{background:radial-gradient(circle at 50% 110%,#4b2f7a,#120d33 70%);padding:2.4rem 1rem 1.6rem}
.diyas{display:flex;justify-content:center;flex-wrap:wrap;gap:.4rem .7rem}
.diya{position:relative;width:64px;height:88px;background:none;padding:0}
.diya svg{position:absolute;left:0;bottom:0;width:64px}
.diya .flame{position:absolute;left:50%;bottom:30px;width:16px;height:30px;margin-left:-8px;border-radius:50% 50% 50% 50%/62% 62% 38% 38%;background:radial-gradient(ellipse at 50% 72%,#fff7c2 0,#ffd04a 40%,#ff7a18 82%,transparent 100%);transform:scale(0);transform-origin:50% 100%;filter:drop-shadow(0 0 10px #ffb02e)}
.diya .halo{position:absolute;left:50%;bottom:14px;width:96px;height:96px;margin-left:-48px;border-radius:50%;background:radial-gradient(circle,#ffb02e77,transparent 65%);opacity:0;transition:opacity .8s;pointer-events:none}
.diya.on .flame{transform:scale(1);animation:flick .16s infinite alternate}
.diya.on .halo{opacity:1}
@keyframes flick{from{transform:scale(1,1) rotate(-3deg)}to{transform:scale(.9,1.1) rotate(3deg)}}
.pm{min-height:3.2rem;margin:1rem auto 0;max-width:520px;font-family:'Tiro Bangla','Noto Serif Bengali',serif;font-size:1.4rem;color:var(--deep);line-height:1.7}
.jsnd{margin-top:.6rem;padding:.5rem 1.1rem;border-radius:99px;background:#ffffffb0;border:1px solid #e2a42b;color:var(--deep);font-family:'Tiro Bangla',serif}
.mala{position:relative;width:280px;height:280px;margin:1rem auto}
#malaRing{position:absolute;inset:0}
.mala i{position:absolute;left:50%;top:50%;width:6px;height:6px;margin:-3px;border-radius:50%;background:#e2a42b66;transition:.3s}
.mala i.on{background:#ffd36b;box-shadow:0 0 8px #ffb02e,0 0 2px #fff}
#japaBtn{position:absolute;left:50%;top:50%;width:156px;height:156px;margin:-78px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff4c2,#ffd36b 40%,#d98f14);color:#4a2a00;box-shadow:0 10px 30px #e2a42b88,inset 0 -6px 14px #b9780f66;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:transform .1s}
#japaBtn:active{transform:scale(.93)}
#japaBtn b{font-family:'Noto Serif Bengali',serif;font-size:2.6rem;line-height:1.1}
#japaBtn span{font-family:'Tiro Bangla',serif;font-size:1rem;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#puspa .puja-card{height:320px;background:linear-gradient(#fff6f8,#ffdbe6)}
.feet{position:absolute;left:50%;bottom:10px;transform:translateX(-50%);width:min(230px,66%);max-height:70%;object-fit:cover;border:4px solid #fffdf5;border-radius:16px;box-shadow:0 0 0 2px #e2a42b99,0 10px 22px #8c2f4b44;pointer-events:none}
.feetph{display:grid;place-items:center;text-align:center;height:150px;padding:1rem;border:2px dashed #d98fa8;color:#a05070;font-size:.95rem;background:#ffffff88;box-shadow:none}
#flCv{position:absolute;inset:0;width:100%;height:100%;cursor:pointer}
.fcount{position:absolute;top:10px;left:0;right:0;text-align:center;font-family:'Tiro Bangla',serif;color:#8c2f4b;pointer-events:none}
body:not(.bloom) #diya .puja-card,body:not(.bloom) #puspa .puja-card{background:#e6e6e6!important;box-shadow:none;border:1px solid #ccc;border-radius:0}
body:not(.bloom) .pm{font-family:Arial,sans-serif;color:#888}
body:not(.bloom) #japaBtn{box-shadow:none}`;
  document.head.appendChild(st);

  $("jar").insertAdjacentHTML("beforebegin", `
  <section id="diya"><h3>দীপাঞ্জলি</h3><p class="hint">প্রদীপগুলো নিজে নিজেই জ্বলে উঠবে, চাইলে তুমিও ছুঁয়ে জ্বালাতে পারো 🪔</p>
    <div class="puja-card"><div class="diyas" id="diyas"></div></div><p class="pm" id="diyaMsg"></p></section>
  <section id="japa"><h3>নাম জপ</h3><p class="hint">তোমার নাম জপ চলছে… ১০৮ বার, বারবার 📿</p>
    <div class="mala"><div id="malaRing"></div><button id="japaBtn"><b id="japaCnt">০</b><span id="japaName"></span></button></div><p class="pm" id="japaMsg"></p><button class="jsnd" id="japaSnd" aria-label="সুর">🔊 রাধে সুর চালু</button></section>
  <section id="puspa"><h3>চরণে পুষ্পাঞ্জলি</h3><p class="hint">ফুল নিজে নিজেই ঝরছে তোমার চরণে, ট্যাপ করলে আরও ঝরবে 🌸</p>
    <div class="puja-card"><div class="fcount" id="flCnt">চরণে ফুল: ০টি</div><img class="feet" id="feetImg" alt=""><canvas id="flCv"></canvas></div><p class="pm" id="flMsg"></p></section>`);
  { /* চরণের আসল ছবি: photos/feet.jpg (jpg/jpeg/png/webp যেকোনোটা চলবে), অন্য নামে দিলে content.js-এ FEET_IMG */
    const im = $("feetImg"), box = im.parentNode;
    const list = typeof FEET_IMG !== "undefined" && FEET_IMG ? [FEET_IMG] : ["photos/feet.jpg", "photos/feet.jpeg", "photos/feet.png", "photos/feet.webp"];
    (function next() {
      if (!list.length) { im.remove(); const ph = document.createElement("div"); ph.className = "feet feetph"; ph.textContent = "📷 এখানে তার চরণের ছবি আসবে (photos/feet.jpg)"; box.insertBefore(ph, $("flCv")); return; }
      im.onerror = next; im.src = list.shift();
    })();
  }
  $("japaName").textContent = NAME;
  const io2 = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); }), { threshold: .12 });
  ["diya", "japa", "puspa"].forEach(id => { const el = $(id); el.classList.add("reveal"); io2.observe(el); });
  const chime = (k) => { try { if (ac && fluteOn && !ducked) note(SCALE[k % SCALE.length], 1.8); } catch (e) { } };
  const buzz = ms => { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) { } };
  const rain = n => { for (let j = 0; j < n; j++) setTimeout(heart, j * 140); };

  /* সেকশনে পৌঁছালে (আর রঙ ফিরলে) নিজে নিজেই চালু, চলে গেলে থেমে যায় */
  const bloomed = () => document.body.classList.contains("bloom");
  function auto(sec, start, stop) {
    let vis = false, on = false;
    new IntersectionObserver(es => { vis = es[0].isIntersecting; }, { threshold: .35 }).observe(sec);
    setInterval(() => {
      const want = vis && bloomed() && !document.hidden;
      if (want && !on) { on = true; start(); } else if (!want && on) { on = false; stop(); }
    }, 400);
  }

  /* ১. দীপাঞ্জলি: সাতটি প্রদীপ নিজে নিজেই একে একে জ্বলে, আবার নিভে, আবার জ্বলে */
  (function () {
    const N = 7, box = $("diyas"); let lit = 0, t = null;
    const bowl = '<svg viewBox="0 0 64 36"><path d="M2 12 Q32 6 62 12 Q58 34 32 34 Q6 34 2 12Z" fill="#c8641e"/><path d="M2 12 Q32 6 62 12 Q32 18 2 12Z" fill="#f0a35e"/><ellipse cx="32" cy="12" rx="6" ry="2" fill="#5a2c0b"/></svg>';
    function light(b) {
      if (b.classList.contains("on")) return; b.classList.add("on"); lit++; chime([...box.children].indexOf(b) + 1);
      if (lit === N) { $("diya").classList.add("all"); $("diyaMsg").textContent = DT; rain(12); }
    }
    function reset() { [...box.children].forEach(b => b.classList.remove("on")); lit = 0; $("diya").classList.remove("all"); $("diyaMsg").textContent = ""; }
    function step() {
      const off = [...box.children].filter(b => !b.classList.contains("on"));
      if (off.length) { light(off[0]); t = setTimeout(step, 1300); }
      else t = setTimeout(() => { reset(); t = setTimeout(step, 1600); }, 6500);
    }
    for (let k = 0; k < N; k++) {
      const b = document.createElement("button"); b.className = "diya"; b.setAttribute("aria-label", "প্রদীপ জ্বালো");
      b.innerHTML = '<span class="halo"></span><span class="flame"></span>' + bowl;
      b.onclick = () => { light(b); buzz(15); };
      box.appendChild(b);
    }
    auto($("diya"), () => { clearTimeout(t); t = setTimeout(step, 500); }, () => clearTimeout(t));
  })();

  /* ২. নাম জপ: ১০৮ বার নিজে নিজেই, বারবার, সাথে পেছনে রাধে সুর (songs/radhe.mp3) */
  (function () {
    const JA = typeof JAPA_AUDIO !== "undefined" ? JAPA_AUDIO : "songs/radhe.mp3";
    const ja = new Audio(JA); ja.loop = true; ja.volume = .75;
    const ring = $("malaRing"), dots = []; let c = 0, done = false, iv = null, jOn = false, muted = false;
    for (let k = 0; k < 108; k++) { const d = document.createElement("i"); d.style.transform = "rotate(" + (k * 360 / 108) + "deg) translateY(-128px)"; ring.appendChild(d); dots.push(d); }
    function reset() { c = 0; done = false; dots.forEach(d => d.classList.remove("on")); $("japaCnt").textContent = bn(0); $("japaMsg").textContent = ""; }
    function tick() {
      if (done) return; c++; dots[c - 1].classList.add("on"); $("japaCnt").textContent = bn(c);
      if (c % 12 === 0) chime(c / 12);
      if (c === 108) { done = true; $("japaMsg").textContent = JT; rain(14); setTimeout(reset, 7000); }
    }
    function play() { if (muted || !audio.paused) { fluteDuck(!audio.paused); return; } ja.play().then(() => fluteDuck(true)).catch(() => { }); }
    function pause() { ja.pause(); fluteDuck(!audio.paused); }
    audio.addEventListener("play", () => ja.pause());
    $("japaBtn").onclick = () => { tick(); buzz(12); };
    $("japaSnd").onclick = () => { muted = !muted; $("japaSnd").textContent = muted ? "🔇 রাধে সুর বন্ধ" : "🔊 রাধে সুর চালু"; if (muted) pause(); else if (jOn) play(); };
    auto($("japa"), () => { jOn = true; clearInterval(iv); iv = setInterval(tick, 500); play(); }, () => { jOn = false; clearInterval(iv); pause(); });
  })();

  /* ৩. পুষ্পাঞ্জলি: ফুল নিজে নিজেই ঝরে, ট্যাপ করলে আরও */
  (function () {
    const cv = $("flCv"), cx = cv.getContext("2d"); let W = 0, H = 0, P = [], n = 0, go = false, running = false, done = false, fi = null;
    const E = ["🌸", "🌺", "🌼", "🌷", "💮"];
    function size() { if (cv.clientWidth === W) return; const d = devicePixelRatio || 1; W = cv.clientWidth; H = cv.clientHeight; cv.width = W * d; cv.height = H * d; cx.setTransform(d, 0, 0, d, 0, 0); }
    size(); addEventListener("resize", size);
    function drop(x) {
      P.push({ x: x + (Math.random() - .5) * 50, y: -20, vy: 1 + Math.random() * 1.3, ph: Math.random() * 6, r: Math.random() * 6, vr: (Math.random() - .5) * .08, e: E[Math.random() * E.length | 0], s: 20 + Math.random() * 14, fl: H - 16 - Math.random() * 44, rest: false });
      if (P.length > 260) P.shift(); n++;
      $("flCnt").textContent = "চরণে ফুল: " + bn(n) + "টি";
      if (n >= 108 && !done) { done = true; $("flMsg").textContent = FT; rain(12); }
    }
    cv.onpointerdown = e => { const r = cv.getBoundingClientRect(), x = e.clientX - r.left; for (let k = 0; k < 3; k++) setTimeout(() => drop(x), k * 90); buzz(10); chime(n % 7); kick(); };
    function frame() {
      if (!go) { running = false; return; }
      cx.clearRect(0, 0, W, H);
      P.forEach(p => {
        if (!p.rest) { p.y += p.vy; p.x += Math.sin(p.y / 28 + p.ph) * .7; p.r += p.vr; if (p.y >= p.fl) { p.y = p.fl; p.rest = true; } }
        cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.font = p.s + "px serif"; cx.textAlign = "center"; cx.fillText(p.e, 0, 0); cx.restore();
      });
      requestAnimationFrame(frame);
    }
    function kick() { if (go && !running) { running = true; requestAnimationFrame(frame); } }
    new IntersectionObserver(es => { go = es[0].isIntersecting; kick(); }).observe(cv);
    auto($("puspa"), () => { clearInterval(fi); fi = setInterval(() => { size(); drop(30 + Math.random() * Math.max(1, W - 60)); kick(); }, 380); }, () => clearInterval(fi));
  })();
})();

/* 🌳 আমাদের পারিজাত: ইন্দ্রলোকের পারিজাতের মতো বিশাল দিব্য গাছ, "চলো, বৃন্দাবনে যাই" চাপার পর নিজে নিজে বেড়ে ওঠে */
(function () {
  const TM = typeof TREE_TEXT !== "undefined" ? TREE_TEXT : "স্বর্গের পারিজাত যেমন কখনও ম্লান হয় না, আমাদের ভালোবাসাও তেমনি 💗";
  const st = document.createElement("style");
  st.textContent = `
.treebox{width:100%;max-width:720px;margin:.3rem auto 0}
@media (max-width:600px){.treebox{width:calc(100% + 2.4rem);max-width:none;margin:.3rem -1.2rem 0}}
#treeSvg{width:100%;height:auto;display:block;overflow:visible;cursor:pointer;touch-action:manipulation}
#treeSvg text{font-family:"Noto Color Emoji","Apple Color Emoji","Segoe UI Emoji",sans-serif}
.br{fill:none;stroke:#8b5a3c;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:1}
.grow .br{animation:tg var(--du,.9s) ease-out var(--d) forwards}
@keyframes tg{to{stroke-dashoffset:0}}
.lf{transform-box:fill-box;transform-origin:50% 50%;transform:scale(0);opacity:0}
.grow .lf{animation:lp .7s cubic-bezier(.3,1.6,.5,1) var(--ld) forwards}
.grow .lf.sw{animation:lp .7s cubic-bezier(.3,1.6,.5,1) var(--ld) forwards,lsw var(--sw) ease-in-out calc(var(--ld) + .7s) infinite alternate}
@keyframes lp{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes lsw{from{transform:scale(1) rotate(-7deg)}to{transform:scale(1) rotate(7deg)}}
#aur{opacity:0;transition:opacity 5s}
.grow #aur{opacity:1}
.tw{opacity:0}
.grow .tw{animation:tw var(--t) ease-in-out var(--td) infinite alternate}
@keyframes tw{from{opacity:.05}to{opacity:1}}
.fh{transform-box:fill-box;opacity:0;animation:fh 4s ease-in forwards}
@keyframes fh{0%{opacity:0;transform:translate(0,0) rotate(0)}12%{opacity:1}100%{opacity:0;transform:translate(var(--dx),var(--dy)) rotate(var(--r))}}
#crown.shake{transform-box:fill-box;transform-origin:50% 100%;animation:tshake .6s}
@keyframes tshake{25%{transform:rotate(-1.8deg)}75%{transform:rotate(1.8deg)}}
body:not(.bloom) #tree .pm{font-family:Arial,sans-serif;color:#888}`;
  document.head.appendChild(st);

  $("orbs").insertAdjacentHTML("beforebegin", `
  <section id="tree"><h3>আমাদের পারিজাত</h3><p class="hint">স্বর্গ থেকে কৃষ্ণ যে পারিজাত এনেছিলেন, তারই মতো এই গাছ… প্রতিটা পাতায় ভালোবাসা, ছুঁয়ে দেখো 💗</p>
    <div class="treebox"><svg id="treeSvg" viewBox="0 0 600 680" role="img" aria-label="পারিজাত বৃক্ষ">
      <defs>
        <radialGradient id="aura" cx="50%" cy="45%" r="55%"><stop offset="0" stop-color="#fff6c8" stop-opacity=".95"/><stop offset=".5" stop-color="#ffd1e6" stop-opacity=".45"/><stop offset="1" stop-color="#ffd1e6" stop-opacity="0"/></radialGradient>
        <radialGradient id="gnd"><stop offset="0" stop-color="#fff3c4" stop-opacity=".95"/><stop offset="1" stop-color="#ffd36b" stop-opacity="0"/></radialGradient>
      </defs>
      <ellipse id="aur" cx="300" cy="290" rx="318" ry="300" fill="url(#aura)"/>
      <g id="stars"></g>
      <ellipse cx="160" cy="656" rx="150" ry="22" fill="url(#gnd)"/><ellipse cx="440" cy="656" rx="150" ry="22" fill="url(#gnd)"/><ellipse cx="300" cy="652" rx="230" ry="24" fill="url(#gnd)"/>
      <g id="trunks"></g><g id="crown"></g><g id="fallG"></g></svg></div>
    <p class="pm" id="treeMsg"></p></section>`);
  const io3 = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); }), { threshold: .05 });
  { const el = $("tree"); el.classList.add("reveal"); io3.observe(el); }

  const NS = "http://www.w3.org/2000/svg", GY = 640, svg = $("treeSvg"), br = $("trunks"), crown = $("crown"), fall = $("fallG"), stars = $("stars");
  const H = ["💗", "💖", "💕", "💞", "💓", "❤️"], BL = ["🌸", "💮"], tips = [];
  let seed = 23; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const mk = (tag, at, par) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); par.appendChild(e); return e; };
  for (let k = 0; k < 40; k++) { const c = mk("circle", { cx: (rnd() * 600).toFixed(0), cy: (rnd() * 560).toFixed(0), r: (1 + rnd() * 2).toFixed(1), fill: "#fff2b0", "class": "tw" }, stars); c.style.setProperty("--t", (1.6 + rnd() * 2.4).toFixed(1) + "s"); c.style.setProperty("--td", (3 + rnd() * 5).toFixed(1) + "s"); }
  function leaf(x, y, d) {
    const r = rnd(), g = r < .66 ? H[Math.floor(rnd() * H.length)] : (r < .86 ? BL[Math.floor(rnd() * BL.length)] : "✨");
    const t = mk("text", { x: x.toFixed(1), y: y.toFixed(1), "font-size": (18 + rnd() * 16).toFixed(0), "text-anchor": "middle", "class": "lf" + (rnd() > .5 ? " sw" : "") }, crown);
    t.textContent = g; t.style.setProperty("--ld", (d * .75 + .6 + rnd() * .7).toFixed(2) + "s"); t.style.setProperty("--sw", (2.4 + rnd() * 2.2).toFixed(1) + "s");
    if (g !== "✨") tips.push([x, y]);
  }
  function branch(x, y, a, len, d, w) {
    const x2 = x + Math.sin(a) * len, y2 = y - Math.cos(a) * len, cx = x + Math.sin(a + .15) * len * .5, cy = y - Math.cos(a + .15) * len * .5;
    const p = mk("path", { d: "M" + x.toFixed(1) + " " + y.toFixed(1) + " Q" + cx.toFixed(1) + " " + cy.toFixed(1) + " " + x2.toFixed(1) + " " + y2.toFixed(1), pathLength: 1, "stroke-width": w.toFixed(1), "class": "br" }, br);
    p.style.setProperty("--d", (d * .75).toFixed(2) + "s"); if (d === 0) p.style.setProperty("--du", "1.6s");
    if (d >= 2) { const n = d === 2 ? 1 : (d <= 4 ? 2 : (d === 5 ? 3 : 2)); for (let k = 0; k < n; k++) leaf(x2 + (rnd() - .5) * 30, y2 + (rnd() - .5) * 26, d); }
    if (d < 6) {
      const dl = .5 - .06 * d, base = a * .82;
      branch(x2, y2, base - (dl + rnd() * .1), len * .76, d + 1, w * .7);
      branch(x2, y2, base + (dl + rnd() * .1), len * .76, d + 1, w * .7);
    }
  }
  ["M300 640 Q258 648 196 668", "M300 640 Q342 648 404 668", "M296 640 Q276 656 246 676", "M304 640 Q324 656 354 676"].forEach((d, k) => { const p = mk("path", { d: d, pathLength: 1, "stroke-width": k < 2 ? 13 : 8, "class": "br" }, br); p.style.setProperty("--d", "0s"); p.style.setProperty("--du", "1.6s"); });
  branch(300, GY, 0, 150, 0, 28);

  let grown = false, vis = false;
  function grow() { if (grown) return; grown = true; svg.classList.add("grow"); setTimeout(() => { $("treeMsg").textContent = TM; }, 7500); }
  $("enter").addEventListener("click", () => setTimeout(grow, 700));
  new IntersectionObserver(es => { vis = es[0].isIntersecting; }, { threshold: .1 }).observe(svg);
  function drop() {
    if (!tips.length) return; const [x, y] = tips[Math.floor(Math.random() * tips.length)];
    const t = mk("text", { x: x.toFixed(1), y: y.toFixed(1), "font-size": (16 + Math.random() * 12).toFixed(0), "text-anchor": "middle", "class": "fh" }, fall);
    t.textContent = Math.random() < .75 ? H[Math.floor(Math.random() * H.length)] : BL[Math.floor(Math.random() * BL.length)];
    t.style.setProperty("--dx", ((Math.random() - .5) * 90).toFixed(0) + "px"); t.style.setProperty("--dy", (GY + 8 - y).toFixed(0) + "px"); t.style.setProperty("--r", ((Math.random() - .5) * 160).toFixed(0) + "deg");
    setTimeout(() => t.remove(), 4200);
  }
  setInterval(() => { if (grown && vis && !document.hidden) { drop(); if (Math.random() < .5) drop(); } }, 800);
  svg.addEventListener("pointerdown", () => {
    if (!grown) return; for (let k = 0; k < 14; k++) setTimeout(drop, k * 60);
    crown.classList.remove("shake"); void crown.getBoundingClientRect(); crown.classList.add("shake");
    try { navigator.vibrate && navigator.vibrate(12); } catch (e) { }
  });
})();