import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

// SVG Icons
const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const BookOpenIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const HomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

// Elegant gradient color pairs for initial avatars
const AVATAR_GRADIENTS = [
  ['#c5a059', '#e8c87e'],  // gold
  ['#3b82f6', '#60a5fa'],  // blue
  ['#8b5cf6', '#a78bfa'],  // violet
  ['#10b981', '#34d399'],  // emerald
  ['#f43f5e', '#fb7185'],  // rose
  ['#f97316', '#fb923c'],  // orange
  ['#06b6d4', '#22d3ee'],  // cyan
  ['#ec4899', '#f472b6'],  // pink
];

function InitialAvatar({ name, index, size = 90 }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const [c1, c2] = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];

  return (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '3px solid rgba(255,255,255,0.15)',
      boxShadow: `0 4px 20px ${c1}33`,
      flexShrink: 0,
      fontSize: `${size * 0.36}px`,
      fontWeight: '800',
      fontFamily: "'Outfit', sans-serif",
      color: '#0a0c16',
      letterSpacing: '1px',
      userSelect: 'none',
    }}>
      {initials}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Committee data — REAL chair names from the CSMUN 2026 committee table
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const COMMITTEE_DATA_MAP = {
  SC: {
    fullName: "United Nations Security Council (SC)",
    grade: "NA",
    topics: [
      "Managing Cross-border Supply Chains and Provincial Industrial Policy Under U.S. Trade Tensions"
    ],
    chairs: [
      { name: "Sachev Satheesh Kumar", role: "Head Chair", note: "Welcome to the Security Council. This is the highest-stakes committee at CSMUN — expect rapid crisis updates, binding resolutions, and intense negotiation. Come prepared to lead under pressure." },
      { name: "Vishanth Thiagarajan M", role: "Head Chair", note: "Dear delegates, the SC demands precision, speed, and strategic alliances. Research your country's veto patterns and foreign policy positions thoroughly. I look forward to a riveting session." },
    ],
  },
  "WTO I": {
    fullName: "World Trade Organization I (WTO I)",
    grade: "Grades 11 & 12",
    topics: [
      "Addressing the Compatibility of Carbon Border Adjustment Mechanisms with WTO Non-Discrimination Rules",
      "Discussing the Monopoly of Major Powers in Global Semiconductor and Technology Trade"
    ],
    chairs: [
      { name: "Nethra N", role: "Head Chair", note: "Welcome to WTO I. Trade policy is evolving rapidly under climate and tech pressures. I expect sharp analysis and creative treaty proposals that balance environmental goals with free trade principles." },
      { name: "Dheera JM", role: "Head Chair", note: "Hello delegates! This committee tackles some of the most important economic questions of our time. Come ready with data, case studies, and actionable proposals." },
      { name: "Supriya K", role: "Deputy Chair", note: "Looking forward to hearing your arguments on carbon taxation and semiconductor supply chains. Strong lobbying and precise drafting will be key to success." },
    ],
  },
  "WTO II": {
    fullName: "World Trade Organization II (WTO II)",
    grade: "Grades 11 & 12",
    topics: [
      "Deliberating the Future of Digital Trade Governance in AI Economies and WTO E-Commerce Frameworks",
      "Ensuring Equitable Access to Global Markets Amid Geopolitical Disruptions to Trade Routes"
    ],
    chairs: [
      { name: "Pranav R", role: "Head Chair", note: "Welcome to WTO II. Digital trade is reshaping the global economy faster than regulations can keep up. I want to see bold proposals that balance innovation with equitable access." },
      { name: "Shrineha SS", role: "Head Chair", note: "Dear delegates, our agenda covers urgent geopolitical challenges in trade. Prepare your positions on digital governance and trade route disruptions carefully." },
      { name: "Sanvi TJ", role: "Deputy Chair", note: "Greetings! I'll be assessing the depth of your policy research and the feasibility of your resolutions under existing international frameworks. Let's make this count!" },
    ],
  },
  "UNEA I": {
    fullName: "United Nations Environment Assembly I (UNEA I)",
    grade: "Grades 9 & 10",
    topics: [
      "Strengthening International Cooperation for Affordable and Sustainable Clean Energy Access",
      "Examining the Ecological Risks of Deep-Sea Mining for Resources Essential to Renewable Energy Production"
    ],
    chairs: [
      { name: "Jitesh Abinav SS", role: "Head Chair", note: "Welcome to UNEA I! Clean energy access and deep-sea mining present two sides of the sustainability coin. I'm looking for solutions that don't sacrifice our oceans for a green future." },
      { name: "Tanvi Arunkumar", role: "Head Chair", note: "Hello delegates! The environmental challenges we tackle here are real and pressing. Research your country's energy policies and ecological commitments deeply." },
      { name: "Dakshita", role: "Deputy Chair", note: "I look forward to productive debate. Focus on practical international cooperation mechanisms and bring evidence-based proposals to the table." },
    ],
  },
  "UNEA II": {
    fullName: "United Nations Environment Assembly II (UNEA II)",
    grade: "Grades 9 & 10",
    topics: [
      "Evaluating Sustainable Pathways for Critical Mineral Extraction Amid the Global Green Energy Transition",
      "Managing the Lifecycle and Toxic Waste Volatility of Decommissioned Clean Energy Technologies"
    ],
    chairs: [
      { name: "Shivanikha G", role: "Head Chair", note: "Welcome to UNEA II. The green transition can't succeed without addressing the environmental costs of mineral extraction and e-waste. I expect nuanced, well-researched solutions." },
      { name: "Eniyaa SR", role: "Head Chair", note: "Dear delegates, sustainable development requires uncomfortable tradeoffs. Come prepared to challenge assumptions and build consensus across regional blocs." },
      { name: "Sharvak D", role: "Deputy Chair", note: "Looking forward to supporting you through this complex agenda. Strong evidence and collaborative spirit will be rewarded. Good luck with your prep!" },
    ],
  },
  "SOCHUM I": {
    fullName: "Social, Humanitarian & Cultural Committee I (SOCHUM I)",
    grade: "Grade 8",
    topics: [
      "Strengthening Rehabilitation and Reintegration Programs for Survivors of Human Trafficking",
      "Addressing Labour Rights and Refugee Integration Challenges in Migrant Labour and Global Resettlement Systems"
    ],
    chairs: [
      { name: "Ankitha Mohan", role: "Head Chair", note: "Welcome to SOCHUM I. Human trafficking and labour rights are deeply interconnected. I expect compassionate yet practical policy proposals that centre the voices of survivors." },
      { name: "Sahas Harishankar", role: "Deputy Chair", note: "Hello delegates! This committee deals with some of the most sensitive humanitarian issues. Bring your empathy and your research — both matter equally here." },
      { name: "S. Shrelaya", role: "Additional Chair", note: "Looking forward to seeing how you navigate the complexities of refugee integration and migrant rights. Don't be afraid to propose bold ideas!" },
    ],
  },
  "SOCHUM II": {
    fullName: "Social, Humanitarian & Cultural Committee II (SOCHUM II)",
    grade: "Grade 8",
    topics: [
      "Combating the Exploitation of Youth Through Online Radicalization",
      "Combating the Social Exploitation and Forced Displacement of Civilians in Regions of Conflict"
    ],
    chairs: [
      { name: "Shrri Pranav SR", role: "Head Chair", note: "Welcome to SOCHUM II. Online radicalization and forced displacement are defining humanitarian crises. I want to see creative, enforceable solutions that protect the most vulnerable." },
      { name: "Shivrohith S", role: "Head Chair", note: "Dear delegates, our topics this year demand both moral clarity and practical strategy. Research your country's policies and international obligations thoroughly." },
      { name: "Inial Kalidass", role: "Deputy Chair", note: "I'm excited to see how you tackle these challenging issues. Strong speaking, detailed amendments, and collaborative caucusing will make all the difference." },
    ],
  },
  HRC: {
    fullName: "United Nations Human Rights Council (HRC)",
    grade: "Grades 7 & 8",
    topics: [
      "Addressing the Human Rights and Humanitarian Impact of Nuclear Testing and Radiation Exposure",
      "Safeguarding Mental Health and Human Rights in an Era of Digital Volatility"
    ],
    chairs: [
      { name: "Ajjan Sharvesh AN", role: "Head Chair", note: "Welcome to the HRC. From nuclear testing to digital mental health, our agenda touches on rights that define our generation's challenges. Research deeply and speak boldly." },
      { name: "Senkathirvelan S", role: "Deputy Chair", note: "Hello delegates! I look forward to hearing your policy positions on these critical human rights issues. Back your arguments with conventions and case law." },
      { name: "Agnes Jillian", role: "Additional Chair", note: "This is your opportunity to advocate for real change. Come prepared with strong evidence and a commitment to constructive debate. Let's make CSMUN count!" },
    ],
  },
  DISEC: {
    fullName: "Disarmament and International Security Committee (DISEC)",
    grade: "Grade 7",
    topics: [
      "Addressing the Threats Posed by Autonomous Weapons, Artificial Intelligence, and Cyber Warfare to Global Security",
      "Addressing the Weaponisation of Space and Global Security"
    ],
    chairs: [
      { name: "Ilamathi", role: "Head Chair", note: "Welcome to DISEC! The arms race has moved into cyberspace and outer space. I expect delegates to bring innovative disarmament proposals backed by thorough research." },
      { name: "Anvitha Vignesh", role: "Head Chair", note: "Dear delegates, autonomous weapons and space weaponization pose existential challenges. Study your country's military and tech policies to contribute meaningfully." },
      { name: "Nivriti Thiagarajan", role: "Deputy Chair", note: "Looking forward to a dynamic committee! Focus on verification mechanisms, treaty enforcement, and the ethical dimensions of AI in warfare." },
    ],
  },
  UNEP: {
    fullName: "United Nations Environment Programme (UNEP)",
    grade: "Grade 7",
    topics: [
      "Addressing Environmental Degradation Caused by Excessive Consumption and Improper Waste Disposal",
      "Analyzing the Impact of Industrial Expansion on Ecological Stability"
    ],
    chairs: [
      { name: "Chendhoorselvan KY", role: "Head Chair", note: "Welcome to UNEP! Our planet's ecological stability is under unprecedented pressure. I expect solutions that are both scientifically grounded and diplomatically feasible." },
      { name: "Pragyea Subramanian", role: "Head Chair", note: "Hello delegates! Environmental degradation is everyone's problem. Come ready with data on waste management, industrial pollution, and conservation strategies." },
      { name: "Akanya", role: "Deputy Chair", note: "I'm looking forward to sharp debates and creative resolutions. Remember — the best delegates balance idealism with practicality. Good luck!" },
    ],
  },
};

// Fallback default committee info
const DEFAULT_COMMITTEE = {
  fullName: "CSMUN Committee",
  grade: "",
  topics: ["Global Collaboration and Diplomatic Problem Solving"],
  chairs: [
    { name: "Committee Head Chair", role: "Head Chair", note: "Welcome delegates! Research your assigned topics and country policies thoroughly to ensure high-fidelity debate." },
    { name: "Committee Deputy Chair", role: "Deputy Chair", note: "Hello! We are looking forward to collaborative resolution writing and amazing debates in our session." }
  ]
};

export default function CommitteePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { committeeId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      if (currentUser) {
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      }
      setLoading(false);
    }
    fetchUserData();
  }, [currentUser]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#0a0c16',
        color: '#ffffff',
        fontFamily: "'Inter', sans-serif"
      }}>
        <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>Loading Committee Details...</div>
      </div>
    );
  }

  // Resolve committee: URL param takes priority, then user's assigned committee
  const resolvedCommittee = committeeId
    ? decodeURIComponent(committeeId)
    : (userData?.committee || '');

  // Try exact match first, then uppercase match
  const info = COMMITTEE_DATA_MAP[resolvedCommittee]
    || COMMITTEE_DATA_MAP[resolvedCommittee.toUpperCase()]
    || Object.entries(COMMITTEE_DATA_MAP).find(
        ([key]) => key.toLowerCase() === resolvedCommittee.toLowerCase()
      )?.[1]
    || DEFAULT_COMMITTEE;

  // Determine back navigation
  const isFromDashboard = currentUser && userData;
  const handleBack = () => {
    if (isFromDashboard) {
      navigate('/app/delegate');
    } else {
      window.location.href = '/#committees';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0c16 0%, #12172a 50%, #0a0c16 100%)',
      color: '#ffffff',
      fontFamily: "'Inter', sans-serif",
      padding: '2rem 1.5rem',
      boxSizing: 'border-box',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Decorative Spheres */}
      <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'rgba(197, 160, 89, 0.05)', filter: 'blur(120px)', borderRadius: '50%', top: '10%', left: '5%', pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'rgba(59, 130, 246, 0.05)', filter: 'blur(140px)', borderRadius: '50%', bottom: '15%', right: '5%', pointerEvents: 'none' }}></div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        {/* Navigation & Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <button
            onClick={handleBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '30px',
              padding: '0.6rem 1.2rem',
              color: '#ffffff',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.85rem',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateX(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            {isFromDashboard ? <BackIcon /> : <HomeIcon />}
            {isFromDashboard ? 'Dashboard' : 'Home'}
          </button>
          
          <span style={{
            fontSize: '0.8rem',
            fontWeight: '800',
            color: '#c5a059',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            background: 'rgba(197, 160, 89, 0.1)',
            padding: '6px 16px',
            borderRadius: '20px'
          }}>
            CSMUN 2026
          </span>
        </div>

        {/* Committee Title Section */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(26, 32, 58, 0.6) 0%, rgba(10, 15, 30, 0.8) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          padding: '2.5rem',
          marginBottom: '2.5rem',
          textAlign: 'center',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
        }}>
          <h1 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            fontWeight: '900',
            margin: '0 0 1rem 0',
            background: 'linear-gradient(90deg, #ffffff 0%, #cbd5e1 50%, #c5a059 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {info.fullName}
          </h1>
          {info.grade && (
            <div style={{
              display: 'inline-block',
              background: 'rgba(197, 160, 89, 0.12)',
              border: '1px solid rgba(197, 160, 89, 0.2)',
              borderRadius: '20px',
              padding: '4px 16px',
              fontSize: '0.8rem',
              fontWeight: '700',
              color: '#c5a059',
              marginBottom: '1rem',
            }}>
              {info.grade}
            </div>
          )}
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {info.topics.map((topic, i) => (
              <p key={i} style={{
                fontSize: '1rem',
                color: '#94a3b8',
                margin: '0.5rem 0',
                lineHeight: '1.6',
                fontWeight: '500'
              }}>
                <strong style={{ color: '#ffffff' }}>Topic {info.topics.length > 1 ? i + 1 : ''}:</strong> {topic}
              </p>
            ))}
          </div>
        </div>

        {/* Chairs Grid */}
        <h2 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '1.6rem',
          fontWeight: '800',
          marginBottom: '1.5rem',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem'
        }}>
          Meet Your Committee Chairs
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {info.chairs.map((chair, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '24px',
                padding: '2rem',
                display: 'flex',
                gap: '1.5rem',
                alignItems: 'flex-start',
                backdropFilter: 'blur(16px)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = 'rgba(197, 160, 89, 0.3)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(197, 160, 89, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
              }}
            >
              {/* Chair Avatar */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <InitialAvatar name={chair.name} index={index} />
                <div style={{
                  position: 'absolute',
                  bottom: '-5px',
                  right: '-5px',
                  background: chair.role === 'Head Chair' ? '#c5a059' : chair.role === 'Deputy Chair' ? '#3b82f6' : '#8b5cf6',
                  color: '#0a0c16',
                  fontSize: '0.55rem',
                  fontWeight: '800',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap'
                }}>
                  {chair.role === 'Head Chair' ? 'HEAD' : chair.role === 'Deputy Chair' ? 'DEPUTY' : 'CHAIR'}
                </div>
              </div>

              {/* Note from Chair */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: 0 }}>
                <h3 style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '1.2rem',
                  fontWeight: '800',
                  color: '#ffffff',
                  margin: 0
                }}>
                  {chair.name}
                </h3>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  color: chair.role === 'Head Chair' ? '#c5a059' : chair.role === 'Deputy Chair' ? '#60a5fa' : '#a78bfa',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  {chair.role}
                </span>
                
                {/* Note Bubble */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '1rem',
                  marginTop: '0.5rem',
                  position: 'relative'
                }}>
                  <p style={{
                    color: '#cbd5e1',
                    fontSize: '0.85rem',
                    lineHeight: '1.5',
                    margin: 0,
                    fontStyle: 'italic'
                  }}>
                    "{chair.note}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Background Guides Download Section */}
        <h2 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '1.6rem',
          fontWeight: '800',
          marginBottom: '1.5rem',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem'
        }}>
          <BookOpenIcon style={{ color: '#c5a059' }} /> Committee Study Guides & Resources
        </h2>

        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.3) 0%, rgba(15, 23, 42, 0.5) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '24px',
          padding: '2.5rem',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem'
        }}>
          <div>
            <h3 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1.3rem',
              fontWeight: '800',
              color: '#ffffff',
              margin: '0 0 0.5rem 0'
            }}>
              Download Background Guide (BG)
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0, lineHeight: '1.5' }}>
              The background guide outlines the topic framework, historical context, bloc dynamics, and research questions. Read it carefully to draft your position paper.
            </p>
          </div>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.25rem',
            alignItems: 'center'
          }}>
            {/* Primary Download Button */}
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); alert('Background guides will be available for download soon!'); }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                background: 'linear-gradient(90deg, #8b1e1e 0%, #a72828 100%)',
                color: '#ffffff',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '0.9rem',
                padding: '0.85rem 1.8rem',
                borderRadius: '30px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(139, 30, 30, 0.25)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 30, 30, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(139, 30, 30, 0.25)';
              }}
            >
              <DownloadIcon /> Download Background Guide (PDF)
            </a>
          </div>

          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: '#c5a059',
            fontSize: '0.85rem',
            fontWeight: '600'
          }}>
            <span>💡 Need assistance with your research? Reach out to your assigned mentor in the dashboard.</span>
          </div>

        </div>

      </div>
    </div>
  );
}
