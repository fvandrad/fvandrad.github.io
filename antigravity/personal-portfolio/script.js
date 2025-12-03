document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections and cards
    document.querySelectorAll('.project-card, .section-title, .about-text, .profile-card').forEach(el => {
        el.style.opacity = '0'; // Hide initially
        el.classList.add('fade-in-up'); // Add class but it needs trigger
        // Actually, let's remove the class and add it via observer for cleaner control
        el.classList.remove('fade-in-up');
        observer.observe(el);
    });

    // Dynamic header background on scroll
    const header = document.querySelector('.glass-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(10, 10, 10, 0.9)';
        } else {
            header.style.background = 'rgba(10, 10, 10, 0.7)';
        }
    });
});
