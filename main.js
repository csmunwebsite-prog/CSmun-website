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

    // ── IMMERSIVE CINEMATIC SCROLLYTELLING (GSAP) ──
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Clean up old CSS reveal classes
        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => {
            el.style.transition = 'none';
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.classList.remove('reveal', 'reveal-up', 'reveal-down', 'reveal-left', 'reveal-right', 'reveal-zoom');
        });

        // Ensure sections fill screen for pinning
        document.body.style.overflowX = "hidden";

        // 1. HERO SCENE: Pin and scrub zoom out
        const heroSection = document.querySelector('.premium-hero');
        if (heroSection) {
            const heroContent = document.querySelector('.premium-hero-content');
            const heroBgImg = document.querySelector('.hero-bg img');

            const heroTl = gsap.timeline({
                scrollTrigger: {
                    trigger: heroSection,
                    start: "top 0",
                    end: "+=150%", // Good distance for a smooth fade
                    pin: true,
                    scrub: 1.5, // Smooth scrubbing
                    anticipatePin: 1
                }
            });

            // Keep text completely visible at start, but fade out quickly on scroll
            heroTl.to(heroContent, {
                scale: 1.1,
                opacity: 0,
                filter: "blur(8px)",
                duration: 0.8
            }, 0) // Reacts immediately on scroll
            .to(heroBgImg, {
                scale: 1.2,
                opacity: 0.3,
                duration: 1.3
            }, 0);
        }

        // 2. ABOUT SCENE: Pinned lateral reveal
        const aboutSection = document.querySelector('.about');
        if (aboutSection) {
            const aboutImg = aboutSection.querySelector('.about-image-wrapper');
            const aboutText = aboutSection.querySelector('.about-text');

            const aboutTl = gsap.timeline({
                scrollTrigger: {
                    trigger: aboutSection,
                    start: "center center",
                    end: "+=150%",
                    pin: true,
                    scrub: 1.5
                }
            });

            // Start state
            gsap.set(aboutImg, { x: "-20vw", opacity: 0, rotationY: -10 });
            gsap.set(aboutText, { x: "20vw", opacity: 0 });

            // Animate in and stay
            aboutTl.to(aboutImg, { x: 0, opacity: 1, rotationY: 0, duration: 1, ease: "power2.out" }, 0)
                   .to(aboutText, { x: 0, opacity: 1, duration: 1, ease: "power2.out" }, 0.2);
        }

        // 3. COMMITTEES SCENE: Natural smooth scroll entry (Unpinned to avoid cutting off grid)
        const committeesSection = document.querySelector('.committees');
        if (committeesSection) {
            const headerText = committeesSection.querySelectorAll('.committees-header > *');
            const cards = committeesSection.querySelectorAll('.committee-card');

            // Hide initially
            gsap.set(headerText, { y: 30, opacity: 0 });
            gsap.set(cards, { y: 60, opacity: 0, scale: 0.9 });

            // Play smoothly when scrolled into view (no scrub, prevents skipping)
            ScrollTrigger.create({
                trigger: committeesSection,
                start: "top 75%",
                onEnter: () => {
                    gsap.to(headerText, { y: 0, opacity: 1, stagger: 0.15, duration: 1, ease: "power3.out" });
                    gsap.to(cards, { y: 0, opacity: 1, scale: 1, stagger: 0.1, duration: 1.2, ease: "power3.out", delay: 0.3 });
                }
            });
        }

        // 4. TIMELINE SCENE: Flowing cinematic entry (Unpinned to fit all items)
        const timelineSection = document.querySelector('.timeline-section');
        if (timelineSection) {
            const timelineHeader = timelineSection.querySelectorAll('.timeline-header > *');
            const timelineItems = document.querySelectorAll('.timeline-item');
            
            gsap.set(timelineHeader, { y: 30, opacity: 0 });
            gsap.set(timelineItems, { opacity: 0, x: (i) => i % 2 === 0 ? -50 : 50 });

            ScrollTrigger.create({
                trigger: timelineSection,
                start: "top 75%",
                onEnter: () => {
                    gsap.to(timelineHeader, { y: 0, opacity: 1, stagger: 0.15, duration: 1, ease: "power3.out" });
                    gsap.to(timelineItems, { x: 0, opacity: 1, stagger: 0.3, duration: 1.2, ease: "power3.out", delay: 0.4 });
                }
            });
        }

        // 5. SG LETTER: Smooth parallax float (Unpinned)
        const letterSection = document.querySelector('.letter-section');
        if (letterSection) {
            const letterContainer = letterSection.querySelector('.letter-container');
            
            gsap.set(letterContainer, { scale: 0.9, opacity: 0, y: 80 });

            gsap.to(letterContainer, {
                scale: 1,
                opacity: 1,
                y: 0,
                duration: 1.5,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: letterSection,
                    start: "top 80%",
                    end: "center center",
                    scrub: 1.5 // Scrub gives it a nice parallax feel without pinning
                }
            });
        }
        
        // 6. REGISTER CTA: Reveal
        const ctaSection = document.querySelector('.register-cta');
        if (ctaSection) {
            const ctaBox = ctaSection.querySelector('.register-cta-box');
            
            gsap.set(ctaBox, { scale: 0.9, opacity: 0, y: 50 });
            
            gsap.to(ctaBox, {
                scale: 1,
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ctaSection,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            });
        }
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

    // ── Committee cards hover tilt effect (GSAP Powered for high-end smoothness) ──
    const cards = document.querySelectorAll('.committee-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;

            gsap.to(card, {
                transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`,
                duration: 0.3,
                ease: "power2.out",
                overwrite: "auto"
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                transform: `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`,
                duration: 0.5,
                ease: "power2.out",
                overwrite: "auto"
            });
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
