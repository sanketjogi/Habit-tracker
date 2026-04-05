// Utilities for Haptic Feedback
import { sounds } from './sounds.js';

export const haptics = {
  light: () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(20);
    }
    sounds.click();
  },
  medium: () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
    sounds.ding();
  },
  heavy: () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([100, 50, 100]);
    }
    sounds.chime();
  },
  error: () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([50, 50, 50, 50]);
    }
    sounds.error();
  }
};

// Helper for UI elements needing visual ripple
export function addRipple(event, element) {
  const circle = document.createElement("span");
  const diameter = Math.max(element.clientWidth, element.clientHeight);
  const radius = diameter / 2;

  const rect = element.getBoundingClientRect();
  
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - rect.left - radius}px`;
  circle.style.top = `${event.clientY - rect.top - radius}px`;
  circle.style.position = 'absolute';
  circle.style.borderRadius = '50%';
  circle.style.background = 'rgba(255, 255, 255, 0.3)';
  circle.style.transform = 'scale(0)';
  circle.style.animation = 'ripple 600ms linear';
  circle.style.pointerEvents = 'none';

  element.appendChild(circle);

  setTimeout(() => circle.remove(), 600);
}
