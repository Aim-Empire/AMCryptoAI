(function(){
  // ---------- Toast ----------
  function toast(msg){
    const box = document.querySelector("[data-toastbox]");
    const text = document.querySelector("[data-toasttext]");
    if(!box || !text) return alert(msg);
    text.textContent = msg;
    box.hidden = false;
    box.classList.remove("show");
    // simple reflow
    void box.offsetWidth;
    box.classList.add("show");
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
    // click outside to close
    document.addEventListener("click", (e)=>{
      if(!menu.classList.contains("open")) return;
      if(e.target.closest("[data-menu]") || e.target.closest("[data-menu-btn]")) return;
      menu.classList.remove("open");
      menuBtn.setAttribute("aria-expanded","false");
    });
  }

  // ---------- Local Auth (Demo-ready) ----------
  const STORAGE_KEY = "aimcryptoai_user";

  function getUser(){
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); }
    catch { return null; }
  }

  function setUser(u){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  }

  function setLoggedIn(val){
    localStorage.setItem("aimcryptoai_logged_in", val ? "1" : "0");
  }

  function goDashboard(){
    // keep it simple: open dashboard.html
    window.location.href = "dashboard.html";
  }

  // Signup
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

  // Login
  const loginForm = document.getElementById("loginForm");
  if(loginForm){
    loginForm.addEventListener("submit", (e)=>{
      e.preventDefault();
      const fd = new FormData(loginForm);
      const email = String(fd.get("email")||"").trim().toLowerCase();
      const pass = String(fd.get("password")||"");

      const u = getUser();
      if(!u){
        toast("No account found. Please sign up first.");
        return;
      }
      if(u.email !== email || u.pass !== pass){
        toast("Invalid email or password.");
        return;
      }

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

  // Optional: protect internal pages in future (not blocking yet)
})();
