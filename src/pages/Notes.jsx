import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../../index.css';

// ===== PREMIUM SVG ICON COMPONENTS =====

const ArrowLeftIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const SearchIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const BookIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
  </svg>
);

const GlobeIcon = ({ size = 28, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

const ClipboardIcon = ({ size = 28, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
  </svg>
);

const FlaskIcon = ({ size = 28, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M6 3h12"></path>
    <path d="M12 3v7"></path>
    <path d="M9 10.17L3 20a2 2 0 0 0 1.7 3h14.6a2 2 0 0 0 1.7-3L15 10.17V3H9v7.17z"></path>
  </svg>
);

const SpeakerIcon = ({ size = 28, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
  </svg>
);

const FileTextIcon = ({ size = 28, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const GavelIcon = ({ size = 28, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M14.5 17.5L3 6"></path>
    <path d="M16 16l-3.5-3.5"></path>
    <path d="M8 8L4.5 4.5"></path>
    <path d="M12.5 12.5L20 5l-3-3-7.5 7.5"></path>
    <path d="M19 14.5L22 17l-3 3-3-2.5"></path>
    <path d="M16 20l-1.5-1.5"></path>
    <path d="M20 16l-1.5-1.5"></path>
  </svg>
);

const MicIcon = ({ size = 28, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="22"></line>
  </svg>
);

const UsersIcon = ({ size = 28, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const FileEditIcon = ({ size = 28, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const LayersIcon = ({ size = 28, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
    <polyline points="2 17 12 22 22 17"></polyline>
    <polyline points="2 12 12 17 22 12"></polyline>
  </svg>
);

const ShuffleIcon = ({ size = 28, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <polyline points="16 3 21 3 21 8"></polyline>
    <line x1="4" y1="20" x2="21" y2="3"></line>
    <polyline points="21 16 21 21 16 21"></polyline>
    <line x1="15" y1="15" x2="21" y2="21"></line>
    <line x1="4" y1="4" x2="9" y2="9"></line>
  </svg>
);

export default function Notes() {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const topics = [
    {
      title: "Introduction to MUN & Administrative Structure",
      icon: <GlobeIcon size={28} color="#8b1e1e" />,
      description: "Learn the core basics of Model United Nations and the official CSMUN administrative hierarchy.",
      sections: [
        {
          title: "United Nations (UN) Overview",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
                The <strong>United Nations</strong> is a global organization where countries worldwide come together to discuss, debate, and solve global issues.
              </p>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderLeft: '4px solid #8b1e1e', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <li><strong>Location:</strong> Manhattan, New York, NY</li>
                  <li><strong>Leader:</strong> Secretary-General (currently <em>Antonio Guterres</em> from Portugal) who heads the administration and serves as the face of the UN.</li>
                  <li><strong>Office:</strong> He operates directly from within the <strong>Secretariat</strong>.</li>
                </ul>
              </div>
            </div>
          )
        },
        {
          title: "What is Model United Nations (MUN)?",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
                Model United Nations is an academic <strong>simulation of the real United Nations</strong>. 
              </p>
              <p style={{ lineHeight: '1.6', color: '#94a3b8' }}>
                In a MUN conference, you act as a <strong>Delegate</strong> representing a country's official policies within a specific committee room, tackling global crises alongside other nation representatives.
              </p>
            </div>
          )
        },
        {
          title: "Understanding MUN Committees",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
                A <strong>Committee</strong> is a specialized group formed to complete specific tasks or address focused global challenges. 
              </p>
              <div style={{ background: 'rgba(139, 30, 30, 0.08)', border: '1px solid rgba(139, 30, 30, 0.2)', padding: '1rem', borderRadius: '12px', marginBottom: '1rem' }}>
                <strong>Example:</strong> The <em>United Nations Environment Programme (UNEP)</em> specifically debates environmental sustainability and climate adaptation.
              </div>
            </div>
          )
        },
        {
          title: "Debating, Collaborating & The Resolution",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
                Delegates must follow a strict set of parliamentary rules and procedures inspired by the real UN to ensure formal, respectful, and highly productive debates.
              </p>
              <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
                Ultimately, delegates collaborate to write one specialized final document called a <strong>Resolution</strong>. 
              </p>
              <div style={{ background: 'rgba(22, 163, 74, 0.08)', border: '1px solid rgba(22, 163, 74, 0.2)', color: '#4ade80', padding: '0.85rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600' }}>
                Resolution: The final compilation of all inclusive, practical solutions written in a highly formatted manner.
              </div>
            </div>
          )
        },
        {
          title: "CSMUN Administration & Secretariat Structure",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1.5rem' }}>
                CSMUN has proudly transitioned from an online platform (CSMUN I) into a premium offline conference (CSMUN II). The student body organizing the conference is called the <strong>Secretariat</strong>, divided into two major divisions:
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                {/* Logistics */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.25rem', borderRadius: '16px' }}>
                  <h4 style={{ color: '#8b1e1e', margin: '0 0 0.75rem 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Logistics Portfolio
                  </h4>
                  <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', color: '#cbd5e1' }}>
                    <li><strong>Secretary-General:</strong> Represents the entire conference, managing registration, committee rooms, food, IT, and practical materials.</li>
                    <li><strong>Deputy Secretary-General:</strong> Manages IT, technical infrastructure, and coordination.</li>
                    <li><strong>Head of Logistics:</strong> Directs practical necessities, including mics, room setups, printouts, and stationery.</li>
                  </ul>
                </div>

                {/* Academics */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.25rem', borderRadius: '16px' }}>
                  <h4 style={{ color: '#8b1e1e', margin: '0 0 0.75rem 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Academics Portfolio
                  </h4>
                  <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', color: '#cbd5e1' }}>
                    <li><strong>Director General:</strong> Manages academic parameters, recruits committee chairs, proofreads background guides, manages press, and oversees mentors.</li>
                    <li><strong>Deputy Director General:</strong> Directly manages mentor operations and ensures effective delegate training.</li>
                  </ul>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
                <strong>Under-Secretary Generals (USGs):</strong> Focus on specific domains, bridging logistics (USGs of Press, Logistics) and academics (USGs of IT, Mentorship, Training, Impact).
              </div>
            </div>
          )
        },
        {
          title: "Chairs & Mentors Roles",
          content: (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                <div>
                  <h4 style={{ color: '#ffffff', margin: '0 0 0.5rem 0' }}>The Committee Chairs</h4>
                  <p style={{ lineHeight: '1.6', color: '#94a3b8' }}>
                    Each committee room is guided by a <strong>Head Chair</strong> and two <strong>Deputy Chairs</strong>. They ensure parliamentary decorum, manage speeches, and author the crucial <strong>Background Guide (BG)</strong>—the master starting point for your research.
                  </p>
                </div>
                <div>
                  <h4 style={{ color: '#ffffff', margin: '0 0 0.5rem 0' }}>CSMUN Mentors</h4>
                  <p style={{ lineHeight: '1.6', color: '#94a3b8' }}>
                    A special leadership feature unique to CSMUN! Mentors guide delegates starting from the day of registration. They host periodic online training sessions after school, clarify doubts, and review submissions to guarantee you are highly prepared.
                  </p>
                </div>
              </div>
            </div>
          )
        }
      ]
    },
    {
      title: "Research Fundamentals",
      icon: <ClipboardIcon size={28} color="#8b1e1e" />,
      description: "Understand the core processes of gathering data and structuring your research binder.",
      sections: [
        {
          title: "Why Do We Research?",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
                Research is a thorough process of investigation done to gather factual knowledge, expand understanding, solve crises, and generate original solutions.
              </p>
              <div style={{ background: 'rgba(139,30,30,0.08)', padding: '1.25rem', borderRadius: '16px', borderLeft: '4px solid #8b1e1e' }}>
                <h5 style={{ color: '#ffffff', margin: '0 0 0.5rem 0' }}>Why Research is Crucial in MUN:</h5>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', color: '#cbd5e1' }}>
                  <li>Understand all underlying details and nuances of your assigned agenda.</li>
                  <li>Gather vital empirical evidence and statistical data to support arguments.</li>
                  <li>Speak confidently and engage in strong debates without stuttering.</li>
                  <li>Avoid the fatal mistake of proposing solutions that contradict your country's actual policy.</li>
                </ul>
              </div>
            </div>
          )
        },
        {
          title: "How to Begin Your Prep",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1.25rem' }}>
                Always start by reading the official <strong>Background Guide (BG)</strong> written by your committee chairs. It provides the core overview, key questions, and a bibliography to guide your reading.
              </p>
              <h5 style={{ color: '#ffffff', margin: '0 0 0.75rem 0' }}>Five Pillars of Research:</h5>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                {['The Agenda/Topic', 'Your Country Stance', 'Past UN Efforts', 'Key Countries Involved', 'Possible Solutions'].map((pillar, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.75rem', borderRadius: '12px', textAlign: 'center', fontSize: '0.85rem', fontWeight: '700' }}>
                    {idx + 1}. {pillar}
                  </div>
                ))}
              </div>
            </div>
          )
        },
        {
          title: "Topic Research Essentials",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
                Deep-dive into the core problem to outline its historical timeline and current trajectory:
              </p>
              <ul style={{ paddingLeft: '1.25rem', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#94a3b8' }}>
                <li>Research the <strong>root causes</strong> rather than just superficial symptoms.</li>
                <li>Go through the <strong>Guiding Questions</strong> listed in your Background Guide.</li>
                <li>Gather reliable facts, figures, and international statistics.</li>
                <li>Break the central topic down into smaller, manageable sub-issues.</li>
              </ul>
            </div>
          )
        },
        {
          title: "Country Research & Policy Alignment",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
                You must represent your assigned nation accurately. Research your country's:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px' }}>
                  <strong>History & Policy:</strong> Focus heavily on recent affairs (no further back than 1 year). Study domestic political events and key national interests.
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px' }}>
                  <strong>Foreign Relations:</strong> Understand your alliances and adversaries, official stance, regional sanctions, or economic dependencies.
                </div>
              </div>
              <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '12px', color: '#f87171' }}>
                <strong>Critical Warning:</strong> Suggesting solutions that contradict your country's official guidelines! Make sure your solutions always match your country's foreign policy.
              </div>
            </div>
          )
        },
        {
          title: "The Research Binder",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
                A <strong>Research Binder</strong> is a single central document containing all links, empirical statistics, policy notes, and articles compiled during your preparation.
              </p>
              <p style={{ lineHeight: '1.6', color: '#94a3b8' }}>
                Keep your binder organized and bring it to committee for quick reference during debate.
              </p>
            </div>
          )
        }
      ]
    },
    {
      title: "Advanced Research II & Sourcing",
      icon: <FlaskIcon size={28} color="#8b1e1e" />,
      description: "Master the art of evaluating past efforts, finding reliable sources, and referencing data.",
      sections: [
        {
          title: "Past Efforts & Why They Fail",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
                Before proposing new ideas, study previous international efforts—past UN resolutions, regional treaties, NGO campaigns, and government programs.
              </p>
              <ul style={{ paddingLeft: '1.25rem', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#cbd5e1' }}>
                <li>Identify why prior initiatives succeeded or failed.</li>
                <li>Make sure your proposed policies are original and do not just repeat old efforts.</li>
                <li>Examine your country's historical actions regarding the topic.</li>
              </ul>
            </div>
          )
        },
        {
          title: "Key Actors & Finding Allies",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
                Observe the countries and organizations leading the debate:
              </p>
              <p style={{ lineHeight: '1.6', color: '#94a3b8' }}>
                Identify nations with similar political goals to form strong alliances (caucuses) during committee sessions. Look up major international NGOs and regional bodies to see their stances.
              </p>
            </div>
          )
        },
        {
          title: "Crafting Practical Solutions",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
                Solutions must be realistic, highly specific, and detail-oriented:
              </p>
              <ul style={{ paddingLeft: '1.25rem', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#cbd5e1' }}>
                <li>Do not copy the solutions listed in the Background Guide directly—use them only as inspiration.</li>
                <li>Align your ideas with the UN's <strong>Sustainable Development Goals (SDGs)</strong> and their targets.</li>
                <li>Carefully list the strengths and weaknesses of each solution, and research ways to minimize the weaknesses.</li>
              </ul>
            </div>
          )
        },
        {
          title: "Live Demonstration: Where to Search",
          content: (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1rem', borderRadius: '12px' }}>
                  <strong>Google Scholar & Academic Databases:</strong> Research verified databases like <em>ScienceDirect, PubMed, or ResearchGate</em>. Avoid trusting Wikipedia as a direct source (use its bibliography instead).
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1rem', borderRadius: '12px' }}>
                  <strong>Highly Reliable Outlets:</strong> BBC, The Guardian, Al Jazeera, the official UN document repository, and the NIH.
                </div>
              </div>

              <div style={{ background: 'rgba(139,30,30,0.08)', padding: '1.25rem', borderRadius: '16px' }}>
                <h5 style={{ color: '#ffffff', margin: '0 0 0.5rem 0' }}>Step-by-Step Search Routines:</h5>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', color: '#cbd5e1', fontSize: '0.9rem' }}>
                  <li><strong>Topic Research:</strong> Find papers → Filter relevant sections → Skim text → Summarize in Research Binder.</li>
                  <li><strong>Country Research:</strong> Consult the <em>CIA World Factbook</em> → Review official government portals → Search <code>"(topic) (country)"</code>.</li>
                  <li><strong>Solution Research:</strong> Search for previous UN Resolutions → Consult NGO case studies → Brainstorm based on root causes.</li>
                </ul>
              </div>
            </div>
          )
        }
      ]
    },
    {
      title: "Roll Call, Points, and Yields",
      icon: <SpeakerIcon size={28} color="#8b1e1e" />,
      description: "Master procedural etiquette, from marking attendance to formal points and floor yields.",
      sections: [
        {
          title: "The Roll Call (Attendance)",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
                <strong>Roll Call</strong> is the official attendance check conducted at the start of each committee session and after lunch.
              </p>
              <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
                The Chair will read out the country names alphabetically. Raise your placard and answer with one of the following:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', borderLeft: '3px solid #ef4444' }}>
                  <strong>Present:</strong> You are present in committee. You retain the right to <strong>abstain</strong> (choose not to vote) on the final resolution.
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', borderLeft: '3px solid #10b981' }}>
                  <strong>Present and Voting:</strong> You are fully active. You <strong>cannot abstain</strong> when voting on the final resolution; you must vote Yes or No.
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                <strong>Missed Roll Call?</strong> Send a formal paper note to the Dais (Chairs) stating your presence and explaining why you were late.
              </div>
            </div>
          )
        },
        {
          title: "The Three Pillars of Points",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
                Debate in MUN is highly structured. You cannot directly address other delegates (no crosstalk). All communications go through the Chair using points:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
                  <strong>Point of Personal Privilege:</strong> Used to report personal discomfort (e.g. room too hot/cold, can't hear the speaker). <em>This is the only point that can interrupt a speaker.</em>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
                  <strong>Point of Parliamentary Inquiry:</strong> Used to ask the Chair to clarify committee rules or procedural status. <em>Cannot interrupt a speaker.</em>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
                  <strong>Point of Order:</strong> Used to point out a procedural mistake made by the Chair or another delegate. <em>Cannot interrupt a speaker.</em>
                </div>
              </div>
            </div>
          )
        },
        {
          title: "The Floor & Yielding Procedures",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
                <strong>The Floor:</strong> Having the floor means you have official permission to speak while others listen.
              </p>
              <p style={{ lineHeight: '1.6', marginBottom: '1.25rem' }}>
                <strong>Yielding:</strong> When your speech ends before your time expires, you must formally transfer ("yield") the remaining floor time back to the Chair or elsewhere:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', borderLeft: '3px solid #8b1e1e' }}>
                  <strong>Yielding to POIs (Points of Information):</strong> You open yourself to questions from other delegates. Delegates ask questions from the podium, and you reply. No rhetorical or Yes/No questions. Only 1 follow-up is allowed.
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', borderLeft: '3px solid #8b1e1e' }}>
                  <strong>Yielding to Another Delegate:</strong> You transfer your remaining time to a selected ally. They must accept the yield. No further yields (e.g., to a third delegate) are allowed.
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', borderLeft: '3px solid #8b1e1e' }}>
                  <strong>Yielding to the Chair:</strong> The default yield. Any remaining time is absorbed by the Chair, and committee moves to the next speaker.
                </div>
              </div>
            </div>
          )
        }
      ]
    },
    {
      title: "Position Paper - One Pager",
      icon: <FileTextIcon size={28} color="#8b1e1e" />,
      description: "A comprehensive summary of your country stance, research, and proposed solutions.",
      sections: [
        {
          title: "Position Paper Overview",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1.25rem' }}>
                A <strong>Position Paper</strong> is a summary of your research which describes your country's position and is the first official document that you would submit to the committee chairs.
              </p>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderLeft: '4px solid #8b1e1e', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                📋 <strong>Structure:</strong> A typical Position Paper contains exactly 5 sections: <strong>Header</strong>, <strong>Introduction</strong>, <strong>Body</strong>, <strong>Conclusion</strong>, and a <strong>Bibliography</strong>.
              </div>
            </div>
          )
        },
        {
          title: "The Five Core Sections",
          content: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '16px' }}>
                <h5 style={{ color: '#ffffff', margin: '0 0 0.5rem 0', fontSize: '1.05rem' }}>1. Header</h5>
                <p style={{ margin: 0, color: '#94a3b8', lineHeight: '1.5' }}>
                  Contains the delegate's country, committee, and topic details. This helps the Chair quickly identify the author and core context of the paper.
                </p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '16px' }}>
                <h5 style={{ color: '#ffffff', margin: '0 0 0.5rem 0', fontSize: '1.05rem' }}>2. Introduction</h5>
                <p style={{ margin: 0, color: '#94a3b8', lineHeight: '1.5' }}>
                  Provides a general overview of the issue and summarizes your research. It demonstrates an understanding of the topic and the country (not just your specific stance). <em>Your first impression is crucial.</em>
                </p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '16px' }}>
                <h5 style={{ color: '#ffffff', margin: '0 0 0.5rem 0', fontSize: '1.05rem' }}>3. Body</h5>
                <p style={{ margin: 0, color: '#94a3b8', lineHeight: '1.5' }}>
                  Reveals the country's official stance on the issue, utilizing meaningful international statistics and real-world events. Explains the country's relationship with the issue, past domestic policies, and previous efforts.
                </p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '16px' }}>
                <h5 style={{ color: '#ffffff', margin: '0 0 0.5rem 0', fontSize: '1.05rem' }}>4. Conclusion (Most Important)</h5>
                <p style={{ margin: 0, color: '#94a3b8', lineHeight: '1.5' }}>
                  This is the most critical section of the paper. It proposes original and practical solutions aligned with the country's stance. It must include at least two highly impactful solutions and emphasize their novelty.
                </p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '16px' }}>
                <h5 style={{ color: '#ffffff', margin: '0 0 0.5rem 0', fontSize: '1.05rem' }}>5. Bibliography</h5>
                <p style={{ margin: 0, color: '#94a3b8', lineHeight: '1.5' }}>
                  Gives credit to all academic sources and websites used. Full URLs and links should be formatted cleanly following the citation guidelines.
                </p>
              </div>
            </div>
          )
        },
        {
          title: "Submission Do's and Don'ts",
          content: (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ background: 'rgba(34, 197, 94, 0.04)', border: '1px solid rgba(34, 197, 94, 0.2)', padding: '1.5rem', borderRadius: '20px' }}>
                <h5 style={{ color: '#4ade80', margin: '0 0 0.75rem 0', fontSize: '1.1rem' }}>✓ Do:</h5>
                <ul style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.4' }}>
                  <li>Provide practical solutions that align with your country's policy.</li>
                  <li>Include statistics and events to substantiate your content.</li>
                  <li>Use formal, precise, and diplomatic language.</li>
                  <li>Ensure the writing is cohesive, readable, and highly engaging.</li>
                  <li>Express original thoughts rather than copy-pasting search engine results.</li>
                  <li>Consider the global perspective, not solely focusing on domestic interests.</li>
                </ul>
              </div>
              <div style={{ background: 'rgba(239, 68, 68, 0.04)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1.5rem', borderRadius: '20px' }}>
                <h5 style={{ color: '#f87171', margin: '0 0 0.75rem 0', fontSize: '1.1rem' }}>✗ Don't:</h5>
                <ul style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.4' }}>
                  <li>Plagiarize content from other sources or rely heavily on search engine drafts.</li>
                  <li>Use aggressive or confrontational language when referring to other nations.</li>
                  <li>Neglect the global perspective or ignore committee parameters.</li>
                  <li>Disregard the specified word limits or structural guidelines.</li>
                  <li>Express highly biased statements that favor one side without balance.</li>
                </ul>
              </div>
            </div>
          )
        }
      ]
    },
    {
      title: "Motions & Parliamentary Procedure",
      icon: <GavelIcon size={28} color="#8b1e1e" />,
      description: "Learn how to propose motions, manage committee voting, and employ special procedures.",
      sections: [
        {
          title: "Introduction to Motions",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1.25rem' }}>
                A <strong>Motion</strong> is the standard mechanism by which delegates formally communicate with the Chairs about what they wish to do in the committee room.
              </p>
              <div style={{ background: 'rgba(139,30,30,0.06)', borderLeft: '4px solid #8b1e1e', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#cbd5e1', gap: '0.5rem' }}>
                Delegate ➔ Proposes Motion ➔ Flow Action in the Committee Room
              </div>
              <p style={{ lineHeight: '1.6', color: '#94a3b8', marginBottom: '1rem' }}>
                All of the following parliamentary procedures require a formal motion to be introduced and passed:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                {['Setting the Agenda', 'Moderated Caucus', 'Unmoderated Caucus', 'General Speakers List (GSL)', 'Adjourning for a Break', 'Opening Resolution Debate', 'Dismissing the Committee'].map((proc, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '0.75rem 1rem', borderRadius: '12px', textAlign: 'center', fontSize: '0.85rem', color: '#cbd5e1', fontWeight: '600' }}>
                    {proc}
                  </div>
                ))}
              </div>
            </div>
          )
        },
        {
          title: "The Three Kinds of Motions",
          content: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Requires voting */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '20px', borderLeft: '3px solid #8b1e1e' }}>
                <h5 style={{ color: '#ffffff', margin: '0 0 0.75rem 0', fontSize: '1.1rem' }}>1. Requires Voting (Most Common)</h5>
                <p style={{ color: '#94a3b8', lineHeight: '1.5', marginBottom: '1rem' }}>
                  Requires the house to vote. Passes when a simple majority (50%) of the delegates vote in favor.
                </p>
                <div style={{ background: 'rgba(0,0,0,0.15)', padding: '1.25rem', borderRadius: '12px', fontFamily: 'monospace', fontSize: '0.9rem', color: '#cbd5e1' }}>
                  <div style={{ color: '#a72828', fontWeight: 'bold' }}>[CHAIR]</div>
                  "Are there any motions on the floor?"<br/><br/>
                  <div style={{ color: '#3b82f6', fontWeight: 'bold' }}>[DELEGATE]</div>
                  "The delegate of [Country] would like to propose a motion to [parliamentary procedure] for [details of parliamentary procedure]"<br/><br/>
                  <div style={{ color: '#a72828', fontWeight: 'bold' }}>[CHAIR]</div>
                  "All those in favor... (Delegates raise placards)"<br/>
                  "All those against... (Delegates raise placards)"<br/><br/>
                  <div style={{ color: '#22c55e', fontWeight: 'bold' }}>[OUTCOME]</div>
                  "This motion passes (50% in favor)" or "This motion fails (50% against)"
                </div>
              </div>

              {/* Do not require voting */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '20px', borderLeft: '3px solid #8b1e1e' }}>
                <h5 style={{ color: '#ffffff', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>2. Do Not Require Voting</h5>
                <p style={{ margin: 0, color: '#94a3b8', lineHeight: '1.5' }}>
                  The Chair passes or rejects these motions immediately at their own discretion depending on the flow of committee and time constraints.
                </p>
              </div>

              {/* Special motions requiring seconds */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '20px', borderLeft: '3px solid #8b1e1e' }}>
                <h5 style={{ color: '#ffffff', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>3. Requires Seconds</h5>
                <p style={{ margin: 0, color: '#94a3b8', lineHeight: '1.5' }}>
                  Raised by delegates when necessary. If one delegate proposes a motion, typically other delegates who want the motion to be discussed will <strong>"Second"</strong> (support) it. If a delegate disagrees or does not want it discussed, they can raise an <strong>"Objection"</strong>.
                </p>
              </div>

            </div>
          )
        },
        {
          title: "Four Special Motions",
          content: (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '16px' }}>
                <h5 style={{ color: '#ffffff', margin: '0 0 0.5rem 0', fontSize: '1.05rem' }}>A. Motion to Extend POIs</h5>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.4' }}>
                  Extends the floor time for delegates to ask Points of Information to a speaker. Note: If you have already asked a POI, you cannot propose this motion.
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '16px' }}>
                <h5 style={{ color: '#ffffff', margin: '0 0 0.5rem 0', fontSize: '1.05rem' }}>B. Motion to Approach the Head Table</h5>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.4' }}>
                  Proposes that a delegate walk to the Dais to clarify technical doubts personally with the Chairs. Does not require a second.
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '16px' }}>
                <h5 style={{ color: '#ffffff', margin: '0 0 0.5rem 0', fontSize: '1.05rem' }}>C. Move to the Previous Question (Voting)</h5>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.4' }}>
                  Proposed when a delegate feels the debate is exhausted or pointless. Forces the house to stop caucuses and move immediately to voting on the draft resolution or amendments. Requires a second; a single objection is enough to overrule it.
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '16px' }}>
                <h5 style={{ color: '#ffffff', margin: '0 0 0.5rem 0', fontSize: '1.05rem' }}>D. Motion to Divide the House</h5>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.4' }}>
                  Can be proposed after a resolution fails by a very small margin. Re-votes the entire draft resolution. During a divided house vote, <strong>delegates cannot abstain</strong> (abstentions are converted to active votes) and the Chair queries each delegate in alphabetical order.
                </p>
              </div>

            </div>
          )
        }
      ]
    },
    {
      title: "Opening Speech",
      icon: <MicIcon size={28} color="#8b1e1e" />,
      description: "Learn how to hook the audience, structure your delegation stance, and deliver with maximum confidence.",
      sections: [
        {
          title: "What is an Opening Speech?",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
                An <strong>Opening Speech</strong> is the first speech delivered in a committee, setting the tone for your delegation's policy and presence.
              </p>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderLeft: '4px solid #8b1e1e', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
                ⏱️ <strong>Parameters:</strong> Typically ranges from <strong>45 to 90 seconds</strong>, with a recommended target word limit of <strong>150 words</strong>.
              </div>
              <p style={{ lineHeight: '1.6', color: '#94a3b8', marginBottom: '1rem' }}>
                <strong>Core Purpose:</strong>
              </p>
              <ul style={{ paddingLeft: '1.25rem', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#cbd5e1' }}>
                <li>Introduce your assigned country (your official delegation).</li>
                <li>Express your country's clear stance on the agenda topics.</li>
                <li>Outline proposed structural solutions and overall committee expectations.</li>
              </ul>
              <div style={{ background: 'rgba(139,30,30,0.08)', padding: '0.85rem', borderRadius: '8px', fontSize: '0.9rem', marginTop: '1rem' }}>
                💡 <strong>Strategy:</strong> Use your speech to formally invite other delegates with similar positions to collaborate on your resolution draft!
              </div>
            </div>
          )
        },
        {
          title: "Key Elements of an Opening Speech",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1.25rem' }}>
                To create a high-impact opening speech, ensure it includes these vital pillars:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px' }}>
                  <strong>1. Issue Identification:</strong> Highlight the specific problem and explain why its immediate resolution is critical to the international community.
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px' }}>
                  <strong>2. Country Stance & Policies:</strong> Detail your country's adopted policy guidelines and provide strong logical reasons that back your national stance.
                </div>
              </div>
              <div style={{ background: 'rgba(23, 163, 74, 0.08)', border: '1px solid rgba(23, 163, 74, 0.2)', padding: '1rem', borderRadius: '12px', color: '#4ade80' }}>
                <strong>Pro-Tip:</strong> Focus heavily on your country's **stance and concrete solutions**! Other delegates are already familiar with the general topic—it is your country's unique perspective that they want to hear.
              </div>
            </div>
          )
        },
        {
          title: "The Perfect Structure: Hooks & Solutions",
          content: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px' }}>
                <h5 style={{ color: '#ffffff', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Introduction (The Hook)</h5>
                <p style={{ color: '#cbd5e1', lineHeight: '1.6', margin: '0 0 1rem 0' }}>
                  Always start formally: <em>"Honorable Chairs, fellow delegates, and distinguished guests..."</em>. Immediately follow this with an attention-grabbing <strong>Hook</strong>:
                </p>
                <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                  <li><strong>A Quote:</strong> A powerful statement from a historic leader or diplomat.</li>
                  <li><strong>A Rhetorical Question:</strong> A question that drives immediate contemplation of the topic.</li>
                  <li><strong>Impressive Data:</strong> E.g., <em>"54% of global populations remain locked out of..."</em> to spark immediate urgency.</li>
                </ul>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px' }}>
                <h5 style={{ color: '#ffffff', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>The Body & The Solutions</h5>
                <p style={{ color: '#cbd5e1', lineHeight: '1.6', margin: 0 }}>
                  This is the core of your speech. Present your country's policies, followed by the most important element: **The Solutions**. Introduce concrete, innovative, and practical actions that set your speech apart and make the committee eager to align with your bloc.
                </p>
              </div>
            </div>
          )
        },
        {
          title: "Guidelines for Effective Delivery",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1.25rem' }}>
                Delivering a speech with poise and authority is just as important as writing it:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
                  <strong>Time Discipline:</strong> Keep a strict eye on the clock and wrap up cleanly within your assigned limits.
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
                  <strong>Strategic Pausing:</strong> Pause purposefully to emphasize critical arguments rather than rushing.
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
                  <strong>Body Language:</strong> Look up, engage the committee room, use natural hand gestures, and avoid reading directly from a paper sheet.
                </div>
              </div>
              <div style={{ background: 'rgba(139,30,30,0.06)', padding: '1rem', borderRadius: '12px', marginTop: '1.25rem', borderLeft: '3px solid #8b1e1e', fontSize: '0.9rem' }}>
                💡 <strong>Confidence is Key:</strong> Great public speaking is built entirely on practice. Rehearse your speech multiple times beforehand to speak with absolute authority!
              </div>
            </div>
          )
        }
      ]
    },
    {
      title: "Moderated & Unmoderated Caucus",
      icon: <UsersIcon size={28} color="#8b1e1e" />,
      description: "Master sub-topic debates, bloc formation, drafting resolutions, and strategic negotiations.",
      sections: [
        {
          title: "What is a Moderated Caucus?",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
                A <strong>Moderated Caucus</strong> is a formal debate period within the committee room focused on discussing specific sub-areas of your general agenda.
              </p>
              <div style={{ background: 'rgba(139,30,30,0.08)', padding: '1rem', borderRadius: '12px', marginBottom: '1.25rem', color: '#cbd5e1' }}>
                💡 <strong>Core Logic:</strong> Instead of general debates, a Moderated Caucus allows the committee to break down the crisis into focused, digestible sub-topics to find exact solutions.
              </div>
              <ul style={{ paddingLeft: '1.25rem', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#94a3b8' }}>
                <li>It is fully regulated and run by the Chair.</li>
                <li>Provides targeted time to detail specific national policies.</li>
                <li>Chairs will generally give voting priority to caucuses with the shortest speaker times to maximize participation.</li>
              </ul>
            </div>
          )
        },
        {
          title: "Proposing a Motion (The 4T Rule)",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
                To initiate a Moderated Caucus, you must raise your placard when the Chair opens the floor for motions and state your request following the **4T Rule**:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                {['Topic', 'Timing (Per Speaker)', 'Total Time', 'To Go 1st/Last'].map((rule, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '0.75rem 0.5rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '800' }}>
                    {idx + 1}. {rule}
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(0,0,0,0.15)', padding: '1.25rem', borderRadius: '12px', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                <span style={{ color: '#a72828', fontWeight: 'bold' }}>Example Proposing Dialogue:</span><br/>
                "The delegate of Ghana would like to propose a 20-minute moderated caucus [Total Time] on the topic of 'Economic impact of drought in countries dependent on agriculture' [Topic] with an individual speaking time of 60 seconds [Timing]. The delegate would like to go first [Order]."
              </div>
            </div>
          )
        },
        {
          title: "Speaking to Persuade, Not to Recite Facts",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1.25rem' }}>
                Because speaker times in Moderated Caucuses are short, you must make every second count:
              </p>
              <ul style={{ paddingLeft: '1.25rem', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#cbd5e1' }}>
                <li><strong>Focus on One Core Point:</strong> Do not try to pack multiple issues into a short speech.</li>
                <li><strong>Organize and Structure:</strong> Break your ideas down into clear, sequential bullet points.</li>
                <li><strong>Increase Perspective, Lower Facts:</strong> Fellow delegates already know global statistics from their research. They want to hear your country's unique perspective, strategic ideas, and solutions.</li>
              </ul>
            </div>
          )
        },
        {
          title: "The Unmoderated Caucus (Blocs & Drafting)",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1.25rem' }}>
                An <strong>Unmoderated Caucus</strong> is a temporary suspension of formal rules where delegates move around the committee room freely to speak informally, align interests, and write the draft resolution.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.25rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '16px' }}>
                  <h5 style={{ color: '#ffffff', margin: '0 0 0.5rem 0' }}>Teaming Up in Blocs</h5>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.4' }}>
                    Delegates split into small cooperative groups called <strong>Blocs</strong>, gathering nations with similar regional, economic, or political goals to work as a team.
                  </p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '16px' }}>
                  <h5 style={{ color: '#ffffff', margin: '0 0 0.5rem 0' }}>Drafting & Negotiating</h5>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.4' }}>
                    Collaborate on laptops or shared documents to write the actual resolution text, negotiating roles for Sponsors (main authors) and Co-Submitters (supporters).
                  </p>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h5 style={{ margin: 0, color: '#ffffff' }}>Tips for Unmod Success:</h5>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', color: '#cbd5e1', fontSize: '0.9rem' }}>
                  <li>Be highly active and express your thoughts politely.</li>
                  <li>Keep detailed notes of all cooperative discussions.</li>
                  <li>Negotiate with an open, cooperative, and diplomatic mind.</li>
                </ul>
              </div>
            </div>
          )
        }
      ]
    },
    {
      title: "Draft Resolution I",
      icon: <FileEditIcon size={28} color="#8b1e1e" />,
      description: "Understand the core structure of draft resolutions, authoring headers, and framing preambulatory clauses.",
      sections: [
        {
          title: "Resolution Basics & Importance",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1.25rem' }}>
                A <strong>Draft Resolution</strong> is a formal written proposal created by a bloc of delegates to address and solve a specific global crisis debated within the committee room.
              </p>
              <div style={{ background: 'rgba(139,30,30,0.08)', padding: '1.25rem', borderRadius: '16px', borderLeft: '4px solid #8b1e1e', marginBottom: '1.25rem' }}>
                <h5 style={{ color: '#ffffff', margin: '0 0 0.5rem 0' }}>Why Drafting is Crucial:</h5>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', color: '#cbd5e1', fontSize: '0.92rem' }}>
                  <li>Allows delegates to compile their independent research into a single, cohesive master document.</li>
                  <li>Fosters intense collaboration, lobbying, and negotiation among different nations.</li>
                  <li>Guides the final phase of debate and formal decision-making through amendment and voting.</li>
                </ul>
              </div>
              <p style={{ lineHeight: '1.6', color: '#cbd5e1', margin: 0 }}>
                Every draft resolution comprises 3 main formatting sections: <strong>The Header</strong>, <strong>The Preambulatory Clauses</strong>, and <strong>The Operative Clauses</strong>.
              </p>
            </div>
          )
        },
        {
          title: "Resolution Header & Address",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1.25rem' }}>
                The Header lists the basic administrative information of the document:
              </p>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.25rem' }}>
                <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.92rem' }}>
                  <li><strong>Committee:</strong> The specific room debating (e.g. UNEP, SOCHUM).</li>
                  <li><strong>Issue/Topic:</strong> The exact official agenda.</li>
                  <li><strong>Main Submitter (Sponsor):</strong> The principal author(s) of the text.</li>
                  <li><strong>Co-Submitters:</strong> Delegates who actively contributed to the resolutions.</li>
                  <li><strong>Signatories:</strong> Delegates who wish to see the resolution formally debated (does not mean they support it).</li>
                </ul>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.85rem', borderRadius: '8px', fontSize: '0.88rem' }}>
                <strong>Note:</strong> Immediately after the Header block, the document must include a formal address to the committee body (e.g. <em>"The General Assembly,..."</em>).
              </div>
            </div>
          )
        },
        {
          title: "Preambulatory Clauses Overview",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
                <strong>Preambulatory Clauses</strong> act as the introduction to the resolution, explaining the historical context and urgency of the topic.
              </p>
              <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '12px', color: '#f87171', marginBottom: '1.25rem' }}>
                <strong>Key Preamble Rule:</strong> Preambulatory clauses **never** propose active solutions or policies! Their sole purpose is to list reasons, facts, and past events that justify why action is necessary.
              </div>
              <p style={{ lineHeight: '1.6', color: '#94a3b8', margin: 0 }}>
                Every preambulatory clause must begin with an **italicized introductory phrase** (prefix) and must end with a **comma (,)**.
              </p>
            </div>
          )
        },
        {
          title: "What to Include (Real-World Examples)",
          content: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px' }}>
                <strong>Statistics:</strong> <em>Alarmed by</em> the fact that according to the World Nuclear Association (WNA), around 370,000 tonnes of heavy metal (tHM) of spent nuclear fuel exists today,
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px' }}>
                <strong>Definition of the Topic:</strong> <em>Bearing in mind</em> that radioactive wastes could have half-lives greater than a million years, resulting in severe peril to ecosystems if leaked,
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px' }}>
                <strong>Causes & Effects:</strong> <em>Deeply disturbed by</em> the cheap availability of illicit nucleic acid synthesis technology, and <em>Fully aware</em> of international nuclear proliferation triggers,
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px' }}>
                <strong>History & Past Efforts:</strong> <em>Further recalling</em> that efforts to make the Middle East a nuclear-free zone began in 1960, and <em>Having adopted</em> previous UN Security Council Resolutions 1977 and 1540,
              </div>
            </div>
          )
        },
        {
          title: "Official Preambulatory Prefixes",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1.25rem' }}>
                Choose from these standard italicized prefixes to start your preambulatory clauses:
              </p>
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                padding: '1.25rem',
                borderRadius: '16px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '0.5rem',
                fontSize: '0.8rem',
                fontFamily: 'monospace',
                color: '#cbd5e1'
              }}>
                {['Affirming', 'Alarmed by', 'Aware of', 'Bearing in mind', 'Believing', 'Confident', 'Convinced', 'Deeply concerned', 'Deeply conscious', 'Deeply disturbed', 'Deeply regretting', 'Expressing appreciation', 'Fully alarmed', 'Fully aware', 'Further recalling', 'Guided by', 'Having adopted', 'Keeping in mind', 'Noting further', 'Realizing', 'Recalling', 'Recognizing', 'Taking into account'].map((prefix, idx) => (
                  <div key={idx} style={{ fontStyle: 'italic' }}>
                    {prefix}
                  </div>
                ))}
              </div>
            </div>
          )
        }
      ]
    },
    {
      title: "Draft Resolution II",
      icon: <LayersIcon size={28} color="#8b1e1e" />,
      description: "Master framing operative clauses, writing actionable solutions, and detailing sub-clauses.",
      sections: [
        {
          title: "Operative Clauses Overview",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
                <strong>Operative Clauses</strong> serve as the actual solutions in a resolution. They are actionable statements detailing exactly how the committee should solve the crisis.
              </p>
              <div style={{ background: 'rgba(23, 163, 74, 0.08)', border: '1px solid rgba(23, 163, 74, 0.2)', padding: '1.25rem', borderRadius: '16px', color: '#4ade80', marginBottom: '1.25rem' }}>
                <strong>Key Operative Rules:</strong>
                <ul style={{ margin: '0.5rem 0 0 1.2rem', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', color: '#cbd5e1', fontSize: '0.92rem' }}>
                  <li>Must be sequentially numbered (1, 2, 3, ...).</li>
                  <li>Must start with an <u>underlined operative phrase</u>.</li>
                  <li>Must end with a <strong>semicolon (;)</strong>, except the very final operative clause which ends with a <strong>full stop (.)</strong>.</li>
                </ul>
              </div>
            </div>
          )
        },
        {
          title: "Sub-Clauses & Formatting Details",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1.25rem' }}>
                To add specific execution details, utilize sub-clauses and sub-sub-clauses. Connect them using phrases such as <em>"such as but not limited to"</em> or <em>"by"</em>:
              </p>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'monospace', fontSize: '0.88rem', color: '#cbd5e1' }}>
                1. <u>Calls upon</u> member states to restrict regional biosecurity threats by:<br/>
                &nbsp;&nbsp;a. establishing a centralized security framework to inspect biolabs,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;i. executing random inspections twice a year,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;ii. allocating technical monitoring resources;<br/>
                &nbsp;&nbsp;b. sanctioning non-compliant laboratory entities;
              </div>
              <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.85rem', borderRadius: '8px', fontSize: '0.88rem', color: '#f87171', marginTop: '1.25rem' }}>
                ⚠️ <strong>No Punctuation Rule:</strong> Do not place any punctuation after intermediate sub-clauses; keep them flowing smoothly into the sub-sub-clauses.
              </div>
            </div>
          )
        },
        {
          title: "The Core Details (What, When, Who)",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1.25rem' }}>
                Ensure your operative clauses fully explain the **who, what, when, where, and how** of your proposed actions to remain self-explanatory:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px' }}>
                  <strong>What & How:</strong> Describe the action (e.g. creating programs, aid, investigations) and the detailed infrastructure, resource allocation, and cooperation needed.
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px' }}>
                  <strong>Who Implements & Benefits:</strong> Specify which entities (countries, NGOs, regional blocs) are responsible to execute, and who stands to benefit.
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px' }}>
                <strong>Funding & Urgency:</strong> State how funding will be acquired (which institutions contribute) and explain when actions should commence.
              </div>
            </div>
          )
        },
        {
          title: "Official Operative Phrases",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1.25rem' }}>
                Select from these standard operative prefixes to start your actionable clauses:
              </p>
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                padding: '1.25rem',
                borderRadius: '16px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '0.5rem',
                fontSize: '0.8rem',
                fontFamily: 'monospace',
                color: '#cbd5e1'
              }}>
                {['accepts', 'affirms', 'approves', 'authorizes', 'calls', 'calls upon', 'condemns', 'confirms', 'deplores', 'designates', 'draws attention', 'emphasizes', 'encourages', 'endorses', 'invites', 'proclaims', 'reaffirms', 'recommends', 'reminds', 'requests', 'solemnly affirms', 'strongly condemns', 'supports', 'takes note of'].map((phrase, idx) => (
                  <div key={idx} style={{ textDecoration: 'underline' }}>
                    {phrase}
                  </div>
                ))}
              </div>
            </div>
          )
        }
      ]
    },
    {
      title: "Debate Flow and Amendments",
      icon: <ShuffleIcon size={28} color="#8b1e1e" />,
      description: "Learn about submitter speeches, answering POIs, caucusing, raising amendments, and final voting.",
      sections: [
        {
          title: "Main Submitter Speeches & POIs",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1.25rem' }}>
                Once your draft resolution is selected for formal debate, the **Main Submitter** must steer the room:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px' }}>
                  <strong>1. Reading Clauses:</strong> The Main Submitter reads aloud the main operative clauses (excluding sub-clauses).
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px' }}>
                  <strong>2. First Speech (60s):</strong> Deliver a highly prepared 60-second speech explaining why the resolution deserves support and welcoming constructive amendments.
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px' }}>
                  <strong>3. Answering POIs:</strong> Address clarification questions from the floor with confidence and authority.
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', borderLeft: '3px solid #8b1e1e' }}>
                <strong>Yielding:</strong> The Main Submitter can yield remaining speaking time to the Chair or to a Co-Submitter. Co-Submitters must yield the floor directly back to the Chair.
              </div>
            </div>
          )
        },
        {
          title: "For and Against Speeches",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1.25rem' }}>
                After the submitter's initial involvement, the Chair opens the floor for debate speeches:
              </p>
              <ul style={{ paddingLeft: '1.25rem', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#cbd5e1' }}>
                <li>Any delegate in the committee room can speak to argue for or against the resolution.</li>
                <li>Speeches should highlight specific clauses to praise or criticize.</li>
                <li><strong>No Backstabbing:</strong> Co-submitters must use their speaking opportunity to vouch for their resolution and must vote in favor.</li>
              </ul>
            </div>
          )
        },
        {
          title: "The Amendment Process",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1.25rem' }}>
                <strong>Amendments</strong> are formal changes submitted to add, remove, or replace clauses in the resolution to improve its overall quality.
              </p>
              <div style={{ background: 'rgba(139,30,30,0.08)', padding: '1.25rem', borderRadius: '16px', borderLeft: '4px solid #8b1e1e' }}>
                <h5 style={{ color: '#ffffff', margin: '0 0 0.5rem 0' }}>Procedure:</h5>
                <ol style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', color: '#cbd5e1', fontSize: '0.92rem' }}>
                  <li>Write the exact amendment text on a paper note addressed to the Chair.</li>
                  <li>The Chair selects amendments that promise the most valuable debate.</li>
                  <li>House debates the amendment (for/against speeches) and conducts an immediate vote specifically on that amendment.</li>
                </ol>
              </div>
            </div>
          )
        },
        {
          title: "Final Voting & Resolution Passage",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1.25rem' }}>
                Before final voting, the Chair may call an optional **Special Moderated Caucus** to assess the room's sentiment, followed by the Main Submitter's final optional speech.
              </p>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '16px', marginBottom: '1.25rem' }}>
                <h5 style={{ color: '#ffffff', margin: '0 0 0.5rem 0' }}>Voting Protocol:</h5>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', color: '#cbd5e1', fontSize: '0.9rem' }}>
                  <li>Chairs suspend note passing and call for delegates in favor, against, and abstaining.</li>
                  <li><strong>Abstentions:</strong> Only delegates who answered <em>"Present"</em> during roll call can abstain. If you answered <em>"Present and Voting"</em>, you must vote Yes or No.</li>
                  <li>Signatories are not required to vote in favor.</li>
                </ul>
              </div>
              <div style={{ background: 'rgba(23, 163, 74, 0.08)', border: '1px solid rgba(23, 163, 74, 0.2)', padding: '0.85rem', borderRadius: '8px', fontSize: '0.88rem', color: '#4ade80', textAlign: 'center' }}>
                If the resolution passes, clapping is in order! If it fails, clapping is not in order.
              </div>
            </div>
          )
        }
      ]
    }
  ];

  // Filtering based on Search Query
  const filteredTopics = topics.map((topic, index) => {
    const matchingSections = topic.sections.filter(sec => 
      sec.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      topic.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...topic, index, sections: matchingSections };
  }).filter(topic => topic.sections.length > 0);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0b0f19',
      color: '#e2e8f0',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Decorative orbs */}
      <style dangerouslySetInnerHTML={{__html: `
        body { background: #0b0f19; }

        /* ===== NOTES PAGE — MOBILE CARD LAYOUT ===== */
        @media (max-width: 640px) {

          /* Card: switch from single row to two-row layout */
          .notes-topic-card {
            flex-direction: column !important;
            align-items: flex-start !important;
            padding: 1.25rem 1.1rem !important;
            gap: 0.85rem !important;
          }

          /* Top section: number + icon + title all in one row */
          .notes-card-left {
            flex: unset !important;
            width: 100% !important;
            gap: 0.75rem !important;
            align-items: flex-start !important;
          }

          /* Title container: let it take full remaining width */
          .notes-card-title-wrap {
            flex: 1 !important;
            min-width: 0 !important;
          }

          /* Allow the title to wrap naturally — no clipping */
          .notes-card-title-wrap h3 {
            font-size: 1rem !important;
            line-height: 1.35 !important;
            white-space: normal !important;
          }

          /* Description: single line ellipsis is fine on mobile */
          .notes-card-title-wrap p {
            font-size: 0.8rem !important;
          }

          /* Right section: chapters badge + arrow in a row at the bottom */
          .notes-card-right {
            margin-left: 0 !important;
            padding-left: 0 !important;
            width: 100% !important;
            justify-content: flex-start !important;
            gap: 0.75rem !important;
          }
        }
      `}} />

      {/* Decorative Orbs */}
      <div style={{ position: 'absolute', width: '450px', height: '450px', background: 'rgba(139, 30, 30, 0.12)', filter: 'blur(120px)', borderRadius: '50%', top: '5%', left: '5%', pointerEvents: 'none', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'rgba(37, 45, 80, 0.15)', filter: 'blur(130px)', borderRadius: '50%', bottom: '10%', right: '5%', pointerEvents: 'none', zIndex: 0 }}></div>

      {/* ===== NAVBAR ===== */}
      <nav className="navbar scrolled" id="navbar">
        <div className="container-wide">
          <a href="/index.html" className="nav-brand">
            <div className="nav-logo-wrapper">
              <img src="/assets/logo.png" alt="CSMUN Logo" className="nav-logo" />
            </div>
            <span className="nav-brand-text">CS<span>MUN</span></span>
          </a>
          <ul className="nav-links" id="navLinks">
            <li><a href="/index.html#committees">Committees</a></li>
            <li><a href="/index.html#videos">Training Videos</a></li>
            <li><a href="/resources.html">Resources</a></li>
            <li><a href="/app/notes" className="active">Notes</a></li>
          </ul>
        </div>
      </nav>

      {/* Main Container */}
      <main style={{ maxWidth: '1200px', margin: '2.5rem auto', padding: '0 1.5rem', position: 'relative', zIndex: 2 }}>
        
        {selectedTopicIndex === null ? (
          /* START STATE: LIST OF TOPICS */
          <div>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2.8rem', fontWeight: '800', marginBottom: '0.75rem', color: '#f8fafc' }}>
                Academic Notes & <span style={{ color: '#ef4444' }}>Training Guides</span>
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto 2.5rem auto', lineHeight: '1.6' }}>
                Select an academic topic below to open its dedicated notes in full screen distraction-free reading mode.
              </p>

              {/* Search Box */}
              <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }}>
                  <SearchIcon size={18} color="#94a3b8" />
                </span>
                <input 
                  type="text"
                  placeholder="Search across all training books and guidelines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '1.1rem 1.5rem 1.1rem 3.25rem',
                    borderRadius: '30px',
                    border: '1.5px solid rgba(255, 255, 255, 0.08)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    color: '#f8fafc',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(239, 68, 68, 0.45)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.06)';
                    e.target.style.boxShadow = '0 0 25px rgba(139, 30, 30, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.03)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {filteredTopics.length === 0 ? (
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '4rem 2rem',
                borderRadius: '24px',
                textAlign: 'center',
                color: '#94a3b8'
              }}>
                <span style={{ display: 'block', marginBottom: '1rem', opacity: 0.3 }}>
                  <SearchIcon size={56} color="#94a3b8" />
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#f8fafc', marginBottom: '0.5rem' }}>No matching topics found</h3>
                <p style={{ fontSize: '0.95rem' }}>Try looking up alternative terms like "Research", "Roll Call", "UN", or "Point".</p>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                maxWidth: '850px',
                margin: '1.5rem auto 0 auto'
              }}>
                {filteredTopics.map((topic) => (
                  <div
                    className="notes-topic-card"
                    onClick={() => {
                      setSelectedTopicIndex(topic.index);
                      setSearchQuery('');
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '20px',
                      padding: '1.5rem 2rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)';
                    }}
                  >
                    <div className="notes-card-left" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1, minWidth: 0 }}>
                      {/* Explicit Numbering Badge */}
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: 'rgba(139, 30, 30, 0.15)',
                        border: '1.5px solid #ef4444',
                        color: '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: '800',
                        fontSize: '1rem',
                        flexShrink: 0,
                        boxShadow: '0 0 10px rgba(239, 68, 68, 0.2)'
                      }}>
                        {topic.index + 1}
                      </div>

                      {/* Premium Icon */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {topic.icon}
                      </div>

                      {/* Title & Description Container */}
                      <div className="notes-card-title-wrap" style={{ minWidth: 0, flex: 1 }}>
                        <h3 style={{
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: '1.25rem',
                          fontWeight: '800',
                          color: '#f8fafc',
                          margin: '0 0 0.25rem 0',
                          lineHeight: '1.3'
                        }}>
                          {topic.title}
                        </h3>
                        <p style={{
                          fontSize: '0.88rem',
                          color: '#94a3b8',
                          lineHeight: '1.4',
                          margin: 0,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {topic.description}
                        </p>
                      </div>
                    </div>

                    {/* Right side: Chapters Count & Action arrow */}
                    <div className="notes-card-right" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginLeft: '1.5rem', flexShrink: 0 }}>
                      <span style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        padding: '0.4rem 0.85rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        color: '#cbd5e1',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}>
                        <BookIcon size={12} color="#cbd5e1" /> {topic.sections.length} Chapters
                      </span>
                      <span style={{ fontSize: '1.25rem', color: '#ef4444', fontWeight: 'bold', lineHeight: 1 }}>
                        ➔
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* FOCUS STATE: FULL IMMERSIVE VIEW */
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            
            {/* Header / Sub navigation */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <button
                onClick={() => {
                  setSelectedTopicIndex(null);
                  setSearchQuery('');
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '30px',
                  color: '#f8fafc',
                  padding: '0.6rem 1.25rem',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateX(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <ArrowLeftIcon size={14} color="#f8fafc" /> Back to Topics
              </button>

              <div style={{ position: 'relative', width: '320px' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
                  <SearchIcon size={14} color="#94a3b8" />
                </span>
                <input 
                  type="text"
                  placeholder="Search within this topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 1rem 0.55rem 2.25rem',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    color: '#f8fafc',
                    fontSize: '0.88rem',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(239, 68, 68, 0.6)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)'}
                />
              </div>
            </div>

            {/* Immersive Content Container */}
            <section style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '28px',
              padding: '3rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              color: '#f8fafc'
            }}>
              
              {/* Immersive Header */}
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '2rem', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(239,68,68,0.12)', border: '1.5px solid rgba(239,68,68,0.3)', flexShrink: 0 }}>
                  {topics[selectedTopicIndex].icon}
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2rem', fontWeight: '800', margin: '0 0 0.35rem 0', lineHeight: '1.2', color: '#f8fafc' }}>
                    {topics[selectedTopicIndex].title}
                  </h3>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: '#8890a4', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      📚 OFFICIAL STUDY GUIDE
                    </span>
                    <span style={{ width: '4px', height: '4px', background: '#8890a4', borderRadius: '50%' }}></span>
                    <span style={{ fontSize: '0.78rem', color: '#a72828', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Focus Mode
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic Immersive Note Sections */}
              {(() => {
                const topicSections = topics[selectedTopicIndex].sections.filter(sec => 
                  sec.title.toLowerCase().includes(searchQuery.toLowerCase())
                );

                if (topicSections.length === 0) {
                  return (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
                      <span style={{ display: 'block', marginBottom: '0.75rem' }}>
                        <SearchIcon size={36} color="rgba(255,255,255,0.2)" />
                      </span>
                      <h4 style={{ color: '#f8fafc', margin: '0 0 0.25rem 0' }}>No chapters match your search</h4>
                      <p style={{ fontSize: '0.9rem' }}>Try clearing the search query or typing other keywords.</p>
                    </div>
                  );
                }

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                    {topicSections.map((section, sIdx) => (
                      <div key={sIdx} style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        padding: '2.25rem',
                        borderRadius: '24px',
                        position: 'relative'
                      }}>
                        {/* Chapter Badge */}
                        <div style={{
                          position: 'absolute',
                          top: '1.25rem',
                          right: '1.5rem',
                          fontSize: '0.75rem',
                          color: '#94a3b8',
                          fontWeight: '800',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          opacity: 0.7
                        }}>
                          Chapter {sIdx + 1}
                        </div>

                        {/* Section Title */}
                        <h4 style={{
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: '1.35rem',
                          fontWeight: '800',
                          color: '#f8fafc',
                          margin: '0 0 1.5rem 0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem'
                        }}>
                          {section.title}
                        </h4>

                        {/* Section Content */}
                        <div style={{ color: '#e2e8f0', fontSize: '0.98rem', lineHeight: '1.75' }}>
                          {section.content}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}

            </section>
            
            {/* Immersive Footer Go Back */}
            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <button
                onClick={() => {
                  setSelectedTopicIndex(null);
                  setSearchQuery('');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{
                  background: 'linear-gradient(90deg, #8b1e1e 0%, #a72828 100%)',
                  border: 'none',
                  borderRadius: '30px',
                  color: '#ffffff',
                  padding: '0.75rem 2rem',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(139, 30, 30, 0.25)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 30, 30, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(139, 30, 30, 0.25)';
                }}
              >
                <ArrowLeftIcon size={14} color="#ffffff" /> Back to Library Topics
              </button>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
