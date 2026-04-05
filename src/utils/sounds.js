// Utilities for Sound Effects using Web Audio API

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, type, duration, vol) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
  
  gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
}

export const sounds = {
  click: () => playTone(800, 'sine', 0.1, 0.1),
  ding: () => {
    playTone(900, 'sine', 0.2, 0.1);
    setTimeout(() => playTone(1200, 'sine', 0.4, 0.1), 100);
  },
  error: () => playTone(300, 'sawtooth', 0.2, 0.1),
  chime: () => {
    playTone(523.25, 'sine', 0.3, 0.1); // C5
    setTimeout(() => playTone(659.25, 'sine', 0.3, 0.1), 100); // E5
    setTimeout(() => playTone(783.99, 'sine', 0.6, 0.1), 200); // G5
  },
  alarm: () => {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => playTone(800, 'square', 0.2, 0.1), i * 400);
      setTimeout(() => playTone(1000, 'square', 0.2, 0.1), i * 400 + 200);
    }
  }
};
