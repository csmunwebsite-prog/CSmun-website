import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db, storage } from '../../firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, collection, addDoc, serverTimestamp, query, where, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const TRAINING_VIDEOS = [
  { id: 'v1', title: 'Opening Speech Guide', url: 'https://www.youtube.com/embed/F7CRCt0Td7A', youtubeId: 'F7CRCt0Td7A', deadline: 'May 20, 2026' },
  { id: 'v2', title: 'Resolution Debate Procedure', url: 'https://www.youtube.com/embed/RpSqJTaiBJI', youtubeId: 'RpSqJTaiBJI', deadline: 'May 24, 2026' },
  { id: 'v3', title: 'How to Write a Position Paper', url: 'https://www.youtube.com/embed/rP1hD1vN5bY', youtubeId: 'rP1hD1vN5bY', deadline: 'May 28, 2026' }
];

const VIDEO_QUIZZES = {
  v1: {
    question: "What is the primary focus of an MUN Opening Speech?",
    options: [
      "To introduce your nation's policy and main concerns on the agenda",
      "To challenge the chairs",
      "To write a resolution",
      "To socialize with delegates"
    ],
    correct: "To introduce your nation's policy and main concerns on the agenda"
  },
  v2: {
    question: "During resolution debates, what does the delegate prioritize explaining?",
    options: [
      "The clauses, policies, and actions of the proposed draft resolution",
      "Criticizing the host nation",
      "Submitting a personal complaint",
      "Leaving the committee room"
    ],
    correct: "The clauses, policies, and actions of the proposed draft resolution"
  },
  v3: {
    question: "What is the primary purpose of a Position Paper in MUN?",
    options: [
      "To outline your country's policy on the agenda topic",
      "To criticize other countries",
      "To draft a final resolution",
      "To write a speech for the opening ceremony"
    ],
    correct: "To outline your country's policy on the agenda topic"
  }
};

export default function DelegateDashboard() {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();
  const [completedVideos, setCompletedVideos] = useState([]);
  const [uploadType, setUploadType] = useState('position_paper');
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState('');
  const [mentorName, setMentorName] = useState('');
  const [loadingMentor, setLoadingMentor] = useState(false);
  const [uploads, setUploads] = useState([]);

  // Dedicated Video Viewer and Quiz States
  const [activeVideo, setActiveVideo] = useState(null);
  const [selectedQuizOption, setSelectedQuizOption] = useState('');
  const [quizError, setQuizError] = useState('');
  const [quizSuccess, setQuizSuccess] = useState(false);
  const [isFullScreenViewer, setIsFullScreenViewer] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, 'uploads'), where('uid', '==', currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userUploads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUploads(userUploads);
    }, (err) => {
      console.error("Error fetching uploads:", err);
    });
    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    const fetchProgress = async () => {
      if (currentUser) {
        const docRef = doc(db, 'delegateProgress', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCompletedVideos(docSnap.data().completedVideos || []);
        } else {
          await setDoc(docRef, { completedVideos: [] });
        }
      }
    };
    fetchProgress();
  }, [currentUser]);

  useEffect(() => {
    const fetchMentorName = async () => {
      if (userData?.mentorId) {
        try {
          setLoadingMentor(true);
          const mentorRef = doc(db, 'users', userData.mentorId);
          const mentorSnap = await getDoc(mentorRef);
          if (mentorSnap.exists()) {
            setMentorName(mentorSnap.data().name || 'Assigned Mentor');
          } else {
            setMentorName('');
          }
        } catch (err) {
          console.error("Error fetching mentor name:", err);
          setMentorName('');
        } finally {
          setLoadingMentor(false);
        }
      } else {
        setMentorName('');
      }
    };
    fetchMentorName();
  }, [userData]);

  const markCompleted = async (videoId) => {
    if (!completedVideos.includes(videoId)) {
      const newCompleted = [...completedVideos, videoId];
      setCompletedVideos(newCompleted);
      const docRef = doc(db, 'delegateProgress', currentUser.uid);
      await updateDoc(docRef, {
        completedVideos: arrayUnion(videoId)
      });
    }
  };

  const resetVideoProgress = async (videoId) => {
    try {
      const updatedCompleted = completedVideos.filter(id => id !== videoId);
      setCompletedVideos(updatedCompleted);

      const docRef = doc(db, 'delegateProgress', currentUser.uid);
      await setDoc(docRef, {
        completedVideos: updatedCompleted
      }, { merge: true });
      
      if (activeVideo && activeVideo.id === videoId) {
        setSelectedQuizOption('');
        setQuizError('');
        setQuizSuccess(false);
      }
    } catch (err) {
      console.error("Error resetting video progress:", err);
    }
  };

  const toggleModalFullscreen = () => {
    setIsFullScreenViewer(!isFullScreenViewer);
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    if (!activeVideo) return;
    
    const quiz = VIDEO_QUIZZES[activeVideo.id];
    if (selectedQuizOption === quiz.correct) {
      setQuizError('');
      setQuizSuccess(true);
      
      await markCompleted(activeVideo.id);
      
      setTimeout(() => {
        setQuizSuccess(false);
        setSelectedQuizOption('');
      }, 2000);
    } else {
      setQuizSuccess(false);
      setQuizError('Incorrect answer. Please review the video and try again!');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const storageRef = ref(storage, `uploads/${currentUser.uid}/${uploadType}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      }, 
      (error) => {
        setUploadMessage('Upload failed: ' + error.message);
      }, 
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        
        // Save metadata to Firestore
        await addDoc(collection(db, 'uploads'), {
          uid: currentUser.uid,
          delegateEmail: currentUser.email,
          delegateName: userData?.name || 'Delegate',
          type: uploadType,
          fileName: file.name,
          url: downloadURL,
          createdAt: serverTimestamp(),
          rank: null // Mentors will rank this later
        });

        setUploadMessage('Upload successful!');
        setFile(null);
        setUploadProgress(0);
      }
    );
  };

  const progressPercentage = Math.round((completedVideos.length / TRAINING_VIDEOS.length) * 100);

  return (
    <div className="portal-wrapper" style={{ 
      minHeight: '100vh', 
      background: '#f3f6fa', 
      color: '#0f172a',
      padding: '2rem 1.5rem',
      fontFamily: "'Inter', sans-serif",
      position: 'relative'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        
        {/* Navigation / Header Banner */}
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <span style={{ 
              fontSize: '0.8rem', 
              fontWeight: '800', 
              color: '#3b82f6', 
              textTransform: 'uppercase', 
              letterSpacing: '1.5px',
              display: 'block',
              marginBottom: '0.25rem'
            }}>
              DASHBOARD
            </span>
            <h1 style={{ 
              fontSize: '2.2rem', 
              fontWeight: '800', 
              fontFamily: "'Outfit', sans-serif",
              color: '#0a2342',
              margin: 0
            }}>
              Welcome, {userData?.name || currentUser?.displayName || 'Delegate'}.
            </h1>
            <p style={{ color: '#475569', fontSize: '0.95rem', margin: '0.25rem 0 0 0', fontWeight: '500' }}>
              You've completed <strong style={{ color: '#0a2342' }}>{progressPercentage}%</strong> of training this week. Go through your resources to keep your progress glowing.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => window.location.href = '/'}
              style={{ 
                padding: '0.65rem 1.5rem', 
                borderRadius: '30px', 
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#334155',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '0.85rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.borderColor = '#94a3b8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }}
            >
              🏠 Home
            </button>
            <button 
              onClick={() => navigate('/app/profile')}
              style={{ 
                padding: '0.65rem 1.5rem', 
                borderRadius: '30px', 
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#334155',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '0.85rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.borderColor = '#94a3b8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }}
            >
              ⚙️ Profile
            </button>
            <button 
              onClick={logout} 
              style={{ 
                padding: '0.65rem 1.5rem', 
                borderRadius: '30px', 
                background: 'transparent',
                border: '1.5px solid rgba(139, 30, 30, 0.25)',
                color: '#8b1e1e',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '0.85rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#8b1e1e';
                e.currentTarget.style.background = 'rgba(139, 30, 30, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(139, 30, 30, 0.25)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              🚪 Log Out
            </button>
          </div>
        </header>

        {/* TOP ROW: Profile Card & Committee Card Side-by-Side with Matching Height */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '2rem', 
          marginTop: '1.5rem',
          alignItems: 'stretch' // Force matching heights!
        }}>
          
          {/* Left Column: Premium Profile Card with Sleek, Compressed Height */}
          <div style={{ 
            flex: '1 1 280px', // Stretchable flex width
            background: '#f4f6fe',
            border: '1px solid #cbd5e1',
            borderRadius: '24px',
            padding: '1.25rem', // Compressed padding
            boxShadow: '0 4px 20px rgba(10, 35, 66, 0.02)',
            display: 'flex',
            flexDirection: 'column' // Height matches via flexbox stretch
          }}>
            <span style={{ 
              fontSize: '0.75rem', 
              fontWeight: '700', 
              color: '#64748b', 
              textTransform: 'uppercase', 
              letterSpacing: '1px', 
              display: 'block', 
              textAlign: 'center', 
              marginBottom: '0.4rem' // Reduced margin
            }}>
              CSMUN VI 2026 DELEGATE
            </span>

            <h3 style={{ 
              fontSize: '1.5rem', // Sleeker font size
              fontWeight: '800', 
              color: '#0a2342', 
              margin: '0 0 0.75rem 0', // Compressed margin
              fontFamily: "'Outfit', sans-serif", 
              textAlign: 'center' 
            }}>
              {userData?.name || currentUser?.displayName || 'Delegate'}
            </h3>

            {/* Rounded Badges */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <span style={{ 
                background: '#ffffff', 
                border: '1px solid #cbd5e1', 
                padding: '0.4rem 0.85rem', 
                borderRadius: '30px', 
                fontSize: '0.8rem', 
                fontWeight: '600', 
                color: '#334155', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.3rem',
                boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
              }}>
                🎓 {userData?.grade ? `Grade ${userData.grade}` : 'N/A'}
              </span>
              {userData?.stream && (
                <span style={{ 
                  background: '#ffffff', 
                  border: '1px solid #cbd5e1', 
                  padding: '0.4rem 0.85rem', 
                  borderRadius: '30px', 
                  fontSize: '0.8rem', 
                  fontWeight: '600', 
                  color: '#334155', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.3rem',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
                }}>
                  🏫 {userData.stream}
                </span>
              )}
              {userData?.section && (
                <span style={{ 
                  background: '#ffffff', 
                  border: '1px solid #cbd5e1', 
                  padding: '0.4rem 0.85rem', 
                  borderRadius: '30px', 
                  fontSize: '0.8rem', 
                  fontWeight: '600', 
                  color: '#334155', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.3rem',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
                }}>
                  📍 Sec {userData.section.toUpperCase()}
                </span>
              )}
            </div>

            {/* Compact Stats Row - Highly professional single line to match user's screenshot height */}
            <div style={{ 
              display: 'flex', 
              borderTop: '1px solid #cbd5e1', 
              paddingTop: '0.85rem', 
              marginTop: 'auto',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              color: '#475569',
              fontWeight: '600'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>📄</span>
                <strong>{uploads.length}</strong> Submissions
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>📺</span>
                <strong>{completedVideos.length}</strong> Videos Done
              </div>
            </div>
          </div>

          {/* Committee Card (Top Right) */}
          <div style={{ 
            flex: '2 1 600px',
            background: 'linear-gradient(135deg, #dbeafe 0%, #dcfce7 100%)', 
            borderRadius: '24px',
            padding: '2rem 2.5rem',
            boxShadow: '0 4px 20px rgba(59, 130, 246, 0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}>
              <div>
                <span style={{ 
                  background: '#ffffff', 
                  color: '#2563eb', 
                  fontSize: '0.75rem', 
                  fontWeight: '800', 
                  padding: '4px 12px', 
                  borderRadius: '20px', 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
                  marginBottom: '1rem'
                }}>
                  ⚡️ ACTIVE STATUS
                </span>
                <h3 style={{ 
                  fontFamily: "'Outfit', sans-serif", 
                  fontSize: '1.6rem', 
                  color: '#0a2342', 
                  margin: '0 0 0.5rem 0',
                  fontWeight: '800'
                }}>
                  {userData?.committee || 'No Committee Assigned'}
                </h3>
                <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0, maxWidth: '480px', lineHeight: '1.5' }}>
                  {mentorName ? (
                    <span>Your assigned mentor is <strong style={{ color: '#0a2342' }}>{mentorName}</strong>. Reach out for feedback and evaluations.</span>
                  ) : (
                    <span>No mentor has tracked your profile yet. Once a mentor joins your committee, they can assign you under them.</span>
                  )}
                </p>
              </div>

              {/* White rounded momentum capsule elements */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ background: '#ffffff', padding: '1rem 1.25rem', borderRadius: '16px', textAlign: 'center', minWidth: '90px', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#64748b', display: 'block', textTransform: 'uppercase' }}>STREAM</span>
                  <strong style={{ fontSize: '1.1rem', color: '#0a2342', display: 'block', marginTop: '0.25rem' }}>{userData?.stream || 'N/A'}</strong>
                </div>
                <div style={{ background: '#ffffff', padding: '1rem 1.25rem', borderRadius: '16px', textAlign: 'center', minWidth: '90px', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#64748b', display: 'block', textTransform: 'uppercase' }}>SECTION</span>
                  <strong style={{ fontSize: '1.1rem', color: '#0a2342', display: 'block', marginTop: '0.25rem' }}>{userData?.section?.toUpperCase() || 'N/A'}</strong>
                </div>
              </div>
          </div>
        </div>

        {/* BOTTOM ROW: Fully Stretched Document Submissions and Training Progress Cards stacked vertically */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '2rem', 
          marginTop: '2rem' 
        }}>
          
          {/* Training Videos (Card 2) */}
          <div style={{ 
            background: '#ffffff', 
            border: '1px solid #cbd5e1',
            borderRadius: '24px',
            padding: '2rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.01)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.3rem', color: '#0a2342', fontWeight: '800', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📺</span> Training Videos
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: '1.5' }}>
              Watch essential MUN training videos to prepare for your committee.
            </p>

            {/* Progress bar */}
            <div style={{ position: 'relative', background: '#f1f5f9', borderRadius: '10px', height: '20px', margin: '0.5rem 0 1.5rem 0', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
              <div style={{ 
                background: 'linear-gradient(90deg, #8b1e1e 0%, #c24646 100%)', 
                height: '100%', 
                borderRadius: '10px', 
                width: `${progressPercentage}%`, 
                transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
              }}></div>
              <span style={{ position: 'absolute', right: '10px', top: '1px', fontSize: '0.75rem', fontWeight: 'bold', color: progressPercentage > 5 ? '#ffffff' : '#334155' }}>
                {progressPercentage}%
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '420px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {TRAINING_VIDEOS.map((video, idx) => {
                const isUnlocked = idx === 0 || completedVideos.includes(TRAINING_VIDEOS[idx - 1].id);
                return (
                  <div key={video.id} style={{ 
                    background: '#f8fafc', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '16px',
                    padding: '1.25rem',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    cursor: isUnlocked ? 'pointer' : 'not-allowed',
                    opacity: isUnlocked ? 1 : 0.55,
                    filter: isUnlocked ? 'none' : 'grayscale(70%)',
                    pointerEvents: isUnlocked ? 'auto' : 'none'
                  }}
                  onClick={() => {
                    if (isUnlocked) setActiveVideo(video);
                  }}
                  onMouseEnter={(e) => {
                    if (isUnlocked) {
                      e.currentTarget.style.borderColor = 'rgba(139, 30, 30, 0.3)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isUnlocked) {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                  >
                    {/* Premium YouTube Video Thumbnail */}
                    <div style={{
                      width: '100px',
                      height: '65px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      position: 'relative',
                      flexShrink: 0,
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                    }}>
                      <img 
                        src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`} 
                        alt={video.title} 
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: '#8b1e1e',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                          border: '2px solid #ffffff'
                        }}>
                          {isUnlocked ? '▶' : '🔒'}
                        </div>
                      </div>
                    </div>

                    {/* Middle: Video info */}
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0a2342', margin: '0 0 0.25rem 0' }}>{video.title}</h4>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>
                        2 Checkpoints (1:50 & 2:50)
                      </span>
                      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                       {!isUnlocked ? (
                         <span style={{ 
                           background: '#f1f5f9', 
                           color: '#64748b', 
                           fontSize: '0.75rem', 
                           fontWeight: '700', 
                           padding: '4px 10px', 
                           borderRadius: '20px',
                           display: 'inline-flex',
                           alignItems: 'center',
                           gap: '0.25rem',
                           border: '1px solid #cbd5e1'
                         }}>
                           🔒 Locked
                         </span>
                       ) : completedVideos.includes(video.id) ? (
                         <>
                           <span style={{ 
                             background: '#dcfce7', 
                             color: '#16a34a', 
                             fontSize: '0.75rem', 
                             fontWeight: '700', 
                             padding: '4px 10px', 
                             borderRadius: '20px',
                             display: 'inline-flex',
                             alignItems: 'center',
                             gap: '0.25rem'
                           }}>
                             ✓ Done
                           </span>
                           <button
                             onClick={(e) => {
                               e.stopPropagation(); // Prevent opening player immediately
                               resetVideoProgress(video.id);
                             }}
                             style={{
                               background: '#fee2e2',
                               border: '1px solid #fee2e2',
                               color: '#8b1e1e',
                               cursor: 'pointer',
                               fontSize: '0.7rem',
                               fontWeight: '700',
                               padding: '4px 8px',
                               borderRadius: '12px',
                               transition: 'all 0.2s ease',
                               boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                               pointerEvents: 'auto'
                             }}
                             onMouseEnter={(e) => {
                               e.currentTarget.style.background = '#8b1e1e';
                               e.currentTarget.style.color = '#ffffff';
                             }}
                             onMouseLeave={(e) => {
                               e.currentTarget.style.background = '#fee2e2';
                               e.currentTarget.style.color = '#8b1e1e';
                             }}
                             title="Reset progress to test again"
                           >
                             Reset
                           </button>
                         </>
                       ) : (
                         <span style={{ 
                           background: 'rgba(139, 30, 30, 0.08)', 
                           color: '#8b1e1e', 
                           fontSize: '0.75rem', 
                           fontWeight: '700', 
                           padding: '4px 10px', 
                           borderRadius: '20px',
                           display: 'inline-flex',
                           alignItems: 'center',
                           gap: '0.25rem'
                         }}>
                           ▶ Watch
                         </span>
                       )}
                     </div>
                    </div>

                    {/* Right: Deadline Indicator */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', marginLeft: 'auto', flexShrink: 0 }}>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: '800', 
                        color: '#ef4444', 
                        background: 'rgba(239, 68, 68, 0.06)', 
                        padding: '6px 12px', 
                        borderRadius: '20px',
                        border: '1px solid rgba(239, 68, 68, 0.12)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}>
                        🗓 Deadline: {video.deadline}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Document Upload (Card 1) */}
          <div style={{ 
            background: '#ffffff', 
            border: '1px solid #cbd5e1',
            borderRadius: '24px',
            padding: '2rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.01)'
          }}>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.3rem', color: '#0a2342', fontWeight: '800', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📤</span> Document Submissions
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Submit position papers or draft resolutions to receive scoring.
            </p>
            
            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.8rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Document Type</label>
                <select 
                  value={uploadType} 
                  onChange={(e) => setUploadType(e.target.value)} 
                  style={{ 
                    width: '100%', 
                    padding: '0.8rem', 
                    borderRadius: '8px', 
                    border: '1px solid #cbd5e1', 
                    background: '#ffffff', 
                    color: '#1e293b',
                    fontSize: '0.9rem',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="position_paper">Position Paper</option>
                  <option value="draft_resolution">Draft Resolution</option>
                </select>
              </div>
              
              <div style={{
                border: '2px dashed #cbd5e1',
                borderRadius: '12px',
                padding: '1.5rem',
                textAlign: 'center',
                background: '#f8fafc',
                cursor: 'pointer',
                position: 'relative'
              }}
              onDragOver={(e) => e.preventDefault()}
              >
                <input 
                  type="file" 
                  onChange={(e) => setFile(e.target.files[0])} 
                  style={{ 
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    opacity: 0, cursor: 'pointer'
                  }} 
                />
                <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '0.25rem' }}>📄</span>
                <span style={{ display: 'block', color: file ? '#8b1e1e' : '#334155', fontWeight: file ? '700' : '500', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {file ? file.name : 'Drag here or choose file'}
                </span>
                <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem' }}>
                  PDF, DOCX, or text files
                </span>
              </div>

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div style={{ width: '100%', background: '#f1f5f9', borderRadius: '10px', height: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  <div style={{ background: '#8b1e1e', height: '100%', width: `${uploadProgress}%` }}></div>
                </div>
              )}

              <button 
                type="submit" 
                disabled={!file || (uploadProgress > 0 && uploadProgress < 100)} 
                style={{ 
                  width: '100%', 
                  padding: '0.85rem', 
                  borderRadius: '30px', 
                  background: !file ? '#e2e8f0' : 'linear-gradient(90deg, #8b1e1e 0%, #a72828 100%)', 
                  color: !file ? '#94a3b8' : '#ffffff', 
                  border: 'none', 
                  cursor: !file ? 'not-allowed' : 'pointer', 
                  fontWeight: '700', 
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  transition: 'all 0.3s ease',
                  boxShadow: file ? '0 4px 12px rgba(139, 30, 30, 0.15)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (file) e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  if (file) e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {uploadProgress > 0 && uploadProgress < 100 ? 'Uploading...' : 'Submit Paper'}
              </button>
              
              {uploadMessage && (
                <p style={{ 
                  textAlign: 'center',
                  fontWeight: '600',
                  color: uploadMessage.includes('success') ? '#16a34a' : '#ef4444',
                  fontSize: '0.85rem',
                  margin: 0 
                }}>
                  {uploadMessage}
                </p>
              )}
            </form>
          </div>

        </div>

          </div>

      {/* Premium Video Viewer Overlay / Modal */}
      {activeVideo && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(10px)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isFullScreenViewer ? '0' : '2rem',
          transition: 'all 0.3s ease'
        }}>
          <div style={{
            background: '#ffffff',
            border: isFullScreenViewer ? 'none' : '1px solid #cbd5e1',
            borderRadius: isFullScreenViewer ? '0' : '24px',
            padding: isFullScreenViewer ? '3.5rem 2.5rem 2.5rem 2.5rem' : '2.5rem',
            maxWidth: isFullScreenViewer ? '100vw' : '1000px',
            width: '100%',
            height: isFullScreenViewer ? '100vh' : 'auto',
            maxHeight: isFullScreenViewer ? '100vh' : '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative',
            display: 'flex',
            gap: '2rem',
            flexWrap: 'wrap',
            alignContent: 'start',
            transition: 'all 0.3s ease'
          }}>
            {/* Toggle Full Screen / Theater Mode Button */}
            <button 
              onClick={toggleModalFullscreen}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '3.5rem',
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#8b1e1e'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
            >
              {isFullScreenViewer ? '🗗 Exit Fullscreen' : '🖵 Fullscreen'}
            </button>

            {/* Close Button */}
            <button 
              onClick={() => {
                setActiveVideo(null);
                setSelectedQuizOption('');
                setQuizError('');
                setQuizSuccess(false);
                setIsFullScreenViewer(false);
              }}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                fontSize: '1.75rem',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
                lineHeight: '1'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
            >
              ×
            </button>

            {/* Video Player Column */}
            <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.6rem', color: '#0a2342', fontWeight: '800', margin: 0 }}>
                🎥 {activeVideo.title}
              </h3>
              
              <div style={{ 
                position: 'relative',
                paddingBottom: '56.25%', /* 16:9 Aspect Ratio */
                height: 0,
                overflow: 'hidden',
                borderRadius: '16px',
                background: '#000000',
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
              }}>
                <iframe 
                  src={activeVideo.url}
                  title={activeVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none'
                  }}
                />
              </div>
              <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
                Watch this video in full to understand the key concept, then answer the checkpoint question on the right side to successfully mark this module as completed.
              </p>
            </div>

            {/* Quiz Checkpoint Column */}
            <div style={{ 
              flex: '1 1 340px', 
              background: '#f8fafc', 
              border: '1px solid #cbd5e1', 
              borderRadius: '20px', 
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <span style={{ 
                background: '#fee2e2', 
                color: '#8b1e1e', 
                fontSize: '0.7rem', 
                fontWeight: '800', 
                padding: '4px 10px', 
                borderRadius: '20px', 
                display: 'inline-flex',
                alignSelf: 'start',
                marginBottom: '1rem',
                letterSpacing: '0.5px'
              }}>
                📝 QUIZ CHECKPOINT
              </span>

              {completedVideos.includes(activeVideo.id) ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🎉</span>
                  <h4 style={{ color: '#16a34a', fontSize: '1.2rem', fontWeight: '800', margin: '0 0 0.5rem 0' }}>Checkpoint Passed!</h4>
                  <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
                    You have successfully answered the checkpoint question and unlocked this training module. Good job!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleQuizSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <h4 style={{ fontSize: '1rem', color: '#0a2342', fontWeight: '800', margin: 0, lineHeight: '1.4' }}>
                    {VIDEO_QUIZZES[activeVideo.id].question}
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {VIDEO_QUIZZES[activeVideo.id].options.map((opt, idx) => {
                      const isSelected = selectedQuizOption === opt;
                      return (
                        <label 
                          key={idx} 
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.85rem 1rem',
                            background: isSelected ? 'rgba(139, 30, 30, 0.05)' : '#ffffff',
                            border: isSelected ? '1.5px solid #8b1e1e' : '1px solid #cbd5e1',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            color: isSelected ? '#8b1e1e' : '#334155',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <input 
                            type="radio" 
                            name="quizOption" 
                            value={opt} 
                            checked={isSelected}
                            onChange={() => setSelectedQuizOption(opt)}
                            style={{ 
                              accentColor: '#8b1e1e',
                              cursor: 'pointer'
                            }}
                          />
                          {opt}
                        </label>
                      );
                    })}
                  </div>

                  {quizError && (
                    <div style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      ⚠️ {quizError}
                    </div>
                  )}

                  {quizSuccess && (
                    <div style={{ color: '#16a34a', fontSize: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      🎉 Correct! Module completed!
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!selectedQuizOption}
                    style={{
                      width: '100%',
                      padding: '0.85rem',
                      borderRadius: '30px',
                      background: !selectedQuizOption ? '#cbd5e1' : 'linear-gradient(90deg, #8b1e1e 0%, #a72828 100%)',
                      color: !selectedQuizOption ? '#94a3b8' : '#ffffff',
                      border: 'none',
                      cursor: !selectedQuizOption ? 'not-allowed' : 'pointer',
                      fontWeight: '700',
                      fontSize: '0.85rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      transition: 'all 0.3s ease',
                      boxShadow: selectedQuizOption ? '0 4px 12px rgba(139, 30, 30, 0.15)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedQuizOption) e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      if (selectedQuizOption) e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Submit Answer
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
