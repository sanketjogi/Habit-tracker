import { state, subscribe, completeHabit } from '../state.js';
import { sounds } from '../utils/sounds.js';

let timerInterval;
let timerState = {
    timeLeft: 25 * 60,
    isRunning: false,
    mode: 'work' // 'work' or 'break'
};

export function renderTimer() {
    const container = document.getElementById('pomodoro-timer');
    if (!container) return;

    function formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    function renderView() {
        const { settings } = state.data;
        const totalTime = timerState.mode === 'work' ? settings.timerWork * 60 : settings.timerBreak * 60;
        const progress = 100 - ((timerState.timeLeft / totalTime) * 100);

        container.innerHTML = `
            <div class="glass" style="padding: 24px; text-align: center; border-radius: 20px; position: relative;">
                <div style="font-weight: 600; margin-bottom: 24px; color: ${timerState.mode === 'work' ? 'var(--accent-timer)' : 'var(--accent-good)'}">
                    ${timerState.mode === 'work' ? 'Focus Session' : 'Break Time'}
                </div>
                
                <div style="position: relative; width: 150px; height: 150px; margin: 0 auto 24px auto;">
                    <!-- SVG Circle Progress -->
                    <svg width="150" height="150" style="transform: rotate(-90deg);">
                        <circle cx="75" cy="75" r="70" fill="none" stroke="var(--glass-border)" stroke-width="8" />
                        <circle cx="75" cy="75" r="70" fill="none" stroke="${timerState.mode === 'work' ? 'var(--accent-timer)' : 'var(--accent-good)'}" stroke-width="8" stroke-dasharray="439.8" stroke-dashoffset="${439.8 - (progress / 100) * 439.8}" style="transition: stroke-dashoffset 1s linear;" />
                    </svg>
                    <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: 700; font-family: monospace;">
                        ${formatTime(timerState.timeLeft)}
                    </div>
                </div>

                <div style="display: flex; justify-content: center; gap: 12px;">
                    <button id="timer-toggle" class="btn-primary" style="background: ${timerState.isRunning ? 'var(--text-secondary)' : 'var(--text-primary)'}; width: 80px;">
                        ${timerState.isRunning ? 'Pause' : 'Start'}
                    </button>
                    <button class="icon-btn" id="timer-reset" title="Reset">
                        <i data-lucide="rotate-ccw" style="width: 18px;"></i>
                    </button>
                </div>
            </div>
        `;

        if(window.lucide) lucide.createIcons();

        document.getElementById('timer-toggle').onclick = () => {
            if (timerState.isRunning) {
                clearInterval(timerInterval);
                timerState.isRunning = false;
            } else {
                if (timerState.timeLeft <= 0) {
                     timerState.timeLeft = timerState.mode === 'work' ? settings.timerWork * 60 : settings.timerBreak * 60;
                }
                
                timerState.isRunning = true;
                timerInterval = setInterval(() => {
                    timerState.timeLeft--;
                    if (timerState.timeLeft <= 0) {
                        clearInterval(timerInterval);
                        timerState.isRunning = false;
                        sounds.alarm();
                        
                        // Auto log Deep Work if it was a work session
                        if (timerState.mode === 'work') {
                            const habit = state.data.habits.find(h => h.title === 'Deep Work');
                            if (habit) completeHabit(habit.id);
                            timerState.mode = 'break';
                            timerState.timeLeft = settings.timerBreak * 60;
                        } else {
                            timerState.mode = 'work';
                            timerState.timeLeft = settings.timerWork * 60;
                        }
                    }
                    renderView();
                }, 1000);
            }
            renderView();
        };

        document.getElementById('timer-reset').onclick = () => {
            clearInterval(timerInterval);
            timerState.isRunning = false;
            timerState.timeLeft = timerState.mode === 'work' ? settings.timerWork * 60 : settings.timerBreak * 60;
            renderView();
        };
    }

    // Initialize timer state from settings initially
    if (!timerState.initialized) {
         timerState.timeLeft = state.data.settings.timerWork * 60;
         timerState.initialized = true;
    }

    renderView();
    // Intentionally not subscribing to global state updates so timer doesn't re-render on unrelated changes
}
