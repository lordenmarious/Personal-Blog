// Utility functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Main application
document.addEventListener('DOMContentLoaded', () => {
    const app = {
        init() {
            this.initDarkMode();
            this.initGallery();
            this.initBlog();
            this.initContactForm();
            this.initLazyLoading();
            this.initAccessibility();
            this.setupServiceWorker();
            this.initMobileMenu();
            this.initScrollHandling();
        },

        // Dark Mode Toggle
        initDarkMode() {
            const darkModeToggle = document.querySelector('.dark-mode-toggle');
            if (!darkModeToggle) return;

            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
            const savedTheme = localStorage.getItem('theme');

            // Set initial theme
            if (savedTheme) {
                document.documentElement.classList.toggle('dark-mode', savedTheme === 'dark');
            } else {
                document.documentElement.classList.toggle('dark-mode', prefersDark.matches);
            }

            darkModeToggle.addEventListener('click', () => {
                document.documentElement.classList.toggle('dark-mode');
                const isDark = document.documentElement.classList.contains('dark-mode');
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
            });

            // Listen for system theme changes
            prefersDark.addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    document.documentElement.classList.toggle('dark-mode', e.matches);
                }
            });
        },

        // Mobile Menu
        initMobileMenu() {
            const menuButton = document.querySelector('.menu-toggle');
            const navLinks = document.querySelector('.nav-links');
            
            if (!menuButton || !navLinks) return;

            menuButton.addEventListener('click', () => {
                const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
                menuButton.setAttribute('aria-expanded', !isExpanded);
                navLinks.classList.toggle('active');
                
                if (!isExpanded) {
                    // Trap focus within menu when open
                    navLinks.querySelector('a').focus();
                }
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                    menuButton.click();
                    menuButton.focus();
                }
            });
        },

        // Scroll Handling
        initScrollHandling() {
            const scrollHandler = debounce(() => {
                const scrollTop = window.pageYOffset;
                const scrollTopButton = document.getElementById('scrollTop');
                const navbar = document.querySelector('.navbar');
                
                if (scrollTopButton) {
                    scrollTopButton.classList.toggle('visible', scrollTop > 500);
                }
                
                if (navbar) {
                    navbar.classList.toggle('scrolled', scrollTop > 50);
                }
            }, 16);

            window.addEventListener('scroll', scrollHandler, { passive: true });

            // Smooth scroll for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(anchor.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        },

        // Gallery functionality
        initGallery() {
            const gallery = document.querySelector('.gallery-grid');
            if (!gallery) return;

            const lightbox = document.querySelector('.lightbox');
            const lightboxImage = lightbox.querySelector('.lightbox-image');
            const lightboxCaption = lightbox.querySelector('.lightbox-caption');
            const lightboxCounter = lightbox.querySelector('.image-counter');
            const prevButton = lightbox.querySelector('.lightbox-prev');
            const nextButton = lightbox.querySelector('.lightbox-next');
            
            let currentIndex = 0;
            const galleryItems = document.querySelectorAll('.gallery-item');

            // Filter functionality
            const filterButtons = document.querySelectorAll('.filter-btn');
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const filter = button.dataset.filter;
                    
                    // Update button states
                    filterButtons.forEach(btn => {
                        btn.classList.remove('active');
                        btn.setAttribute('aria-pressed', 'false');
                    });
                    button.classList.add('active');
                    button.setAttribute('aria-pressed', 'true');

                    // Filter items with animation
                    galleryItems.forEach(item => {
                        const shouldShow = filter === 'all' || item.dataset.category === filter;
                        if (shouldShow) {
                            item.style.opacity = '0';
                            item.style.display = 'block';
                            requestAnimationFrame(() => {
                                item.style.opacity = '1';
                            });
                        } else {
                            item.style.opacity = '0';
                            setTimeout(() => {
                                item.style.display = 'none';
                            }, 300);
                        }
                    });
                });
            });

            // Lightbox functionality
            const openLightbox = (item, index) => {
                const img = item.querySelector('img');
                const caption = item.querySelector('.gallery-caption').innerHTML;
                
                currentIndex = index;
                lightboxImage.src = img.src.replace('-small.', '-large.');
                lightboxImage.alt = img.alt;
                lightboxCaption.innerHTML = caption;
                lightboxCounter.textContent = `Image ${currentIndex + 1} of ${galleryItems.length}`;
                
                lightbox.classList.add('active');
                lightbox.setAttribute('aria-hidden', 'false');
                updateNavigationState();
                
                // Trap focus within lightbox
                lightbox.querySelector('.lightbox-close').focus();
            };

            const updateNavigationState = () => {
                prevButton.disabled = currentIndex === 0;
                nextButton.disabled = currentIndex === galleryItems.length - 1;
                prevButton.setAttribute('aria-disabled', currentIndex === 0);
                nextButton.setAttribute('aria-disabled', currentIndex === galleryItems.length - 1);
            };

            // Event Listeners
            galleryItems.forEach((item, index) => {
                item.addEventListener('click', () => openLightbox(item, index));
                item.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openLightbox(item, index);
                    }
                });
            });

            // Navigation
            prevButton.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    openLightbox(galleryItems[currentIndex], currentIndex);
                }
            });

            nextButton.addEventListener('click', () => {
                if (currentIndex < galleryItems.length - 1) {
                    currentIndex++;
                    openLightbox(galleryItems[currentIndex], currentIndex);
                }
            });

            // Close lightbox
            const closeLightbox = () => {
                lightbox.classList.remove('active');
                lightbox.setAttribute('aria-hidden', 'true');
                lightboxImage.src = '';
                currentIndex = 0;
            };

            lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
            
            // Close on outside click
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (!lightbox.classList.contains('active')) return;
                
                switch (e.key) {
                    case 'Escape':
                        closeLightbox();
                        break;
                    case 'ArrowLeft':
                        if (currentIndex > 0) {
                            currentIndex--;
                            openLightbox(galleryItems[currentIndex], currentIndex);
                        }
                        break;
                    case 'ArrowRight':
                        if (currentIndex < galleryItems.length - 1) {
                            currentIndex++;
                            openLightbox(galleryItems[currentIndex], currentIndex);
                        }
                        break;
                }
            });
        },

        // Enhanced Lazy Loading
        initLazyLoading() {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        observer.unobserve(img);
                        
                        // Preload next images
                        this.preloadNextImages(img);
                    }
                });
            }, {
                rootMargin: '50px 0px' // Start loading before image enters viewport
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        },

        loadImage(img) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
        },

        preloadNextImages(currentImg) {
            const nextImages = Array.from(currentImg.parentElement.nextElementSibling?.querySelectorAll('img[data-src]') || [])
                .slice(0, 2); // Preload next 2 images
            
            nextImages.forEach(img => {
                const preloadLink = document.createElement('link');
                preloadLink.rel = 'preload';
                preloadLink.as = 'image';
                preloadLink.href = img.dataset.src;
                document.head.appendChild(preloadLink);
            });
        },

        // Accessibility Enhancements
        initAccessibility() {
            // Handle keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    document.body.classList.add('using-keyboard');
                }
            });

            document.addEventListener('mousedown', () => {
                document.body.classList.remove('using-keyboard');
            });

            // Setup live regions
            this.setupLiveRegions();
        },

        setupLiveRegions() {
            const liveRegion = document.createElement('div');
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.classList.add('sr-only');
            document.body.appendChild(liveRegion);
            this.liveRegion = liveRegion;
        },

        announceToScreenReader(message) {
            if (this.liveRegion) {
                this.liveRegion.textContent = message;
            }
        },

        // Service Worker Setup
        setupServiceWorker() {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('ServiceWorker registration successful');
                        
                        // Handle updates
                        registration.addEventListener('updatefound', () => {
                            const newWorker = registration.installing;
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    this.notifyUser('New content available! Refresh to update.');
                                }
                            });
                        });
                    })
                    .catch(error => {
                        console.error('ServiceWorker registration failed:', error);
                    });
            }
        },

        notifyUser(message) {
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.setAttribute('role', 'alert');
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 5000);
        },

        // Error Handling
        handleError(error, context) {
            console.error(`Error in ${context}:`, error);
            this.notifyUser('Something went wrong. Please try again later.');
        },

        // Blog functionality
        initBlog() {
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
        },

        // Form validation and submission
        initContactForm() {
            const form = document.getElementById('contactForm');
            if (!form) return;

            const formGroups = form.querySelectorAll('.form-group');
            const successMessage = document.querySelector('.form-success');
            const errorMessage = document.querySelector('.form-error');
            
            // Enhanced email validation
            const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            const validateField = (input) => {
                const formGroup = input.closest('.form-group');
                const errorSpan = formGroup.querySelector('.error-message');
                let isValid = true;
                let errorMessage = '';

                // Clear previous error state
                formGroup.classList.remove('error');
                input.removeAttribute('aria-invalid');
                
                // Required field validation
                if (input.required && !input.value.trim()) {
                    isValid = false;
                    errorMessage = 'This field is required';
                }
                // Email validation
                else if (input.type === 'email' && input.value) {
                    if (!emailRegex.test(input.value.toLowerCase())) {
                        isValid = false;
                        errorMessage = 'Please enter a valid email address';
                    }
                }
                // Minlength validation
                else if (input.minLength && input.value.length < input.minLength) {
                    isValid = false;
                    errorMessage = `Must be at least ${input.minLength} characters`;
                }

                // Update field state
                if (!isValid) {
                    formGroup.classList.add('error');
                    input.setAttribute('aria-invalid', 'true');
                    if (errorSpan) {
                        errorSpan.textContent = errorMessage;
                    }
                }

                return isValid;
            };

            // Real-time validation
            formGroups.forEach(group => {
                const input = group.querySelector('input, textarea');
                if (!input) return;

                // Validate on blur
                input.addEventListener('blur', () => {
                    validateField(input);
                });

                // Clear error on input if field was previously invalid
                input.addEventListener('input', () => {
                    if (input.hasAttribute('aria-invalid')) {
                        validateField(input);
                    }
                });
            });

            // Show message function
            const showMessage = (element, duration = 5000) => {
                element.setAttribute('aria-hidden', 'false');
                element.classList.add('active');

                setTimeout(() => {
                    hideMessage(element);
                }, duration);
            };

            // Hide message function
            const hideMessage = (element) => {
                element.classList.remove('active');
                element.setAttribute('aria-hidden', 'true');
            };

            // Close message buttons
            document.querySelectorAll('.close-success, .close-error').forEach(button => {
                button.addEventListener('click', () => {
                    hideMessage(button.closest('[role="alert"]'));
                });
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

                if (!isFormValid) {
                    // Focus first invalid field
                    form.querySelector('[aria-invalid="true"]')?.focus();
                    return;
                }

                // Show loading state
                const submitButton = form.querySelector('.submit-button');
                submitButton.classList.add('loading');
                submitButton.disabled = true;

                try {
                    // Simulate form submission (replace with actual API call)
                    await new Promise(resolve => setTimeout(resolve, 1500));

                    // Show success message
                    showMessage(successMessage);
                    form.reset();

                } catch (error) {
                    console.error('Form submission error:', error);
                    showMessage(errorMessage);
                } finally {
                    submitButton.classList.remove('loading');
                    submitButton.disabled = false;
                }
            });

            // Close messages when clicking outside
            document.addEventListener('click', (e) => {
                if (e.target.closest('.form-success, .form-error, .submit-button')) return;
                
                if (successMessage.classList.contains('active')) {
                    hideMessage(successMessage);
                }
                if (errorMessage.classList.contains('active')) {
                    hideMessage(errorMessage);
                }
            });

            // Close messages on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    if (successMessage.classList.contains('active')) {
                        hideMessage(successMessage);
                    }
                    if (errorMessage.classList.contains('active')) {
                        hideMessage(errorMessage);
                    }
                }
            });
        }
    };

    // Initialize application
    app.init();
});