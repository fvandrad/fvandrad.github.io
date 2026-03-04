// Reveal elements on scroll
function reveal() {
    var reveals = document.querySelectorAll(".reveal");

    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 100;

        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }

    // Interactive choir light effect
    var choirLight = document.querySelector('.choir-light-effect');
    if (choirLight) {
        var worshipSectionTop = document.getElementById('celestial-worship').getBoundingClientRect().top;
        if (worshipSectionTop < windowHeight && worshipSectionTop > -windowHeight) {
            var scrollPercent = 1 - (worshipSectionTop / windowHeight);
            choirLight.style.opacity = Math.min(1, Math.max(0.3, scrollPercent));
        }
    }
}

window.addEventListener("scroll", reveal);

// Trigger reveal on load
document.addEventListener("DOMContentLoaded", () => {
    // Initial reveal for elements already in viewport
    setTimeout(reveal, 100);
    initParticles();
});

// Particles System for floating bright particles (like divine sparks)
function initParticles() {
    const canvas = document.getElementById("celestial-particles");
    const ctx = canvas.getContext("2d");

    let particlesArray;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5 - 0.5; // moving slowly upwards
            this.color = Math.random() > 0.5 ? 'rgba(249, 229, 150, 0.8)' : 'rgba(255, 255, 255, 0.8)';
            this.glow = Math.random() * 10 + 5;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Loop around screen
            if (this.y < 0) this.y = canvas.height;
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = this.glow;
            ctx.shadowColor = this.color;
            ctx.fill();
        }
    }

    function generateParticles() {
        particlesArray = [];
        let numberOfParticles = (canvas.width * canvas.height) / 10000;
        // Limit to prevent lag
        if (numberOfParticles > 150) numberOfParticles = 150;

        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animateParticles() {
        // Clear canvas but leave trail effect by using semi-transparent fill
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }

    generateParticles();
    animateParticles();
}
