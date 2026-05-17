import { auth, db } from './src/firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

document.addEventListener('DOMContentLoaded', () => {

    // ── Auth state check for registration buttons ──
    onAuthStateChanged(auth, async (user) => {
        const authNavItem = document.getElementById('auth-nav-item');
        const heroBtn = document.getElementById('heroRegisterBtn');
        const mainRegBtn = document.getElementById('registerBtn');

        if (user) {
            // 1. Render initial placeholder immediately using auth info
            let displayNameToShow = (user.displayName || 'Account').split(' ')[0];
            
            const renderProfile = (nameText) => {
                if (authNavItem) {
                    authNavItem.innerHTML = `
                        <a href="/app/profile" class="nav-profile-link" style="text-decoration: none;">
                            <div class="nav-profile">
                                <img src="${user.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(nameText)}" alt="Profile" class="nav-avatar" />
                                <span class="nav-user-name">${nameText}</span>
                            </div>
                        </a>
                    `;
                }
            };

            renderProfile(displayNameToShow);

            // 2. Fetch official name and grade from Firestore
            try {
                const userDocRef = doc(db, 'users', user.uid);
                const userSnap = await getDoc(userDocRef);
                if (userSnap.exists()) {
                    const data = userSnap.data();
                    const finalName = data.name || data.certificateName || user.displayName || 'Account';
                    const firstName = finalName.split(' ')[0];
                    const gradeStr = data.grade ? ` (Gr. ${data.grade})` : (data.role === 'mentor' ? ' (Mentor)' : '');
                    displayNameToShow = firstName + gradeStr;
                }
            } catch (err) {
                console.error("Error fetching user profile for homepage nav:", err);
            }

            // 3. Re-render with beautiful user-entered details from Firestore
            renderProfile(displayNameToShow);

            // Update other CTA buttons to "Go to Dashboard"
            if (heroBtn) {
                heroBtn.textContent = 'Go to Dashboard →';
                heroBtn.href = '/app';
            }
            if (mainRegBtn) {
                mainRegBtn.textContent = 'Go to Dashboard →';
                mainRegBtn.href = '/app';
            }
        } else {
            // Restore Register Buttons if logged out
            if (authNavItem) {
                authNavItem.innerHTML = `<a href="/app" class="btn btn-primary nav-cta" id="navRegisterBtn">Register Now</a>`;
            }
            if (heroBtn) {
                heroBtn.textContent = 'Register as Delegate';
                heroBtn.href = '/app';
            }
            if (mainRegBtn) {
                mainRegBtn.textContent = 'Register Now →';
                mainRegBtn.href = '/app';
            }
        }
    });

    // ── Navbar scroll effect ──
    const navbar = document.getElementById('navbar');
    const handleScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ── Mobile nav toggle ──
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Animate hamburger → X
        const spans = navToggle.querySelectorAll('span');
        if (navLinks.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close mobile nav when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // ── Scroll reveal animations ──
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ── Counter animation for hero stats ──
    function animateCounter(element, target, suffix = '') {
        let current = 0;
        const duration = 2000;
        const step = target / (duration / 16);
        const isDecimal = String(target).includes('.');

        function update() {
            current += step;
            if (current >= target) {
                current = target;
                element.textContent = (isDecimal ? target.toFixed(1) : Math.floor(target)) + suffix;
                return;
            }
            element.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
            requestAnimationFrame(update);
        }

        update();
    }

    const statDelegates = document.getElementById('statDelegates');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(statDelegates, 300, '+');
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (statDelegates) statsObserver.observe(statDelegates);

    // ── Smooth scroll for anchor links ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });

    // ── Parallax effect on hero background ──
    const heroBg = document.querySelector('.hero-bg img');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroBg.style.transform = `scale(1.1) translateY(${scrolled * 0.3}px)`;
            }
        }, { passive: true });
    }

    // ── Committee cards hover tilt effect ──
    const cards = document.querySelectorAll('.committee-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // ── Countdown timer (optional, shows days until event) ──
    const eventDate = new Date('2026-08-15T09:00:00+05:30');
    function updateCountdown() {
        const now = new Date();
        const diff = eventDate - now;
        if (diff <= 0) return;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        // Could display this somewhere if needed
    }
    updateCountdown();

});
