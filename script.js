document.addEventListener('DOMContentLoaded', function () {
    // Initialize particles.js if available
    if (typeof particlesJS === 'function' && document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#6e00ff"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    }
                },
                "opacity": {
                    "value": 0.5,
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#6e00ff",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });
    }

    // Initialize game UI elements
    initGameUI();

    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', function () {
        this.classList.toggle('open');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navLinks.classList.remove('active');
        });
    });

    // Header scroll effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Back to top button
    const backToTopBtn = document.querySelector('.back-to-top');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });

    backToTopBtn.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation item based on scroll position
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // Intersection Observer for animations
    const animateOnScroll = function () {
        const elements = document.querySelectorAll('.project-card, .timeline-item, .certification-card, .achievement-card');

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function (entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        elements.forEach(element => {
            observer.observe(element);
        });
    };

    // Initialize animations
    animateOnScroll();

    // Game UI Initialization
    function initGameUI() {
        // Health bar animation
        const healthBar = document.querySelector('.health-bar-fill');
        const healthText = document.querySelector('.health-text');

        // Simulate health decreasing as user scrolls
        window.addEventListener('scroll', () => {
            const scrollPercentage = Math.min(100, (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            const health = 100 - Math.floor(scrollPercentage / 2);

            healthBar.style.width = `${health}%`;
            healthText.textContent = `ENERGY: ${health}%`;
        });

        // XP bar animation
        const xpBar = document.querySelector('.xp-bar-fill');
        const xpText = document.querySelector('.xp-text');
        let xp = 0;

        // Simulate XP increasing as user interacts with the page
        document.addEventListener('click', () => {
            if (xp < 100) {
                xp += 5;
                xpBar.style.width = `${xp}%`;
                xpText.textContent = `XP: ${xp}/${100}`;
            }
        });
    }

    // Form Validation
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const successPopup = document.getElementById('successPopup');
    const errorPopup = document.getElementById('errorPopup');
    const closeSuccessPopup = document.getElementById('closeSuccessPopup');
    const closeErrorPopup = document.getElementById('closeErrorPopup');
    const continueBtn = document.getElementById('continueBtn');
    const retryBtn = document.getElementById('retryBtn');
    const errorDetails = document.getElementById('errorDetails');
    const errorPopupMessage = document.getElementById('errorPopupMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Reset previous errors
            resetFormErrors();
            formStatus.textContent = '';
            formStatus.className = 'form-status';

            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            // Validate form
            const errors = validateForm(name, email, message);

            if (Object.keys(errors).length > 0) {
                // Show error popup
                showErrorPopup(errors);
            } else {
                // Submit form to Firebase
                submitFormToFirebase(name, email, subject, message);
            }
        });
    }

    function validateForm(name, email, message) {
        const errors = {};

        // Validate name
        if (!name) {
            errors.name = "Your character name is required!";
            showFieldError('name', errors.name);
        } else {
            showFieldSuccess('name');
        }

        // Validate email
        if (!email) {
            errors.email = "Your quest log (email) is required!";
            showFieldError('email', errors.email);
        } else if (!isValidEmail(email)) {
            errors.email = "Invalid email format! Check your coordinates!";
            showFieldError('email', errors.email);
        } else {
            showFieldSuccess('email');
        }

        // Validate message
        if (!message) {
            errors.message = "Your message scroll is empty!";
            showFieldError('message', errors.message);
        } else {
            showFieldSuccess('message');
        }

        return errors;
    }

    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function showFieldError(fieldId, errorMessage) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}Error`);

        field.classList.add('error');
        field.classList.remove('success');

        errorElement.textContent = errorMessage;
        errorElement.style.display = 'block';

        // Add shake animation
        field.style.animation = 'none';
        setTimeout(() => {
            field.style.animation = 'shake 0.5s ease-in-out';
        }, 10);
    }

    function showFieldSuccess(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}Error`);

        field.classList.remove('error');
        field.classList.add('success');

        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }

    function resetFormErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        const formControls = document.querySelectorAll('.form-control');

        errorMessages.forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });

        formControls.forEach(control => {
            control.classList.remove('error');
            control.classList.remove('success');
        });
    }

    function showErrorPopup(errors) {
        errorDetails.innerHTML = '';

        // Create error list
        const errorList = document.createElement('ul');

        for (const field in errors) {
            const errorItem = document.createElement('li');
            errorItem.innerHTML = `<i class="fas fa-times-circle"></i> ${errors[field]}`;
            errorList.appendChild(errorItem);
        }

        errorDetails.appendChild(errorList);

        // Set error message based on number of errors
        if (Object.keys(errors).length > 1) {
            errorPopupMessage.textContent = "Multiple quest requirements not met. Check the details below:";
        } else {
            errorPopupMessage.textContent = "One quest requirement not met. Check the detail below:";
        }

        // Show popup
        errorPopup.classList.add('active');

        // Play error sound
        playErrorSound();
    }

    function submitFormToFirebase(name, email, subject, message) {
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Get a reference to the database service
        const database = firebase.database();
        const messagesRef = database.ref('messages');

        // Push new message to Firebase
        messagesRef.push({
            name: name,
            email: email,
            subject: subject,
            message: message,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        })
            .then(() => {
                // Success
                contactForm.reset();
                resetFormErrors();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                showSuccessPopup();
                updateXP(50);
            })
            .catch((error) => {
                // Error handling
                console.error("Error saving message: ", error);
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;

                // Show error message in form
                formStatus.textContent = "Message not sent. Please try again after some time.";
                formStatus.className = 'form-status error';

                // Also show error popup
                showErrorPopup({ firebase: "Failed to send message. Please try again later." });
            });
    }

    function showSuccessPopup() {
        successPopup.classList.add('active');

        // Play success sound and confetti
        playSuccessSound();
        triggerConfetti();
    }

    function updateXP(amount) {
        const xpBar = document.querySelector('.xp-bar-fill');
        const xpText = document.querySelector('.xp-text');

        if (xpBar && xpText) {
            let currentXP = parseInt(xpText.textContent.split('/')[0].replace('XP: ', ''));
            let newXP = Math.min(100, currentXP + amount);

            xpBar.style.width = `${newXP}%`;
            xpText.textContent = `XP: ${newXP}/${100}`;
        }
    }

    function playSuccessSound() {
        // Create audio element for success sound
        const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-magical-coin-win-1936.mp3');
        audio.volume = 0.5;
        audio.play().catch(e => console.log("Audio play failed:", e));
    }

    function playErrorSound() {
        // Create audio element for error sound
        const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-retro-arcade-lose-2027.mp3');
        audio.volume = 0.5;
        audio.play().catch(e => console.log("Audio play failed:", e));
    }

    function triggerConfetti() {
        if (typeof confetti !== 'function') return;

        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        let intervalId = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(intervalId);
            }

            const particleCount = 50 * (timeLeft / duration);

            // Since particles fall down, start a bit higher than random
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);
    }

    // Close popup events
    if (closeSuccessPopup) {
        closeSuccessPopup.addEventListener('click', () => {
            successPopup.classList.remove('active');
        });
    }

    if (closeErrorPopup) {
        closeErrorPopup.addEventListener('click', () => {
            errorPopup.classList.remove('active');
        });
    }

    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            successPopup.classList.remove('active');
        });
    }

    if (retryBtn) {
        retryBtn.addEventListener('click', () => {
            errorPopup.classList.remove('active');
        });
    }

    // Close popups when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === successPopup) {
            successPopup.classList.remove('active');
        }
        if (e.target === errorPopup) {
            errorPopup.classList.remove('active');
        }
    });
});