import { state } from '../state.js';

export function openLayoutManager() {
    let container = document.getElementById('layout-modal-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'layout-modal-container';
        document.body.appendChild(container);
    }

    const { layout } = state.data;
    
    const availableSections = [
        { id: 'section-banner', name: 'Hero Banner' },
        { id: 'section-status', name: 'Status Profile' },
        { id: 'section-timer', name: 'Pomodoro Timer' },
        { id: 'section-rewards', name: 'Rewards Shop' },
        { id: 'section-quickaction', name: 'Quick Actions' },
        { id: 'section-lifeareas', name: 'Life Areas' },
        { id: 'section-goodhabits', name: 'Daily Good Habits' },
        { id: 'section-badhabits', name: 'Daily Bad Habits' },
        { id: 'section-calendar-good', name: 'Completed Good (Calendar)' },
        { id: 'section-calendar-bad', name: 'Completed Bad (Calendar)' }
    ];

    let togglesHtml = availableSections.map(sec => {
        const isVisible = layout.includes(sec.id);
        return `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--glass-bg); border-radius: 8px; margin-bottom: 8px;">
                <span style="font-size: 0.9rem; font-weight: 500;">${sec.name}</span>
                <input type="checkbox" class="layout-toggle" data-id="${sec.id}" ${isVisible ? 'checked' : ''} style="accent-color: var(--accent-good); width: 18px; height: 18px;">
            </div>
        `;
    }).join('');

    let html = `
        <div class="modal-overlay" id="layout-overlay" style="position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(5px); z-index: 1000; display: flex; align-items: center; justify-content: center;">
            <div class="glass-deep" style="width: 90%; max-width: 400px; padding: 24px; position: relative; animation: popIn 0.3s ease;">
                <button id="close-layout" class="icon-btn" style="position: absolute; top: 16px; right: 16px; background: transparent; border: none;">
                    <i data-lucide="x"></i>
                </button>
                <h2 style="margin-bottom: 24px; font-size: 1.5rem;">Layout Visibility</h2>
                <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 16px;">Toggle which widgets appear on your dashboard.</p>
                
                <div style="max-height: 400px; overflow-y: auto;">
                    ${togglesHtml}
                </div>

                <button id="save-layout" class="btn-primary btn-large" style="width: 100%; margin-top: 16px;">Update Layout</button>
            </div>
        </div>
    `;

    container.innerHTML = html;
    if(window.lucide) lucide.createIcons();

    document.getElementById('close-layout').onclick = () => container.innerHTML = '';
    document.getElementById('layout-overlay').onclick = (e) => {
        if (e.target.id === 'layout-overlay') container.innerHTML = '';
    };

    document.getElementById('save-layout').onclick = () => {
        const checkboxes = container.querySelectorAll('.layout-toggle');
        const newLayout = [];
        checkboxes.forEach(cb => {
            if (cb.checked) newLayout.push(cb.getAttribute('data-id'));
            
            // Also directly toggle DOM element visibility
            const domEl = document.getElementById(cb.getAttribute('data-id'));
            if (domEl) domEl.style.display = cb.checked ? 'block' : 'none';
        });

        state.data.layout = newLayout;
        
        // Save
        import('../state.js').then(module => {
            module.forceUpdate();
        });

        container.innerHTML = ''; // close
    };
}

export function applyLayout() {
    // Initial apply on load
    const { layout } = state.data;
    const allSections = document.querySelectorAll('.section-wrapper');
    allSections.forEach(sec => {
        if (!layout.includes(sec.id)) {
            sec.style.display = 'none';
        } else {
            sec.style.display = 'block';
        }
    });
}
