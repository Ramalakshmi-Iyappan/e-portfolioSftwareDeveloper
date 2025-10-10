performance.mark('app-start');
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar .nav-link').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

  const linkedinBtn = document.getElementById('linkedinBtn');
  if (linkedinBtn) {
    linkedinBtn.href = 'https://www.linkedin.com/in/Ramalakshmi-iyappan/';
  }

    

  

    

const form = document.getElementById('contactForm');
const thankYou = document.getElementById('thankYou');

function validateField(input){
  let valid = true;
  if (input.id === 'email'){
    const v = String(input.value||'').trim();
    valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  } else {
    valid = String(input.value||'').trim().length > 0;
  }
  input.classList.toggle('is-valid', valid);
  input.classList.toggle('is-invalid', !valid);
  return valid;
}

if (form) {
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const msg = document.getElementById('message');

  [name, email, msg].forEach(el => {
    el.addEventListener('input', () => validateField(el));
    el.classList.remove('is-valid','is-invalid'); // clean state on load
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = [name, email, msg].map(validateField).every(Boolean);

    localStorage.setItem('Name',name.value);
    console.log(name.value);

    if (!ok) return;

    if (thankYou) {
      thankYou.classList.remove('d-none');
      thankYou.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    form.reset();
    [name, email, msg].forEach(el => el.classList.remove('is-valid','is-invalid'));
  });

function greet(){
    
    const greetMessage = document.querySelector("#greetMessage");
    let localName = localStorage.getItem('Name');
    greetMessage.textContent = `Hello ${localName}, Welcome!`;
}

greet();

localStorage.setItem("Message","Hello World");

} 
});

// ---------- Pop-the-Bubbles (fixed for HiDPI; score + reset + sound) ----------
(function popBubbles(){
  const canvas = document.getElementById('miniGame');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // UI
  const scoreBadge = document.getElementById('scoreBadge');
  const resetBtn   = document.getElementById('resetBubbles');
  const toggleBtn  = document.getElementById('soundToggle');

  // Score
  let score = 0;
  const updateScore = (v=score) => {
    score = v;
    if (scoreBadge) scoreBadge.textContent = `Score: ${score}`;
  };
  updateScore(0);

  // Sound
  let muted = localStorage.getItem('bubbles_mute') === '1';
  const renderSoundLabel = () => {
    if (!toggleBtn) return;
    toggleBtn.textContent = muted ? '🔇 Sound: Off' : '🔊 Sound: On';
    toggleBtn.classList.toggle('btn-outline-danger', muted);
    toggleBtn.classList.toggle('btn-outline-secondary', !muted);
  };
  toggleBtn?.addEventListener('click', () => {
    muted = !muted;
    localStorage.setItem('bubbles_mute', muted ? '1' : '0');
    renderSoundLabel();
  });
  renderSoundLabel();

  // Synth pop
  let actx = null;
  function playPop(){
    if (muted) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const now = actx.currentTime;
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      const base = 380 + Math.random() * 320;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(base, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.25, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
      osc.connect(gain).connect(actx.destination);
      osc.start(now); osc.stop(now + 0.16);
    } catch {}
  }

  // Canvas sizing (work in CSS pixels)
  let cssW = canvas.clientWidth || canvas.width;
  let cssH = canvas.clientHeight || canvas.height;
  function fitCanvas(){
    const rect = canvas.getBoundingClientRect();
    cssW = Math.max(1, Math.floor(rect.width));
    cssH = Math.max(1, Math.floor(rect.height));
    const pr = window.devicePixelRatio || 1;
    canvas.width  = Math.round(cssW * pr);
    canvas.height = Math.round(cssH * pr);
    // Scale so 1 unit == 1 CSS pixel
    ctx.setTransform(pr, 0, 0, pr, 0, 0);
  }

  // Bubbles & particles use CSS px coords
  const palette = [
    'rgba(99,102,241,0.18)','rgba(59,130,246,0.18)','rgba(16,185,129,0.18)',
    'rgba(236,72,153,0.18)','rgba(234,179,8,0.18)',
  ];
  const makeBubble = () => {
    const r = 10 + Math.random() * 22;
    return {
      x: Math.random() * cssW,
      y: cssH + Math.random() * cssH * 0.4,
      r,
      vy: -(0.35 + Math.random() * 0.8),
      vx: (Math.random() - 0.5) * 0.4,
      col: palette[(Math.random() * palette.length) | 0],
    };
  };

  let bubbles = [];
  let particles = [];
  function resetBubblesState(){
    bubbles.length = 0;
    particles.length = 0;
    const count = Math.max(18, Math.floor((cssW || 400) / 24));
    for (let i = 0; i < count; i++) bubbles.push(makeBubble());
  }
  resetBtn?.addEventListener('click', () => { updateScore(0); resetBubblesState(); });

  // Pointer & hover
  let mx = 0, my = 0;
  canvas.addEventListener('mousemove', (e)=>{
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    mx = x / (rect.width || 1) - 0.5;
    my = y / (rect.height || 1) - 0.5;
    const near = bubbles.some(b => {
      const dx = x - b.x, dy = y - b.y;
      return dx*dx + dy*dy <= (b.r + 8) * (b.r + 8);
    });
    canvas.style.cursor = near ? 'pointer' : 'default';
  });
  function pointerPos(evt){
    const rect = canvas.getBoundingClientRect();
    const cx = evt.clientX ?? evt.touches?.[0]?.clientX;
    const cy = evt.clientY ?? evt.touches?.[0]?.clientY;
    return { x: cx - rect.left, y: cy - rect.top };
  }

  function spawnParticles(x, y, baseColor){
    const N = 12 + (Math.random() * 12)|0;
    for (let i=0;i<N;i++){
      const ang = (Math.PI * 2 * i) / N + Math.random()*0.3;
      const spd = 1 + Math.random()*2.4;
      particles.push({
        x, y, vx: Math.cos(ang)*spd, vy: Math.sin(ang)*spd, life: 1,
        col: baseColor.replace(/0\.18\)$/, '0.55)'),
      });
    }
  }

  function popAt(x, y){
    for (let i=bubbles.length-1; i>=0; i--){
      const b = bubbles[i];
      const dx = x - b.x, dy = y - b.y;
      if (dx*dx + dy*dy <= b.r*b.r){
        updateScore(score + 1);
        playPop();
        spawnParticles(b.x, b.y, b.col);
        const nb = makeBubble(); nb.y = cssH + nb.r;
        bubbles[i] = nb;
        break;
      }
    }
  }
  canvas.addEventListener('pointerdown', e => { const p = pointerPos(e); popAt(p.x, p.y); });
  canvas.addEventListener('mousedown',   e => { const p = pointerPos(e); popAt(p.x, p.y); });
  canvas.addEventListener('touchstart',  e => { const p = pointerPos(e); popAt(p.x, p.y); e.preventDefault(); }, { passive:false });

  function drawBackground(){
    ctx.clearRect(0,0,cssW,cssH);
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fillRect(0,0,cssW,cssH);
  }

  function step(){
    drawBackground();

    // bubbles
    for (const b of bubbles){
      b.x += b.vx + mx * 0.2;
      b.y += b.vy + my * -0.2;
      if (b.y + b.r < 0 || b.x < -60 || b.x > cssW + 60){
        const nb = makeBubble(); nb.y = cssH + nb.r + Math.random() * cssH * 0.25;
        nb.x = Math.random() * cssW; Object.assign(b, nb);
      }
      ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2); ctx.fillStyle = b.col; ctx.fill();
      ctx.beginPath(); ctx.arc(b.x - b.r*0.35, b.y - b.r*0.35, b.r*0.35, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fill();
    }

    // particles
    for (let i=particles.length-1; i>=0; i--){
      const p = particles[i];
      p.x += p.vx; p.y += p.vy; p.vy += 0.02; p.life -= 0.02;
      if (p.life <= 0){ particles.splice(i,1); continue; }
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.col; ctx.beginPath(); ctx.arc(p.x,p.y,2.2,0,Math.PI*2); ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  let rafId = 0;
  const loop = () => { step(); rafId = requestAnimationFrame(loop); };

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(rafId); else loop();
  });
  window.addEventListener('resize', () => { fitCanvas(); resetBubblesState(); });

  fitCanvas();
  resetBubblesState();
  loop();
})();




function showSection(section) {
    const sections = ['education', 'experience'];
    sections.forEach(id => {
      document.getElementById(id).classList.toggle('d-none', id !== section);
      document.getElementById(id + '-tab').classList.toggle('active', id === section);
    });
  }

//     const worker = new Worker('worker.js');

//     function checkIfPrime() {
//       const input = document.getElementById('numberInput').value;
//       const number = parseInt(input);

//       if (isNaN(number)) {
//         document.getElementById('resultText').textContent = 'Please enter a valid number.';
//         return;
//       }

//       document.getElementById('resultText').textContent = 'Checking...';

//       worker.postMessage(number);
//     }

//     worker.onmessage = function(event) {
//       document.getElementById('resultText').textContent = event.data;
//     };


// window.addEventListener('load', ()=>{
//   performance.mark('app-loaded');
//   performance.measure('app-to-load','app-start','app-loaded');
//   const m = performance.getEntriesByName('app-to-load').pop();
//   if (m) console.log(`App load: ${Math.round(m.duration)} ms`);


// });

// ---- Web Worker setup ----
const worker = new Worker('worker.js');
const inputEl  = document.getElementById('numberInput');
const resultEl = document.getElementById('resultText');

function checkIfPrime() {
  const raw = inputEl.value.trim();
  const number = Number(raw);

  if (!Number.isInteger(number)) {
    resultEl.textContent = 'Please enter a valid integer.';
    return;
  }

  resultEl.textContent = 'Checking…';
  worker.postMessage(number);
}

worker.onmessage = (event) => {
  resultEl.textContent = event.data;
};

worker.onerror = (err) => {
  console.error('Worker error:', err);
  resultEl.textContent = 'Error: could not complete the check.';
};


// ---- Performance Profiling (Checklist #18) ----
window.addEventListener('load', () => {
  // Mark end and measure total load time
  performance.mark('app-loaded');
  performance.measure('app-to-load', 'app-start', 'app-loaded');

  const measure = performance.getEntriesByName('app-to-load').slice(-1)[0];
  if (measure) {
    const duration = Math.round(measure.duration);

    // Log to console
    console.log(`⏱ App load: ${duration} ms`);

    // Show visually on the page
    const info = document.createElement('p');
    info.textContent = `Page Load Time: ${duration} ms`;
    info.style.textAlign = 'center';
    info.style.fontSize = '14px';
    info.style.color = '#555';
    info.style.marginTop = '10px';
    document.body.appendChild(info);
  }

  // Clean up marks
  performance.clearMarks('app-loaded');
  performance.clearMeasures('app-to-load');
});


// detect end of CSS transitions on body
document.addEventListener('DOMContentLoaded', ()=>{
  const target = document.body;
  if (!target) return;
  target.addEventListener('transitionend', (e)=>{
    if (['background-color','color','border-color'].includes(e.propertyName)){
      console.log('Transition finished:', e.propertyName);
    }
  });
});

// Custom JavaScript class: FormSaver (autosave form fields to localStorage)
class FormSaver {
  constructor(prefix, fields){ this.prefix = prefix; this.fields = fields; }
  load(){ this.fields.forEach(id => { const el = document.getElementById(id); if(el){ el.value = localStorage.getItem(this.prefix+id) || ""; }}); }
  bind(){ this.fields.forEach(id => { const el = document.getElementById(id); if(el){ el.addEventListener('input', ()=>localStorage.setItem(this.prefix+id, el.value)); }}); }
  clear(){ this.fields.forEach(id => localStorage.removeItem(this.prefix+id)); }
}

document.addEventListener('DOMContentLoaded', ()=>{
  const form = document.getElementById('contactForm');
  const fields = ['name','email','message'].filter(id => document.getElementById(id));
  if (form && fields.length){
    const saver = new FormSaver('contact_', fields);
    saver.load(); saver.bind();
    form.addEventListener('submit', ()=> saver.clear());
  }
});

 // Weather badge using Geolocation
(async function () {
  const API_KEY = "9e6523efe6c91da5e23208148e38b504";
  const UNITS = "metric"; // "metric"=°C, "imperial"=°F

  function setText(t) {
    const el = document.getElementById("liveInfo");
    if (el) el.textContent = t;
  }

  // Get user location using browser geolocation
  function getUserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
      } else {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos.coords),
          (err) => reject(err),
          { enableHighAccuracy: true, timeout: 10000 }
        );
      }
    });
  }

  async function fetchWeatherByCoords(lat, lon) {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${UNITS}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();

      const temp = Math.round(data.main.temp);
      const weather = data.weather[0].main;

      const icons = {
        Clear: "☀️",
        Clouds: "☁️",
        Rain: "🌧️",
        Drizzle: "🌦️",
        Thunderstorm: "⛈️",
        Snow: "❄️",
        Mist: "🌫️",
        Fog: "🌫️",
      };
      const icon = icons[weather] || "🌡️";

      setText(`${icon} ${data.name} ${temp}°C`);
    } catch (e) {
      console.error(e);
      setText("Weather unavailable");
    }
  }

  try {
    const coords = await getUserLocation();
    setText("Fetching weather...");
    await fetchWeatherByCoords(coords.latitude, coords.longitude);
  } catch (e) {
    console.error(e);
    setText("Location not available");
  }
})();


// File API preview (image or text)
document.addEventListener('DOMContentLoaded', ()=>{
  const input = document.getElementById('fileInput');
  const out = document.getElementById('filePreview');
  if (!input || !out) return;
  input.addEventListener('change', (e)=>{
    const file = e.target.files && e.target.files[0];
    if(!file){ out.innerHTML=''; return; }
    const reader = new FileReader();
    reader.onload = ()=>{
      if (file.type.startsWith('image/')){
        out.innerHTML = `<img src="${reader.result}" alt="preview" style="max-width:280px;border-radius:12px;box-shadow:0 6px 18px rgba(0,0,0,.15)">`;
      } else {
        out.innerHTML = `<pre class="p-3 bg-body-tertiary rounded" style="white-space:pre-wrap">${reader.result}</pre>`;
      }
    };
    if (file.type.startsWith('image/')) reader.readAsDataURL(file); else reader.readAsText(file);
  });
});


  const box = document.getElementById("myBox");
  const btn = document.getElementById("animateBtn");
  const status = document.getElementById("status");

  btn.addEventListener("click", () => {
    // Toggle the active class to trigger CSS transition
    box.classList.toggle("active");
    status.textContent = "Transition running...";
  });

  // Listen for the transitionend event
  box.addEventListener("transitionend", function(event) {
    status.textContent = `Transition finished for: ${event.propertyName}`;
    console.log("Transition ended:", event.propertyName);
  });


  //web socket - chat App

// === WebSocket Chat Client (single origin) ===
(() => {
  const socket = new WebSocket(`ws://${location.host}`);

  const messagesEl = document.getElementById('messages');
  const inputEl    = document.getElementById('messageInput');
  const sendBtn    = document.getElementById('sendButton');

  // Optional status text (if you added one)
  const statusEl   = document.getElementById('chatStatus');

  const setStatus = (t) => { if (statusEl) statusEl.textContent = t; };

  socket.addEventListener('open', () => {
    setStatus('Connected');
    sendBtn.disabled = false;
    inputEl.disabled = false;
    inputEl.focus();
  });

  socket.addEventListener('message', (ev) => {
    const data = ev.data;
    if (data instanceof Blob) {
      const reader = new FileReader();
      reader.onload = (e) => appendMessage(e.target.result);
      reader.readAsText(data);
    } else {
      appendMessage(String(data));
    }
  });

  socket.addEventListener('error', () => setStatus('Connection error'));
  socket.addEventListener('close', () => setStatus('Disconnected'));

  sendBtn.addEventListener('click', () => {
    const text = inputEl.value.trim();
    if (!text || socket.readyState !== WebSocket.OPEN) return;
    socket.send(text);
    // Since server broadcasts to everyone incl. sender, local echo is optional.
    // appendMessage(text);
    inputEl.value = '';
    inputEl.focus();
  });

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendBtn.click();
    }
  });

  function appendMessage(text) {
    const p = document.createElement('p');
    p.className = 'mb-1';
    p.textContent = text;
    messagesEl.appendChild(p);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }
})();
