import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
    <div className="app-wrapper">
      {/* Navbar */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <a href="#" className="nav-logo">CSMUN 2026</a>
          <ul className="nav-links">
            <li><a href="#about">About</a></li>
            <li><a href="#committees">Committees</a></li>
            <li><a href="#secretariat">Secretariat</a></li>
            <li><Link to="/login" className="btn btn-primary" style={{padding: '0.5rem 1rem', marginLeft: '1rem'}}>Login</Link></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="container hero-content animate-fade-in">
          <h1>Diplomacy in Action.</h1>
          <p>Join the sixth edition of the Chaitanya School Model United Nations. Empowering global thinkers to lead through dialogue and consensus.</p>
          <div className="cta-group">
            <Link to="/login" className="btn btn-primary">Register Now</Link>
            <a href="#about" className="btn btn-secondary">Learn More</a>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="section bg-light">
        <div className="container">
          <div className="section-title">
            <h2>About CSMUN</h2>
          </div>
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <p>CSMUN is more than just a simulation; it's a platform for the next generation of leaders to refine their negotiation, public speaking, and critical thinking skills. This year, we delve into pressing global issues with renewed vigor and commitment to diplomatic excellence.</p>
          </div>
        </div>
      </section>

      {/* Committees Section */}
      <section id="committees" className="section">
        <div className="container">
          <div className="section-title">
            <h2>Our Committees</h2>
          </div>
          <div className="committee-grid">
            <div className="committee-card">
              <h3>UNSC</h3>
              <p>United Nations Security Council: Addressing international peace and security in an ever-changing geopolitical landscape.</p>
            </div>
            <div className="committee-card">
              <h3>UNHRC</h3>
              <p>Human Rights Council: Championing the fundamental rights of every individual across the globe.</p>
            </div>
            <div className="committee-card">
              <h3>UNGA</h3>
              <p>General Assembly: The main deliberative, policymaking, and representative organ of the UN.</p>
            </div>
            <div className="committee-card">
              <h3>DISEC</h3>
              <p>Disarmament and International Security: Tackling threats to global stability and the proliferation of weapons.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-content">
            <div>
              <h3>CSMUN 2026</h3>
              <p>Empowering the diplomats of tomorrow.</p>
            </div>
            <div>
              <h4>Quick Links</h4>
              <ul style={{ listStyle: 'none', opacity: 0.8 }}>
                <li><a href="#about" style={{ color: 'white', textDecoration: 'none' }}>About</a></li>
                <li><a href="#committees" style={{ color: 'white', textDecoration: 'none' }}>Committees</a></li>
                <li><Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Registration</Link></li>
              </ul>
            </div>
            <div>
              <h4>Contact Us</h4>
              <p>Chaitanya School, Gandhinagar</p>
              <p>Email: mun@chaitanyaschool.edu</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Chaitanya School MUN. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
