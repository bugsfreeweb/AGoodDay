// Enhanced Professional Calendar Application
// API Keys - Replace with your own if needed
const WEATHER_API_KEY = "925a54f5c17bac334fbcc8214e99f06f";
const NEWS_API_KEY = "ce62f852b2d3424a9ba85424274c63f6";
const HOLIDAY_API_URL = "https://date.nager.at/api/v3/publicholidays/";

// Enhanced Seasonal Backgrounds with Professional Quality
const seasonalNature = [
  "https://images.pexels.com/photos/132037/pexels-photo-132037.jpeg?w=1920&q=85",
  "https://images.pexels.com/photos/844297/pexels-photo-844297.jpeg?w=1920&q=85",
  "https://images.pexels.com/photos/3584428/pexels-photo-3584428.jpeg?w=1920&q=85",
  "https://images.pexels.com/photos/1461974/pexels-photo-1461974.jpeg?w=1920&q=85",
  "https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?w=1920&q=85",
  "https://images.pexels.com/photos/933255/pexels-photo-933255.jpeg?w=1920&q=85",
  "https://images.pexels.com/photos/1484759/pexels-photo-1484759.jpeg?w=1920&q=85",
  "https://images.pexels.com/photos/2356059/pexels-photo-2356059.jpeg?w=1920&q=85",
  "https://images.pexels.com/photos/1252864/pexels-photo-1252864.jpeg?w=1920&q=85",
  "https://images.pexels.com/photos/235621/pexels-photo-235621.jpeg?w=1920&q=85",
  "https://images.pexels.com/photos/1424246/pexels-photo-1424246.jpeg?w=1920&q=85",
  "https://images.pexels.com/photos/1659437/pexels-photo-1659437.jpeg?w=1920&q=85",
  "https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg?w=1920&q=85",
  "https://images.pexels.com/photos/40896/larch-conifer-cone-branch-tree-40896.jpeg?w=1920&q=85",
  "https://images.pexels.com/photos/36487/above-adventure-aerial-air.jpg?w=1920&q=85",
  "https://images.pexels.com/photos/33109/fall-autumn-red-season.jpg?w=1920&q=85",
  "https://images.pexels.com/photos/772429/pexels-photo-772429.jpeg?w=1920&q=85",
  "https://images.pexels.com/photos/1379636/pexels-photo-1379636.jpeg?w=1920&q=85",
  "https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?w=1920&q=85",
  "https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg?w=1920&q=85",
  "https://images.pexels.com/photos/47334/meadow-grass-palm-tree-forest-plenty-of-natural-light-47334.jpeg?w=1920&q=85",
  "https://images.pexels.com/photos/38136/pexels-photo-38136.jpeg?w=1920&q=85",
  "https://images.pexels.com/photos/66997/pexels-photo-66997.jpeg?w=1920&q=85",
  "https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?w=1920&q=85",
  "https://images.pexels.com/photos/39811/pexels-photo-39811.jpeg?w=1920&q=85"
];

// Update current date display based on selected month/year
function updateCurrentDateDisplay() {
  const bigDate = document.getElementById('bigDate');
  const dateLabel = document.getElementById('dateLabel');
  
  if (bigDate) bigDate.textContent = 1; // Show 1st of the month
  if (dateLabel) {
    const date = new Date(currentYear, currentMonth, 1);
    dateLabel.textContent = date.toLocaleDateString('en-US', {month:'long', year:'numeric'});
  }
}

// Professional Data Management
class DataManager {
  constructor() {
    this.events = this.loadFromStorage('calendar_events', {});
    this.preferences = this.loadFromStorage('calendar_preferences', {
      theme: 'dark',
      language: 'en',
      weekStart: 0,
      timeFormat: '12h',
      notifications: true,
      autoLocation: true
    });
    this.statistics = this.loadFromStorage('calendar_stats', {
      totalClicks: 0,
      daysViewed: new Set(),
      favoriteFeatures: {},
      usageHistory: []
    });
  }

  loadFromStorage(key, defaultValue) {
    try {
      const data = localStorage.getItem(key);
      if (!data) return defaultValue;
      
      const parsedData = JSON.parse(data);
      
      // Ensure statistics object exists
      if (!parsedData.statistics) {
        parsedData.statistics = defaultValue.statistics || {};
      }
      
      // Convert daysViewed back to Set if it was loaded as array
      if (parsedData.statistics && Array.isArray(parsedData.statistics.daysViewed)) {
        parsedData.statistics.daysViewed = new Set(parsedData.statistics.daysViewed);
      } else if (!parsedData.statistics.daysViewed) {
        // Initialize as Set if not present
        parsedData.statistics.daysViewed = new Set();
      }
      
      return parsedData;
    } catch (error) {
      console.warn(`Failed to load ${key} from storage:`, error);
      return defaultValue;
    }
  }

  saveToStorage(key, value) {
    try {
      // Deep clone and convert Sets to arrays for JSON serialization
      const clonedValue = JSON.parse(JSON.stringify(value, (key, value) => {
        if (value instanceof Set) {
          return Array.from(value);
        }
        return value;
      }));
      localStorage.setItem(key, JSON.stringify(clonedValue));
    } catch (error) {
      console.warn(`Failed to save ${key} to storage:`, error);
    }
  }

  addEvent(date, event) {
    const dateKey = this.formatDateKey(date);
    if (!this.events[dateKey]) {
      this.events[dateKey] = [];
    }
    this.events[dateKey].push({
      ...event,
      id: Date.now() + Math.random(),
      createdAt: new Date().toISOString()
    });
    this.saveToStorage('calendar_events', this.events);
    this.updateStatistics('eventAdded');
  }

  getEvents(date) {
    const dateKey = this.formatDateKey(date);
    return this.events[dateKey] || [];
  }

  removeEvent(date, eventId) {
    const dateKey = this.formatDateKey(date);
    if (this.events[dateKey]) {
      this.events[dateKey] = this.events[dateKey].filter(e => e.id !== eventId);
      if (this.events[dateKey].length === 0) {
        delete this.events[dateKey];
      }
      this.saveToStorage('calendar_events', this.events);
    }
  }

  formatDateKey(date) {
    // Use local date methods to match showDetail function
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  updateStatistics(action) {
    try {
      const now = new Date();
      const dateKey = this.formatDateKey(now);
      
      this.statistics.totalClicks++;
      
      // Ensure daysViewed is always a Set
      if (!this.statistics.daysViewed) {
        this.statistics.daysViewed = new Set();
      } else if (Array.isArray(this.statistics.daysViewed)) {
        this.statistics.daysViewed = new Set(this.statistics.daysViewed);
      }
      
      // Only add to daysViewed for meaningful interactions, not every clock tick
      const meaningfulActions = ['dayClick', 'monthChange', 'yearChange', 'navigationPrev', 'navigationNext', 'homeNavigation', 'settingsOpen', 'eventCreated', 'themeToggle'];
      if (meaningfulActions.includes(action)) {
        this.statistics.daysViewed.add(dateKey);
      }
      
      this.statistics.usageHistory.push({
        action,
        timestamp: now.toISOString(),
        date: dateKey
      });

      // Keep only last 100 actions
      if (this.statistics.usageHistory.length > 100) {
        this.statistics.usageHistory = this.statistics.usageHistory.slice(-100);
      }

      this.saveToStorage('calendar_stats', this.statistics);
    } catch (error) {
      console.warn('Failed to update statistics:', error);
    }
  }

  getStatistics() {
    return {
      ...this.statistics,
      daysViewed: Array.from(this.statistics.daysViewed || []),
      totalDaysViewed: (this.statistics.daysViewed && this.statistics.daysViewed.size) || 0
    };
  }

  exportData() {
    return {
      events: this.events,
      preferences: this.preferences,
      statistics: this.getStatistics(),
      exportDate: new Date().toISOString()
    };
  }

  importData(data) {
    if (data.events) {
      this.events = data.events;
      this.saveToStorage('calendar_events', this.events);
    }
    if (data.preferences) {
      this.preferences = { ...this.preferences, ...data.preferences };
      this.saveToStorage('calendar_preferences', this.preferences);
    }
  }
}

// Global Variables
let currentBgIndex = 0;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
const today = new Date();
let userCountryCode = 'US';
const dataManager = new DataManager();

// Enhanced Background Management
function changeBackground() {
  currentBgIndex = (currentBgIndex + 1) % seasonalNature.length;
  document.body.style.backgroundImage = `url('${seasonalNature[currentBgIndex]}')`;
}

changeBackground();
setInterval(changeBackground, 3600000); // Change every hour

// Professional Time Management
function formatTime12(date) {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

function formatTime24(date) {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

// Enhanced Live Clock with Timezone Support
function updateClock() {
  const now = new Date();
  const timeFormat = dataManager.preferences.timeFormat;
  
  document.getElementById('dayName').textContent = now.toLocaleDateString('en-US', {weekday:'long'});
  document.getElementById('liveTime').textContent = timeFormat === '24h' ? formatTime24(now) : formatTime12(now);
  document.getElementById('bigDate').textContent = now.getDate();
  document.getElementById('dateLabel').textContent = now.toLocaleDateString('en-US', {month:'long', year:'numeric'});
  
  // Only update statistics for significant time changes (minutes)
  const currentMinute = now.getMinutes();
  const currentSecond = now.getSeconds();
  if (currentSecond === 0) { // Only on minute changes
    dataManager.updateStatistics('minuteChange');
  }
}
setInterval(updateClock, 1000);
updateClock();

// Enhanced Theme Management
document.getElementById('themeToggle').onclick = () => {
  const isDark = document.body.getAttribute('data-theme') === 'dark';
  const newTheme = isDark ? 'light' : 'dark';
  
  document.body.setAttribute('data-theme', newTheme);
  document.getElementById('themeIcon').setAttribute('data-feather', isDark ? 'sun' : 'moon');
  dataManager.preferences.theme = newTheme;
  dataManager.saveToStorage('calendar_preferences', dataManager.preferences);
  feather.replace();
  
  dataManager.updateStatistics('themeToggle');
};

// Professional Calendar Logic
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const monthSelect = document.getElementById('monthSelect');
const yearInput = document.getElementById('yearInput');

months.forEach((m, i) => {
  const opt = document.createElement('option');
  opt.value = i; 
  opt.textContent = m;
  if (i === currentMonth) opt.selected = true;
  monthSelect.appendChild(opt);
});

yearInput.value = currentYear;
monthSelect.onchange = () => { 
  currentMonth = parseInt(monthSelect.value); 
  renderCalendar(); 
  updateCurrentDateDisplay();
  dataManager.updateStatistics('monthChange');
};
yearInput.onchange = () => {
  let y = parseInt(yearInput.value);
  if (y >= 1950 && y <= 2050) currentYear = y;
  else yearInput.value = currentYear;
  renderCalendar();
  updateCurrentDateDisplay();
  dataManager.updateStatistics('yearChange');
};

// Enhanced Holiday Functions with Caching (moved to HolidayManager class)

// Professional Holiday Data Manager
class HolidayManager {
  constructor() {
    this.cachedHolidays = {};
  }

  async fetchHolidaysForYear(year, country) {
    const cacheKey = `${year}-${country}`;
    if (this.cachedHolidays[cacheKey]) return this.cachedHolidays[cacheKey];
    
    // Track API calls to prevent spam (silent operation)
    
    try {
      const res = await fetch(`${HOLIDAY_API_URL}${year}/${country}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      if (!res.ok) throw new Error('API error');
      
      // Check if response has content
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid content type');
      }
      
      const holidays = await res.json();
      
      if (Array.isArray(holidays) && holidays.length > 0) {
        this.cachedHolidays[cacheKey] = holidays;
        return holidays;
      }
      
      // Fallback to US if no holidays found
      if (country !== 'US') {
        return await this.fetchHolidaysForYear(year, 'US');
      }
      
      return [];
    } catch (err) {
      // For BD and other problematic countries, fallback to US
      if (country !== 'US') {
        return await this.fetchHolidaysForYear(year, 'US');
      }
      return [];
    }
  }
}

const holidayManager = new HolidayManager();

// Legacy function for compatibility
async function fetchHolidaysForYear(year, country) {
  return await holidayManager.fetchHolidaysForYear(year, country);
}

async function getHolidayForDate(day, month, year, country = userCountryCode) {
  const holidays = await fetchHolidaysForYear(year, country);
  const targetDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const holiday = holidays.find(h => h.date === targetDate);
  return holiday ? holiday.localName || holiday.name : null;
}

// Search functionality removed

// Professional Settings System
class SettingsManager {
  constructor() {
    this.sidebar = document.getElementById('settingsSidebar');
    this.overlay = document.getElementById('settingsOverlay');
    this.toggle = document.getElementById('settingsToggle');
    this.close = document.getElementById('settingsClose');
    this.isOpen = false;
    
    this.initializeEventListeners();
    this.loadSettings();
    this.updateStatisticsDisplay();
  }

  initializeEventListeners() {
    // Toggle sidebar
    this.toggle.addEventListener('click', () => this.toggleSidebar());
    this.close.addEventListener('click', () => this.closeSidebar());
    this.overlay.addEventListener('click', () => this.closeSidebar());

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeSidebar();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        this.toggleSidebar();
      }
    });

    // Settings controls
    this.setupSettingsControls();
  }

  setupSettingsControls() {
    // Theme control
    const themeSelect = document.getElementById('themeSelect');
    themeSelect.addEventListener('change', (e) => {
      dataManager.preferences.theme = e.target.value;
      dataManager.saveToStorage('calendar_preferences', dataManager.preferences);
      document.body.setAttribute('data-theme', e.target.value);
      document.getElementById('themeIcon').setAttribute('data-feather', e.target.value === 'dark' ? 'moon' : 'sun');
      feather.replace();
    });

    // Time format control
    const timeFormatSelect = document.getElementById('timeFormatSelect');
    timeFormatSelect.addEventListener('change', (e) => {
      dataManager.preferences.timeFormat = e.target.value;
      dataManager.saveToStorage('calendar_preferences', dataManager.preferences);
      updateClock();
    });

    // Week start control
    const weekStartSelect = document.getElementById('weekStartSelect');
    weekStartSelect.addEventListener('change', (e) => {
      dataManager.preferences.weekStart = parseInt(e.target.value);
      dataManager.saveToStorage('calendar_preferences', dataManager.preferences);
      renderCalendar();
    });

    // Notifications control
    const notificationsToggle = document.getElementById('notificationsToggle');
    notificationsToggle.addEventListener('change', (e) => {
      dataManager.preferences.notifications = e.target.checked;
      dataManager.saveToStorage('calendar_preferences', dataManager.preferences);
    });

    // Auto location control
    const autoLocationToggle = document.getElementById('autoLocationToggle');
    autoLocationToggle.addEventListener('change', (e) => {
      dataManager.preferences.autoLocation = e.target.checked;
      dataManager.saveToStorage('calendar_preferences', dataManager.preferences);
    });

    // Export/Import buttons
    document.getElementById('exportBtn').addEventListener('click', () => this.exportData());
    document.getElementById('importBtn').addEventListener('click', () => {
      document.getElementById('importFile').click();
    });

    document.getElementById('importFile').addEventListener('change', (e) => {
      this.importData(e.target.files[0]);
    });
  }

  loadSettings() {
    // Apply saved settings
    document.getElementById('themeSelect').value = dataManager.preferences.theme;
    document.getElementById('timeFormatSelect').value = dataManager.preferences.timeFormat;
    document.getElementById('weekStartSelect').value = dataManager.preferences.weekStart;
    document.getElementById('notificationsToggle').checked = dataManager.preferences.notifications;
    document.getElementById('autoLocationToggle').checked = dataManager.preferences.autoLocation;
  }

  toggleSidebar() {
    if (this.isOpen) {
      this.closeSidebar();
    } else {
      this.openSidebar();
    }
  }

  openSidebar() {
    this.sidebar.classList.add('open');
    this.overlay.classList.add('active');
    this.isOpen = true;
    dataManager.updateStatistics('settingsOpen');
    
    // Update statistics display when opening
    this.updateStatisticsDisplay();
    
    // Focus management for accessibility
    this.sidebar.focus();
  }

  closeSidebar() {
    this.sidebar.classList.remove('open');
    this.overlay.classList.remove('active');
    this.isOpen = false;
    
    // Return focus to toggle button
    this.toggle.focus();
  }

  updateStatisticsDisplay() {
    const stats = dataManager.getStatistics();
    document.getElementById('totalClicks').textContent = stats.totalClicks;
    document.getElementById('totalDaysViewed').textContent = stats.totalDaysViewed;
    document.getElementById('totalEvents').textContent = Object.values(dataManager.events).flat().length;
  }

  exportData() {
    const data = dataManager.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calendar-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    dataManager.updateStatistics('export');
  }

  importData(file) {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        dataManager.importData(data);
        this.loadSettings();
        renderCalendar();
        this.updateStatisticsDisplay();
        
        // Show success message
        this.showNotification('Data imported successfully!', 'success');
        dataManager.updateStatistics('import');
      } catch (error) {
        this.showNotification('Error importing data. Please check the file format.', 'error');
      }
    };
    reader.readAsText(file);
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `settings-notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : 'var(--accent-dark)'};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      z-index: 3000;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

const settingsManager = new SettingsManager();


// Enhanced Event System
class EventManager {
  constructor() {
    this.activeEvent = null;
  }

  showEventDialog(date) {
    const dialog = document.createElement('div');
    dialog.className = 'event-dialog';
    dialog.innerHTML = `
      <div class="event-dialog-content">
        <h3>Add Event for ${date.toLocaleDateString()}</h3>
        <input type="text" id="eventTitle" placeholder="Event title" />
        <textarea id="eventDescription" placeholder="Event description"></textarea>
        <input type="time" id="eventTime" />
        <select id="eventType">
          <option value="personal">Personal</option>
          <option value="work">Work</option>
          <option value="reminder">Reminder</option>
        </select>
        <div class="dialog-buttons">
          <button id="saveEvent">Save</button>
          <button id="cancelEvent">Cancel</button>
        </div>
      </div>
    `;

    document.body.appendChild(dialog);

    document.getElementById('saveEvent').onclick = () => {
      const title = document.getElementById('eventTitle').value;
      const description = document.getElementById('eventDescription').value;
      const time = document.getElementById('eventTime').value;
      const type = document.getElementById('eventType').value;

      if (title) {
        dataManager.addEvent(date, {
          title,
          description,
          time,
          type
        });
        renderCalendar();
        dataManager.updateStatistics('eventCreated');
      }
      dialog.remove();
    };

    document.getElementById('cancelEvent').onclick = () => {
      dialog.remove();
    };
  }

  getEventsForDate(date) {
    return dataManager.getEvents(date);
  }
}

const eventManager = new EventManager();

// Enhanced Calendar Rendering
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
    
    // Add events indicator
    const events = eventManager.getEventsForDate(new Date(currentYear, currentMonth, d));
    if (events.length > 0) {
      const eventIndicator = document.createElement('div');
      eventIndicator.className = 'event-indicator';
      card.appendChild(eventIndicator);

      const tooltip = document.createElement('div');
      tooltip.className = 'event-tooltip';
      tooltip.textContent = `${events.length} event${events.length > 1 ? 's' : ''}`;
      card.appendChild(tooltip);
    }
    
    const hue = (d * 16 + currentMonth * 34) % 360;
    card.style.setProperty('--c1', `hsl(${hue}, 92%, 70%)`);
    card.style.setProperty('--c2', `hsl(${(hue + 120) % 360}, 92%, 70%)`);
    card.innerHTML += `<span>${d}</span>`;
    card.onclick = (e) => {
      dataManager.updateStatistics('dayClick');
      if (e.ctrlKey || e.metaKey) {
        // Ctrl+click to add event
        eventManager.showEventDialog(new Date(currentYear, currentMonth, d));
      } else {
        butterflyToDetail(e, card, d, currentMonth, currentYear);
      }
    };
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

// Enhanced Butterfly Animation
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

// Enhanced Location and Weather System
let geolocationPermissionRequested = false;

async function getLocationAndLoad() {
  if (dataManager.preferences.autoLocation && navigator.geolocation && !geolocationPermissionRequested) {
    geolocationPermissionRequested = true;
    
    try {
      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 5000,
          maximumAge: 300000
        });
      });
      
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&appid=${WEATHER_API_KEY}&units=metric`);
      const data = await res.json();
      
      if (data.sys && data.sys.country) {
        userCountryCode = data.sys.country;
      }
      
      const temp = Math.round(data.main.temp);
      const desc = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
      const condition = data.weather[0].main;
      
      // Use professional weather card layout
      document.getElementById("weather").innerHTML = `
        <div class="weather-card-professional">
          <div class="weather-header">
            <span class="weather-title">Weather</span>
          </div>
          <div class="weather-content">
            <div class="weather-main">
              <span class="weather-icon">${getWeatherIcon(condition)}</span>
              <div class="weather-temp">
                <span class="temp-value">${temp}°</span>
                <span class="temp-unit">C</span>
              </div>
            </div>
            <div class="weather-info">
              <div class="location">${data.name}</div>
              <div class="condition">${desc}</div>
            </div>
          </div>
        </div>
      `;
      
      await fetchNewsByCountry(userCountryCode.toLowerCase());
    } catch (err) {
      console.log('Location access denied or failed, using default');
      geolocationPermissionRequested = false; // Reset so it can try again later
      await fallbackLocation();
    }
  } else {
    await fallbackLocation();
  }
}

function getWeatherIcon(condition) {
  const icons = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '❄️',
    'Mist': '🌫️',
    'Fog': '🌫️'
  };
  return icons[condition] || '🌤️';
}

async function fallbackLocation() {
  userCountryCode = 'US';
  await fetchWeather(40.7128, -74.0060);
  await fetchNewsByCountry('us');
}

// Enhanced Professional Weather Function
async function fetchWeather(lat, lon) {
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);
    const data = await res.json();
    const temp = Math.round(data.main.temp);
    const desc = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
    const condition = data.weather[0].main;
    const icon = getWeatherIcon(condition);
    
    document.getElementById("weather").innerHTML = `
      <div class="weather-card-professional">
        <div class="weather-header">
          <span class="weather-title">Weather</span>
        </div>
        <div class="weather-content">
          <div class="weather-main">
            <span class="weather-icon">${icon}</span>
            <div class="weather-temp">
              <span class="temp-value">${temp}°</span>
              <span class="temp-unit">C</span>
            </div>
          </div>
          <div class="weather-info">
            <div class="location">${data.name}</div>
            <div class="condition">${desc}</div>
          </div>
        </div>
      </div>
    `;
  } catch {
    document.getElementById("weather").innerHTML = `
      <div class="weather-card-professional">
        <div class="weather-header">
          <span class="weather-title">Weather</span>
        </div>
        <div class="weather-content">
          <div class="weather-main">
            <span class="weather-icon">🌤️</span>
            <div class="weather-temp">
              <span class="temp-value">--</span>
              <span class="temp-unit">°</span>
            </div>
          </div>
          <div class="weather-info">
            <div class="location">Weather unavailable</div>
            <div class="condition">Check connection</div>
          </div>
        </div>
      </div>
    `;
  }
}

// Enhanced News System with Better Sources
async function fetchNewsByCountry(country = 'us') {
  const newsEl = document.getElementById("news");
  newsEl.innerHTML = '<div class="loading-skeleton">Loading news...</div>';
  
  try {
    // Use Google News directly - no API needed
    const countryUrls = {
      'us': 'https://news.google.com',
      'gb': 'https://news.google.co.uk',
      'in': 'https://news.google.co.in',
      'ca': 'https://news.google.ca',
      'au': 'https://news.google.com.au',
      'bd': 'https://news.google.com'
    };
    const newsUrl = countryUrls[country.toLowerCase()] || 'https://news.google.com';
    newsEl.innerHTML = `<img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'><text y='16' font-size='16'>📰</text></svg>" alt="News" class="news-icon" /><a href="${newsUrl}" target="_blank" class="news-link">Latest Headlines 📰</a>`;
  } catch (error) {
    // Fallback to general Google News
    newsEl.innerHTML = '<img src="data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'currentColor\'><text y=\'16\' font-size=\'16\'>📰</text></svg>" alt="News" class="news-icon" /><a href="https://news.google.com" target="_blank" class="news-link">Latest Headlines 📰</a>';
  }
}

// Enhanced Detail View
async function showDetail(day, month, year) {
  // Debug: Log what we're receiving
  console.log('showDetail called with:', { day, month, year });
  
  // Create date properly - month is 0-indexed
  const date = new Date(year, month, day);
  console.log('Created date object:', date.toDateString());
  
  // Update header to show selected date
  const bigDate = document.getElementById('bigDate');
  const dateLabel = document.getElementById('dateLabel');
  const dayName = document.getElementById('dayName');
  
  if (bigDate) bigDate.textContent = date.getDate();
  if (dateLabel) {
    const dateLabelText = date.toLocaleDateString('en-US', {month:'long', year:'numeric'});
    dateLabel.textContent = dateLabelText;
  }
  if (dayName) {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    dayName.textContent = weekdays[date.getDay()];
  }
  
  // Check if elements exist before setting them
  const detailDateEl = document.getElementById('detailTitle');
  const detailTimeEl = document.getElementById('detailTime');
  const weatherEl = document.getElementById("weather");
  const newsEl = document.getElementById("news");
  const holidayEl = document.getElementById("holiday");
  
  if (detailDateEl) {
    // Format date manually to avoid timezone issues
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Use local date methods to avoid timezone issues
    const weekdayName = weekdays[date.getDay()];
    const monthName = months[date.getMonth()];
    const dayNum = date.getDate();
    const yearNum = date.getFullYear();
    
    const formattedDate = `${weekdayName}, ${monthName} ${dayNum}, ${yearNum}`;
    console.log('Setting detail date to:', formattedDate);
    detailDateEl.textContent = formattedDate;
  }
  if (detailTimeEl) {
    detailTimeEl.textContent = dataManager.preferences.timeFormat === '24h' ? formatTime24(new Date()) : formatTime12(new Date());
  }
  
  if (weatherEl) {
    weatherEl.innerHTML = '<div class="loading-skeleton">Loading weather...</div>';
  }
  if (newsEl) {
    newsEl.innerHTML = '<div class="loading-skeleton">Loading news...</div>';
  }
  if (holidayEl) {
    holidayEl.innerHTML = '<div class="loading-skeleton">Loading holiday info...</div>';
  }
  
  const overlay = document.getElementById('detailOverlay');
  overlay.style.display = 'flex';
  setTimeout(() => overlay.style.opacity = '1', 100);
  
  await getLocationAndLoad();
  
  // Show events for this date in the Special Day section
  const events = eventManager.getEventsForDate(date);
  
  if (events && events.length > 0) {
    const eventsList = events.map(event => {
      const time = event.time ? `<strong>${event.time}</strong> ` : '';
      return `${time}${event.title}`;
    }).join('<br>');
    holidayEl.innerHTML = `<img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'><text y='16' font-size='16'>📝</text></svg>" alt="Events" class="holiday-icon" /><div><strong>${events.length} Event${events.length > 1 ? 's' : ''}</strong><br><span style="font-size: 0.9rem; color: var(--text-secondary);">${eventsList}</span></div>`;
  } else {
    const holiday = await getHolidayForDate(day, month, year);
    if (holiday) {
      holidayEl.innerHTML = `<img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'><text y='16' font-size='16'>🎉</text></svg>" alt="Holiday" class="holiday-icon" /><a href="https://www.google.com/search?q=${encodeURIComponent(holiday)}" target="_blank" class="holiday-link">${holiday}</a>`;
    } else {
      holidayEl.innerHTML = '<img src="data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'currentColor\'><text y=\'16\' font-size=\'16\'>📅</text></svg>" alt="Calendar" class="holiday-icon" />Regular day';
    }
  }
  
  dataManager.updateStatistics('detailView');
}

// Close Detail
document.getElementById('closeBtn').onclick = () => {
  const overlay = document.getElementById('detailOverlay');
  overlay.style.opacity = '0';
  setTimeout(() => overlay.style.display = 'none', 1200);
  dataManager.updateStatistics('detailClose');
};

// Enhanced Navigation
document.getElementById('prevBtn').onclick = async () => { 
  currentMonth = (currentMonth - 1 + 12) % 12; 
  if (currentMonth === 11) currentYear--; 
  monthSelect.value = currentMonth; 
  yearInput.value = currentYear; 
  await renderCalendar(); 
  updateCurrentDateDisplay();
  dataManager.updateStatistics('navigationPrev');
};

document.getElementById('nextBtn').onclick = async () => { 
  currentMonth = (currentMonth + 1) % 12; 
  if (currentMonth === 0) currentYear++; 
  monthSelect.value = currentMonth; 
  yearInput.value = currentYear; 
  await renderCalendar(); 
  updateCurrentDateDisplay();
  dataManager.updateStatistics('navigationNext');
};

document.getElementById('homeBtn').onclick = async () => { 
  currentMonth = today.getMonth(); 
  currentYear = today.getFullYear(); 
  monthSelect.value = currentMonth; 
  yearInput.value = currentYear; 
  await renderCalendar(); 
  updateCurrentDateDisplay();
  dataManager.updateStatistics('homeNavigation');
};

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey) {
    switch(e.key) {
      case 'h':
        e.preventDefault();
        document.getElementById('homeBtn').click();
        break;
      case 's':
        e.preventDefault();
        document.querySelector('.settings-toggle').click();
        break;

    }
  }
  
  switch(e.key) {
    case 'ArrowLeft':
      document.getElementById('prevBtn').click();
      break;
    case 'ArrowRight':
      document.getElementById('nextBtn').click();
      break;
    case 't':
      document.getElementById('themeToggle').click();
      break;
  }
});

// Initialize Application
feather.replace();

// Apply saved theme
document.body.setAttribute('data-theme', dataManager.preferences.theme);
document.getElementById('themeIcon').setAttribute('data-feather', dataManager.preferences.theme === 'dark' ? 'moon' : 'sun');

// Apply time format
if (dataManager.preferences.timeFormat === '24h') {
  document.getElementById('liveTime').textContent = formatTime24(new Date());
}

// Initialize application
async function initializeApp() {
  await renderCalendar();
  // Initialize statistics tracking
  dataManager.updateStatistics('appStart');
  
  // Initialize managers
  const settingsManager = new SettingsManager();
  const eventManager = new EventManager();
}

// Permission Management
let permissionsRequested = {
  notifications: false,
  geolocation: false
};

async function requestPermissions() {
  // Request notifications permission with user notice
  if (!permissionsRequested.notifications && 'Notification' in window && Notification.permission === 'default') {
    permissionsRequested.notifications = true;
    setTimeout(() => {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notifications enabled');
        }
      });
    }, 1000); // Delay to show the notice first
  }
  
  // Request geolocation permission with user notice
  if (!permissionsRequested.geolocation && navigator.geolocation) {
    permissionsRequested.geolocation = true;
    setTimeout(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location access granted');
        },
        (error) => {
          console.log('Location access denied or failed');
        },
        { timeout: 3000 }
      );
    }, 1500); // Delay to show the notice first
  }
}

// Show permission notice
function showPermissionNotice() {
  const notice = document.createElement('div');
  notice.className = 'permission-notice';
  notice.innerHTML = `
    <div class="permission-content">
      <div class="permission-icon">🔔</div>
      <h3>Enable Enhanced Features</h3>
      <p>Allow notifications and location access to see real-time weather, news, and personalized content for your perfect day experience.</p>
      <div class="permission-features">
        <div class="feature">📍 Location-based weather</div>
        <div class="feature">📰 Regional news</div>
        <div class="feature">🔔 Smart notifications</div>
      </div>
      <p class="permission-note">You can change these settings anytime in the app preferences.</p>
    </div>
  `;
  document.body.appendChild(notice);
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    if (notice.parentNode) {
      notice.classList.add('fade-out');
      setTimeout(() => notice.remove(), 500);
    }
  }, 5000);
}

// Hide splash screen
function hideSplashScreen() {
  const splashScreen = document.getElementById('splashScreen');
  if (splashScreen) {
    splashScreen.classList.add('fade-out');
    setTimeout(() => {
      splashScreen.style.display = 'none';
    }, 800);
  }
}

// Start the application with splash screen
async function startApplication() {
  // Show permission notice
  showPermissionNotice();
  
  // Request permissions
  await requestPermissions();
  
  try {
    await initializeApp();
    
    // Hide splash screen after initialization
    hideSplashScreen();
    
    console.log('Application initialized successfully');
  } catch (error) {
    console.error('Failed to initialize application:', error);
    hideSplashScreen();
  }
}

// Start the application
startApplication();