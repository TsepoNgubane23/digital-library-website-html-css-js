// Advanced Animation System
class AnimationManager {
    constructor() {
        this.init();
    }

    // Initialize all animations
    init() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupClickEffects();
        this.setupLoadingAnimations();
        this.setupParticleSystem();
        this.setupTypewriterEffect();
        this.setupCounterAnimations();
    }

    // Setup scroll-triggered animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Stagger animation for children
                    const children = entry.target.querySelectorAll('.animate-child');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animate-in');
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);

        // Observe elements with animation classes
        document.querySelectorAll('.fade-in, .slide-up, .slide-in-left, .slide-in-right, .scale-in').forEach(el => {
            observer.observe(el);
        });

        // Observe book cards and other elements
        document.querySelectorAll('.book-card, .video-card, .rules-card, .stat-card').forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }

    // Setup hover effects
    setupHoverEffects() {
        // Book card hover effects
        document.addEventListener('mouseenter', (e) => {
            if (e.target.closest('.book-card')) {
                const card = e.target.closest('.book-card');
                this.animateBookCardHover(card, true);
            }
            
            if (e.target.closest('.btn')) {
                const btn = e.target.closest('.btn');
                this.animateButtonHover(btn, true);
            }

            if (e.target.closest('.nav-menu a')) {
                const link = e.target.closest('.nav-menu a');
                this.animateNavLinkHover(link, true);
            }
        }, true);

        document.addEventListener('mouseleave', (e) => {
            if (e.target.closest('.book-card')) {
                const card = e.target.closest('.book-card');
                this.animateBookCardHover(card, false);
            }
            
            if (e.target.closest('.btn')) {
                const btn = e.target.closest('.btn');
                this.animateButtonHover(btn, false);
            }

            if (e.target.closest('.nav-menu a')) {
                const link = e.target.closest('.nav-menu a');
                this.animateNavLinkHover(link, false);
            }
        }, true);

        // Social icons hover
        document.querySelectorAll('.social-icon').forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                icon.style.transform = 'translateY(-3px) scale(1.1)';
                icon.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
            });
            
            icon.addEventListener('mouseleave', () => {
                icon.style.transform = 'translateY(0) scale(1)';
                icon.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
            });
        });
    }

    // Animate book card hover
    animateBookCardHover(card, isHover) {
        const img = card.querySelector('img');
        const overlay = card.querySelector('.book-overlay');
        
        if (isHover) {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
            if (img) img.style.transform = 'scale(1.05)';
            if (overlay) overlay.style.opacity = '1';
        } else {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
            if (img) img.style.transform = 'scale(1)';
            if (overlay) overlay.style.opacity = '0';
        }
    }

    // Animate button hover
    animateButtonHover(btn, isHover) {
        if (isHover) {
            btn.style.transform = 'translateY(-2px)';
            btn.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
        } else {
            btn.style.transform = 'translateY(0)';
            btn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        }
    }

    // Animate nav link hover
    animateNavLinkHover(link, isHover) {
        if (isHover) {
            link.style.transform = 'translateY(-2px)';
            link.style.color = '#3b82f6';
        } else {
            link.style.transform = 'translateY(0)';
            link.style.color = '';
        }
    }

    // Setup click effects
    setupClickEffects() {
        document.addEventListener('click', (e) => {
            // Ripple effect for buttons
            if (e.target.closest('.btn')) {
                this.createRippleEffect(e.target.closest('.btn'), e);
            }

            // Book card click animation
            if (e.target.closest('.book-card')) {
                this.animateBookCardClick(e.target.closest('.book-card'));
            }

            // Menu item click animation
            if (e.target.closest('.menu-item')) {
                this.animateMenuItemClick(e.target.closest('.menu-item'));
            }
        });
    }

    // Create ripple effect
    createRippleEffect(element, event) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Animate book card click
    animateBookCardClick(card) {
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        }, 150);
    }

    // Animate menu item click
    animateMenuItemClick(item) {
        item.style.transform = 'scale(0.95)';
        setTimeout(() => {
            item.style.transform = 'scale(1)';
        }, 150);
    }

    // Setup loading animations
    setupLoadingAnimations() {
        // Page load animation
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            
            // Animate hero elements
            const heroTitle = document.querySelector('.hero-title');
            const heroDescription = document.querySelector('.hero-description');
            const heroButtons = document.querySelector('.hero-buttons');
            
            if (heroTitle) {
                setTimeout(() => heroTitle.classList.add('animate-in'), 300);
            }
            if (heroDescription) {
                setTimeout(() => heroDescription.classList.add('animate-in'), 600);
            }
            if (heroButtons) {
                setTimeout(() => heroButtons.classList.add('animate-in'), 900);
            }
        });

        // Form submission loading
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    this.animateFormSubmission(submitBtn);
                }
            });
        });
    }

    // Animate form submission
    animateFormSubmission(button) {
        const originalContent = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        button.disabled = true;
        button.classList.add('loading');

        // Reset after animation (if not handled by form logic)
        setTimeout(() => {
            if (button.classList.contains('loading')) {
                button.innerHTML = originalContent;
                button.disabled = false;
                button.classList.remove('loading');
            }
        }, 3000);
    }

    // Setup particle system
    setupParticleSystem() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;

        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: linear-gradient(45deg, #3b82f6, #8b5cf6);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                animation: float ${Math.random() * 10 + 10}s linear infinite;
                animation-delay: ${Math.random() * 15}s;
                opacity: ${Math.random() * 0.5 + 0.2};
            `;
            particlesContainer.appendChild(particle);
        }
    }

    // Setup typewriter effect
    setupTypewriterEffect() {
        const typewriterElements = document.querySelectorAll('.typewriter');
        
        typewriterElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            element.style.borderRight = '2px solid #3b82f6';
            
            let i = 0;
            const typeInterval = setInterval(() => {
                element.textContent += text.charAt(i);
                i++;
                
                if (i >= text.length) {
                    clearInterval(typeInterval);
                    setTimeout(() => {
                        element.style.borderRight = 'none';
                    }, 1000);
                }
            }, 100);
        });
    }

    // Setup counter animations
    setupCounterAnimations() {
        const counters = document.querySelectorAll('.counter');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    // Animate counter
    animateCounter(element) {
        const target = parseInt(element.dataset.target || element.textContent);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.ceil(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        };

        updateCounter();
    }

    // Smooth scroll to element
    smoothScrollTo(element, offset = 0) {
        const targetPosition = element.offsetTop - offset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let start = null;

        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };

        requestAnimationFrame(animation);
    }

    // Easing function
    easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    // Add floating animation to elements
    addFloatingAnimation(elements) {
        elements.forEach((element, index) => {
            element.style.animation = `float ${3 + index * 0.5}s ease-in-out infinite`;
            element.style.animationDelay = `${index * 0.2}s`;
        });
    }

    // Add pulse animation
    addPulseAnimation(element) {
        element.style.animation = 'pulse 2s ease-in-out infinite';
    }

    // Add shake animation
    addShakeAnimation(element) {
        element.classList.add('shake');
        setTimeout(() => {
            element.classList.remove('shake');
        }, 500);
    }

    // Add bounce animation
    addBounceAnimation(element) {
        element.classList.add('bounce');
        setTimeout(() => {
            element.classList.remove('bounce');
        }, 1000);
    }
}

// CSS animations (to be added to CSS file)
const animationStyles = `
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

@keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}

@keyframes bounce {
    0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
    40%, 43% { transform: translateY(-15px); }
    70% { transform: translateY(-7px); }
    90% { transform: translateY(-3px); }
}

.fade-in {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease;
}

.fade-in.animate-in {
    opacity: 1;
    transform: translateY(0);
}

.slide-up {
    opacity: 0;
    transform: translateY(50px);
    transition: all 0.8s ease;
}

.slide-up.animate-in {
    opacity: 1;
    transform: translateY(0);
}

.slide-in-left {
    opacity: 0;
    transform: translateX(-50px);
    transition: all 0.8s ease;
}

.slide-in-left.animate-in {
    opacity: 1;
    transform: translateX(0);
}

.slide-in-right {
    opacity: 0;
    transform: translateX(50px);
    transition: all 0.8s ease;
}

.slide-in-right.animate-in {
    opacity: 1;
    transform: translateX(0);
}

.scale-in {
    opacity: 0;
    transform: scale(0.8);
    transition: all 0.6s ease;
}

.scale-in.animate-in {
    opacity: 1;
    transform: scale(1);
}

.book-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

.menu-item {
    transition: all 0.3s ease;
}

.particle {
    pointer-events: none;
    z-index: -1;
}

.loading {
    pointer-events: none;
}

body.loaded {
    overflow-x: hidden;
}

.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: 8px;
    padding: 15px 20px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 1000;
    animation: slideInRight 0.3s ease;
}

.notification-success {
    border-left: 4px solid #10b981;
}

.notification-error {
    border-left: 4px solid #ef4444;
}

.notification-info {
    border-left: 4px solid #3b82f6;
}

.notification-close {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: #666;
    margin-left: 10px;
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
`;

// Initialize animation manager
const animationManager = new AnimationManager();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationManager;
}
