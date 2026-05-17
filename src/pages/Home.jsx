import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Custom Reveal on Scroll Component
function RevealOnScroll({ children, delay = 0, direction = 'up' }) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      });
    }, { threshold: 0.1 });
    
    const current = domRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  const getTransform = () => {
    if (isVisible) return 'translate(0, 0) scale(1)';
    switch (direction) {
      case 'left': return 'translate(-80px, 0) scale(0.95)';
      case 'right': return 'translate(80px, 0) scale(0.95)';
      case 'down': return 'translate(0, -80px) scale(0.95)';
      case 'up':
      default: return 'translate(0, 80px) scale(0.95)';
    }
  };

  return (
    <div
      ref={domRef}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        willChange: 'transform, opacity'
      }}
    >
      {children}
    </div>
  );
}

// Interactive Committee Card Component
const InteractiveCommitteeCard = ({ title, desc, icon }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#ffffff',
        padding: '2.5rem',
        borderRadius: '24px',
        boxShadow: hovered ? '0 30px 60px rgba(10, 35, 66, 0.12)' : '0 10px 40px rgba(0, 0, 0, 0.03)',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: hovered ? 'translateY(-12px) scale(1.03)' : 'translateY(0) scale(1)',
        border: '1px solid rgba(10, 35, 66, 0.05)',
        borderTop: `6px solid ${hovered ? '#c5a059' : '#0a2342'}`,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{
        position: 'absolute',
        bottom: '-50px',
        right: '-50px',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: hovered ? 'rgba(197, 160, 89, 0.12)' : 'rgba(10, 35, 66, 0.02)',
        transition: 'all 0.5s ease',
        filter: 'blur(20px)'
      }} />

      <div style={{
        background: 'rgba(197, 160, 89, 0.08)',
        padding: '1rem',
        borderRadius: '16px',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: hovered ? 'rotate(10deg) scale(1.1)' : 'rotate(0) scale(1)',
        transition: 'all 0.4s ease'
      }}>
        {icon}
      </div>

      <h3 style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: '1.5rem',
        color: '#0a2342',
        fontWeight: '800',
        marginBottom: '0.75rem'
      }}>
        {title}
      </h3>

      <p style={{
        color: '#475569',
        fontSize: '0.9rem',
        lineHeight: '1.6',
        margin: 0
      }}>
        {desc}
      </p>
    </div>
  );
};

// Interactive Secretariat Component
const SecretariatInteractive = () => {
  const [activeTab, setActiveTab] = useState('logistics');
  const [hoveredRole, setHoveredRole] = useState(null);

  const logisticsRoles = [
    { title: 'Secretary-General', desc: 'Represents the entire conference, directing administrative flow, overseeing registration, logistical arrangements, food, IT infrastructure, and delegate kits.', details: 'The chief executive responsible for the event\'s premium quality.' },
    { title: 'Deputy Secretary-General', desc: 'Manages IT, technical infrastructure, and digital parameters, ensuring smooth system synchronization and communications.', details: 'Ensures the technical skeleton runs flawlessly.' },
    { title: 'Head of Logistics', desc: 'Coordinates practical room structures, mics, background materials, prints, stationary and venue readiness.', details: 'Ensures the tangible conference environment is fully equipped.' }
  ];

  const academicsRoles = [
    { title: 'Director General', desc: 'Directs academic frameworks, selects committee chairs, proofreads background guides, manages press corps and delegate mentor assignments.', details: 'The academic sentinel ensuring high-fidelity debate.' },
    { title: 'Deputy Director General', desc: 'Directs mentor workflows, oversees preparation schedules, and designs delegate training strategies to ensure top debate standard.', details: 'Fosters high-competency delegate participation.' }
  ];

  const currentRoles = activeTab === 'logistics' ? logisticsRoles : academicsRoles;

  return (
    <div style={{ 
      maxWidth: '1000px', 
      margin: '0 auto', 
      padding: '2.5rem 2rem', 
      background: 'rgba(255, 255, 255, 0.7)', 
      borderRadius: '24px', 
      border: '1px solid rgba(10, 35, 66, 0.08)', 
      backdropFilter: 'blur(16px)', 
      boxShadow: '0 20px 40px rgba(0,0,0,0.03)' 
    }}>
      {/* Toggle Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setActiveTab('logistics')}
          style={{
            padding: '0.8rem 2rem',
            borderRadius: '30px',
            border: 'none',
            background: activeTab === 'logistics' ? 'linear-gradient(135deg, #0a2342 0%, #173b64 100%)' : '#e2e8f0',
            color: activeTab === 'logistics' ? '#ffffff' : '#334155',
            fontWeight: '700',
            cursor: 'pointer',
            fontSize: '0.9rem',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: activeTab === 'logistics' ? '0 10px 20px rgba(10, 35, 66, 0.15)' : 'none',
            transform: activeTab === 'logistics' ? 'translateY(-2px)' : 'translateY(0)'
          }}
        >
          💼 Logistics Division
        </button>
        <button 
          onClick={() => setActiveTab('academics')}
          style={{
            padding: '0.8rem 2rem',
            borderRadius: '30px',
            border: 'none',
            background: activeTab === 'academics' ? 'linear-gradient(135deg, #0a2342 0%, #173b64 100%)' : '#e2e8f0',
            color: activeTab === 'academics' ? '#ffffff' : '#334155',
            fontWeight: '700',
            cursor: 'pointer',
            fontSize: '0.9rem',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: activeTab === 'academics' ? '0 10px 20px rgba(10, 35, 66, 0.15)' : 'none',
            transform: activeTab === 'academics' ? 'translateY(-2px)' : 'translateY(0)'
          }}
        >
          🎓 Academics Division
        </button>
      </div>

      {/* Roles Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: currentRoles.length === 3 ? 'repeat(auto-fit, minmax(280px, 1fr))' : 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '1.5rem', 
        minHeight: '260px' 
      }}>
        {currentRoles.map((role, idx) => (
          <div 
            key={idx}
            onMouseEnter={() => setHoveredRole(idx)}
            onMouseLeave={() => setHoveredRole(null)}
            style={{
              background: '#ffffff',
              border: hoveredRole === idx ? '1px solid #c5a059' : '1px solid rgba(10, 35, 66, 0.08)',
              borderRadius: '20px',
              padding: '2rem 1.5rem',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: hoveredRole === idx ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
              boxShadow: hoveredRole === idx ? '0 20px 30px rgba(10, 35, 66, 0.08)' : '0 4px 15px rgba(0, 0, 0, 0.02)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '120px',
              height: '120px',
              background: 'radial-gradient(circle, rgba(197, 160, 89, 0.08) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />
            
            <h4 style={{ 
              fontFamily: "'Outfit', sans-serif", 
              fontSize: '1.25rem', 
              color: '#0a2342', 
              fontWeight: '800', 
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                background: '#c5a059',
                display: 'inline-block'
              }} />
              {role.title}
            </h4>
            
            <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '1rem' }}>
              {role.desc}
            </p>

            <div style={{
              opacity: hoveredRole === idx ? 1 : 0.6,
              transform: hoveredRole === idx ? 'translateY(0)' : 'translateY(5px)',
              transition: 'all 0.3s ease',
              borderTop: '1px solid rgba(10, 35, 66, 0.05)',
              paddingTop: '0.75rem',
              fontSize: '0.8rem',
              color: '#c5a059',
              fontWeight: '700',
              fontStyle: 'italic'
            }}>
              {role.details}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Animated Stats Ticker
const StatTicker = ({ value, label, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);
  const domRef = useRef();

  useEffect(() => {
    let active = true;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          let start = 0;
          const end = parseInt(value, 10);
          if (start === end) return;
          
          const totalMiliseconds = 1500;
          const incrementTime = Math.abs(Math.floor(totalMiliseconds / end));
          
          const timer = setInterval(() => {
            start += 1;
            if (active) setCount(start);
            if (start === end) {
              clearInterval(timer);
            }
          }, incrementTime);
        }
      });
    }, { threshold: 0.2 });

    const current = domRef.current;
    if (current) observer.observe(current);
    return () => {
      active = false;
      if (current) observer.unobserve(current);
    };
  }, [value]);

  return (
    <div ref={domRef} style={{ textAlign: 'center', padding: '1.5rem' }}>
      <h2 style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: '3rem',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #0a2342 0%, #c5a059 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '0.5rem',
        display: 'inline-block'
      }}>
        {prefix}{count}{suffix}
      </h2>
      <p style={{ color: '#475569', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
        {label}
      </p>
    </div>
  );
};

// Scroll Floating Shapes (Parallax Background effect)
const FloatingShapes = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      {/* Abstract Globe outline floating */}
      <div style={{
        position: 'absolute',
        top: '15%',
        right: '10%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        border: '1.5px dashed rgba(197, 160, 89, 0.15)',
        transform: `translateY(${scrollY * 0.15}px) rotate(${scrollY * 0.05}deg)`,
        transition: 'transform 0.1s linear',
      }} />
      
      {/* Floating circular rings */}
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '-100px',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        border: '2px solid rgba(10, 35, 66, 0.04)',
        transform: `translateY(${scrollY * -0.08}px) scale(${1 + scrollY * 0.0002})`,
        transition: 'transform 0.1s linear',
      }} />

      <div style={{
        position: 'absolute',
        top: '75%',
        right: '-50px',
        width: '250px',
        height: '250px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(197, 160, 89, 0.06) 0%, transparent 70%)',
        transform: `translateY(${scrollY * 0.12}px)`,
        transition: 'transform 0.1s linear',
      }} />
    </div>
  );
};

// SVGs for Committee Cards
const ShieldIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c5a059" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const ScaleIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c5a059" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1" />
    <path d="M18 8h4a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-4" />
    <line x1="12" y1="2" x2="12" y2="22" />
    <line x1="5" y1="7" x2="19" y2="7" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c5a059" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const AnchorIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c5a059" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="3" />
    <line x1="12" y1="22" x2="12" y2="8" />
    <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
  </svg>
);

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app-wrapper" style={{ position: 'relative', overflowX: 'hidden' }}>
      <FloatingShapes />

      {/* Navbar */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} style={{
        background: scrolled ? '#0a2342' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
      }}>
        <div className="container nav-container">
          <a href="#" className="nav-logo" style={{ letterSpacing: '1.5px', color: '#ffffff', fontWeight: '800' }}>CSMUN 2026</a>
          <ul className="nav-links" style={{ alignItems: 'center' }}>
            <li><a href="#about">About</a></li>
            <li><a href="#committees">Committees</a></li>
            <li><a href="#secretariat">Secretariat</a></li>
            <li>
              <Link 
                to="/login" 
                className="btn btn-primary" 
                style={{
                  padding: '0.55rem 1.4rem', 
                  marginLeft: '0.5rem',
                  fontSize: '0.85rem',
                  borderRadius: '30px',
                  background: '#c5a059',
                  borderColor: '#c5a059',
                  color: '#0a2342',
                  boxShadow: scrolled ? '0 4px 10px rgba(197, 160, 89, 0.2)' : 'none'
                }}
              >
                Login
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero" style={{ position: 'relative', zIndex: 2 }}>
        <div className="container hero-content animate-fade-in" style={{ padding: '0 1.5rem' }}>
          <h1 style={{
            textShadow: '0 10px 30px rgba(0,0,0,0.15)',
            letterSpacing: '-1px',
            marginBottom: '1rem',
            fontFamily: "'Outfit', sans-serif"
          }}>
            Diplomacy in Action.
          </h1>
          <p style={{
            fontSize: '1.25rem',
            maxWidth: '650px',
            margin: '0 auto 2.5rem',
            opacity: 0.95,
            lineHeight: '1.7',
            letterSpacing: '0.5px'
          }}>
            Join the sixth edition of the Chaitanya School Model United Nations. Empowering global thinkers to lead through dialogue, consensus, and outstanding leadership.
          </p>
          <div className="cta-group">
            <Link 
              to="/login" 
              className="btn btn-primary"
              style={{
                background: '#c5a059',
                borderColor: '#c5a059',
                color: '#0a2342',
                boxShadow: '0 10px 20px rgba(197, 160, 89, 0.35)',
                transform: 'scale(1.05)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 15px 30px rgba(197, 160, 89, 0.5)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 10px 20px rgba(197, 160, 89, 0.35)'}
            >
              Register Now
            </Link>
            <a href="#about" className="btn btn-secondary" style={{ borderRadius: '50px' }}>Learn More</a>
          </div>

          {/* Bounce Down Arrow */}
          <div style={{
            position: 'absolute',
            bottom: '2.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            animation: 'bounce 2s infinite',
            cursor: 'pointer',
            opacity: 0.7
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="section bg-light" style={{ position: 'relative', zIndex: 2, overflow: 'hidden', padding: '120px 0' }}>
        <div className="container">
          <RevealOnScroll direction="up">
            <div className="section-title">
              <h2>About CSMUN</h2>
            </div>
            <div style={{ 
              textAlign: 'center', 
              maxWidth: '820px', 
              margin: '0 auto 4rem', 
              background: 'rgba(255, 255, 255, 0.6)', 
              padding: '3rem', 
              borderRadius: '32px', 
              border: '1px solid rgba(10, 35, 66, 0.05)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.02)'
            }}>
              <p style={{ fontSize: '1.1rem', color: '#334155', lineHeight: '1.8' }}>
                CSMUN is more than just a simulation; it's a premium arena for the next generation of global leaders to refine their negotiation, public speaking, and critical analytical capacities. This year, we delve into pressing geopolitical matters with outstanding academic vigor and a strict commitment to diplomatic excellence.
              </p>
            </div>
          </RevealOnScroll>

          {/* Stats Tickers Section */}
          <RevealOnScroll direction="up" delay={0.1}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              marginTop: '4rem',
              background: '#ffffff',
              borderRadius: '24px',
              padding: '2rem',
              border: '1px solid rgba(10, 35, 66, 0.05)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
            }}>
              <StatTicker value="4" label="Elite Committees" />
              <StatTicker value="150" label="Active Delegates" suffix="+" />
              <StatTicker value="48" label="Hours of Debate" suffix="h" />
              <StatTicker value="10" label="Trained Mentors" />
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Committees Section */}
      <section id="committees" className="section" style={{ position: 'relative', zIndex: 2, padding: '120px 0' }}>
        <div className="container">
          <RevealOnScroll direction="up">
            <div className="section-title" style={{ marginBottom: '4rem' }}>
              <h2>Our Committees</h2>
            </div>
          </RevealOnScroll>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            <RevealOnScroll direction="left" delay={0.0}>
              <InteractiveCommitteeCard 
                title="UNSC" 
                desc="United Nations Security Council: Addressing international peace, structural stability, and security in an ever-shifting geopolitical landscape." 
                icon={<ShieldIcon />} 
              />
            </RevealOnScroll>
            <RevealOnScroll direction="left" delay={0.1}>
              <InteractiveCommitteeCard 
                title="UNHRC" 
                desc="Human Rights Council: Championing the fundamental civil, political, and universal rights of every individual across the globe." 
                icon={<ScaleIcon />} 
              />
            </RevealOnScroll>
            <RevealOnScroll direction="right" delay={0.2}>
              <InteractiveCommitteeCard 
                title="UNGA" 
                desc="General Assembly: The primary deliberative, policymaking, and multi-national representative organ of the United Nations." 
                icon={<GlobeIcon />} 
              />
            </RevealOnScroll>
            <RevealOnScroll direction="right" delay={0.3}>
              <InteractiveCommitteeCard 
                title="DISEC" 
                desc="Disarmament and International Security: Tackling direct threats to global stability, proliferation of armaments, and securing peace." 
                icon={<AnchorIcon />} 
              />
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Secretariat Section */}
      <section id="secretariat" className="section bg-light" style={{ position: 'relative', zIndex: 2, padding: '120px 0' }}>
        <div className="container">
          <RevealOnScroll direction="up">
            <div className="section-title" style={{ marginBottom: '1.5rem' }}>
              <h2>The Secretariat</h2>
            </div>
            <p style={{
              textAlign: 'center',
              color: '#64748b',
              maxWidth: '600px',
              margin: '0 auto 4.5rem',
              fontSize: '1rem',
              lineHeight: '1.6'
            }}>
              CSMUN II features a premium organizing team split into core portfolios, designed to bring you the highest-quality simulation conference.
            </p>
          </RevealOnScroll>

          <RevealOnScroll direction="up" delay={0.15}>
            <SecretariatInteractive />
          </RevealOnScroll>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 2, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container">
          <div className="footer-content">
            <div>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.5rem', color: '#c5a059', fontWeight: '800', marginBottom: '1rem' }}>CSMUN 2026</h3>
              <p style={{ opacity: 0.8, fontSize: '0.9rem', lineHeight: '1.6' }}>Empowering the premium diplomats and leaders of tomorrow.</p>
            </div>
            <div>
              <h4 style={{ fontFamily: "'Outfit', sans-serif", color: '#ffffff', marginBottom: '1rem' }}>Quick Links</h4>
              <ul style={{ listStyle: 'none', opacity: 0.8, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                <li><a href="#about" style={{ color: 'white', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#c5a059'} onMouseLeave={(e) => e.target.style.color = 'white'}>About</a></li>
                <li><a href="#committees" style={{ color: 'white', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#c5a059'} onMouseLeave={(e) => e.target.style.color = 'white'}>Committees</a></li>
                <li><Link to="/login" style={{ color: 'white', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#c5a059'} onMouseLeave={(e) => e.target.style.color = 'white'}>Registration</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontFamily: "'Outfit', sans-serif", color: '#ffffff', marginBottom: '1rem' }}>Contact Us</h4>
              <p style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Chaitanya School, Gandhinagar</p>
              <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>Email: <a href="mailto:mun@chaitanyaschool.edu" style={{ color: '#c5a059', textDecoration: 'none' }}>mun@chaitanyaschool.edu</a></p>
            </div>
          </div>
          <div className="footer-bottom" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <p>&copy; 2026 Chaitanya School MUN. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
