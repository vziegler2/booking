// Mobile Navigation Toggle
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    burger.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        burger.classList.remove('active');
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
