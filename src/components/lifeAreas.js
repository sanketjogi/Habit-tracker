import { state, subscribe } from '../state.js';

export function renderLifeAreas() {
    const container = document.getElementById('life-areas');
    if (!container) return;

    function render() {
        const { lifeAreas, habits } = state.data;
        
        let html = `
            <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="display: flex; align-items: center; gap: 8px;">
                    <i data-lucide="compass" style="width: 18px;"></i> Life Areas
                </h3>
            </div>
            <div style="display: flex; overflow-x: auto; gap: 16px; padding-bottom: 8px; scrollbar-width: none;">
        `;

        lifeAreas.forEach(area => {
            const areaHabitsCount = habits.filter(h => h.area === area.title).length;
            html += `
                <div class="glass" style="min-width: 180px; height: 120px; border-radius: 16px; overflow: hidden; position: relative; cursor: pointer; flex-shrink: 0;">
                    <img src="${area.image}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.6;" />
                    <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 12px; background: linear-gradient(transparent, rgba(0,0,0,0.8));">
                        <div style="font-weight: 600; font-size: 0.95rem;">${area.title}</div>
                        <div style="font-size: 0.75rem; color: var(--text-secondary);">${areaHabitsCount} Habits</div>
                    </div>
                </div>
            `;
        });
        
        // Add new button
        html += `
                <div class="glass" style="min-width: 120px; height: 120px; border-radius: 16px; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0;">
                    <i data-lucide="plus" style="color: var(--text-secondary);"></i>
                </div>
        `;

        html += `</div>`;
        container.innerHTML = html;
        if(window.lucide) lucide.createIcons();
    }

    render();
    subscribe(render);
}
