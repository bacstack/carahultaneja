// Main JavaScript for Cross-Border Wealth Clarity Landing Page

// DOM Elements
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const scrollToTopBtn = document.getElementById('scrollToTop');
const consultationForm = document.getElementById('consultationForm');

// Mobile Menu Toggle
mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu when clicking on a link
const mobileMenuLinks = mobileMenu.querySelectorAll('a');
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// Navbar scroll effect
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add shadow on scroll
    if (scrollTop > 50) {
        navbar.classList.add('navbar-scrolled', 'shadow-lg');
    } else {
        navbar.classList.remove('navbar-scrolled', 'shadow-lg');
    }
    
    // Show/hide scroll to top button
    if (scrollTop > 300) {
        scrollToTopBtn.classList.remove('hidden');
    } else {
        scrollToTopBtn.classList.add('hidden');
    }
    
    lastScrollTop = scrollTop;
});

// Scroll to top functionality
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections for animation
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(section);
});

// Form submission handling
consultationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(consultationForm);
    const data = {
        name: formData.get('name') || e.target[0].value,
        email: formData.get('email') || e.target[1].value,
        phone: formData.get('phone') || e.target[2].value,
        location: formData.get('location') || e.target[3].value,
        challenge: formData.get('challenge') || e.target[4].value,
        details: formData.get('details') || e.target[5].value,
        timestamp: new Date().toISOString()
    };
    
    // Show loading state
    const submitButton = consultationForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Processing...';
    submitButton.disabled = true;
    consultationForm.classList.add('loading');
    
    try {
        // Simulate API call (replace with actual API endpoint)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Log form data (in production, send to backend)
        console.log('Form submitted:', data);
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <i class="fas fa-check-circle text-2xl mb-2"></i>
            <div class="text-lg font-bold mb-1">Thank You!</div>
            <div>Your consultation request has been received. We'll contact you within 24 hours via WhatsApp and email.</div>
        `;
        
        consultationForm.reset();
        consultationForm.appendChild(successMessage);
        
        // Track conversion (Google Analytics, Facebook Pixel, etc.)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
                'send_to': 'AW-CONVERSION_ID',
                'value': 25000,
                'currency': 'INR',
                'transaction_id': Date.now()
            });
        }
        
        // Redirect to thank you page or payment gateway after 2 seconds
        setTimeout(() => {
            // window.location.href = '/thank-you.html';
            alert('Redirecting to payment gateway...');
        }, 2000);
        
    } catch (error) {
        console.error('Form submission error:', error);
        
        // Show error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.innerHTML = `
            <i class="fas fa-exclamation-circle text-2xl mb-2"></i>
            <div class="text-lg font-bold mb-1">Oops! Something went wrong.</div>
            <div>Please try again or contact us directly via WhatsApp.</div>
        `;
        consultationForm.appendChild(errorMessage);
    } finally {
        // Reset button state
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
        consultationForm.classList.remove('loading');
    }
});

// Real-time form validation
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const validatePhone = (phone) => {
    const re = /^[\d\s\+\-\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

// Add validation feedback
const emailInput = consultationForm.querySelector('input[type="email"]');
const phoneInput = consultationForm.querySelector('input[type="tel"]');

if (emailInput) {
    emailInput.addEventListener('blur', (e) => {
        if (e.target.value && !validateEmail(e.target.value)) {
            e.target.classList.add('border-red-500');
        } else {
            e.target.classList.remove('border-red-500');
        }
    });
}

if (phoneInput) {
    phoneInput.addEventListener('blur', (e) => {
        if (e.target.value && !validatePhone(e.target.value)) {
            e.target.classList.add('border-red-500');
        } else {
            e.target.classList.remove('border-red-500');
        }
    });
}

// Count up animation for numbers
const countUpElements = document.querySelectorAll('.count-up');

const countUp = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCount = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCount);
        } else {
            element.textContent = target;
        }
    };
    
    updateCount();
};

// Observe count up elements
const countUpObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            countUp(entry.target);
            entry.target.classList.add('counted');
        }
    });
}, { threshold: 0.5 });

countUpElements.forEach(element => {
    countUpObserver.observe(element);
});

// Add particles to CTA section (optional visual enhancement)
const createParticles = () => {
    const ctaSection = document.querySelector('#cta');
    if (!ctaSection) return;
    
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles absolute inset-0 pointer-events-none';
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 10}s`;
        particle.style.animationDuration = `${10 + Math.random() * 10}s`;
        particlesContainer.appendChild(particle);
    }
    
    ctaSection.appendChild(particlesContainer);
};

// Initialize particles
// createParticles();

// Track scroll depth for analytics
let maxScrollDepth = 0;
window.addEventListener('scroll', () => {
    const scrollPercentage = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
    
    if (scrollPercentage > maxScrollDepth) {
        maxScrollDepth = scrollPercentage;
        
        // Track milestone scroll depths
        if (maxScrollDepth > 25 && !window.scrollDepth25) {
            window.scrollDepth25 = true;
            console.log('Scroll depth: 25%');
            // Track with analytics
        }
        if (maxScrollDepth > 50 && !window.scrollDepth50) {
            window.scrollDepth50 = true;
            console.log('Scroll depth: 50%');
        }
        if (maxScrollDepth > 75 && !window.scrollDepth75) {
            window.scrollDepth75 = true;
            console.log('Scroll depth: 75%');
        }
        if (maxScrollDepth > 90 && !window.scrollDepth90) {
            window.scrollDepth90 = true;
            console.log('Scroll depth: 90%');
        }
    }
});

// Track CTA button clicks
document.querySelectorAll('a[href="#cta"], a[href="#booking-form"]').forEach(button => {
    button.addEventListener('click', () => {
        console.log('CTA button clicked:', button.textContent);
        // Track with analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                'event_category': 'CTA',
                'event_label': button.textContent.trim()
            });
        }
    });
});

// Track WhatsApp button clicks
document.querySelectorAll('a[href^="https://wa.me/"]').forEach(button => {
    button.addEventListener('click', () => {
        console.log('WhatsApp button clicked');
        // Track with analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                'event_category': 'WhatsApp',
                'event_label': 'Contact via WhatsApp'
            });
        }
    });
});

// Exit intent popup (optional)
let exitIntentShown = false;

document.addEventListener('mouseleave', (e) => {
    if (e.clientY < 10 && !exitIntentShown && window.scrollY > 500) {
        exitIntentShown = true;
        console.log('Exit intent detected');
        // Show exit intent popup
        // You can implement a modal here
    }
});

// Lazy load images (if any heavy images are added)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add floating animation to WhatsApp button
const whatsappButton = document.querySelector('a[href^="https://wa.me/"]');
if (whatsappButton && whatsappButton.classList.contains('fixed')) {
    whatsappButton.classList.add('floating-button');
}

// Console welcome message
console.log('%c🌍 Cross-Border Wealth Clarity Offer™', 'font-size: 20px; font-weight: bold; color: #F59E0B;');
console.log('%cWelcome to Taxpire & Finpire', 'font-size: 14px; color: #1E40AF;');
console.log('%cFor NRIs, HNIs & Business Owners', 'font-size: 12px; color: #10B981;');

// Prevent console errors in production
window.addEventListener('error', (e) => {
    console.error('Error caught:', e.error);
    // Send to error tracking service in production
});

// Performance monitoring
if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page load time: ${pageLoadTime}ms`);
            
            // Track with analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'timing_complete', {
                    'name': 'load',
                    'value': pageLoadTime,
                    'event_category': 'Performance'
                });
            }
        }, 0);
    });
}

// Service Worker registration (for PWA, if needed)
if ('serviceWorker' in navigator) {
    // Uncomment to enable PWA functionality
    // window.addEventListener('load', () => {
    //     navigator.serviceWorker.register('/sw.js')
    //         .then(reg => console.log('Service Worker registered'))
    //         .catch(err => console.error('Service Worker registration failed:', err));
    // });
}

console.log('✅ Main JavaScript loaded successfully');