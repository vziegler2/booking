// Mobile Navigation Toggle
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    burger.classList.toggle('active');

    // Toggle aria-expanded for accessibility
    const isExpanded = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', !isExpanded);
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        burger.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
    });
});

// Smooth scroll for navigation links
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

// Navbar background on scroll
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.style.background = 'rgba(5, 13, 26, 0.98)';
    } else {
        header.style.background = 'rgba(5, 13, 26, 0.9)';
    }
});

// Form submission handling
const bookingForm = document.getElementById('booking-form');

bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(bookingForm);
    const data = Object.fromEntries(formData);

    // Validate required fields
    if (!data.name || !data.email || !data.service || !data.message) {
        alert('Bitte füllen Sie alle Pflichtfelder aus.');
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
        return;
    }

    // Validate privacy checkbox
    if (!data.privacy) {
        alert('Bitte akzeptieren Sie die Datenschutzerklärung.');
        return;
    }

    // Get submit button
    const submitBtn = bookingForm.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;

    // Show loading state
    submitBtn.innerHTML = 'Wird gesendet...';
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual API call)
    try {
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Show success message
        showSuccessMessage();

        // Reset form
        bookingForm.reset();

    } catch (error) {
        alert('Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.');
    } finally {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// Show success message
function showSuccessMessage() {
    // Create success message element if it doesn't exist
    let successMsg = document.querySelector('.success-message');
    if (!successMsg) {
        successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.innerHTML = `
            <strong>Vielen Dank für Ihre Anfrage!</strong>
            <p>Ich werde mich innerhalb von 24 Stunden bei Ihnen melden.</p>
        `;
        bookingForm.parentNode.insertBefore(successMsg, bookingForm);
    }

    successMsg.classList.add('show');

    // Hide after 5 seconds
    setTimeout(() => {
        successMsg.classList.remove('show');
    }, 5000);

    // Scroll to success message
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Animate skill bars on scroll
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillBars = entry.target.querySelectorAll('.skill-progress');
            skillBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.transition = 'width 1s ease-out';
                    bar.style.width = width;
                }, 100);
            });
            skillsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

// Animate elements on scroll
const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

// Apply animation to cards
document.querySelectorAll('.skill-card, .service-card, .project-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    animateOnScroll.observe(card);
});

// Set minimum date for date picker to today
const startDateInput = document.getElementById('start-date');
if (startDateInput) {
    const today = new Date().toISOString().split('T')[0];
    startDateInput.setAttribute('min', today);
}

// Add active class to current nav link based on scroll position
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Console message
console.log('%cSAP Developer Booking Site', 'color: #0070f3; font-size: 20px; font-weight: bold;');
console.log('%cBereit für Ihr nächstes Projekt!', 'color: #00d4aa; font-size: 14px;');

// ===== EINPRÄGSAME UX FEATURES =====

// 1. Typing Animation for Code Window
function initTypingAnimation() {
    const codeContent = document.querySelector('.code-content');
    if (!codeContent) return;

    const originalHTML = codeContent.innerHTML;
    const text = codeContent.textContent;

    // Store original and clear
    codeContent.innerHTML = '';
    codeContent.style.visibility = 'visible';

    let index = 0;
    const speed = 30;

    function type() {
        if (index < text.length) {
            codeContent.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        } else {
            // Restore syntax highlighting
            setTimeout(() => {
                codeContent.innerHTML = originalHTML;
            }, 500);
        }
    }

    // Start typing after page load
    setTimeout(type, 1000);
}

// 2. Animated Particles Background
function initParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        pointer-events: none;
        z-index: 0;
    `;
    hero.style.position = 'relative';
    hero.insertBefore(particlesContainer, hero.firstChild);

    // Create particles
    for (let i = 0; i < 50; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    const size = Math.random() * 5 + 2;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;

    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${Math.random() > 0.5 ? 'rgba(0, 112, 243, 0.3)' : 'rgba(0, 212, 170, 0.3)'};
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: floatParticle ${duration}s ease-in-out ${delay}s infinite;
    `;

    container.appendChild(particle);
}

// Add particle animation keyframes
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes floatParticle {
        0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
        }
        25% {
            transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1.5);
            opacity: 0.6;
        }
        50% {
            transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1);
            opacity: 0.4;
        }
        75% {
            transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1.2);
            opacity: 0.5;
        }
    }
`;
document.head.appendChild(particleStyle);

// 3. Counter Animation for Stats
function initCounterAnimation() {
    const stats = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent;
                const number = parseInt(text);

                if (!isNaN(number)) {
                    animateCounter(target, number, text.includes('+'), text.includes('%'));
                }
                counterObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => counterObserver.observe(stat));
}

function animateCounter(element, target, hasPlus, hasPercent) {
    let current = 0;
    const increment = target / 50;
    const duration = 2000;
    const stepTime = duration / 50;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        let display = Math.floor(current);
        if (hasPlus) display += '+';
        if (hasPercent) display += '%';

        element.textContent = display;
    }, stepTime);
}

// 4. Magnetic Button Effect
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-primary');

    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.05)`;
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0) scale(1)';
        });
    });
}

// 5. Enhanced Form Input Animations
function initFormAnimations() {
    const inputs = document.querySelectorAll('#booking-form input, #booking-form select, #booking-form textarea');

    inputs.forEach(input => {
        // Focus animation
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
            input.style.transform = 'scale(1.02)';
            input.style.boxShadow = '0 0 20px rgba(0, 112, 243, 0.3)';
        });

        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
            input.style.transform = 'scale(1)';
            input.style.boxShadow = 'none';
        });

        // Input validation feedback
        input.addEventListener('input', () => {
            if (input.checkValidity() && input.value) {
                input.style.borderColor = '#00d4aa';
            } else if (input.value && !input.checkValidity()) {
                input.style.borderColor = '#ff5f56';
            } else {
                input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }
        });
    });
}

// 6. Parallax Effect on Scroll
function initParallax() {
    const hero = document.querySelector('.hero-content');
    const codeWindow = document.querySelector('.code-window');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;

        if (hero && scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * 0.3}px)`;
            hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
        }

        if (codeWindow && scrolled < window.innerHeight) {
            codeWindow.style.transform = `translateY(${scrolled * -0.1}px)`;
        }
    });
}

// 7. Cursor Trail Effect
function initCursorTrail() {
    const trail = [];
    const trailLength = 10;

    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail';
        dot.style.cssText = `
            position: fixed;
            width: ${8 - i * 0.5}px;
            height: ${8 - i * 0.5}px;
            background: var(--primary);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: ${1 - i * 0.1};
            transition: transform 0.1s ease;
        `;
        document.body.appendChild(dot);
        trail.push(dot);
    }

    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateTrail() {
        let x = mouseX;
        let y = mouseY;

        trail.forEach((dot, index) => {
            const nextDot = trail[index + 1] || trail[0];

            dot.style.left = x + 'px';
            dot.style.top = y + 'px';

            x += (parseFloat(nextDot.style.left) - x) * 0.3;
            y += (parseFloat(nextDot.style.top) - y) * 0.3;
        });

        requestAnimationFrame(animateTrail);
    }

    animateTrail();
}

// 8. Section Reveal Animation
function initSectionReveal() {
    const sections = document.querySelectorAll('section');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        if (section.id !== 'home') {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            revealObserver.observe(section);
        }
    });
}

// Initialize all UX features
document.addEventListener('DOMContentLoaded', () => {
    initTypingAnimation();
    initParticles();
    initCounterAnimation();
    initMagneticButtons();
    initFormAnimations();
    initParallax();
    // initCursorTrail(); // Uncomment for cursor trail effect
    initSectionReveal();
});
