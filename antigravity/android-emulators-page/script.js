document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.cursor-light');
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Glitch effect on title hover
const title = document.querySelector('.glitch');
title.addEventListener('mouseover', () => {
    title.style.textShadow = `
        2px 2px 0px var(--accent-purple),
        -2px -2px 0px var(--accent-green)
    `;
});

title.addEventListener('mouseout', () => {
    title.style.textShadow = '0 0 20px var(--accent-blue)';
});
