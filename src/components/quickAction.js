// src/components/quickAction.js
export function renderQuickAction() {
    const container = document.getElementById('quick-action');
    if (!container) return;
    
    container.innerHTML = `
        <div class="glass-panel" style="padding: 16px; border-radius: 16px; margin-bottom: 24px; display: flex; gap: 12px; flex-wrap: wrap;">
            <button class="btn-primary" style="flex: 1; background: var(--glass-bg); border: 1px solid var(--accent-good); color: var(--text-primary); font-size: 0.9rem;">
                <i data-lucide="plus" style="width: 16px;"></i> Good Habit
            </button>
            <button class="btn-primary" style="flex: 1; background: var(--glass-bg); border: 1px solid var(--accent-bad); color: var(--text-primary); font-size: 0.9rem;">
                <i data-lucide="plus" style="width: 16px;"></i> Bad Habit
            </button>
            <button class="icon-btn" title="Database" style="flex: 0 0 40px; border-color: var(--glass-border);">
                <i data-lucide="database" style="width: 16px;"></i>
            </button>
        </div>
    `;
    if(window.lucide) lucide.createIcons();

    const btns = container.querySelectorAll('button');
    if (btns.length === 3) {
        btns[0].onclick = () => alert("Create Good Habit modal coming soon!");
        btns[1].onclick = () => alert("Create Bad Habit modal coming soon!");
        btns[2].onclick = () => alert("Habit Database overview coming soon!");
    }
}
