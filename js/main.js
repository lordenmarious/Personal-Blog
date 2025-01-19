// Fade in elements with animation
document.addEventListener('DOMContentLoaded', () => {
    // Fade in gallery items sequentially
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
    });
});

// Form validation
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add form validation logic here
        alert('Form submitted! (This is just a demo)');
    });
} 