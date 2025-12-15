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
