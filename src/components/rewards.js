import { state, subscribe, claimReward } from '../state.js';

export function renderRewards() {
    const container = document.getElementById('rewards-panel');
    if (!container) return;

    function render() {
        const { rewards, profile } = state.data;
        
        let html = `
            <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="display: flex; align-items: center; gap: 8px; color: #fbbf24;">
                    <i data-lucide="gift" style="width: 18px;"></i> Rewards
                </h3>
            </div>
            <div style="display: flex; flex-direction: column; gap: 12px;">
        `;

        rewards.forEach(reward => {
            const canAfford = profile.xp >= reward.cost;
            html += `
                <div class="glass" style="padding: 16px; display: flex; justify-content: space-between; align-items: center; border-radius: 12px; border-left: 4px solid ${canAfford ? '#fbbf24' : 'var(--glass-border)'};">
                    <div>
                        <div style="font-weight: 600; font-size: 0.95rem; margin-bottom: 4px;">${reward.title}</div>
                        <div style="font-size: 0.75rem; color: var(--text-secondary);">Cost: ${reward.cost} XP</div>
                    </div>
                    <button class="claim-btn btn-primary" data-id="${reward.id}" ${canAfford ? '' : 'disabled'} style="padding: 6px 12px; font-size: 0.8rem; border-radius: 8px; opacity: ${canAfford ? '1' : '0.5'}; cursor: ${canAfford ? 'pointer' : 'not-allowed'};">
                        Claim
                    </button>
                </div>
            `;
        });
        
        html += `</div>`;
        container.innerHTML = html;
        if(window.lucide) lucide.createIcons();

        // Attach listeners
        document.querySelectorAll('.claim-btn').forEach(btn => {
            btn.onclick = () => {
                const id = btn.getAttribute('data-id');
                if (claimReward(id)) {
                    // Quick visual feedback on button
                    btn.innerText = "Claimed!";
                    btn.style.background = "var(--accent-good)";
                    setTimeout(() => render(), 1000);
                }
            };
        });
    }

    render();
    subscribe(render);
}
