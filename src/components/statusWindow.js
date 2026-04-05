import { state, subscribe, calculateLevel } from '../state.js';

export function renderStatusWindow() {
    const container = document.getElementById('status-window');
    if (!container) return;

    function render() {
        const { profile } = state.data;
        const level = calculateLevel(profile.xp);
        
        // Simple mock of progress to next level
        const nextLevelXP = 10 * Math.pow(level, 2);
        const prevLevelXP = level > 1 ? 10 * Math.pow(level - 1, 2) : 0;
        const progressPercent = Math.max(0, Math.min(100, Math.round(((profile.xp - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100)));

        container.innerHTML = `
            <div class="glass" style="padding: 24px;">
                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
                    <img src="${profile.avatar}" alt="Avatar" style="width: 64px; height: 64px; border-radius: 50%; border: 2px solid var(--accent-xp);">
                    <div>
                        <h2 style="margin: 0; font-size: 1.25rem;">${profile.username}</h2>
                        <div style="color: var(--accent-xp); font-size: 0.9rem; font-weight: 600;">Level ${level}</div>
                    </div>
                </div>
                
                <div style="margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 8px;">
                        <span>XP Progress</span>
                        <span>${profile.xp} / ${nextLevelXP} (${progressPercent}%)</span>
                    </div>
                    <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
                        <div style="width: ${progressPercent}%; height: 100%; background: var(--accent-xp); transition: width 0.3s ease;"></div>
                    </div>
                </div>
            </div>
        `;
    }

    render();
    subscribe(render);
}
