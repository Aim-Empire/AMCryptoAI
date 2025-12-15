(function(){
  // ---------- Toast ----------
  function toast(msg){
    const box = document.querySelector("[data-toastbox]");
    const text = document.querySelector("[data-toasttext]");
    if(!box || !text) return alert(msg);
    text.textContent = msg;
    box.hidden = false;
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(()=>{ box.hidden = true; }, 2200);
  }

  // Toast hooks
  document.addEventListener("click", (e)=>{
    const el = e.target.closest("[data-toast]");
    if(el) toast(el.getAttribute("data-toast"));
  });

  // ---------- Mobile menu ----------
  const menuBtn = document.querySelector("[data-menu-btn]");
  const menu = document.querySelector("[data-menu]");
  if(menuBtn && menu){
    menuBtn.addEventListener("click", ()=>{
      const open = menu.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("click", (e)=>{
      if(!menu.classList.contains("open")) return;
      if(e.target.closest("[data-menu]") || e.target.closest("[data-menu-btn]")) return;
      menu.classList.remove("open");
      menuBtn.setAttribute("aria-expanded","false");
    });
  }

  // ---------- Local Auth (Demo-ready) ----------
  const STORAGE_KEY = "aimcryptoai_user";
  const LOGIN_KEY = "aimcryptoai_logged_in";

  function getUser(){
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); }
    catch { return null; }
  }
  function setUser(u){ localStorage.setItem(STORAGE_KEY, JSON.stringify(u)); }
  function isLoggedIn(){ return localStorage.getItem(LOGIN_KEY) === "1"; }
  function setLoggedIn(val){ localStorage.setItem(LOGIN_KEY, val ? "1" : "0"); }

  function goDashboard(){ window.location.href = "dashboard.html"; }

  function logout(){
    setLoggedIn(false);
    toast("Logged out ✅");
    setTimeout(()=>{ window.location.href = "login.html"; }, 450);
  }

  // ---------- Page protection ----------
  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const publicPages = new Set(["index.html","login.html","signup.html",""]);

  if(!publicPages.has(page)){
    if(!isLoggedIn()){
      window.location.replace("login.html");
      return;
    }
  }

  // ---------- Signup ----------
  const signupForm = document.getElementById("signupForm");
  if(signupForm){
    signupForm.addEventListener("submit", (e)=>{
      e.preventDefault();
      const fd = new FormData(signupForm);
      const name = String(fd.get("name")||"").trim();
      const email = String(fd.get("email")||"").trim().toLowerCase();
      const pass = String(fd.get("password")||"");
      const confirm = String(fd.get("confirm")||"");
      const terms = fd.get("terms");

      if(name.length < 2) return toast("Enter your full name.");
      if(!email.includes("@")) return toast("Enter a valid email.");
      if(pass.length < 6) return toast("Password must be at least 6 characters.");
      if(pass !== confirm) return toast("Passwords do not match.");
      if(!terms) return toast("Please accept the terms.");

      setUser({ name, email, pass, createdAt: Date.now() });
      setLoggedIn(true);
      toast("Account created ✅ Opening dashboard...");
      setTimeout(goDashboard, 650);
    });
  }

  // ---------- Login ----------
  const loginForm = document.getElementById("loginForm");
  if(loginForm){
    loginForm.addEventListener("submit", (e)=>{
      e.preventDefault();
      const fd = new FormData(loginForm);
      const email = String(fd.get("email")||"").trim().toLowerCase();
      const pass = String(fd.get("password")||"");

      const u = getUser();
      if(!u) return toast("No account found. Please sign up first.");
      if(u.email !== email || u.pass !== pass) return toast("Invalid email or password.");

      setLoggedIn(true);
      toast("Login successful ✅ Opening dashboard...");
      setTimeout(goDashboard, 650);
    });

    const demoBtn = document.getElementById("demoBtn");
    if(demoBtn){
      demoBtn.addEventListener("click", ()=>{
        setUser({ name:"Demo User", email:"demo@aimcryptoai.com", pass:"demo123", createdAt: Date.now() });
        setLoggedIn(true);
        toast("Demo access enabled ✅ Opening dashboard...");
        setTimeout(goDashboard, 650);
      });
    }
  }

  // ---------- User badge + auto-fill profile fields ----------
  function escapeHtml(str){
    return String(str)
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll("\"","&quot;")
      .replaceAll("\x27","&#039;");
  }

  function injectUserBadge(){
    if(publicPages.has(page)) return;
    if(document.querySelector(".userbadge")) return;

    const u = getUser() || { name:"User", email:"unknown@aimcryptoai.com" };

    const badge = document.createElement("div");
    badge.className = "userbadge";
    badge.innerHTML = `
      <div class="userbadge__row">
        <div>
          <div class="userbadge__name">${escapeHtml(u.name || "User")}</div>
          <div class="userbadge__email">${escapeHtml(u.email || "")}</div>
        </div>
        <div class="userbadge__tag">ACCOUNT</div>
      </div>
      <div class="userbadge__actions">
        <button class="btn btn--ghost btn--full" type="button" id="userBadgeLogout">Logout</button>
      </div>
    `;
    document.body.appendChild(badge);

    const out = document.getElementById("userBadgeLogout");
    if(out) out.addEventListener("click", logout);
  }

  function autofillProfile(){
    if(page !== "profile.html") return;
    const u = getUser();
    if(!u) return;

    // Try common ids if present
    const nameEl = document.querySelector("#fullName, #name, [name=\"fullName\"], [name=\"name\"]");
    const emailEl = document.querySelector("#email, #userEmail, [name=\"email\"]");
    if(nameEl && !nameEl.value) nameEl.value = u.name || "";
    if(emailEl && !emailEl.value) emailEl.value = u.email || "";
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    injectUserBadge();
    autofillProfile();
  });

  // allow any element to trigger logout
  document.addEventListener("click", (e)=>{
    const el = e.target.closest("[data-logout], #logoutBtn");
    if(el){ e.preventDefault(); logout(); }
  });

})();

/* ===== AIM_CHART_ANIM ===== */
(function(){
  function rnd(n){ return (Math.random()-0.5)*n; }
  function tickText(el, base, dp){
    if(!el) return;
    let v = parseFloat(String(el.textContent).replace(/[^0-9.]/g,"")) || base;
    v = Math.max(0.01, v + rnd(base*0.003));
    el.textContent = "$" + v.toFixed(dp);
  }
  function tickChg(el){
    if(!el) return;
    let v = (Math.random()*4 - 2);
    el.textContent = (v>=0?"+":"") + v.toFixed(1) + "%";
    el.classList.remove("up","down","flat");
    el.classList.add(v>0.2?"up":(v<-0.2?"down":"flat"));
  }

  function initChart(){
    const canvas = document.getElementById("aimLiveChart");
    if(!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    let mode = "BTC";

    document.querySelectorAll("[data-chart]").forEach(btn=>{
      btn.addEventListener("click", ()=>{ mode = btn.getAttribute("data-chart") || "BTC"; });
    });

    let data = new Array(80).fill(0).map((_,i)=> 100 + i*0.2 + (Math.sin(i/6)*4));
    function step(){
      const last = data[data.length-1];
      const drift = (mode==="BTC") ? 0.25 : 0.18;
      const vol   = (mode==="BTC") ? 1.2  : 1.6;
      const next = last + drift + (Math.random()-0.5)*vol;
      data.push(next);
      if(data.length>90) data.shift();
    }

    function draw(){
      ctx.clearRect(0,0,W,H);
      ctx.globalAlpha = 0.8;
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      for(let i=1;i<6;i++){
        const y = (H/6)*i;
        ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke();
      }

      const min = Math.min(...data), max = Math.max(...data);
      const pad = 22;
      const scale = (v)=> {
        const t = (v-min)/Math.max(0.0001,(max-min));
        return H - pad - t*(H - pad*2);
      };

      ctx.strokeStyle = "rgba(31,211,106,0.95)";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      data.forEach((v,i)=>{
        const x = (W/(data.length-1))*i;
        const y = scale(v);
        if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      });
      ctx.stroke();

      ctx.strokeStyle = "rgba(31,211,106,0.18)";
      ctx.lineWidth = 8;
      ctx.beginPath();
      data.forEach((v,i)=>{
        const x = (W/(data.length-1))*i;
        const y = scale(v);
        if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      });
      ctx.stroke();

      const ly = scale(data[data.length-1]);
      ctx.fillStyle = "rgba(31,211,106,0.95)";
      ctx.beginPath(); ctx.arc(W,ly,4,0,Math.PI*2); ctx.fill();

      requestAnimationFrame(draw);
    }

    setInterval(step, 650);
    draw();
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    initChart();
    const btc = document.querySelector("[data-live=btc]");
    const eth = document.querySelector("[data-live=eth]");
    const sol = document.querySelector("[data-live=sol]");
    const cb  = document.querySelector("[data-chg=btc]");
    const ce  = document.querySelector("[data-chg=eth]");
    const cs  = document.querySelector("[data-chg=sol]");

    if(btc || eth || sol){
      setInterval(()=>{
        tickText(btc, 42180, 0); tickChg(cb);
        tickText(eth, 2280, 0);  tickChg(ce);
        tickText(sol, 98.2, 1);  tickChg(cs);
      }, 1200);
    }
  });
})();

/* ===== AIM_BALANCE_STORE ===== */
(function(){
  const KEY_BAL = "aimcryptoai_balance";

  function getBalance(){
    const v = Number(localStorage.getItem(KEY_BAL));
    return Number.isFinite(v) ? v : 0;
  }
  function setBalance(n){
    const v = Number(n);
    localStorage.setItem(KEY_BAL, String(Number.isFinite(v) ? v : 0));
  }
  function fmtUSD(n){
    const v = Number(n);
    const x = Number.isFinite(v) ? v : 0;
    return "$" + x.toLocaleString(undefined,{minimumFractionDigits:2, maximumFractionDigits:2});
  }

  // On dashboard: replace the visible Total Balance number with stored balance
  function paintDashboardBalance(){
    const el = document.querySelector(".dashCard__big"); // your total balance element
    if(el && /\\$/.test(el.textContent) || el){
      // Only update if it looks like the total balance card
      // (safe: first big money on dashboard)
      el.textContent = fmtUSD(getBalance());
    }
  }

  // Simple toast hookup (if your toast exists)
  function toast(msg){
    const box = document.querySelector("[data-toastbox]");
    const txt = document.querySelector("[data-toasttext]");
    if(!box || !txt){ alert(msg); return; }
    txt.textContent = msg;
    box.hidden = false;
    clearTimeout(window.__aimToastT);
    window.__aimToastT = setTimeout(()=> box.hidden = true, 1800);
  }

  // On payments page: demo add funds via clicking "Use" buttons or deposit button
  function hookPayments(){
    if(!/payments\\.html/i.test(location.pathname)) return;

    // If there are buttons with text "Use" (your deposit methods), add click behavior
    document.querySelectorAll("button, a").forEach(btn=>{
      const t = (btn.textContent||"").trim().toLowerCase();
      if(t === "use" || t.includes("deposit")){
        btn.addEventListener("click", (e)=>{
          // prevent navigation if it is a button-like link
          if(btn.tagName === "A") e.preventDefault();

          // add a demo amount
          const add = 50; // default demo deposit
          const nb = getBalance() + add;
          setBalance(nb);
          toast("✅ Deposit received: " + fmtUSD(add));
        }, {passive:false});
      }
    });
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    // Ensure default balance exists
    if(localStorage.getItem(KEY_BAL) === null) setBalance(0);

    paintDashboardBalance();
    hookPayments();
  });

  // expose for later if needed
  window.AIMBAL = { getBalance, setBalance, fmtUSD };
})();

/* ===== POPUP BUTTON WIRING (SAFE) ===== */
document.addEventListener("DOMContentLoaded", ()=>{

  function go(url){
    window.location.href = url;
  }

  document.querySelectorAll("button, a").forEach(el=>{
    const t = (el.textContent||"").toLowerCase();

    if(t.includes("deposit") || t.includes("fund wallet")){
      el.addEventListener("click", e=>{
        e.preventDefault();
        go("payments.html#deposit");
      });
    }

    if(t.includes("withdraw")){
      el.addEventListener("click", e=>{
        e.preventDefault();
        go("payments.html#withdraw");
      });
    }

    if(t.includes("convert")){
      el.addEventListener("click", e=>{
        e.preventDefault();
        go("payments.html#convert");
      });
    }

    if(t.includes("kyc")){
      el.addEventListener("click", e=>{
        e.preventDefault();
        go("profile.html#kyc");
      });
    }
  });

});
/* ===== END SAFE POPUP WIRING ===== */

/* ===== AIM_MENU_FIX ===== */
document.addEventListener("DOMContentLoaded", ()=>{
  const btn = document.querySelector("[data-menu-btn]");
  const menu = document.querySelector("[data-menu]");
  if(btn && menu){
    function openMenu(){
      menu.classList.add("open");
      btn.setAttribute("aria-expanded","true");
      document.body.style.overflow="hidden";
    }
    function closeMenu(){
      menu.classList.remove("open");
      btn.setAttribute("aria-expanded","false");
      document.body.style.overflow="";
    }
    btn.addEventListener("click", ()=>{
      menu.classList.contains("open") ? closeMenu() : openMenu();
    });
    // close when tapping background overlay
    menu.addEventListener("click",(e)=>{
      if(e.target === menu) closeMenu();
    });
    // close on link click
    menu.querySelectorAll("a").forEach(a=>{
      a.addEventListener("click", ()=> closeMenu());
    });
    // escape close
    document.addEventListener("keydown",(e)=>{
      if(e.key==="Escape") closeMenu();
    });
  }
});
/* ===== END AIM_MENU_FIX ===== */
