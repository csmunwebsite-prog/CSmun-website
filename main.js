import { auth, db } from './src/firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

document.addEventListener('DOMContentLoaded', () => {

    // ── Render Premium Lucide Icons ──
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

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

    // ── IMMERSIVE CINEMATIC SCROLLYTELLING ──
    document.body.style.overflowX = "hidden";

    // ── 1. Main Reveal Observer (for .reveal elements) ──
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: "0px 0px -60px 0px",
        threshold: 0.1
    });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // ── 2. Staggered child reveal for grids, features, and timeline ──
    const staggerContainers = [
        { selector: '.committees-grid', children: '.committee-card' },
        { selector: '.about-features', children: '.about-feature' },
        { selector: '.timeline', children: '.timeline-item' },
        { selector: '.register-cta-info', children: 'span' },
    ];

    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const container = entry.target;
                const childSelector = container.getAttribute('data-stagger-child');
                const children = container.querySelectorAll(childSelector);

                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('stagger-visible');
                    }, index * 150); // 150ms stagger between each child
                });

                staggerObserver.unobserve(container);
            }
        });
    }, {
        root: null,
        rootMargin: "0px 0px -40px 0px",
        threshold: 0.15
    });

    staggerContainers.forEach(({ selector, children }) => {
        const container = document.querySelector(selector);
        if (container) {
            container.setAttribute('data-stagger-child', children);
            staggerObserver.observe(container);
        }
    });

    // ── 3. GSAP ScrollTrigger Parallax (if GSAP available) ──
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Parallax glow orbs
        document.querySelectorAll('.glow-orb').forEach(orb => {
            gsap.to(orb, {
                y: () => Math.random() * 150 - 75,
                scrollTrigger: {
                    trigger: orb.closest('section'),
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.5,
                }
            });
        });

        // Subtle section background parallax
        document.querySelectorAll('.committees, .timeline-section, .register-cta').forEach(section => {
            const bg = section.querySelector('::before') || section;
            gsap.fromTo(section, {
                backgroundPositionY: '0%'
            }, {
                backgroundPositionY: '30%',
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });
    }

    // ── 4. HERO SCENE PARALLAX & FADE ──
    const heroSection = document.querySelector('.premium-hero');
    if (heroSection) {
        const heroContent = document.querySelector('.premium-hero-content');
        const heroBgImg = document.querySelector('.hero-bg img');

        const handleHeroScroll = () => {
            const scrollTop = window.scrollY;
            const heroHeight = heroSection.offsetHeight;
            if (scrollTop <= heroHeight) {
                const progress = scrollTop / heroHeight;
                
                if (heroContent) {
                    heroContent.style.opacity = Math.max(0, 1 - progress * 1.5).toString();
                    heroContent.style.transform = `scale(${1 + progress * 0.06}) translateY(${progress * 50}px)`;
                    heroContent.style.filter = `blur(${progress * 8}px)`;
                }
                if (heroBgImg) {
                    heroBgImg.style.opacity = (0.2 + (1 - progress) * 0.8).toString();
                    heroBgImg.style.transform = `scale(${1.05 + progress * 0.08}) translateY(${progress * 30}px)`;
                }
            }
        };
        window.addEventListener('scroll', handleHeroScroll, { passive: true });
        handleHeroScroll();
    }

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

    // ── Committee cards hover tilt effect (GSAP Powered with Native Fallback) ──
    const cards = document.querySelectorAll('.committee-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * 12; // Max 12 deg tilt
            const rotateY = ((centerX - x) / centerX) * 12;

            if (typeof gsap !== 'undefined') {
                gsap.to(card, {
                    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`,
                    duration: 0.3,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            } else {
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
                card.style.transition = 'transform 0.15s ease-out';
            }
        });

        card.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(card, {
                    transform: `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`,
                    duration: 0.5,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            } else {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
                card.style.transition = 'transform 0.4s ease-out';
            }
        });
    });

    // ── Countdown timer (optional, shows days until event) ──
    const eventDate = new Date('2026-09-12T09:00:00+05:30');
    function updateCountdown() {
        const now = new Date();
        const diff = eventDate - now;
        if (diff <= 0) return;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        // Could display this somewhere if needed
    }
    updateCountdown();

});
