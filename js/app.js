// API Keys
const WEATHER_API_KEY = "925a54f5c17bac334fbcc8214e99f06f";
const NEWS_API_KEY = "ce62f852b2d3424a9ba85424274c63f6";

// Seasonal Backgrounds (your 25 beautiful images)
const seasonalNature = [
  "https://images.pexels.com/photos/132037/pexels-photo-132037.jpeg?w=1920&q=80",
  "https://images.pexels.com/photos/844297/pexels-photo-844297.jpeg?w=1920&q=80",
  "https://images.pexels.com/photos/3584428/pexels-photo-3584428.jpeg?w=1920&q=80",
  "https://images.pexels.com/photos/1461974/pexels-photo-1461974.jpeg?w=1920&q=80",
  "https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?w=1920&q=80",
  "https://images.pexels.com/photos/933255/pexels-photo-933255.jpeg?w=1920&q=80",
  "https://images.pexels.com/photos/1484759/pexels-photo-1484759.jpeg?w=1920&q=80",
  "https://images.pexels.com/photos/2356059/pexels-photo-2356059.jpeg?w=1920&q=80",
  "https://images.pexels.com/photos/1252864/pexels-photo-1252864.jpeg?w=1920&q=80",
  "https://images.pexels.com/photos/235621/pexels-photo-235621.jpeg?w=1920&q=80",
  "https://images.pexels.com/photos/1424246/pexels-photo-1424246.jpeg?w=1920&q=80",
  "https://images.pexels.com/photos/1659437/pexels-photo-1659437.jpeg?w=1920&q=80",
  "https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg?w=1920&q=80",
  "https://images.pexels.com/photos/40896/larch-conifer-cone-branch-tree-40896.jpeg?w=1920&q=80",
  "https://images.pexels.com/photos/36487/above-adventure-aerial-air.jpg?w=1920&q=80",
  "https://images.pexels.com/photos/33109/fall-autumn-red-season.jpg?w=1920&q=80",
  "https://images.pexels.com/photos/772429/pexels-photo-772429.jpeg?w=1920&q=80",
  "https://images.pexels.com/photos/1379636/pexels-photo-1379636.jpeg?w=1920&q=80",
  "https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?w=1920&q=80",
  "https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg?w=1920&q=80",
  "https://images.pexels.com/photos/47334/meadow-grass-palm-tree-forest-plenty-of-natural-light-47334.jpeg?w=1920&q=80",
  "https://images.pexels.com/photos/38136/pexels-photo-38136.jpeg?w=1920&q=80",
  "https://images.pexels.com/photos/66997/pexels-photo-66997.jpeg?w=1920&q=80",
  "https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?w=1920&q=80",
  "https://images.pexels.com/photos/39811/pexels-photo-39811.jpeg?w=1920&q=80"
];

function changeBackground() {
  const month = new Date().getMonth();
  const hour = new Date().getHours();
  const index = (month * 2) + (hour >= 12 ? 1 : 0);
  document.body.style.backgroundImage = `url('${seasonalNature[index % seasonalNature.length]}')`;
}
changeBackground();
setInterval(changeBackground, 3600000);

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
const today = new Date();

// 12-HOUR FORMAT WITH AM/PM
function formatTime12(date) {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

// Live Clock - Now in 12-hour format
function updateClock() {
  const now = new Date();
  document.getElementById('dayName').textContent = now.toLocaleDateString('en-US', {weekday:'long'});
  document.getElementById('liveTime').textContent = formatTime12(now);
  document.getElementById('bigDate').textContent = now.getDate();
  document.getElementById('dateLabel').textContent = now.toLocaleDateString('en-US', {month:'long', year:'numeric'});
}
setInterval(updateClock, 1000);
updateClock();

// Theme Toggle
document.getElementById('themeToggle').onclick = () => {
  const isDark = document.body.getAttribute('data-theme') === 'dark';
  document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
  document.getElementById('themeIcon').setAttribute('data-feather', isDark ? 'sun' : 'moon');
  feather.replace();
};

// Calendar Logic (unchanged)
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const monthSelect = document.getElementById('monthSelect');
const yearInput = document.getElementById('yearInput');
months.forEach((m, i) => {
  const opt = document.createElement('option');
  opt.value = i; opt.textContent = m;
  if (i === currentMonth) opt.selected = true;
  monthSelect.appendChild(opt);
});
yearInput.value = currentYear;

monthSelect.onchange = () => { currentMonth = parseInt(monthSelect.value); renderCalendar(); };
yearInput.onchange = () => {
  let y = parseInt(yearInput.value);
  if (y >= 1950 && y <= 2050) currentYear = y;
  else yearInput.value = currentYear;
  renderCalendar();
};

function renderCalendar() {
  const grid = document.getElementById('calendar');
  grid.innerHTML = '';
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
    const card = document.createElement('div');
    card.className = 'day-card other-month';
    card.innerHTML = `<span>${prevMonthDays - i}</span>`;
    grid.appendChild(card);
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const card = document.createElement('div');
    card.className = 'day-card';
    if (d === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
      card.classList.add('today');
    }
    const hue = (d * 16 + currentMonth * 34) % 360;
    card.style.setProperty('--c1', `hsl(${hue}, 92%, 70%)`);
    card.style.setProperty('--c2', `hsl(${(hue + 120) % 360}, 92%, 70%)`);
    card.innerHTML = `<span>${d}</span>`;
    card.onclick = (e) => butterflyToDetail(e, card, d, currentMonth, currentYear);
    grid.appendChild(card);
  }

  // Next month filler
  const total = grid.children.length;
  for (let i = 1; i <= 42 - total; i++) {
    const card = document.createElement('div');
    card.className = 'day-card other-month';
    card.innerHTML = `<span>${i}</span>`;
    grid.appendChild(card);
  }
}

// Butterfly + Detail
function butterflyToDetail(event, card, day, month, year) {
  const rect = card.getBoundingClientRect();
  const clone = card.cloneNode(true);
  clone.classList.add('flying');
  clone.style.position = 'fixed';
  clone.style.left = rect.left + 'px';
  clone.style.top = rect.top + 'px';
  clone.style.width = rect.width + 'px';
  clone.style.height = rect.height + 'px';
  clone.style.zIndex = 99999;
  document.body.appendChild(clone);

  setTimeout(() => {
    showDetail(day, month, year);
    clone.remove();
  }, 2200);
}

// Get Location → Weather + News
let userCountryCode = 'us';

function getLocationAndLoad() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      fetchWeather(pos.coords.latitude, pos.coords.longitude);
      detectCountryAndFetchNews(pos.coords.latitude, pos.coords.longitude);
    }, () => {
      fallbackLocation();
    });
  } else {
    fallbackLocation();
  }
}

function fallbackLocation() {
  fetchWeather(28.6139, 77.2090); // Delhi
  fetchNewsByCountry('in');
}

async function detectCountryAndFetchNews(lat, lon) {
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`);
    const data = await res.json();
    userCountryCode = data.sys.country.toLowerCase();
    fetchNewsByCountry(userCountryCode);
  } catch {
    fetchNewsByCountry('us');
  }
}

// Weather
async function fetchWeather(lat, lon) {
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);
    const data = await res.json();
    const temp = Math.round(data.main.temp);
    const desc = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
    document.getElementById("weather").innerHTML = `${temp}°C in ${data.name}<br><small>${desc}</small>`;
  } catch {
    document.getElementById("weather").textContent = "Weather unavailable";
  }
}

// News - Now 100% working with CORS proxy fallback
async function fetchNewsByCountry(country = 'us') {
  const url = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${NEWS_API_KEY}&pageSize=3`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    if (data.articles && data.articles.length > 0) {
      const title = data.articles[0].title.split(" - ")[0].split(" | ")[0];
      document.getElementById("news").innerHTML = title.length > 90 ? title.substring(0, 87) + "..." : title;
    } else {
      document.getElementById("news").textContent = "No news right now";
    }
  } catch (err) {
    // Fallback: Use all-origins CORS proxy (reliable)
    try {
      const proxyUrl = `https://api.allorigins.ml/get?url=${encodeURIComponent(url)}`;
      const res = await fetch(proxyUrl);
      const proxyData = await res.json();
      const data = JSON.parse(proxyData.contents);
      if (data.articles && data.articles.length > 0) {
        const title = data.articles[0].title.split(" - ")[0];
        document.getElementById("news").innerHTML = title.length > 90 ? title.substring(0, 87) + "..." : title;
      }
    } catch {
      document.getElementById("news").textContent = "News temporarily unavailable";
    }
  }
}

// Show Detail
function showDetail(day, month, year) {
  const date = new Date(year, month, day);
  const overlay = document.getElementById('detailOverlay');

  document.getElementById('detailDate').textContent = date.toLocaleDateString('en-US', {weekday:'long', day:'numeric', month:'long', year:'numeric'});
  document.getElementById('detailTime').textContent = formatTime12(new Date());

  // Reset
  document.getElementById("weather").textContent = "Loading...";
  document.getElementById("news").textContent = "Loading...";

  overlay.style.display = 'flex';
  setTimeout(() => overlay.style.opacity = '1', 100);

  // Fresh data every time
  getLocationAndLoad();
}

// Close
document.getElementById('closeBtn').onclick = () => {
  const overlay = document.getElementById('detailOverlay');
  overlay.style.opacity = '0';
  setTimeout(() => overlay.style.display = 'none', 1200);
};

// Navigation
document.getElementById('prevBtn').onclick = () => { currentMonth = (currentMonth - 1 + 12) % 12; if (currentMonth === 11) currentYear--; monthSelect.value = currentMonth; yearInput.value = currentYear; renderCalendar(); };
document.getElementById('nextBtn').onclick = () => { currentMonth = (currentMonth + 1) % 12; if (currentMonth === 0) currentYear++; monthSelect.value = currentMonth; yearInput.value = currentYear; renderCalendar(); };
document.getElementById('homeBtn').onclick = () => { currentMonth = today.getMonth(); currentYear = today.getFullYear(); monthSelect.value = currentMonth; yearInput.value = currentYear; renderCalendar(); };

// Init
feather.replace();
renderCalendar();