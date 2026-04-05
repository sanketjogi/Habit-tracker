import { state, subscribe } from '../state.js';

export function openSettings() {
    let container = document.getElementById('settings-panel-container');
    
    // Create it if it doesn't exist
    if (!container) {
        container = document.createElement('div');
        container.id = 'settings-panel-container';
        document.body.appendChild(container);
    }

    const { profile, settings } = state.data;

    let html = `
        <div class="modal-overlay" id="settings-overlay" style="position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(5px); z-index: 1000; display: flex; align-items: center; justify-content: center;">
            <div class="glass-deep" style="width: 90%; max-width: 400px; padding: 24px; position: relative; animation: popIn 0.3s ease;">
                <button id="close-settings" class="icon-btn" style="position: absolute; top: 16px; right: 16px; background: transparent; border: none;">
                    <i data-lucide="x"></i>
                </button>
                <h2 style="margin-bottom: 24px; font-size: 1.5rem;">Settings</h2>
                
                <div style="margin-bottom: 16px;">
                    <label style="display: block; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px;">Username</label>
                    <input type="text" id="setting-username" value="${profile.username}" style="width: 100%; background: var(--glass-bg); border: 1px solid var(--glass-border); color: var(--text-primary); padding: 12px; border-radius: 12px; outline: none; font-family: inherit;">
                </div>
                
                <div style="margin-bottom: 24px;">
                    <label style="display: block; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px;">Avatar URL</label>
                    <input type="text" id="setting-avatar" value="${profile.avatar}" style="width: 100%; background: var(--glass-bg); border: 1px solid var(--glass-border); color: var(--text-primary); padding: 12px; border-radius: 12px; outline: none; font-family: inherit;">
                </div>

                <h3 style="margin-bottom: 16px; font-size: 1.1rem; padding-top: 16px; border-top: 1px solid var(--glass-border);">Timer Options</h3>
                
                <div style="display: flex; gap: 16px; margin-bottom: 24px;">
                    <div style="flex: 1;">
                        <label style="display: block; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px;">Focus (min)</label>
                        <input type="number" id="setting-work" value="${settings.timerWork}" style="width: 100%; background: var(--glass-bg); border: 1px solid var(--glass-border); color: var(--text-primary); padding: 12px; border-radius: 12px; outline: none; font-family: inherit;">
                    </div>
                    <div style="flex: 1;">
                        <label style="display: block; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px;">Break (min)</label>
                        <input type="number" id="setting-break" value="${settings.timerBreak}" style="width: 100%; background: var(--glass-bg); border: 1px solid var(--glass-border); color: var(--text-primary); padding: 12px; border-radius: 12px; outline: none; font-family: inherit;">
                    </div>
                </div>

                <button id="save-settings" class="btn-primary btn-large" style="width: 100%;">Save Changes</button>
            </div>
        </div>
    `;

    container.innerHTML = html;
    if(window.lucide) lucide.createIcons();

    // Event Listeners
    document.getElementById('close-settings').onclick = () => {
        container.innerHTML = ''; // close modal
    };
    
    document.getElementById('settings-overlay').onclick = (e) => {
        if (e.target.id === 'settings-overlay') container.innerHTML = '';
    };

    document.getElementById('save-settings').onclick = () => {
        const newUsername = document.getElementById('setting-username').value;
        const newAvatar = document.getElementById('setting-avatar').value;
        const newWork = parseInt(document.getElementById('setting-work').value);
        const newBreak = parseInt(document.getElementById('setting-break').value);

        if (newUsername.trim()) state.data.profile.username = newUsername.trim();
        if (newAvatar.trim()) state.data.profile.avatar = newAvatar.trim();
        if (newWork > 0) state.data.settings.timerWork = newWork;
        if (newBreak > 0) state.data.settings.timerBreak = newBreak;
        
        // Notify state to trigger re-render of components
        import('../state.js').then(module => {
            // We use a small hack to trigger notify manually by calling a generic update
            // Since `notify` is internal to state.js, we just re-assign something to trigger it if needed,
            // or we add a forceUpdate() to state.js
            // Actually, let's just add `forceUpdate` to state.js
            module.forceUpdate();
        });

        container.innerHTML = ''; // close
    };
}
