/* AIMCryptoAI UI + Demo Auth (localStorage) */

const LS_USER = "aim_user";
const LS_SESSION = "aim_session";

function qs(sel){ return document.querySelector(sel); }
function qsa(sel){ return Array.from(document.querySelectorAll(sel)); }

function toast(msg, type="ok"){
  let el = qs(".toast");
  if(!el){
    el = document.createElement("div");
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.classList.remove("ok","bad","show");
  el.classList.add(type === "bad" ? "bad" : "ok");
  el.textContent = msg;
  requestAnimationFrame(()=> el.classList.add("show"));
  setTimeout(()=> el.classList.remove("show"), 2200);
}

function setUser(email, password){
  localStorage.setItem(LS_USER, JSON.stringify({email, password}));
}
function getUser(){
  try { return JSON.parse(localStorage.getItem(LS_USER) || "null"); }
  catch(e){ return null; }
}
function setSession(email){
  localStorage.setItem(LS_SESSION, JSON.stringify({email, at: Date.now()}));
}
function getSession(){
  try { return JSON.parse(localStorage.getItem(LS_SESSION) || "null"); }
  catch(e){ return null; }
}
function clearSession(){
  localStorage.removeItem(LS_SESSION);
}

function requireAuth(){
  const session = getSession();
  if(!session){
    window.location.href = "login.html";
  }
}

function wireLogout(){
  qsa('[data-action="logout"]').forEach(btn=>{
    btn.addEventListener("click", (e)=>{
      e.preventDefault();
      clearSession();
      toast("Logged out", "ok");
      setTimeout(()=> window.location.href="login.html", 400);
    });
  });
}

function wireLogin(){
  const form = qs("#loginForm");
  if(!form) return;

  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const email = (qs("#loginEmail")?.value || "").trim();
    const pass  = (qs("#loginPass")?.value || "").trim();
    const saved = getUser();

    if(!saved){
      toast("No account found. Please sign up first.", "bad");
      return;
    }
    if(email.toLowerCase() !== saved.email.toLowerCase() || pass !== saved.password){
      toast("Invalid email or password", "bad");
      return;
    }
    setSession(saved.email);
    toast("Login successful", "ok");
    setTimeout(()=> window.location.href="dashboard.html", 450);
  });

  const demoBtn = qs("#demoBtn");
  if(demoBtn){
    demoBtn.addEventListener("click", ()=>{
      // demo account always works
      setSession("demo@aimcryptoai.app");
      toast("Demo session started", "ok");
      setTimeout(()=> window.location.href="dashboard.html", 450);
    });
  }
}

function wireSignup(){
  const form = qs("#signupForm");
  if(!form) return;

  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const email = (qs("#signupEmail")?.value || "").trim();
    const pass  = (qs("#signupPass")?.value || "").trim();
    const pass2 = (qs("#signupPass2")?.value || "").trim();

    if(!email || !pass){
      toast("Please fill all fields", "bad");
      return;
    }
    if(pass.length < 6){
      toast("Password must be at least 6 characters", "bad");
      return;
    }
    if(pass !== pass2){
      toast("Passwords do not match", "bad");
      return;
    }
    setUser(email, pass);
    setSession(email);
    toast("Account created", "ok");
    setTimeout(()=> window.location.href="dashboard.html", 450);
  });
}

function wireGuards(){
  const page = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  const protectedPages = ["dashboard.html","payments.html","profile.html","tournaments.html"];
  if(protectedPages.includes(page)) requireAuth();
}

/* init */
document.addEventListener("DOMContentLoaded", ()=>{
  wireGuards();
  wireLogout();
  wireLogin();
  wireSignup();
});
