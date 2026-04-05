import { state, subscribe } from '../state.js';
import { getTodayStr } from '../utils/dates.js';

export function renderCompletedHabits() {
    const containerGood = document.getElementById('calendar-good');
    const containerBad = document.getElementById('calendar-bad');

    function generateCalendar(habits, isGood) {
        // We'll generate a 30-day simplified matrix
        let html = '';
        
        let daysHtml = '';
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            
            // Collect habit icons for this day
            let completedIcons = '';
            habits.forEach(h => {
                const logs = isGood ? h.completions : h.logs;
                if (logs && logs.includes(dateStr)) {
                    completedIcons += `<div style="width: 8px; height: 8px; border-radius: 50%; background: ${isGood ? 'var(--accent-good)' : 'var(--accent-bad)'};"></div>`;
                }
            });

            // If empty, subtle dot layer
            if (completedIcons === '') {
                completedIcons = `<div style="width: 4px; height: 4px; border-radius: 50%; background: var(--glass-border);"></div>`;
            }

            daysHtml += `
                <div style="aspect-ratio: 1; border-radius: 6px; background: rgba(255,255,255,0.03); display: flex; flex-wrap: wrap; gap: 2px; padding: 4px; align-content: flex-start; justify-content: center; position: relative;" title="${dateStr}">
                    ${completedIcons}
                    ${i === 0 ? `<div style="position: absolute; bottom: 2px; left: 50%; transform: translateX(-50%); width: 10px; height: 2px; background: var(--text-primary); border-radius: 2px;"></div>` : ''}
                </div>
            `;
        }

        html += `
            <div style="margin-bottom: 24px;">
                <h4 style="margin-bottom: 12px; color: ${isGood ? 'var(--text-primary)' : 'var(--text-secondary)'}; font-weight: 500;">
                    ${isGood ? 'Completed Good Habits (Last 30 Days)' : 'Completed Bad Habits (Last 30 Days)'}
                </h4>
                <div class="glass" style="padding: 16px;">
                    <div style="display: grid; grid-template-columns: repeat(10, 1fr); gap: 6px;">
                        ${daysHtml}
                    </div>
                </div>
            </div>
        `;
        return html;
    }

    function render() {
        const { habits } = state.data;
        const goodHabits = habits.filter(h => h.type === 'good');
        const badHabits = habits.filter(h => h.type === 'bad');

        if (containerGood) containerGood.innerHTML = generateCalendar(goodHabits, true);
        if (containerBad) containerBad.innerHTML = generateCalendar(badHabits, false);
    }

    render();
    subscribe(render);
}
