const API_KEY = "9e6523efe6c91da5e23208148e38b504"; 

const els = {
  cityInput: document.querySelector("#city"),
  getBtn: document.querySelector("#getWeather"),
  unitToggle: document.querySelector("#unitToggle"),
  unitLabel: document.querySelector("#unitLabel"),
  card: document.querySelector("#weatherResult"),
  error: document.querySelector("#error"),
  cityName: document.querySelector("#cityName"),
  countryCode: document.querySelector("#countryCode"),
  icon: document.querySelector("#icon"),
  temperature: document.querySelector("#temperature"),
  description: document.querySelector("#description"),
  feelsLike: document.querySelector("#feelsLike"),
  humidity: document.querySelector("#humidity"),
  wind: document.querySelector("#wind"),
};

let useFahrenheit = false;
function unitsParam(){ return useFahrenheit ? "imperial" : "metric"; }
function formatTemp(t){ if (t == null) return "—"; return `${Math.round(t)}${useFahrenheit ? "°F":"°C"}`; }
function formatWind(w){ if (w == null) return "—"; return `${w} ${useFahrenheit ? "mph":"m/s"}`; }

function setBackgroundByWeather(main){
  const root = document.documentElement;
  if (!main) return;
  const m = main.toLowerCase();
  if (m.includes("rain") || m.includes("drizzle")){ root.style.setProperty("--primary","#60a5fa"); root.style.setProperty("--accent","#3b82f6"); }
  else if (m.includes("cloud")){ root.style.setProperty("--primary","#93c5fd"); root.style.setProperty("--accent","#67e8f9"); }
  else if (m.includes("clear")){ root.style.setProperty("--primary","#fbbf24"); root.style.setProperty("--accent","#fde047"); }
  else if (m.includes("snow")){ root.style.setProperty("--primary","#bae6fd"); root.style.setProperty("--accent","#7dd3fc"); }
  else { root.style.setProperty("--primary","#38bdf8"); root.style.setProperty("--accent","#22d3ee"); }
}

async function fetchWeather(city){
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${unitsParam()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("City not found");
  return await res.json();
}
function renderWeather(data){
  const name = data.name;
  const country = data.sys?.country ?? "—";
  const main = data.weather?.[0]?.main ?? "";
  const desc = data.weather?.[0]?.description ?? "—";
  const iconCode = data.weather?.[0]?.icon ?? "01d";
  const temp = data.main?.temp;
  const feels = data.main?.feels_like;
  const humidity = data.main?.humidity;
  const wind = data.wind?.speed;

  els.cityName.textContent = name ?? "—";
  els.countryCode.textContent = country;
  els.description.textContent = desc;
  els.temperature.textContent = formatTemp(temp);
  els.feelsLike.textContent = formatTemp(feels);
  els.humidity.textContent = humidity != null ? humidity + "%" : "—";
  els.wind.textContent = formatWind(wind);
  els.icon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  els.icon.alt = desc || "Weather icon";

  els.card.classList.remove("hidden");
  els.error.classList.add("hidden");
  setBackgroundByWeather(main);
}
function showError(msg="Sorry, city not found!"){
  els.card.classList.add("hidden");
  els.error.textContent = msg;
  els.error.classList.remove("hidden");
}

async function handleGetWeather(){
  const city = (els.cityInput.value || "").trim();
  if (!city){ showError("Please enter a city name."); return; }
  try{
    const data = await fetchWeather(city);
    renderWeather(data);
  }catch(e){ showError("Sorry, city not found!"); }
}

els.getBtn.addEventListener("click", handleGetWeather);
els.cityInput.addEventListener("keydown", (e)=>{ if (e.key === "Enter") handleGetWeather(); });
els.unitToggle.addEventListener("change", ()=>{
  useFahrenheit = els.unitToggle.checked;
  els.unitLabel.textContent = useFahrenheit ? "Fahrenheit" : "Celsius";
  const c = (els.cityInput.value || "").trim();
  if (!els.card.classList.contains("hidden") && c){ handleGetWeather(); }
});

// Remember last city & unit
const savedCity = localStorage.getItem("wa_city");
const savedUnit = localStorage.getItem("wa_unit") === "F";
if (savedCity){ els.cityInput.value = savedCity; }
if (savedUnit){ els.unitToggle.checked = true; useFahrenheit = true; els.unitLabel.textContent = "Fahrenheit"; }
els.cityInput.addEventListener("input", ()=>localStorage.setItem("wa_city", els.cityInput.value.trim()));
els.unitToggle.addEventListener("change", ()=>localStorage.setItem("wa_unit", els.unitToggle.checked ? "F" : "C"));
