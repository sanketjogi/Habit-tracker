import { state } from '../state.js';

export function openDatabaseModal() {
    let container = document.getElementById('database-modal-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'database-modal-container';
        document.body.appendChild(container);
    }

    const { habits } = state.data;

    let habitListHtml = habits.length === 0 
        ? `<p style="color: var(--text-secondary); text-align: center;">No habits found.</p>`
        : habits.map(h => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); border-radius: 8px; margin-bottom: 8px;">
                <div>
                    <div style="font-weight: 500; font-size: 0.95rem; display: flex; align-items: center; gap: 6px;">
                        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${h.type === 'good' ? 'var(--accent-good)' : 'var(--accent-bad)'};"></span>
                        ${h.title}
                    </div>
                    <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 4px;">Area: ${h.area}</div>
                </div>
                <button class="icon-btn delete-habit-btn" data-id="${h.id}" title="Delete Habit" style="background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.2); color: #ef4444;">
                    <i data-lucide="trash-2" style="width: 16px;"></i>
                </button>
            </div>
        `).join('');

    let html = `
        <div class="modal-overlay" id="database-overlay" style="position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(5px); z-index: 1000; display: flex; align-items: center; justify-content: center;">
            <div class="glass-deep" style="width: 90%; max-width: 500px; padding: 24px; position: relative; animation: popIn 0.3s ease;">
                <button id="close-database" class="icon-btn" style="position: absolute; top: 16px; right: 16px; background: transparent; border: none;">
                    <i data-lucide="x"></i>
                </button>
                <h2 style="margin-bottom: 8px; font-size: 1.5rem; display: flex; align-items: center; gap: 8px;">
                    <i data-lucide="database"></i> Habit Database
                </h2>
                <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 24px;">Manage and delete your created habits.</p>
                
                <div style="max-height: 400px; overflow-y: auto; padding-right: 8px;">
                    ${habitListHtml}
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
    if(window.lucide) lucide.createIcons();

    // Event Listeners
    document.getElementById('close-database').onclick = () => container.innerHTML = '';
    document.getElementById('database-overlay').onclick = (e) => {
        if (e.target.id === 'database-overlay') container.innerHTML = '';
    };

    const deleteBtns = container.querySelectorAll('.delete-habit-btn');
    deleteBtns.forEach(btn => {
        btn.onclick = () => {
            if(confirm("Are you sure you want to delete this habit? All history will be lost.")) {
                const idToDelete = btn.getAttribute('data-id');
                state.data.habits = state.data.habits.filter(h => h.id !== idToDelete);
                
                import('../state.js').then(module => {
                    module.forceUpdate();
                });
                
                // Refresh modal
                openDatabaseModal(); 
            }
        };
    });
}
