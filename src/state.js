import { syncStateToCloud, loadStateFromCloud } from './firebase.js';
import { getTodayStr, calculateStreak } from './utils/dates.js';
import { haptics } from './utils/haptics.js';

// Default initial state
const defaultState = {
  profile: {
    username: "Player 1",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    xp: 0,
    level: 1,
    theme: "dark",
    bannerImage: "assets/banner_hero.png"
  },
  habits: [
    { id: 'h1', title: 'Deep Work', type: 'good', area: 'Work', image: 'assets/habit_deep_work.png', completions: [] },
    { id: 'h2', title: 'Workout', type: 'good', area: 'Fitness', image: 'assets/habit_workout.png', completions: [] },
    { id: 'h3', title: 'Healthy Diet', type: 'good', area: 'Health', image: 'assets/habit_healthy_diet.png', completions: [] },
    { id: 'h4', title: 'Reading', type: 'good', area: 'Self Improvement', image: 'assets/habit_reading.png', completions: [] },
    { id: 'h5', title: 'Good Sleep', type: 'good', area: 'Health', image: 'assets/habit_good_sleep.png', completions: [] },
    { id: 'b1', title: 'Alcohol', type: 'bad', area: 'Health', image: 'assets/habit_alcohol.png', logs: [] },
    { id: 'b2', title: 'Fast Food', type: 'bad', area: 'Health', image: 'assets/habit_healthy_diet.png', logs: [] }, // Temp asset until quota refreshes
    { id: 'b3', title: 'High Screen Time', type: 'bad', area: 'Self Improvement', image: 'assets/habit_deep_work.png', logs: [] },// Temp asset
  ],
  lifeAreas: [
    { id: 'a1', title: 'Health', image: 'assets/area_health.png' },
    { id: 'a2', title: 'Self Improvement', image: 'assets/area_self_improvement.png' },
    { id: 'a3', title: 'Work', image: 'assets/area_work.png' },
    { id: 'a4', title: 'Fitness', image: 'assets/area_fitness.png' }
  ],
  rewards: [
    { id: 'r1', title: '🚬 Smoke Break', cost: 30, claimed: 0 },
    { id: 'r2', title: '🚶 Go for a Walk', cost: 20, claimed: 0 },
    { id: 'r3', title: '🎬 Watch a Movie', cost: 50, claimed: 0 },
    { id: 'r4', title: '🎮 Gaming Session', cost: 60, claimed: 0 },
    { id: 'r5', title: '🛍️ Buy Something', cost: 150, claimed: 0 }
  ],
  settings: {
    timerWork: 25,
    timerBreak: 5,
    soundVolume: 0.5
  },
  layout: [
    'section-banner', 
    'section-status', 'section-timer', 'section-rewards', 
    'section-quickaction', 'section-lifeareas', 
    'section-goodhabits', 'section-badhabits',
    'section-calendar-good', 'section-calendar-bad'
  ]
};

export const state = {
  data: JSON.parse(JSON.stringify(defaultState)),
  user: null,
  listeners: []
};

// Calculate level based on curve: Level = sqrt(XP / 10)
export function calculateLevel(xp) {
    if (xp < 0) return 1;
    return Math.max(1, Math.floor(Math.sqrt(xp / 10)) + 1);
}

export function subscribe(listener) {
  state.listeners.push(listener);
}

function notify() {
  state.listeners.forEach(l => l(state.data));
  saveState();
}

let syncTimeout;
function saveState() {
  localStorage.setItem('habitState', JSON.stringify(state.data));
  
  if (state.user) {
    clearTimeout(syncTimeout);
    syncTimeout = setTimeout(() => {
      syncStateToCloud(state.user.uid, state.data);
    }, 1000); // Debounce cloud sync
  }
}

export function addXP(amount) {
  const oldLevel = calculateLevel(state.data.profile.xp);
  state.data.profile.xp += amount;
  if(state.data.profile.xp < 0) state.data.profile.xp = 0;
  
  const newLevel = calculateLevel(state.data.profile.xp);
  if (newLevel > oldLevel) {
      haptics.heavy();
      // TODO: Trigger level up animation via event or direct DOM manipulation
      console.log("LEVEL UP to ", newLevel);
  }
  notify();
}

export function deductXP(amount) {
  state.data.profile.xp -= amount;
  if (state.data.profile.xp < 0) state.data.profile.xp = 0;
  notify();
}

export function completeHabit(habitId, dateStr = getTodayStr()) {
  const habit = state.data.habits.find(h => h.id === habitId);
  if (!habit) return;

  if (habit.type === 'good') {
      if (!habit.completions.includes(dateStr)) {
          habit.completions.push(dateStr);
          addXP(10);
          haptics.medium();
      } else {
          // Undo completion
          habit.completions = habit.completions.filter(d => d !== dateStr);
          deductXP(10);
      }
  } else if (habit.type === 'bad') {
      if (!habit.logs) habit.logs = [];
      if (!habit.logs.includes(dateStr)) {
          habit.logs.push(dateStr);
          deductXP(5);
          haptics.error();
      } else {
           // Undo log
          habit.logs = habit.logs.filter(d => d !== dateStr);
          addXP(5);
      }
  }
  notify();
}

export function claimReward(rewardId) {
    const reward = state.data.rewards.find(r => r.id === rewardId);
    if (!reward) return false;
    
    if (state.data.profile.xp >= reward.cost) {
        state.data.profile.xp -= reward.cost;
        reward.claimed = (reward.claimed || 0) + 1;
        haptics.heavy();
        notify();
        return true;
    }
    haptics.error();
    return false;
}

export function forceUpdate() {
    notify();
}

export async function initApp(user) {
  state.user = user;
  
  if (user) {
      state.data.profile.username = user.displayName || state.data.profile.username;
      if (user.photoURL) state.data.profile.avatar = user.photoURL;
  }

  // Load local first for speed
  const localStr = localStorage.getItem('habitState');
  if (localStr) {
      try {
          state.data = { ...defaultState, ...JSON.parse(localStr) };
          
          // Migration: fix broken placeholder images from previous versions
          state.data.habits = state.data.habits.map(h => {
             if (h.image && h.image.includes('via.placeholder.com')) {
                 const defaultHabit = defaultState.habits.find(dh => dh.id === h.id);
                 if (defaultHabit) h.image = defaultHabit.image;
             }
             return h;
          });
      } catch(e) {}
  }

  // Then try cloud
  if (user) {
    const cloudState = await loadStateFromCloud(user.uid);
    if (cloudState) {
        // Simple merge (in real app, use timestamps to resolve conflicts)
        state.data = { ...state.data, ...cloudState };
    }
  }
  
  // Render initial app view
  renderApp();
  notify();
}

import { renderStatusWindow } from './components/statusWindow.js';
import { renderLifeAreas } from './components/lifeAreas.js';
import { renderDailyHabits } from './components/dailyHabits.js';
import { renderRewards } from './components/rewards.js';
import { renderBanner } from './components/heroBanner.js';
import { renderTimer } from './components/pomodoroTimer.js';
import { renderQuickAction } from './components/quickAction.js';
import { renderCompletedHabits } from './components/completedHabits.js';
import { applyLayout } from './components/layoutManager.js';

function renderApp() {
    renderBanner();
    renderStatusWindow();
    renderTimer();
    renderQuickAction();
    renderLifeAreas();
    renderDailyHabits();
    renderRewards();
    renderCompletedHabits();
    applyLayout();
}
