import { auth, db } from './src/firebase.js';
import { VIDEO_CHECKPOINTS } from './src/constants/videos.js';
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
            // Render profile in navbar if user is logged in
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

            renderProfile(displayNameToShow);

            if (heroBtn) {
                heroBtn.textContent = 'Explore Training Videos →';
                heroBtn.href = '#videos';
            }
            if (mainRegBtn) {
                mainRegBtn.textContent = 'Training Videos →';
                mainRegBtn.href = '#videos';
            }
        } else {
            if (heroBtn) {
                heroBtn.textContent = 'Explore Training Videos →';
                heroBtn.href = '#videos';
            }
            if (mainRegBtn) {
                mainRegBtn.textContent = 'Training Videos →';
                mainRegBtn.href = '#videos';
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
    // ── Homepage Interactive Video Gallery & Player ──
    const TRAINING_VIDEOS = [
        { id: 'v1', title: 'Introduction to MUN', youtubeId: 'ChzKEFkv7Dg', category: 'basics' },
        { id: 'v2', title: 'Research I', youtubeId: 'yPOr9Xg28AU', category: 'basics' },
        { id: 'v3', title: 'Research II', youtubeId: 'KTr4sDnE2zE', category: 'basics' },
        { id: 'v4', title: 'Research Part Live Demonstration', youtubeId: 'lnjpnhQPrRI', category: 'basics' },
        { id: 'v5', title: 'Points I', youtubeId: '4nOiPrbcxyM', category: 'procedure' },
        { id: 'v6', title: 'Points II', youtubeId: 'HCGKEtP3Rww', category: 'procedure' },
        { id: 'v7', title: 'Motions I', youtubeId: 'GM_Dgj23ePs', category: 'procedure' },
        { id: 'v8', title: 'Motions II', youtubeId: 'ddS9cCaxQiU', category: 'procedure' },
        { id: 'v9', title: 'Roll Call', youtubeId: 'nCxGlgpafFk', category: 'procedure' },
        { id: 'v11', title: 'Opening Speech', youtubeId: '-TmTYMbfWEs', category: 'resolutions' },
        { id: 'v12', title: 'Draft Resolution - Introduction', youtubeId: 'JhRlyvPQvLQ', category: 'resolutions' },
        { id: 'v13', title: 'Draft Resolution - Preambulatory', youtubeId: 'FaP76l7BbiQ', category: 'resolutions' },
        { id: 'v14', title: 'Draft Resolution - Operatives', youtubeId: '5vPlnSKTruA', category: 'resolutions' },
        { id: 'v15', title: 'Unmoderated Caucus', youtubeId: 'paF5ZmsvTUY', category: 'procedure' },
        { id: 'v16', title: 'Moderated Caucus', youtubeId: 'U-M-3BBRe5o', category: 'procedure' },
        { id: 'v17', title: 'Resolution Debate Procedure', youtubeId: 'EMuLbPUZblE', category: 'resolutions' }
    ];

    const homepageVideosGrid = document.getElementById('homepageVideosGrid');
    const videoModal = document.getElementById('videoModal');
    const videoModalTitle = document.getElementById('videoModalTitle');
    const closeVideoModal = document.getElementById('closeVideoModal');
    const homeQuizOverlay = document.getElementById('homeQuizOverlay');
    const homeQuizQuestion = document.getElementById('homeQuizQuestion');
    const homeQuizOptions = document.getElementById('homeQuizOptions');
    const homeQuizAlert = document.getElementById('homeQuizAlert');
    const homeQuizSubmitBtn = document.getElementById('homeQuizSubmitBtn');
    const videoModalSeekFill = document.getElementById('videoModalSeekFill');
    const videoModalMarkers = document.getElementById('videoModalMarkers');
    const videoModalCurrentTime = document.getElementById('videoModalCurrentTime');
    const videoModalDuration = document.getElementById('videoModalDuration');
    const videoModalSeekbar = document.getElementById('videoModalSeekbar');

    let player = null;
    let timeMonitorInterval = null;
    let currentVideo = null;
    let activeCheckpoint = null;
    let selectedOption = '';

    function formatTimeStr(seconds) {
        if (!seconds || isNaN(seconds)) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        const minsStr = mins < 10 ? `0${mins}` : `${mins}`;
        const secsStr = secs < 10 ? `0${secs}` : `${secs}`;
        return `${minsStr}:${secsStr}`;
    }

    function checkVideoTime() {
        if (!player || typeof player.getCurrentTime !== 'function') return;
        const currentTime = player.getCurrentTime();
        const duration = player.getDuration() || 0;

        if (videoModalCurrentTime) videoModalCurrentTime.textContent = formatTimeStr(currentTime);
        if (videoModalDuration) videoModalDuration.textContent = formatTimeStr(duration);

        if (duration > 0) {
            const pct = (currentTime / duration) * 100;
            if (videoModalSeekFill) videoModalSeekFill.style.width = `${pct}%`;
            const handle = document.getElementById('videoModalHandle');
            if (handle) handle.style.left = `${pct}%`;
        }

        if (!currentVideo || activeCheckpoint) return;

        const checkpoints = VIDEO_CHECKPOINTS[currentVideo.id] || [];
        const answered = JSON.parse(localStorage.getItem('csmun_answered_checkpoints') || '[]');

        for (const cp of checkpoints) {
            if (!answered.includes(cp.id) && currentTime >= cp.timestamp && currentTime <= cp.timestamp + 2) {
                player.pauseVideo();
                triggerQuizOverlay(cp);
                break;
            }
        }
    }

    const videoModalPlayBtn = document.getElementById('videoModalPlayBtn');
    const videoModalRewindBtn = document.getElementById('videoModalRewindBtn');
    const videoModalSpeedBtn = document.getElementById('videoModalSpeedBtn');
    const videoModalMuteBtn = document.getElementById('videoModalMuteBtn');
    const videoModalFullscreenBtn = document.getElementById('videoModalFullscreenBtn');

    let currentSpeedIndex = 0;
    const speeds = [1, 1.25, 1.5, 2];

    function updatePlayIcon(isPlaying) {
        const icon = document.getElementById('videoModalPlayIcon');
        if (!icon) return;
        if (isPlaying) {
            icon.innerHTML = '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';
        } else {
            icon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
        }
    }

    if (videoModalPlayBtn) {
        videoModalPlayBtn.addEventListener('click', () => {
            if (!player || typeof player.getPlayerState !== 'function') return;
            const state = player.getPlayerState();
            if (state === 1) { // playing -> pause
                player.pauseVideo();
                updatePlayIcon(false);
            } else {
                if (activeCheckpoint) return;
                player.playVideo();
                updatePlayIcon(true);
            }
        });
    }

    if (videoModalRewindBtn) {
        videoModalRewindBtn.addEventListener('click', () => {
            if (!player || typeof player.getCurrentTime !== 'function') return;
            const cur = player.getCurrentTime();
            player.seekTo(Math.max(0, cur - 10));
        });
    }

    if (videoModalSpeedBtn) {
        videoModalSpeedBtn.addEventListener('click', () => {
            if (!player || typeof player.setPlaybackRate !== 'function') return;
            currentSpeedIndex = (currentSpeedIndex + 1) % speeds.length;
            const rate = speeds[currentSpeedIndex];
            player.setPlaybackRate(rate);
            videoModalSpeedBtn.textContent = `${rate}x`;
        });
    }

    if (videoModalMuteBtn) {
        videoModalMuteBtn.addEventListener('click', () => {
            if (!player || typeof player.isMuted !== 'function') return;
            const muteIcon = document.getElementById('videoModalMuteIcon');
            if (player.isMuted()) {
                player.unMute();
                if (muteIcon) muteIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>';
            } else {
                player.mute();
                if (muteIcon) muteIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>';
            }
        });
    }

    if (videoModalFullscreenBtn) {
        videoModalFullscreenBtn.addEventListener('click', () => {
            const container = document.querySelector('.video-modal-container') || videoModal;
            if (!document.fullscreenElement) {
                if (container.requestFullscreen) container.requestFullscreen();
                else if (container.webkitRequestFullscreen) container.webkitRequestFullscreen();
            } else {
                if (document.exitFullscreen) document.exitFullscreen();
                else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
            }
        });
    }

    function openInteractiveVideo(video) {
        currentVideo = video;
        activeCheckpoint = null;
        if (videoModalTitle) videoModalTitle.textContent = video.title;
        if (videoModal) videoModal.classList.add('open');
        updatePlayIcon(true);

        const createPlayer = () => {
            if (player) {
                player.loadVideoById(video.youtubeId);
            } else {
                player = new YT.Player('videoModalPlayer', {
                    height: '100%',
                    width: '100%',
                    videoId: video.youtubeId,
                    playerVars: {
                        autoplay: 1,
                        controls: 0, // Hides YouTube internal duplicate timeline and controls!
                        disablekb: 1,
                        fs: 0,
                        rel: 0,
                        modestbranding: 1,
                        iv_load_policy: 3
                    },
                    events: {
                        onReady: (event) => {
                            event.target.playVideo();
                            renderTimelineMarkers(video, event.target.getDuration());
                        },
                        onStateChange: (event) => {
                            if (videoModalPlayBtn) {
                                videoModalPlayBtn.textContent = (event.data === 1) ? '⏸' : '▶';
                            }
                        }
                    }
                });
            }

            if (timeMonitorInterval) clearInterval(timeMonitorInterval);
            timeMonitorInterval = setInterval(checkVideoTime, 250);
        };

        if (window.YT && window.YT.Player) {
            createPlayer();
        } else {
            window.onYouTubeIframeAPIReady = createPlayer;
        }
    }

    function loadYouTubeAPI() {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
    }
    loadYouTubeAPI();

    function renderTimelineMarkers(video, duration) {
        if (!videoModalMarkers) return;
        videoModalMarkers.innerHTML = '';
        const checkpoints = VIDEO_CHECKPOINTS[video.id] || [];
        const answered = JSON.parse(localStorage.getItem('csmun_answered_checkpoints') || '[]');
        const wrong = JSON.parse(localStorage.getItem('csmun_wrong_checkpoints') || '[]');

        checkpoints.forEach((cp, idx) => {
            const videoDuration = duration || 237;
            const pct = Math.min(98, Math.max(2, (cp.timestamp / videoDuration) * 100));
            const isCompleted = answered.includes(cp.id);
            const isWrong = wrong.includes(cp.id);
            const fillColor = isWrong ? '#ef4444' : (isCompleted ? '#22c55e' : '#cbd5e1');

            const marker = document.createElement('div');
            marker.className = 'video-marker-droplet';
            marker.style.left = `${pct}%`;
            marker.title = `Question ${idx + 1}: ${cp.question}`;
            marker.innerHTML = `
                <svg width="12" height="14" viewBox="0 0 24 24" fill="${fillColor}" style="filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.8));">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                </svg>
            `;
            marker.addEventListener('click', (e) => {
                e.stopPropagation();
                if (player && typeof player.seekTo === 'function') {
                    player.seekTo(Math.max(0, cp.timestamp - 2));
                }
            });
            videoModalMarkers.appendChild(marker);
        });
    }

    function renderVideos(categoryFilter = 'all') {
        if (!homepageVideosGrid) return;
        homepageVideosGrid.innerHTML = '';

        const filtered = categoryFilter === 'all' 
            ? TRAINING_VIDEOS 
            : TRAINING_VIDEOS.filter(v => v.category === categoryFilter);

        filtered.forEach(video => {
            const card = document.createElement('div');
            card.className = 'video-card-item';
            card.innerHTML = `
                <div class="video-thumb-wrapper">
                    <img src="https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg" alt="${video.title}" class="video-thumb-img" />
                    <div class="video-play-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    </div>
                </div>
                <div class="video-card-info">
                    <h4 class="video-card-title">${video.title}</h4>
                    <div class="video-card-meta">
                        <span class="video-badge">Training Module</span>
                        <span>Watch Now →</span>
                    </div>
                </div>
            `;
            card.addEventListener('click', () => {
                openInteractiveVideo(video);
            });
            homepageVideosGrid.appendChild(card);
        });
    }

    renderVideos('all');

    document.querySelectorAll('.video-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.video-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.getAttribute('data-category');
            renderVideos(category);
        });
    });

    function closeVideoModalHandler() {
        if (videoModal) videoModal.classList.remove('open');
        if (player && typeof player.pauseVideo === 'function') {
            player.pauseVideo();
        }
        if (homeQuizOverlay) homeQuizOverlay.style.display = 'none';
        if (timeMonitorInterval) clearInterval(timeMonitorInterval);
        activeCheckpoint = null;
    }

    if (closeVideoModal) {
        closeVideoModal.addEventListener('click', closeVideoModalHandler);
    }

    if (videoModal) {
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                closeVideoModalHandler();
            }
        });
    }

});
