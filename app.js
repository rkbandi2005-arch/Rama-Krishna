/* ==========================================================================
   TaskFlow SaaS Landing Page JavaScript Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize functions
    initThemeManager();
    initMobileMenu();
    initPricingToggler();
    initFormValidator();
    fetchBlogPosts();
});

/* ==========================================================================
   1. Theme Manager (Dark / Light Mode)
   ========================================================================== */
function initThemeManager() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;

    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-theme');
        updateThemeAccessibility(themeToggleBtn, 'dark');
    } else {
        document.body.classList.remove('dark-theme');
        updateThemeAccessibility(themeToggleBtn, 'light');
    }

    // Toggle theme click event
    themeToggleBtn.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-theme');
        const themeName = isDark ? 'dark' : 'light';
        
        localStorage.setItem('theme', themeName);
        updateThemeAccessibility(themeToggleBtn, themeName);
        
        // Add subtle feedback animation
        themeToggleBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            themeToggleBtn.style.transform = 'scale(1)';
        }, 150);
    });
}

function updateThemeAccessibility(btn, currentTheme) {
    if (currentTheme === 'dark') {
        btn.setAttribute('aria-label', 'Switch to Light Theme');
        btn.setAttribute('title', 'Switch to Light Theme');
    } else {
        btn.setAttribute('aria-label', 'Switch to Dark Theme');
        btn.setAttribute('title', 'Switch to Dark Theme');
    }
}

/* ==========================================================================
   2. Mobile Hamburger Menu
   ========================================================================== */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!hamburger || !navMenu) return;

    const toggleMenu = () => {
        const isActive = hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        
        // Prevent body scrolling when mobile menu is active
        document.body.style.overflow = isActive ? 'hidden' : '';
    };

    hamburger.addEventListener('click', toggleMenu);

    // Close mobile menu when a navigation link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
}

/* ==========================================================================
   3. Pricing Toggler (Monthly / Yearly Billing)
   ========================================================================== */
function initPricingToggler() {
    const billingToggle = document.getElementById('billing-toggle');
    const starterPrice = document.getElementById('starter-price');
    const proPrice = document.getElementById('pro-price');
    const enterprisePrice = document.getElementById('enterprise-price');
    const periods = document.querySelectorAll('.pricing-period');

    if (!billingToggle || !starterPrice || !proPrice || !enterprisePrice) return;

    // Plans rates: [Monthly, Yearly Monthly-Average]
    const prices = {
        starter: { monthly: 15, yearly: 12 },
        pro: { monthly: 39, yearly: 31 },
        enterprise: { monthly: 89, yearly: 71 }
    };

    billingToggle.addEventListener('change', () => {
        const isYearly = billingToggle.checked;

        // Transition animation for price figures
        [starterPrice, proPrice, enterprisePrice].forEach(priceEl => {
            priceEl.style.opacity = '0';
            priceEl.style.transform = 'translateY(-10px)';
        });

        setTimeout(() => {
            if (isYearly) {
                starterPrice.textContent = `$${prices.starter.yearly}`;
                proPrice.textContent = `$${prices.pro.yearly}`;
                enterprisePrice.textContent = `$${prices.enterprise.yearly}`;
                periods.forEach(p => p.textContent = '/mo, billed yearly');
            } else {
                starterPrice.textContent = `$${prices.starter.monthly}`;
                proPrice.textContent = `$${prices.pro.monthly}`;
                enterprisePrice.textContent = `$${prices.enterprise.monthly}`;
                periods.forEach(p => p.textContent = '/month');
            }

            [starterPrice, proPrice, enterprisePrice].forEach(priceEl => {
                priceEl.style.opacity = '1';
                priceEl.style.transform = 'translateY(0)';
                priceEl.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
            });
        }, 200);
    });
}

/* ==========================================================================
   4. Contact Form Validation
   ========================================================================== */
function initFormValidator() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    const fields = {
        name: {
            input: document.getElementById('name'),
            error: document.getElementById('name-error'),
            validate: (val) => val.trim().length >= 2,
            msg: 'Name must be at least 2 characters long'
        },
        email: {
            input: document.getElementById('email'),
            error: document.getElementById('email-error'),
            validate: (val) => {
                const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                return regex.test(val.trim());
            },
            msg: 'Please enter a valid email address'
        },
        message: {
            input: document.getElementById('message'),
            error: document.getElementById('message-error'),
            validate: (val) => val.trim().length >= 10,
            msg: 'Message must be at least 10 characters long'
        }
    };

    // Helper to validate and style a field
    const validateField = (fieldKey, showErrors = true) => {
        const field = fields[fieldKey];
        const isValid = field.validate(field.input.value);

        if (isValid) {
            field.input.classList.remove('invalid');
            field.input.classList.add('valid');
            field.input.setAttribute('aria-invalid', 'false');
            if (field.error) {
                field.error.classList.remove('visible');
            }
        } else if (showErrors) {
            field.input.classList.remove('valid');
            field.input.classList.add('invalid');
            field.input.setAttribute('aria-invalid', 'true');
            if (field.error) {
                field.error.textContent = field.msg;
                field.error.classList.add('visible');
            }
        }
        return isValid;
    };

    // Attach real-time validation listeners
    Object.keys(fields).forEach(key => {
        const field = fields[key];
        
        field.input.addEventListener('input', () => {
            validateField(key, true);
        });

        field.input.addEventListener('blur', () => {
            validateField(key, true);
        });
    });

    // Handle form submit
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isFormValid = true;

        // Force validation and show errors on all fields
        Object.keys(fields).forEach(key => {
            const isValid = validateField(key, true);
            if (!isValid) isFormValid = false;
        });

        if (isFormValid) {
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            // Show sending loader simulation
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg class="spinner" width="20" height="20" viewBox="0 0 50 50" style="animation: spin 1s linear infinite; fill: none; stroke: currentColor; stroke-width: 5; stroke-linecap: round;">
                    <circle cx="25" cy="25" r="20" stroke-dasharray="80, 200" stroke-dashoffset="0"></circle>
                </svg> Sending...`;

            // Inline spinner style injection
            if (!document.getElementById('spinner-style')) {
                const style = document.createElement('style');
                style.id = 'spinner-style';
                style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
                document.head.appendChild(style);
            }

            // Simulate server network latency
            setTimeout(() => {
                showToastNotification('Message Sent!', 'We will get back to you shortly.');
                
                // Clear form & resets
                contactForm.reset();
                Object.keys(fields).forEach(key => {
                    fields[key].input.classList.remove('valid', 'invalid');
                    fields[key].input.removeAttribute('aria-invalid');
                });
                
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }, 1500);
        }
    });
}

function showToastNotification(title, message) {
    const toast = document.getElementById('success-toast');
    if (!toast) return;

    toast.querySelector('h5').textContent = title;
    toast.querySelector('p').textContent = message;
    
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

/* ==========================================================================
   5. API Integration & Loading Skeleton States (Blog Posts)
   ========================================================================== */
function fetchBlogPosts() {
    const container = document.getElementById('blog-posts-container');
    if (!container) return;

    // Show Skeletons on initial load
    renderSkeletonLoaders(container);

    const categories = ['Productivity', 'Case Study', 'Engineering', 'Company News', 'Product Guides', 'Collaborative Culture'];
    const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // Fetch from JSONPlaceholder API
    fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch blog posts. Network response was not ok.');
            }
            return response.json();
        })
        .then(posts => {
            // Wait slightly to demonstrate skeleton loaders
            setTimeout(() => {
                container.innerHTML = '';
                const displayPosts = posts.slice(0, 6);

                displayPosts.forEach((post, index) => {
                    const category = categories[index % categories.length];
                    const card = document.createElement('article');
                    card.className = 'card blog-card';
                    card.innerHTML = `
                        <div class="blog-card-image" role="img" aria-label="Blog post header placeholder image"></div>
                        <div class="blog-card-content">
                            <span class="blog-card-meta">${category}</span>
                            <h3 class="blog-card-title">${capitalizeFirstLetter(post.title)}</h3>
                            <p class="blog-card-excerpt">${capitalizeFirstLetter(post.body)}</p>
                            <a href="#blog" class="blog-card-link" aria-label="Read more about ${post.title}">
                                Read Article
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                                </svg>
                            </a>
                        </div>
                    `;
                    container.appendChild(card);
                });
            }, 1000);
        })
        .catch(error => {
            console.error('Blog Fetch Error:', error);
            setTimeout(() => {
                container.innerHTML = `
                    <div class="api-error-message">
                        <h3>Could not load blog posts</h3>
                        <p>We had trouble connecting to the service. Please try reloading the page.</p>
                        <button class="btn btn-secondary" onclick="fetchBlogPosts()" style="margin-top: 16px;">
                            Retry Loading
                        </button>
                    </div>
                `;
            }, 1000);
        });
}

function renderSkeletonLoaders(container) {
    container.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton-card skeleton-pulse';
        skeleton.innerHTML = `
            <div class="skeleton-image"></div>
            <div class="skeleton-content">
                <div class="skeleton-meta"></div>
                <div class="skeleton-title"></div>
                <div class="skeleton-title-2"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-text-2"></div>
                <div class="skeleton-text-3"></div>
            </div>
        `;
        container.appendChild(skeleton);
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function selectPlan(plan) {
    localStorage.setItem("selectedPlan", plan);

    document.getElementById("selectedPlan").value = plan;
}

window.onload = function () {
    const plan = localStorage.getItem("selectedPlan");

    if (plan) {
        document.getElementById("selectedPlan").value = plan;
    }
};
