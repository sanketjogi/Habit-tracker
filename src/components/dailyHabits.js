import { state, subscribe, completeHabit } from '../state.js';
import { getTodayStr, isToday, calculateStreak } from '../utils/dates.js';

function renderHabitCard(habit, isGood) {
    const today = getTodayStr();
    const isCompletedObj = isGood ? habit.completions : habit.logs;
    const isCompletedToday = isCompletedObj && isCompletedObj.includes(today);
    
    let streakHtml = "";
    if (isGood) {
        const streak = calculateStreak(habit.completions);
        streakHtml = `<div style="font-size: 0.75rem; color: var(--accent-good);">🔥 ${streak} day streak</div>`;
    }

    const btnHtml = isGood 
        ? `<div class="habit-toggle ${isCompletedToday ? 'completed' : ''}" style="width: 24px; height: 24px; border-radius: 50%; border: 2px solid ${isCompletedToday ? 'var(--accent-good)' : 'var(--text-secondary)'}; display: flex; align-items: center; justify-content: center; cursor: pointer; background: ${isCompletedToday ? 'var(--accent-good)' : 'transparent'};">
            ${isCompletedToday ? '<i data-lucide="check" style="width: 14px; color: white;"></i>' : ''}
           </div>`
        : `<div class="habit-toggle ${isCompletedToday ? 'logged' : ''}" style="width: 24px; height: 24px; border-radius: 50%; border: 2px solid ${isCompletedToday ? 'var(--accent-bad)' : 'var(--text-secondary)'}; display: flex; align-items: center; justify-content: center; cursor: pointer; background: ${isCompletedToday ? 'var(--accent-bad)' : 'transparent'};">
            ${isCompletedToday ? '<i data-lucide="x" style="width: 14px; color: white;"></i>' : ''}
           </div>`;

    return `
        <div class="glass habit-card" data-id="${habit.id}" style="display: flex; flex-direction: column; border-radius: 16px; overflow: hidden; position: relative;">
            <div style="height: 100px; width: 100%; overflow: hidden;">
                <img src="${habit.image}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.7;">
            </div>
            <div style="padding: 16px; display: flex; align-items: center; justify-content: space-between;">
                <div>
                    <h4 style="margin-bottom: 4px; font-size: 0.95rem;">${habit.title}</h4>
                    ${streakHtml}
                    ${isCompletedToday ? `<div style="font-size: 0.7rem; color: ${isGood ? 'var(--accent-good)' : 'var(--accent-bad)'}; margin-top: 4px;">Recorded today</div>` : ''}
                </div>
                ${btnHtml}
            </div>
        </div>
    `;
}

export function renderDailyHabits() {
    const goodContainer = document.getElementById('daily-good-habits');
    const badContainer = document.getElementById('daily-bad-habits');

    function render() {
        const { habits } = state.data;
        const goodHabits = habits.filter(h => h.type === 'good');
        const badHabits = habits.filter(h => h.type === 'bad');

        if (goodContainer) {
            let html = `
                <div style="margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                     <h3 style="color: var(--accent-good);"><i data-lucide="calendar" style="width: 18px; display:inline-block; vertical-align:-3px;"></i> Daily Good Habits</h3>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px;">
            `;
            html += goodHabits.map(h => renderHabitCard(h, true)).join('');
            html += `</div>`;
            goodContainer.innerHTML = html;
        }

        if (badContainer) {
            let html = `
                <div style="margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                     <h3 style="color: var(--accent-bad);"><i data-lucide="calendar" style="width: 18px; display:inline-block; vertical-align:-3px;"></i> Daily Bad Habits</h3>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px;">
            `;
            html += badHabits.map(h => renderHabitCard(h, false)).join('');
            html += `</div>`;
            badContainer.innerHTML = html;
        }

        if(window.lucide) lucide.createIcons();

        // Attach listeners
        document.querySelectorAll('.habit-card').forEach(card => {
            const id = card.getAttribute('data-id');
            const toggle = card.querySelector('.habit-toggle');
            if (toggle) {
                toggle.onclick = (e) => {
                    e.stopPropagation();
                    const icon = toggle.querySelector('i');
                    if (icon) {
                        icon.style.transform = 'rotate(360deg)';
                        icon.style.transition = 'transform 0.3s ease';
                    }
                    setTimeout(() => completeHabit(id), 100);
                }
            }
        });
    }

    render();
    subscribe(render);
}
