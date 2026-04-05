import './style.css';
import { setupAuth } from './firebase.js';
import { initApp } from './state.js';
import { openSettings } from './components/settingsPanel.js';
import { openLayoutManager, applyLayout } from './components/layoutManager.js';

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  console.log("HabitForge: DOM loaded. Initializing...");
  
  // Theme Toggle Logic
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  
  // Check local preferences
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
  } else {
    // Force dark mode purely for the aesthetic
    html.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Attempt haptic
    if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
    }
  });

  // Basic stubs for buttons
  document.getElementById('settings-btn').addEventListener('click', () => {
      openSettings();
  });

  document.getElementById('layout-btn').addEventListener('click', () => {
      openLayoutManager();
  });

  // Init Auth and App logic
  setupAuth((user) => {
    const authScreen = document.getElementById('auth-screen');
    const appScreen = document.getElementById('app');

    if (user) {
      console.log("User signed in:", user.displayName);
      authScreen.classList.add('hidden');
      appScreen.classList.remove('hidden');
      initApp(user); // Initialize state, load data, render components
    } else {
      console.log("User signed out.");
      authScreen.classList.remove('hidden');
      appScreen.classList.add('hidden');
    }
  });
});
