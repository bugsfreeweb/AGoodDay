// API Keys - Replace with your own if needed
const WEATHER_API_KEY = "925a54f5c17bac334fbcc8214e99f06f";
const NEWS_API_KEY = "ce62f852b2d3424a9ba85424274c63f6";
const HOLIDAY_API_URL = "https://date.nager.at/api/v3/publicholidays/";

// Seasonal Backgrounds
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

let currentBgIndex = 0;
function changeBackground() {
  currentBgIndex = (currentBgIndex + 1) % seasonalNature.length;
  document.body.style.backgroundImage = `url('${seasonalNature[currentBgIndex]}')`;
}

changeBackground();
setInterval(changeBackground, 3600000); // Change every hour

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
const today = new Date();
let userCountryCode = 'US';

// 12-HOUR FORMAT WITH AM/PM
function formatTime12(date) {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

// Live Clock
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

// Calendar Logic
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

// Holiday Functions
let cachedHolidays = {};
async function fetchHolidaysForYear(year, country) {
  const cacheKey = `${year}-${country}`;
  if (cachedHolidays[cacheKey]) return cachedHolidays[cacheKey];
  
  try {
    const res = await fetch(`${HOLIDAY_API_URL}${year}/${country}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    
    if (!res.ok) throw new Error('API error');
    const holidays = await res.json();
    
    if (Array.isArray(holidays)) {
      cachedHolidays[cacheKey] = holidays;
      return holidays;
    }
    return [];
  } catch (err) {
    console.log(`Holiday fetch failed for ${country} ${year}:`, err);
    return [];
  }
}

async function getHolidayForDate(day, month, year, country = userCountryCode) {
  const holidays = await fetchHolidaysForYear(year, country);
  const targetDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const holiday = holidays.find(h => h.date === targetDate);
  return holiday ? holiday.localName || holiday.name : null;
}

// Render Calendar
async function renderCalendar() {
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
    const holiday = await getHolidayForDate(d, currentMonth, currentYear);
    if (holiday) {
      card.classList.add('holiday');
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

// Butterfly Animation
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
  setTimeout(async () => {
    await showDetail(day, month, year);
    clone.remove();
  }, 2200);
}

// Get Location → Weather + Country (Optimized)
async function getLocationAndLoad() {
  if (navigator.geolocation) {
    try {
      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 5000,
          maximumAge: 300000 // Cache for 5 minutes
        });
      });
      
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&appid=${WEATHER_API_KEY}&units=metric`);
      const data = await res.json();
      
      if (data.sys && data.sys.country) {
        userCountryCode = data.sys.country;
      }
      
      const temp = Math.round(data.main.temp);
      const desc = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
      document.getElementById("weather").innerHTML = `${temp}°C in ${data.name}<br><small>${desc}</small>`;
      
      await fetchNewsByCountry(userCountryCode.toLowerCase());
    } catch (err) {
      console.log('Location access denied or failed, using default');
      await fallbackLocation();
    }
  } else {
    await fallbackLocation();
  }
}

async function fallbackLocation() {
  userCountryCode = 'US';
  await fetchWeather(40.7128, -74.0060); // New York
  await fetchNewsByCountry('us');
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

// Clickable News - Multi-source fallback
async function fetchNewsByCountry(country = 'us') {
  const newsEl = document.getElementById("news");
  
  // Try multiple news sources in order
  const sources = [
    // RSS2JSON for Google News
    async () => {
      const countryDomain = {
        'us': 'com', 'gb': 'co.uk', 'ca': 'ca', 'au': 'com.au',
        'in': 'co.in', 'de': 'de', 'fr': 'fr', 'jp': 'co.jp',
        'br': 'com.br', 'mx': 'com.mx', 'es': 'es', 'it': 'it'
      };
      const domain = countryDomain[country.toLowerCase()] || 'com';
      const rssUrl = `https://news.google.com/rss?hl=en-${country.toUpperCase()}&gl=${country.toUpperCase()}&ceid=${country.toUpperCase()}:en`;
      const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&count=1`;
      
      const res = await fetch(apiUrl);
      const data = await res.json();
      if (data.status === 'ok' && data.items && data.items.length > 0) {
        const article = data.items[0];
        const title = article.title.split(" - ")[0].split(" | ")[0];
        const shortTitle = title.length > 70 ? title.substring(0, 67) + "..." : title;
        return `<a href="${article.link}" target="_blank" class="news-link">${shortTitle}</a>`;
      }
      throw new Error('No articles');
    },
    
    // Fallback to NewsAPI with proxy
    async () => {
      const url = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${NEWS_API_KEY}&pageSize=1`;
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const res = await fetch(proxyUrl);
      const proxyData = await res.json();
      const data = JSON.parse(proxyData.contents);
      if (data.articles && data.articles.length > 0) {
        const article = data.articles[0];
        const title = article.title.split(" - ")[0].split(" | ")[0];
        const shortTitle = title.length > 70 ? title.substring(0, 67) + "..." : title;
        return `<a href="${article.url}" target="_blank" class="news-link">${shortTitle}</a>`;
      }
      throw new Error('No articles');
    },
    
    // Final fallback to country-specific Google News
    async () => {
      const countryUrls = {
        'us': 'https://news.google.com',
        'gb': 'https://news.google.co.uk',
        'in': 'https://news.google.co.in',
        'ca': 'https://news.google.ca',
        'au': 'https://news.google.com.au'
      };
      const newsUrl = countryUrls[country.toLowerCase()] || 'https://news.google.com';
      return `<a href="${newsUrl}" target="_blank" class="news-link">Latest Headlines 📰</a>`;
    }
  ];
  
  // Try each source until one works
  for (const source of sources) {
    try {
      const result = await source();
      newsEl.innerHTML = result;
      return;
    } catch (err) {
      continue;
    }
  }
  
  // If all fail, show generic link
  newsEl.innerHTML = '<a href="https://news.google.com" target="_blank" class="news-link">Latest Headlines 📰</a>';
}

// Show Detail
async function showDetail(day, month, year) {
  const date = new Date(year, month, day);
  document.getElementById('detailDate').textContent = date.toLocaleDateString('en-US', {weekday:'long', day:'numeric', month:'long', year:'numeric'});
  document.getElementById('detailTime').textContent = formatTime12(new Date());
  
  document.getElementById("weather").textContent = "Loading...";
  document.getElementById("news").textContent = "Loading...";
  const holidayEl = document.getElementById("holiday");
  holidayEl.textContent = "Loading...";
  
  const overlay = document.getElementById('detailOverlay');
  overlay.style.display = 'flex';
  setTimeout(() => overlay.style.opacity = '1', 100);
  
  await getLocationAndLoad();
  
  const holiday = await getHolidayForDate(day, month, year);
  if (holiday) {
    holidayEl.innerHTML = `<a href="https://www.google.com/search?q=${encodeURIComponent(holiday)}" target="_blank" class="holiday-link">${holiday}</a>`;
  } else {
    holidayEl.textContent = "Regular day";
  }
}

// Close
document.getElementById('closeBtn').onclick = () => {
  const overlay = document.getElementById('detailOverlay');
  overlay.style.opacity = '0';
  setTimeout(() => overlay.style.display = 'none', 1200);
};

// Navigation
document.getElementById('prevBtn').onclick = async () => { 
  currentMonth = (currentMonth - 1 + 12) % 12; 
  if (currentMonth === 11) currentYear--; 
  monthSelect.value = currentMonth; 
  yearInput.value = currentYear; 
  await renderCalendar(); 
};

document.getElementById('nextBtn').onclick = async () => { 
  currentMonth = (currentMonth + 1) % 12; 
  if (currentMonth === 0) currentYear++; 
  monthSelect.value = currentMonth; 
  yearInput.value = currentYear; 
  await renderCalendar(); 
};

document.getElementById('homeBtn').onclick = async () => { 
  currentMonth = today.getMonth(); 
  currentYear = today.getFullYear(); 
  monthSelect.value = currentMonth; 
  yearInput.value = currentYear; 
  await renderCalendar(); 
};

// Init
feather.replace();
renderCalendar();