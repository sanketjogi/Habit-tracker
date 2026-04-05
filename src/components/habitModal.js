import { state } from '../state.js';

export function openHabitModal(defaultType = 'good') {
    let container = document.getElementById('habit-modal-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'habit-modal-container';
        document.body.appendChild(container);
    }

    const { lifeAreas } = state.data;
    
    let areaOptions = lifeAreas.map(a => `<option value="${a.title}" style="color: black;">${a.title}</option>`).join('');

    let html = `
        <div class="modal-overlay" id="habit-overlay" style="position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(5px); z-index: 1000; display: flex; align-items: center; justify-content: center;">
            <div class="glass-deep" style="width: 90%; max-width: 400px; padding: 24px; position: relative; animation: popIn 0.3s ease;">
                <button id="close-habit" class="icon-btn" style="position: absolute; top: 16px; right: 16px; background: transparent; border: none;">
                    <i data-lucide="x"></i>
                </button>
                <h2 style="margin-bottom: 24px; font-size: 1.5rem;">New Habit</h2>
                
                <div style="margin-bottom: 16px;">
                    <label style="display: block; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px;">Habit Title</label>
                    <input type="text" id="habit-title" placeholder="e.g. Drink Water" style="width: 100%; background: var(--glass-bg); border: 1px solid var(--glass-border); color: var(--text-primary); padding: 12px; border-radius: 12px; outline: none; font-family: inherit;">
                </div>
                
                <div style="display: flex; gap: 16px; margin-bottom: 16px;">
                    <div style="flex: 1;">
                        <label style="display: block; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px;">Type</label>
                        <select id="habit-type" style="width: 100%; background: var(--glass-bg); border: 1px solid var(--glass-border); color: var(--text-primary); padding: 12px; border-radius: 12px; outline: none; font-family: inherit;">
                            <option value="good" style="color: black;" ${defaultType === 'good' ? 'selected' : ''}>Good Habit</option>
                            <option value="bad" style="color: black;" ${defaultType === 'bad' ? 'selected' : ''}>Bad Habit</option>
                        </select>
                    </div>
                    <div style="flex: 1;">
                        <label style="display: block; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px;">Life Area</label>
                        <select id="habit-area" style="width: 100%; background: var(--glass-bg); border: 1px solid var(--glass-border); color: var(--text-primary); padding: 12px; border-radius: 12px; outline: none; font-family: inherit;">
                            ${areaOptions}
                        </select>
                    </div>
                </div>

                <button id="save-habit" class="btn-primary btn-large" style="width: 100%; margin-top: 8px;">Create Habit</button>
            </div>
        </div>
    `;

    container.innerHTML = html;
    if(window.lucide) lucide.createIcons();

    document.getElementById('close-habit').onclick = () => container.innerHTML = '';
    document.getElementById('habit-overlay').onclick = (e) => {
        if (e.target.id === 'habit-overlay') container.innerHTML = '';
    };

    document.getElementById('save-habit').onclick = () => {
        const title = document.getElementById('habit-title').value.trim();
        const type = document.getElementById('habit-type').value;
        const area = document.getElementById('habit-area').value;

        if (!title) return;

        const newHabit = {
            id: 'h' + Date.now(),
            title: title,
            type: type,
            area: area,
            image: type === 'good' ? 'assets/habit_deep_work.png' : 'assets/habit_alcohol.png', // Default images
            completions: [],
            logs: []
        };

        state.data.habits.push(newHabit);
        
        import('../state.js').then(module => {
            module.forceUpdate();
        });

        container.innerHTML = ''; // close
    };
}
