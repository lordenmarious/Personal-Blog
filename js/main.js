// Fade in elements with animation
document.addEventListener('DOMContentLoaded', () => {
    // Fade in gallery items sequentially
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
    });
});

// Form validation and submission
const initContactForm = () => {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const formGroups = form.querySelectorAll('.form-group');
    const successMessage = document.querySelector('.form-success');
    
    const validateField = (input) => {
        const formGroup = input.closest('.form-group');
        const errorSpan = formGroup.querySelector('.error-message');
        let isValid = true;
        let errorMessage = '';

        // Clear previous error
        formGroup.classList.remove('error');
        
        // Required field validation
        if (input.required && !input.value.trim()) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        // Email validation
        else if (input.type === 'email' && input.value) {
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailPattern.test(input.value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        // Minlength validation
        else if (input.minLength && input.value.length < input.minLength) {
            isValid = false;
            errorMessage = `Must be at least ${input.minLength} characters`;
        }

        if (!isValid) {
            formGroup.classList.add('error');
            if (errorSpan) {
                errorSpan.textContent = errorMessage;
            }
        }

        return isValid;
    };

    // Real-time validation
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        if (input) {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if (group.classList.contains('error')) {
                    validateField(input);
                }
            });
        }
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate all fields
        let isFormValid = true;
        form.querySelectorAll('input, textarea').forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) return;

        // Show loading state
        const submitButton = form.querySelector('.submit-button');
        submitButton.classList.add('loading');
        submitButton.disabled = true;

        try {
            // Simulate form submission (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            successMessage.classList.add('active');
            form.reset();

            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.classList.remove('active');
            }, 5000);

        } catch (error) {
            console.error('Form submission error:', error);
            alert('Sorry, there was an error sending your message. Please try again.');
        } finally {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    });

    // Close success message
    const closeButton = successMessage.querySelector('.close-success');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            successMessage.classList.remove('active');
        });
    }

    // Close success message when clicking outside
    document.addEventListener('click', (e) => {
        if (successMessage.classList.contains('active') && 
            !successMessage.contains(e.target)) {
            successMessage.classList.remove('active');
        }
    });
};

// Initialize contact form if it exists
document.addEventListener('DOMContentLoaded', initContactForm);

// Mobile menu functionality
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', 
            menuToggle.classList.contains('active'));
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar') && navLinks.classList.contains('active')) {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
    }
});

// Add smooth scrolling for anchor links
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

// Add lazy loading for images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});

// Gallery functionality
const initGallery = () => {
    const gallery = document.querySelector('.gallery-grid');
    if (!gallery) return;

    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter items
            galleryItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => item.style.opacity = '1', 0);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => item.style.display = 'none', 300);
                }
            });
        });
    });

    // Lightbox functionality
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    let currentIndex = 0;

    const showImage = (index) => {
        const item = galleryItems[index];
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-caption').innerHTML;
        
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.innerHTML = caption;
        currentIndex = index;
    };

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            lightbox.classList.add('active');
            showImage(index);
        });
    });

    // Lightbox controls
    document.querySelector('.lightbox-close').addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    document.querySelector('.lightbox-next').addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % galleryItems.length;
        showImage(currentIndex);
    });

    document.querySelector('.lightbox-prev').addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        showImage(currentIndex);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape':
                lightbox.classList.remove('active');
                break;
            case 'ArrowRight':
                document.querySelector('.lightbox-next').click();
                break;
            case 'ArrowLeft':
                document.querySelector('.lightbox-prev').click();
                break;
        }
    });
};

// Initialize gallery if it exists
document.addEventListener('DOMContentLoaded', initGallery);

// Blog functionality
const initBlog = () => {
    const blogContainer = document.querySelector('.blog-grid');
    if (!blogContainer) return;

    // Blog post filtering
    const filterButtons = document.querySelectorAll('.blog-filters .filter-btn');
    const blogPosts = document.querySelectorAll('.blog-post');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter posts with fade effect
            blogPosts.forEach(post => {
                if (filter === 'all' || post.dataset.category === filter) {
                    post.style.opacity = '0';
                    post.style.display = 'block';
                    requestAnimationFrame(() => {
                        post.style.opacity = '1';
                    });
                } else {
                    post.style.opacity = '0';
                    setTimeout(() => {
                        post.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Search functionality
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchTerm = searchForm.querySelector('input').value.toLowerCase();
            
            blogPosts.forEach(post => {
                const title = post.querySelector('h2').textContent.toLowerCase();
                const content = post.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || content.includes(searchTerm)) {
                    post.style.display = 'block';
                    post.style.opacity = '1';
                } else {
                    post.style.opacity = '0';
                    setTimeout(() => {
                        post.style.display = 'none';
                    }, 300);
                }
            });
        });
    }

    // Pagination (simplified version)
    const paginationButtons = document.querySelectorAll('.pagination-btn');
    const currentPage = document.querySelector('.current-page');
    let pageNumber = 1;

    paginationButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.textContent === '<' && pageNumber > 1) {
                pageNumber--;
            } else if (button.textContent === '>' && pageNumber < 5) { // Assuming 5 pages max
                pageNumber++;
            }
            currentPage.textContent = pageNumber;
        });
    });
};

// Initialize blog functionality
document.addEventListener('DOMContentLoaded', initBlog);

// Add this to improve performance
document.addEventListener('DOMContentLoaded', () => {
    // Defer non-critical images
    const deferImages = () => {
        const imgDefer = document.querySelectorAll('img[data-defer]');
        imgDefer.forEach(img => {
            if(img.getAttribute('data-defer')) {
                img.setAttribute('src', img.getAttribute('data-defer'));
            }
        });
    };
    
    // Load images after page load
    window.addEventListener('load', deferImages);
});

// Add to existing error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // You could add error reporting service here
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// Add keyboard navigation for gallery and blog
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('using-keyboard');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('using-keyboard');
});

// Add basic offline support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registered');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed:', err);
            });
    });
}

// Scroll to top functionality
const scrollTopButton = document.getElementById('scrollTop');
if (scrollTopButton) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            scrollTopButton.classList.add('visible');
        } else {
            scrollTopButton.classList.remove('visible');
        }
    });

    scrollTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
} 