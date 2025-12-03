// ===== LIGHT CASCADE EFFECT =====
class LightCascade {
    constructor() {
        this.canvas = document.getElementById('lightCascade');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 150;
        this.mouse = { x: null, y: null, radius: 150 };

        this.init();
        this.createParticles();
        this.animate();
        this.setupEventListeners();
    }

    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new Particle(this.canvas));
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles.forEach(particle => {
            particle.update(this.mouse);
            particle.draw(this.ctx);
        });

        // Connect nearby particles
        this.connectParticles();

        requestAnimationFrame(() => this.animate());
    }

    connectParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    const opacity = (1 - distance / 120) * 0.3;
                    this.ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.init();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }
}

// ===== PARTICLE CLASS =====
class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
        this.y = Math.random() * canvas.height; // Initial random position
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = -10;
        this.size = Math.random() * 3 + 1;
        this.speedY = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.3;

        // Color variations (purple, gold, white)
        const colors = [
            { r: 168, g: 85, b: 247 },   // Purple
            { r: 234, g: 179, b: 8 },    // Gold
            { r: 147, g: 197, b: 253 },  // Light blue
            { r: 255, g: 255, b: 255 }   // White
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];

        // Glow intensity
        this.glowIntensity = Math.random() * 0.5 + 0.5;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulsePhase = Math.random() * Math.PI * 2;
    }

    update(mouse) {
        // Falling motion
        this.y += this.speedY;
        this.x += this.speedX;

        // Sine wave motion for more organic feel
        this.x += Math.sin(this.y * 0.01) * 0.3;

        // Pulse effect
        this.pulsePhase += this.pulseSpeed;
        const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
        this.currentOpacity = this.opacity * pulse;

        // Mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                const angle = Math.atan2(dy, dx);
                this.x -= Math.cos(angle) * force * 3;
                this.y -= Math.sin(angle) * force * 3;
            }
        }

        // Reset particle when it goes off screen
        if (this.y > this.canvas.height + 10) {
            this.reset();
        }

        if (this.x < -10 || this.x > this.canvas.width + 10) {
            this.x = Math.random() * this.canvas.width;
        }
    }

    draw(ctx) {
        // Glow effect
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size * 4
        );

        gradient.addColorStop(0,
            `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.currentOpacity})`
        );
        gradient.addColorStop(0.5,
            `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.currentOpacity * 0.3})`
        );
        gradient.addColorStop(1,
            `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`
        );

        // Draw glow
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
        ctx.fill();

        // Draw core particle
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.currentOpacity * 1.5})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Add sparkle effect randomly
        if (Math.random() > 0.98) {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.currentOpacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all content sections
document.querySelectorAll('.content-section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    observer.observe(section);
});

// ===== CARD HOVER EFFECTS =====
const cards = document.querySelectorAll('.intro-card, .archangel-card, .symbol-card, .connection-card');

cards.forEach(card => {
    card.addEventListener('mouseenter', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.style.setProperty('--mouse-x', `${x}px`);
        this.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('mousemove', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = '';
    });
});

// ===== PARALLAX EFFECT ON SCROLL =====
let scrollPosition = 0;

window.addEventListener('scroll', () => {
    scrollPosition = window.pageYOffset;

    // Parallax for hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.transform = `translateY(${scrollPosition * 0.5}px)`;
        heroContent.style.opacity = 1 - (scrollPosition / 600);
    }
});

// ===== TYPING EFFECT FOR HERO SUBTITLE =====
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Apply typing effect after page load
window.addEventListener('load', () => {
    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) {
        const originalText = subtitle.textContent;
        setTimeout(() => {
            typeWriter(subtitle, originalText, 80);
        }, 500);
    }
});

// ===== FLOATING ANIMATION FOR ICONS =====
const icons = document.querySelectorAll('.card-icon, .archangel-icon, .symbol-icon');

icons.forEach((icon, index) => {
    icon.style.animation = `float 3s ease-in-out infinite`;
    icon.style.animationDelay = `${index * 0.2}s`;
});

// Add float keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-10px);
        }
    }
`;
document.head.appendChild(style);

// ===== INITIALIZE LIGHT CASCADE =====
window.addEventListener('load', () => {
    new LightCascade();
});

// ===== PERFORMANCE OPTIMIZATION =====
// Reduce particle count on mobile devices
if (window.innerWidth < 768) {
    LightCascade.prototype.particleCount = 75;
}

// ===== ACCESSIBILITY =====
// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// ===== EASTER EGG: ANGEL WINGS ON CLICK =====
let clickCount = 0;
const hero = document.querySelector('.hero');

hero.addEventListener('click', () => {
    clickCount++;

    if (clickCount === 7) {
        createWings();
        clickCount = 0;
    }
});

function createWings() {
    const wing = document.createElement('div');
    wing.textContent = '🪽';
    wing.style.position = 'fixed';
    wing.style.fontSize = '3rem';
    wing.style.left = '50%';
    wing.style.top = '50%';
    wing.style.transform = 'translate(-50%, -50%)';
    wing.style.pointerEvents = 'none';
    wing.style.zIndex = '9999';
    wing.style.animation = 'wingsFly 2s ease-out forwards';

    document.body.appendChild(wing);

    setTimeout(() => {
        wing.remove();
    }, 2000);
}

// Add wings animation
const wingsStyle = document.createElement('style');
wingsStyle.textContent = `
    @keyframes wingsFly {
        0% {
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -200%) scale(3) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(wingsStyle);
