/* ===== সারপ্রাইজের তালা ===== */
const LOCK_ENABLED = false; // তালা চালু। খুলবে ২৮ অক্টোবর রাত ১১:৫৯টায়। পরীক্ষার সময় বন্ধ করতে false লেখো
const UNLOCK = new Date("2026-10-28T23:59:00+05:30"); // কবে খুলবে: ২৮ অক্টোবর রাত ১১:৫৯ (ভারতীয় সময়)
const ANNIV = UNLOCK;
const TEST_KEY = "CHANGE-ME-2910"; // শুধু তুমি পরীক্ষা করতে: তোমার-লিংক/?key=CHANGE-ME-2910 (এটা নিজের মতো বদলে নাও)
const PREVIEW = false;
let OFFSET = 0; // ফোনের ঘড়ি নয়, GitHub সার্ভারের ঘড়ি ধরা হয়, তাই তারিখ বদলে চালাকি চলবে না
const now = () => new Date(Date.now() + OFFSET);
const L = id => document.getElementById(id);
const bnum = n => n.toLocaleString("bn-IN");
async function sync() {
  try {
    const sig = AbortSignal.timeout ? AbortSignal.timeout(3000) : undefined;
    const r = await fetch(location.href.split("#")[0], { method: "HEAD", cache: "no-store", signal: sig });
    const d = r.headers.get("Date"); if (d) OFFSET = new Date(d).getTime() - Date.now();
  } catch (e) { }
}
function loadJS(name) {
  return new Promise((ok, fail) => {
    const el = document.createElement("script"), emb = L("src-" + name);
    if (emb) { el.textContent = emb.textContent; document.body.appendChild(el); ok(); }
    else { el.src = name + ".js"; el.onload = ok; el.onerror = fail; document.body.appendChild(el); }
  });
}
let opened = false;
function unlock() {
  if (opened) return; opened = true;
  document.title = "দুই মাসের প্রেম 🦚";
  document.body.classList.remove("locked");
  const k = L("lock"); if (k) { if (!LOCK_ENABLED) k.remove(); else { k.classList.add("gone"); setTimeout(() => k.remove(), 1600); } }
  loadJS("content").then(() => loadJS("script")).catch(() => { });
}
function tickLock() {
  const d = UNLOCK - now(); if (d <= 0) { unlock(); return; }
  const v = [["দিন", Math.floor(d / 864e5)], ["ঘণ্টা", Math.floor(d / 36e5) % 24], ["মিনিট", Math.floor(d / 6e4) % 60], ["সেকেন্ড", Math.floor(d / 1e3) % 60]];
  L("lkCount").innerHTML = v.map(([l, n]) => `<div><b>${bnum(n)}</b>${l}</div>`).join("");
}
(async () => {
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => { });
  if (!LOCK_ENABLED || new URLSearchParams(location.search).get("key") === TEST_KEY) return unlock();
  await sync(); tickLock(); setInterval(tickLock, 1000);
  if (PREVIEW) { const b = document.createElement("button"); b.className = "pv"; b.textContent = "👀 প্রিভিউ: এখনই খুলে দেখো"; b.onclick = unlock; L("lock").appendChild(b); }
})();
