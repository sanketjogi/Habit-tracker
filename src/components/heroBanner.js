import { state, subscribe } from '../state.js';

export function renderBanner() {
    const container = document.getElementById('hero-banner');
    if (!container) return;

    function render() {
        const { profile } = state.data;
        
        container.innerHTML = `
            <div class="hero-image-wrapper" style="position: relative; height: 250px; border-radius: 24px; overflow: hidden; margin-bottom: 24px;">
                <img src="${profile.bannerImage}" style="width: 100%; height: 100%; object-fit: cover; filter: brightness(0.8);" />
            </div>
        `;
    }

    render();
    subscribe(render);
}
