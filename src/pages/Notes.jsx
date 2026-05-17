import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Notes() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const topics = [
    {
      title: "Introduction to MUN & Administrative Structure",
      icon: "🌍",
      description: "Learn the core basics of Model United Nations and the official CSMUN administrative hierarchy.",
      sections: [
        {
          title: "United Nations (UN) Overview",
          emoji: "🇺🇳",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
                The <strong>United Nations</strong> is a global organization where countries worldwide come together to discuss, debate, and solve global issues.
              </p>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderLeft: '4px solid #8b1e1e', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <li>📍 <strong>Location:</strong> Manhattan, New York, NY</li>
                  <li>🕴️ <strong>Leader:</strong> Secretary-General (currently <em>Antonio Guterres</em> from Portugal) who heads the administration and serves as the face of the UN.</li>
                  <li>🏢 <strong>Office:</strong> He operates directly from within the <strong>Secretariat</strong>.</li>
                </ul>
              </div>
            </div>
          )
        },
        {
          title: "What is Model United Nations (MUN)?",
          emoji: "🤷",
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
          emoji: "🙋",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
                A <strong>Committee</strong> is a specialized group formed to complete specific tasks or address focused global challenges. 
              </p>
              <div style={{ background: 'rgba(139, 30, 30, 0.08)', border: '1px solid rgba(139, 30, 30, 0.2)', padding: '1rem', borderRadius: '12px', marginBottom: '1rem' }}>
                💡 <strong>Example:</strong> The <em>United Nations Environment Programme (UNEP)</em> specifically debates environmental sustainability and climate adaptation.
              </div>
            </div>
          )
        },
        {
          title: "Debating, Collaborating & The Resolution",
          emoji: "📃",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
                Delegates must follow a strict set of parliamentary rules and procedures inspired by the real UN to ensure formal, respectful, and highly productive debates.
              </p>
              <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
                Ultimately, delegates collaborate to write one specialized final document called a <strong>Resolution</strong>. 
              </p>
              <div style={{ background: 'rgba(22, 163, 74, 0.08)', border: '1px solid rgba(22, 163, 74, 0.2)', color: '#4ade80', padding: '0.85rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600' }}>
                ✨ Resolution: The final compilation of all inclusive, practical solutions written in a highly formatted manner.
              </div>
            </div>
          )
        },
        {
          title: "CSMUN Administration & Secretariat Structure",
          emoji: "💼",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1.5rem' }}>
                CSMUN has proudly transitioned from an online platform (CSMUN I) into a premium offline conference (CSMUN II). The student body organizing the conference is called the <strong>Secretariat</strong>, divided into two major divisions:
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                {/* Logistics */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.25rem', borderRadius: '16px' }}>
                  <h4 style={{ color: '#8b1e1e', margin: '0 0 0.75rem 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🗓️</span> Logistics Portfolio
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
                    <span>🎒</span> Academics Portfolio
                  </h4>
                  <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', color: '#cbd5e1' }}>
                    <li><strong>Director General:</strong> Manages academic parameters, recruits committee chairs, proofreads background guides, manages press, and oversees mentors.</li>
                    <li><strong>Deputy Director General:</strong> Directly manages mentor operations and ensures effective delegate training.</li>
                  </ul>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
                <strong>🕴️ Under-Secretary Generals (USGs):</strong> Focus on specific domains, bridging logistics (USGs of Press, Logistics) and academics (USGs of IT, Mentorship, Training, Impact).
              </div>
            </div>
          )
        },
        {
          title: "Chairs & Mentors Roles",
          emoji: "🪑",
          content: (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                <div>
                  <h4 style={{ color: '#ffffff', margin: '0 0 0.5rem 0' }}>🎭 The Committee Chairs</h4>
                  <p style={{ lineHeight: '1.6', color: '#94a3b8' }}>
                    Each committee room is guided by a <strong>Head Chair</strong> and two <strong>Deputy Chairs</strong>. They ensure parliamentary decorum, manage speeches, and author the crucial <strong>Background Guide (BG)</strong>—the master starting point for your research.
                  </p>
                </div>
                <div>
                  <h4 style={{ color: '#ffffff', margin: '0 0 0.5rem 0' }}>🎓 CSMUN Mentors</h4>
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
      icon: "📋",
      description: "Understand the core processes of gathering data and structuring your research binder.",
      sections: [
        {
          title: "Why Do We Research?",
          emoji: "💡",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
                Research is a thorough process of investigation done to gather factual knowledge, expand understanding, solve crises, and generate original solutions.
              </p>
              <div style={{ background: 'rgba(139,30,30,0.08)', padding: '1.25rem', borderRadius: '16px', borderLeft: '4px solid #8b1e1e' }}>
                <h5 style={{ color: '#ffffff', margin: '0 0 0.5rem 0' }}>🔥 Why Research is Crucial in MUN:</h5>
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
          emoji: "🏁",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1.25rem' }}>
                Always start by reading the official <strong>Background Guide (BG)</strong> written by your committee chairs. It provides the core overview, key questions, and a bibliography to guide your reading.
              </p>
              <h5 style={{ color: '#ffffff', margin: '0 0 0.75rem 0' }}>🔍 Five Pillars of Research:</h5>
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
          emoji: "🎩",
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
          emoji: "🌎",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
                You must represent your assigned nation accurately. Research your country's:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px' }}>
                  <strong>🕰️ History & Policy:</strong> Focus heavily on recent affairs (no further back than 1 year). Study domestic political events and key national interests.
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px' }}>
                  <strong>🤝 Foreign Relations:</strong> Understand your alliances and adversaries, official stance, regional sanctions, or economic dependencies.
                </div>
              </div>
              <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '12px', color: '#f87171' }}>
                🚨 <strong>Biggest Mistake:</strong> Suggesting solutions that contradict your country's official guidelines! Make sure your solutions always match your country's foreign policy.
              </div>
            </div>
          )
        },
        {
          title: "The Research Binder",
          emoji: "📁",
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
      icon: "🔬",
      description: "Master the art of evaluating past efforts, finding reliable sources, and referencing data.",
      sections: [
        {
          title: "Past Efforts & Why They Fail",
          emoji: "🧾",
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
          emoji: "🤝",
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
          emoji: "✅",
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
          emoji: "💻",
          content: (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1rem', borderRadius: '12px' }}>
                  <strong>🌐 Google Scholar & Academic Engines:</strong> Research verified databases like <em>ScienceDirect, PubMed, or ResearchGate</em>. Avoid trusting Wikipedia as a direct source (use its bibliography instead).
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1rem', borderRadius: '12px' }}>
                  <strong>📰 Highly Reliable Outlets:</strong> BBC, The Guardian, Al Jazeera, the official UN document repository, and the NIH.
                </div>
              </div>

              <div style={{ background: 'rgba(139,30,30,0.08)', padding: '1.25rem', borderRadius: '16px' }}>
                <h5 style={{ color: '#ffffff', margin: '0 0 0.5rem 0' }}>📋 Step-by-Step Search Routines:</h5>
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
      icon: "📣",
      description: "Master procedural etiquette, from marking attendance to formal points and floor yields.",
      sections: [
        {
          title: "The Roll Call (Attendance)",
          emoji: "📝",
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
                  <strong>🙋🏽‍♀️ Present:</strong> You are present in committee. You retain the right to <strong>abstain</strong> (choose not to vote) on the final resolution.
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', borderLeft: '3px solid #10b981' }}>
                  <strong>🙋🏾‍♂️ Present and Voting:</strong> You are fully active. You <strong>cannot abstain</strong> when voting on the final resolution; you must vote Yes or No.
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                🚨 <strong>Missed Roll Call?</strong> Send a formal paper note to the Dais (Chairs) stating your presence and explaining why you were late.
              </div>
            </div>
          )
        },
        {
          title: "The Three Pillars of Points",
          emoji: "⚖️",
          content: (
            <div>
              <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
                Debate in MUN is highly structured. You cannot directly address other delegates (no crosstalk). All communications go through the Chair using points:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
                  <strong>🔊 Point of Personal Privilege:</strong> Used to report personal discomfort (e.g. room too hot/cold, can't hear the speaker). <em>This is the only point that can interrupt a speaker.</em>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
                  <strong>❓ Point of Parliamentary Inquiry:</strong> Used to ask the Chair to clarify committee rules or procedural status. <em>Cannot interrupt a speaker.</em>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
                  <strong>⚠️ Point of Order:</strong> Used to point out a procedural mistake made by the Chair or another delegate. <em>Cannot interrupt a speaker.</em>
                </div>
              </div>
            </div>
          )
        },
        {
          title: "The Floor & Yielding Procedures",
          emoji: "📣",
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
                  <strong>🙋‍♂️ Yielding to POIs (Points of Information):</strong> You open yourself to questions from other delegates. Delegates ask questions from the podium, and you reply. No rhetorical or Yes/No questions. Only 1 follow-up is allowed.
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', borderLeft: '3px solid #8b1e1e' }}>
                  <strong>👥 Yielding to Another Delegate:</strong> You transfer your remaining time to a selected ally. They must accept the yield. No further yields (e.g., to a third delegate) are allowed.
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', borderLeft: '3px solid #8b1e1e' }}>
                  <strong>🪑 Yielding to the Chair:</strong> The default yield. Any remaining time is absorbed by the Chair, and committee moves to the next speaker.
                </div>
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
      background: 'linear-gradient(135deg, #0a0c16 0%, #12172a 50%, #0a0c16 100%)',
      color: '#ffffff',
      fontFamily: "'Inter', sans-serif",
      paddingBottom: '4rem'
    }}>
      {/* Decorative Orbs */}
      <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'rgba(139, 30, 30, 0.12)', filter: 'blur(120px)', borderRadius: '50%', top: '5%', left: '5%', pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'rgba(26, 32, 58, 0.3)', filter: 'blur(130px)', borderRadius: '50%', bottom: '10%', right: '5%', pointerEvents: 'none' }}></div>

      {/* Header Bar */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '1.25rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            overflow: 'hidden',
            background: 'rgba(139, 30, 30, 0.1)',
            border: '1px solid rgba(139, 30, 30, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img src="/assets/logo.png" alt="Logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
          </div>
          <div>
            <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.25rem', fontWeight: '800', margin: 0, letterSpacing: '0.5px' }}>
              CS<span style={{ color: '#a72828' }}>MUN</span> Academy
            </h1>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Notes & Study Guide Portal</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => {
              if (currentUser) {
                navigate('/app');
              } else {
                window.location.href = '/index.html';
              }
            }}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '30px',
              color: '#ffffff',
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
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            }}
          >
            ↩️ {currentUser ? 'Go to Dashboard' : 'Back to Home'}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1200px', margin: '2.5rem auto', padding: '0 1.5rem', position: 'relative', zIndex: 2 }}>
        
        {selectedTopicIndex === null ? (
          /* START STATE: GRID OF TOPICS */
          <div>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2.8rem', fontWeight: '800', marginBottom: '0.75rem' }}>
                Academic Notes & <span style={{ color: '#a72828' }}>Training Guides</span>
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto 2.5rem auto', lineHeight: '1.6' }}>
                Select an academic topic below to open its dedicated notes in full screen distraction-free reading mode.
              </p>

              {/* Search Box */}
              <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem', opacity: 0.6 }}>🔍</span>
                <input 
                  type="text"
                  placeholder="Search across all training books and guidelines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '1.1rem 1.5rem 1.1rem 3.25rem',
                    borderRadius: '30px',
                    border: '1.5px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    color: '#ffffff',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(167, 40, 40, 0.6)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.target.style.boxShadow = '0 0 25px rgba(167, 40, 40, 0.18)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.03)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {filteredTopics.length === 0 ? (
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '4rem 2rem',
                borderRadius: '24px',
                textAlign: 'center',
                color: '#94a3b8'
              }}>
                <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1rem' }}>📭</span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.5rem' }}>No matching topics found</h3>
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
                    key={topic.index}
                    onClick={() => {
                      setSelectedTopicIndex(topic.index);
                      setSearchQuery(''); // Reset search to display all sections of that topic
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '20px',
                      padding: '1.5rem 2rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.borderColor = 'rgba(139, 30, 30, 0.4)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 30, 30, 0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1, minWidth: 0 }}>
                      {/* Explicit Numbering Badge */}
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: 'rgba(139, 30, 30, 0.15)',
                        border: '1.5px solid #a72828',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: '800',
                        fontSize: '1rem',
                        flexShrink: 0,
                        boxShadow: '0 0 10px rgba(139, 30, 30, 0.2)'
                      }}>
                        {topic.index + 1}
                      </div>

                      {/* Icon */}
                      <span style={{ fontSize: '2.25rem', lineHeight: 1, flexShrink: 0 }}>{topic.icon}</span>

                      {/* Title & Description Container */}
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <h3 style={{
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: '1.25rem',
                          fontWeight: '800',
                          color: '#ffffff',
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginLeft: '1.5rem', flexShrink: 0 }}>
                      <span style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        padding: '0.4rem 0.85rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        color: '#cbd5e1',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        📖 {topic.sections.length} Chapters
                      </span>
                      <span style={{ fontSize: '1.25rem', color: '#a72828', fontWeight: 'bold', lineHeight: 1 }}>
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
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '30px',
                  color: '#ffffff',
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
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.transform = 'translateX(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                👈 Back to Topics
              </button>

              <div style={{ position: 'relative', width: '320px' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.9rem', opacity: 0.5 }}>🔍</span>
                <input 
                  type="text"
                  placeholder="Search within this topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 1rem 0.55rem 2.25rem',
                    borderRadius: '20px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(167, 40, 40, 0.6)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </div>
            </div>

            {/* Immersive Content Container */}
            <section style={{
              background: 'rgba(255, 255, 255, 0.02)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '28px',
              padding: '3rem',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
            }}>
              
              {/* Immersive Header */}
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '2rem', marginBottom: '2.5rem' }}>
                <span style={{ fontSize: '3.5rem', lineHeight: 1 }}>{topics[selectedTopicIndex].icon}</span>
                <div>
                  <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2rem', fontWeight: '800', margin: '0 0 0.35rem 0', lineHeight: '1.2' }}>
                    {topics[selectedTopicIndex].title}
                  </h3>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      📚 OFFICIAL STUDY GUIDE
                    </span>
                    <span style={{ width: '4px', height: '4px', background: '#94a3b8', borderRadius: '50%' }}></span>
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
                      <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem' }}>🔍</span>
                      <h4 style={{ color: '#ffffff', margin: '0 0 0.25rem 0' }}>No chapters match your search</h4>
                      <p style={{ fontSize: '0.9rem' }}>Try clearing the search query or typing other keywords.</p>
                    </div>
                  );
                }

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                    {topicSections.map((section, sIdx) => (
                      <div key={sIdx} style={{
                        background: 'rgba(255,255,255,0.01)',
                        border: '1px solid rgba(255,255,255,0.03)',
                        padding: '2.25rem',
                        borderRadius: '24px',
                        position: 'relative',
                        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)'
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
                          opacity: 0.6
                        }}>
                          Chapter {sIdx + 1}
                        </div>

                        {/* Section Title */}
                        <h4 style={{
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: '1.35rem',
                          fontWeight: '800',
                          color: '#ffffff',
                          margin: '0 0 1.5rem 0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem'
                        }}>
                          <span>{section.emoji}</span> {section.title}
                        </h4>

                        {/* Section Content */}
                        <div style={{ color: '#cbd5e1', fontSize: '0.98rem' }}>
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
                ↩️ Back to Library Topics
              </button>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
