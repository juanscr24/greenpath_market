// Scroll reveal con Intersection Observer
const faders = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.2 });

faders.forEach(el => observer.observe(el));

// Overlay blur y oscurecer
const overlay = document.querySelector('.overlay');
let currentSection = "hero";

window.addEventListener('scroll', () => {
    const aboutTop = document.querySelector('.about').offsetTop;
    const contactTop = document.querySelector('.contact').offsetTop;
    const scrollY = window.scrollY;

    if (scrollY >= contactTop - 200) {
        if (currentSection !== "contact") {
            overlay.style.background = "rgba(0,0,0,0.59)";
            overlay.style.backdropFilter = "blur(6px)";
            currentSection = "contact";
        }
    } else if (scrollY >= aboutTop - 200) {
        if (currentSection !== "about") {
            overlay.style.background = "rgba(0, 0, 0, 0.50)";
            overlay.style.backdropFilter = "blur(4px)";
            currentSection = "about";
        }
    } else {
        if (currentSection !== "hero") {
            overlay.style.background = "rgba(0,0,0,0.45)";
            overlay.style.backdropFilter = "blur(0px)";
            currentSection = "hero";
        }
    }
});