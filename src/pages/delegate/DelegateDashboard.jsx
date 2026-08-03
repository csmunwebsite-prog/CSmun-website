import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, collection, addDoc, serverTimestamp, query, where, onSnapshot } from 'firebase/firestore';
import { TRAINING_VIDEOS, VIDEO_CHECKPOINTS } from '../../constants/videos';

const HomeIcon = ({ style }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const SettingsIcon = ({ style }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const LogOutIcon = ({ style }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const GraduationCapIcon = ({ style }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
  </svg>
);

const SchoolIcon = ({ style }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
    <line x1="9" y1="22" x2="9" y2="16"></line>
    <path d="M9 16h6v6"></path>
    <line x1="8" y1="6" x2="8" y2="6.01"></line>
    <line x1="16" y1="6" x2="16" y2="6.01"></line>
    <line x1="8" y1="10" x2="8" y2="10.01"></line>
    <line x1="16" y1="10" x2="16" y2="10.01"></line>
  </svg>
);

const MapPinIcon = ({ style }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const FileIcon = ({ style }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
  </svg>
);

const TvIcon = ({ style }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
    <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
    <polyline points="17 2 12 7 7 2"></polyline>
  </svg>
);

const BoltIcon = ({ style }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

const CalendarIcon = ({ style }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const UploadIcon = ({ style }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

const LinkIcon = ({ style }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
  </svg>
);

const FullscreenIcon = ({ style }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
  </svg>
);

const ExitFullscreenIcon = ({ style }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
    <path d="M4 14h6v6m10-6h-6v6M4 10h6V4m10 6h-6V4"></path>
  </svg>
);

const PlayIcon = ({ style }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const AlertIcon = ({ style }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const SuccessIcon = ({ style }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

// TRAINING_VIDEOS and VIDEO_CHECKPOINTS are now imported from '../../constants/videos'

export default function DelegateDashboard() {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();
  const [completedVideos, setCompletedVideos] = useState([]);
  const [uploadType, setUploadType] = useState('draft_resolution');
  const [uploadMessage, setUploadMessage] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [mentorName, setMentorName] = useState('');
  const [loadingMentor, setLoadingMentor] = useState(false);
  const [uploads, setUploads] = useState([]);

  // Dedicated Video Viewer and Quiz States
  const [activeVideo, setActiveVideo] = useState(null);
  const [selectedQuizOption, setSelectedQuizOption] = useState('');
  const [quizError, setQuizError] = useState('');
  const [quizSuccess, setQuizSuccess] = useState(false);
  const [isFullScreenViewer, setIsFullScreenViewer] = useState(false);

  // Checkpoints timeline states
  const [answeredCheckpoints, setAnsweredCheckpoints] = useState([]);
  const [wrongCheckpoints, setWrongCheckpoints] = useState([]);
  const [activeCheckpoint, setActiveCheckpoint] = useState(null);
  const [ytPlayer, setYtPlayer] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(237);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMouseActive, setIsMouseActive] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isCaptionsOn, setIsCaptionsOn] = useState(false);
  const modalContainerRef = useRef(null);
  const answeredCheckpointsRef = useRef(answeredCheckpoints);
  const activeCheckpointRef = useRef(activeCheckpoint);

  useEffect(() => {
    answeredCheckpointsRef.current = answeredCheckpoints;
  }, [answeredCheckpoints]);

  useEffect(() => {
    activeCheckpointRef.current = activeCheckpoint;
  }, [activeCheckpoint]);

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
          setAnsweredCheckpoints(docSnap.data().answeredCheckpoints || []);
          setWrongCheckpoints(docSnap.data().wrongCheckpoints || []);
        } else {
          await setDoc(docRef, { completedVideos: [], answeredCheckpoints: [], wrongCheckpoints: [] });
        }
      }
    };
    fetchProgress();
  }, [currentUser]);

  // Load YouTube Player Iframe API Script
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // Set up YT Player instance and playback time tracking
  useEffect(() => {
    if (!activeVideo) {
      if (ytPlayer) {
        try {
          ytPlayer.destroy();
        } catch (e) {
          console.error("Error destroying player:", e);
        }
      }
      setYtPlayer(null);
      setCurrentTime(0);
      setDuration(237);
      setActiveCheckpoint(null);
      setIsPlaying(false);
      setPlaybackSpeed(1);
      setIsMuted(false);
      setIsCaptionsOn(false);
      return;
    }

    let playerInstance = null;
    let intervalId;

    const initPlayer = () => {
      const videoId = activeVideo.youtubeId;
      
      playerInstance = new window.YT.Player('csmun-yt-player', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          enablejsapi: 1,
          rel: 0,
          modestbranding: 1,
          controls: 0, // Clean overlay mode!
          fs: 0
        },
        events: {
          onReady: () => {
            setYtPlayer(playerInstance);
            // Patch the iframe to allow fullscreen on the parent container
            try {
              const iframe = playerInstance.getIframe();
              if (iframe) {
                iframe.setAttribute('allow', 'autoplay; fullscreen');
                iframe.setAttribute('allowfullscreen', '1');
              }
            } catch (e) {}
            try {
              if (playerInstance.getDuration) {
                setDuration(playerInstance.getDuration() || 237);
              }
            } catch (e) {}

            intervalId = setInterval(() => {
              try {
                if (playerInstance && typeof playerInstance.getCurrentTime === 'function') {
                  const curr = playerInstance.getCurrentTime();
                  setCurrentTime(curr);
                  
                  const dur = playerInstance.getDuration();
                  if (dur) setDuration(dur);

                  // Check checkpoints using refs to avoid stale closures
                  const checkpoints = VIDEO_CHECKPOINTS[activeVideo.id] || [];
                  const pendingCP = checkpoints.find(cp => 
                    curr >= cp.timestamp && 
                    !answeredCheckpointsRef.current.includes(cp.id)
                  );
                  
                  if (pendingCP && !activeCheckpointRef.current) {
                    playerInstance.pauseVideo();
                    setActiveCheckpoint(pendingCP);
                    setSelectedQuizOption('');
                    setQuizError('');
                    setQuizSuccess(false);
                    setIsSidebarOpen(true);
                  }
                }
              } catch (err) {
                console.error("Playback tracking error:", err);
              }
            }, 500);
          },
          onStateChange: (event) => {
            if (event.data === 1) {
              const checkpoints = VIDEO_CHECKPOINTS[activeVideo.id] || [];
              const curr = playerInstance.getCurrentTime ? playerInstance.getCurrentTime() : 0;
              const pendingCP = checkpoints.find(cp => 
                curr >= cp.timestamp && 
                !answeredCheckpointsRef.current.includes(cp.id)
              );
              if (pendingCP || activeCheckpointRef.current) {
                playerInstance.pauseVideo();
                setIsPlaying(false);
                if (pendingCP && !activeCheckpointRef.current) {
                  setActiveCheckpoint(pendingCP);
                  setSelectedQuizOption('');
                  setQuizError('');
                  setQuizSuccess(false);
                  setIsSidebarOpen(true);
                }
              } else {
                setIsPlaying(true);
              }
            } else {
              setIsPlaying(false);
            }
          }
        }
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (playerInstance) {
        try {
          playerInstance.destroy();
        } catch (e) {
          console.error("Error destroying player:", e);
        }
      }
    };
  }, [activeVideo]);

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === null) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Setup mouse inactivity fade trigger
  useEffect(() => {
    if (!activeVideo) return;
    
    let timer;
    const handleMouseMove = () => {
      setIsMouseActive(true);
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsMouseActive(false);
      }, 2500);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timer);
    };
  }, [activeVideo]);

  // HTML5 Fullscreen Listener and Handlers
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const currentlyFS = !!(document.fullscreenElement || document.webkitFullscreenElement);
      setIsFullscreen(currentlyFS);
      if (currentlyFS) {
        if (!activeCheckpointRef.current) {
          setIsSidebarOpen(false);
        }
      } else {
        setIsSidebarOpen(true);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleHTML5Fullscreen = (e) => {
    e.stopPropagation();
    const el = modalContainerRef.current;
    if (!el) return;
    const isCurrentlyFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement);
    if (!isCurrentlyFullscreen) {
      const requestFS = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen;
      if (requestFS) {
        requestFS.call(el).catch(err => {
          console.error('Fullscreen request failed:', err);
        });
      }
    } else {
      const exitFS = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen;
      if (exitFS) exitFS.call(document);
    }
  };

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
      const updatedAnswered = answeredCheckpoints.filter(id => !id.startsWith(videoId));
      const updatedWrong = wrongCheckpoints.filter(id => !id.startsWith(videoId));
      
      setCompletedVideos(updatedCompleted);
      setAnsweredCheckpoints(updatedAnswered);
      setWrongCheckpoints(updatedWrong);

      const docRef = doc(db, 'delegateProgress', currentUser.uid);
      await setDoc(docRef, {
        completedVideos: updatedCompleted,
        answeredCheckpoints: updatedAnswered,
        wrongCheckpoints: updatedWrong
      }, { merge: true });
      
      if (activeVideo && activeVideo.id === videoId) {
        setActiveCheckpoint(null);
        setSelectedQuizOption('');
        setQuizError('');
        setQuizSuccess(false);
        setCurrentTime(0);
        
        if (ytPlayer && typeof ytPlayer.seekTo === 'function') {
          ytPlayer.seekTo(0);
          ytPlayer.playVideo();
        }
      }
    } catch (err) {
      console.error("Error resetting video progress:", err);
    }
  };

  const toggleModalFullscreen = () => {
    const nextVal = !isFullScreenViewer;
    setIsFullScreenViewer(nextVal);
    if (nextVal) {
      if (!activeCheckpoint) {
        setIsSidebarOpen(false);
      }
    } else {
      setIsSidebarOpen(true);
    }
  };

  const getFirstUnansweredCheckpoint = () => {
    if (!activeVideo) return null;
    const checkpoints = VIDEO_CHECKPOINTS[activeVideo.id] || [];
    return checkpoints.find(cp => !answeredCheckpoints.includes(cp.id));
  };

  const handleSeek = (targetTime) => {
    if (!ytPlayer) return;
    const unanswered = getFirstUnansweredCheckpoint();
    if (unanswered && targetTime > unanswered.timestamp) {
      ytPlayer.seekTo(unanswered.timestamp);
      return;
    }
    ytPlayer.seekTo(targetTime);
  };

  const handlePlayPause = () => {
    if (!ytPlayer) return;
    if (isPlaying) {
      ytPlayer.pauseVideo();
    } else {
      if (activeCheckpoint) {
        setQuizError('Please answer the checkpoint question to continue!');
        return;
      }
      ytPlayer.playVideo();
    }
  };

  const handleCheckpointSubmit = async (e) => {
    e.preventDefault();
    if (!activeVideo || !activeCheckpoint) return;
    
    const isCorrect = selectedQuizOption === activeCheckpoint.correct;
    
    if (isCorrect) {
      setQuizError('');
      setQuizSuccess(true);
      
      const newAnswered = [...answeredCheckpoints, activeCheckpoint.id];
      setAnsweredCheckpoints(newAnswered);
      
      const docRef = doc(db, 'delegateProgress', currentUser.uid);
      await updateDoc(docRef, {
        answeredCheckpoints: arrayUnion(activeCheckpoint.id)
      });

      // Check if all checkpoints for this video are completed
      const allVideoCheckpoints = VIDEO_CHECKPOINTS[activeVideo.id] || [];
      const hasUnfinished = allVideoCheckpoints.some(cp => !newAnswered.includes(cp.id));
      
      if (!hasUnfinished) {
        await markCompleted(activeVideo.id);
      }

      setTimeout(() => {
        setQuizSuccess(false);
        setSelectedQuizOption('');
        setActiveCheckpoint(null);
        
        if (isFullScreenViewer || isFullscreen) {
          setIsSidebarOpen(false);
        }
        
        if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
          ytPlayer.playVideo();
        }
      }, 1500);
    } else {
      // Mark as wrong answer in database (add to both answered and wrong)
      const newAnswered = [...answeredCheckpoints, activeCheckpoint.id];
      setAnsweredCheckpoints(newAnswered);
      const newWrong = [...wrongCheckpoints, activeCheckpoint.id];
      setWrongCheckpoints(newWrong);
      
      const docRef = doc(db, 'delegateProgress', currentUser.uid);
      await updateDoc(docRef, {
        answeredCheckpoints: arrayUnion(activeCheckpoint.id),
        wrongCheckpoints: arrayUnion(activeCheckpoint.id)
      });

      // Notify the mentor
      try {
        await addDoc(collection(db, 'notifications'), {
          delegateId: currentUser.uid,
          delegateName: userData?.name || currentUser?.displayName || 'Delegate',
          committee: userData?.committee || '',
          videoTitle: activeVideo.title,
          question: activeCheckpoint.question,
          selectedOption: selectedQuizOption,
          correctOption: activeCheckpoint.correct,
          type: 'wrong_answer',
          createdAt: serverTimestamp(),
          read: false
        });
      } catch (err) {
        console.error("Error creating notification for mentor:", err);
      }

      // Check if all checkpoints for this video are completed
      const allVideoCheckpoints = VIDEO_CHECKPOINTS[activeVideo.id] || [];
      const hasUnfinished = allVideoCheckpoints.some(cp => !newAnswered.includes(cp.id));
      
      if (!hasUnfinished) {
        await markCompleted(activeVideo.id);
      }

      // Show that they were wrong for 2.5 seconds
      setQuizSuccess(false);
      setQuizError('❌ Incorrect answer! Moving to the next section...');

      setTimeout(() => {
        setQuizError('');
        setSelectedQuizOption('');
        setActiveCheckpoint(null);
        
        if (isFullScreenViewer || isFullscreen) {
          setIsSidebarOpen(false);
        }
        
        if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
          ytPlayer.playVideo();
        }
      }, 2500);
    }
  };

  const handleSubmitDocument = async (e) => {
    e.preventDefault();

    if (!linkUrl || !linkUrl.trim()) {
      setUploadMessage("❌ Error: Please enter a Google Drive document link!");
      return;
    }
    if (!linkUrl.toLowerCase().startsWith('http://') && !linkUrl.toLowerCase().startsWith('https://')) {
      setUploadMessage("❌ Error: Link must start with http:// or https://");
      return;
    }

    try {
      setUploadMessage("Submitting document link...");
      
      // Save metadata directly to Firestore
      await addDoc(collection(db, 'uploads'), {
        uid: currentUser.uid,
        delegateEmail: currentUser.email,
        delegateName: userData?.name || 'Delegate',
        type: uploadType,
        fileName: uploadType === 'draft_resolution' 
          ? `🔗 Draft Resolution Link` 
          : uploadType === 'research_binder' 
            ? `🔗 Research Binder Link` 
            : `🔗 Opening Speech Link`,
        url: linkUrl.trim(),
        createdAt: serverTimestamp(),
        rank: null // Mentors will rank this later
      });

      setUploadMessage('🎉 Google Drive link submitted successfully!');
      setLinkUrl('');
    } catch (err) {
      console.error("Link submission failed:", err);
      setUploadMessage('❌ Submission failed: ' + err.message);
    }
  };

  const activeVideosCount = TRAINING_VIDEOS.filter(v => !v.isPlaceholder).length;
  const progressPercentage = activeVideosCount > 0 ? Math.round((completedVideos.length / activeVideosCount) * 100) : 0;

  return (
    <div className="portal-wrapper" style={{ 
      minHeight: '100vh', 
      background: 'var(--bg-primary, #ffffff)', 
      color: 'var(--text-secondary, #3a3f52)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      position: 'relative',
      overflowX: 'hidden'
    }}>

      {/* Decorative Orbs */}
      <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'rgba(139, 30, 30, 0.05)', filter: 'blur(120px)', borderRadius: '50%', top: '5%', left: '5%', pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'rgba(37, 45, 80, 0.04)', filter: 'blur(130px)', borderRadius: '50%', bottom: '10%', right: '5%', pointerEvents: 'none' }}></div>

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
            <li><a href="/app" className="active">Dashboard</a></li>
            <li><a href="/index.html#committees">Committees</a></li>
            <li><a href="/resources.html">Resources</a></li>
            <li><a href="/app/notes">Notes</a></li>
            <li id="auth-nav-item">
              {currentUser ? (
                <a href="/app/profile" className="nav-profile-link" style={{ textDecoration: 'none' }}>
                  <div className="nav-profile">
                    <img 
                      src={currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.name || userData?.certificateName || currentUser.displayName || 'User')}`} 
                      alt="Profile" 
                      className="nav-avatar" 
                    />
                    <span className="nav-user-name">
                      {(() => {
                        const finalName = userData?.name || userData?.certificateName || currentUser.displayName || 'Account';
                        const firstName = finalName.split(' ')[0];
                        const gradeStr = userData?.grade ? ` (Gr. ${userData.grade})` : '';
                        return firstName + gradeStr;
                      })()}
                    </span>
                  </div>
                </a>
              ) : (
                <a href="/app" className="btn btn-primary nav-cta" id="registerBtn">Register Now</a>
              )}
            </li>
          </ul>
        </div>
      </nav>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '7rem 1.5rem 3rem', position: 'relative', zIndex: 2 }}>
        
        {/* Navigation / Header Banner */}
        {/* Dashboard Header */}
        <header style={{ marginBottom: '2.5rem' }}>
          <div className="section-label" style={{ display: 'inline-block', marginBottom: '0.75rem' }}>Delegate Portal</div>
          <h1 style={{ 
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', 
            fontWeight: '800', 
            fontFamily: "'Outfit', sans-serif",
            color: 'var(--text-primary, #1a1d2b)',
            margin: '0 0 0.5rem 0'
          }}>
            Welcome, <span className="accent-text">{(userData?.name || currentUser?.displayName || 'Delegate').split(' ')[0]}</span>.
          </h1>
          <p style={{ color: 'var(--text-muted, #5c6278)', fontSize: '1rem', margin: '0 0 1.5rem 0', maxWidth: '600px', lineHeight: '1.6' }}>
            You've completed <strong style={{ color: 'var(--text-primary, #1a1d2b)' }}>{progressPercentage}%</strong> of training. Go through your resources to keep your progress glowing.
          </p>
          <a 
            href="/app/notes"
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '12px 28px', fontSize: '0.8rem' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            View Academic Notes
          </a>
        </header>

        {/* TOP ROW: Profile Card & Committee Card Side-by-Side with Matching Height */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '2rem', 
          marginTop: '1.5rem',
          alignItems: 'stretch' // Force matching heights!
        }}>
          
          {/* Left Column: Premium Profile Card */}
          <div style={{ 
            flex: '1 1 280px',
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(26, 29, 43, 0.08)',
            borderRadius: '20px',
            padding: '1.5rem',
            boxShadow: '0 4px 24px rgba(26, 29, 43, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'box-shadow 0.3s ease, transform 0.3s ease'
          }}>
            <span style={{ 
              fontSize: '0.7rem', 
              fontWeight: '700', 
              color: 'var(--red-500, #a72828)', 
              textTransform: 'uppercase', 
              letterSpacing: '2px', 
              display: 'block', 
              textAlign: 'center', 
              marginBottom: '0.5rem',
              fontFamily: "'Outfit', sans-serif"
            }}>
              CSMUN VI 2026 DELEGATE
            </span>

            <h3 style={{ 
              fontSize: '1.4rem',
              fontWeight: '800', 
              color: 'var(--text-primary, #1a1d2b)', 
              margin: '0 0 0.75rem 0',
              fontFamily: "'Outfit', sans-serif", 
              textAlign: 'center' 
            }}>
              {userData?.name || currentUser?.displayName || 'Delegate'}
            </h3>

            {/* Rounded Badges */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <span style={{ 
                background: 'rgba(26, 29, 43, 0.04)', 
                border: '1px solid rgba(26, 29, 43, 0.08)', 
                padding: '0.35rem 0.8rem', 
                borderRadius: '30px', 
                fontSize: '0.78rem', 
                fontWeight: '600', 
                color: 'var(--text-secondary, #3a3f52)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.3rem'
              }}>
                <GraduationCapIcon /> {userData?.grade ? `Grade ${userData.grade}` : 'N/A'}
              </span>
              {userData?.stream && (
                <span style={{ 
                  background: 'rgba(26, 29, 43, 0.04)', 
                  border: '1px solid rgba(26, 29, 43, 0.08)', 
                  padding: '0.35rem 0.8rem', 
                  borderRadius: '30px', 
                  fontSize: '0.78rem', 
                  fontWeight: '600', 
                  color: 'var(--text-secondary, #3a3f52)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.3rem'
                }}>
                  <SchoolIcon /> {userData.stream}
                </span>
              )}
              {userData?.section && (
                <span style={{ 
                  background: 'rgba(26, 29, 43, 0.04)', 
                  border: '1px solid rgba(26, 29, 43, 0.08)', 
                  padding: '0.35rem 0.8rem', 
                  borderRadius: '30px', 
                  fontSize: '0.78rem', 
                  fontWeight: '600', 
                  color: 'var(--text-secondary, #3a3f52)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.3rem'
                }}>
                  <MapPinIcon /> Sec {userData.section.toUpperCase()}
                </span>
              )}
            </div>

            {/* Compact Stats Row - Highly professional single line to match user's screenshot height */}
            <div style={{ 
              display: 'flex', 
              borderTop: '1px solid rgba(26, 29, 43, 0.08)', 
              paddingTop: '0.85rem', 
              marginTop: 'auto',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              color: 'var(--text-muted, #5c6278)',
              fontWeight: '600'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <FileIcon style={{ color: '#64748b' }} />
                <strong>{uploads.length}</strong> Submissions
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <TvIcon style={{ color: '#64748b' }} />
                <strong>{completedVideos.length}</strong> Videos Done
              </div>
            </div>
          </div>

          {/* Committee Card (Top Right) */}
          <div 
            style={{ 
              flex: '2 1 600px',
              background: 'rgba(255, 255, 255, 0.7)', 
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '2rem 2.5rem',
              boxShadow: '0 4px 24px rgba(26, 29, 43, 0.04)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem',
              cursor: 'default',
              border: '1px solid rgba(26, 29, 43, 0.08)',
              transition: 'box-shadow 0.3s ease, transform 0.3s ease'
            }}
          >
              <div>
                <span style={{ 
                  background: 'rgba(167, 40, 40, 0.08)', 
                  color: 'var(--red-500, #a72828)', 
                  fontSize: '0.7rem', 
                  fontWeight: '700', 
                  padding: '5px 14px', 
                  borderRadius: '20px', 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  letterSpacing: '1px',
                  marginBottom: '1rem',
                  fontFamily: "'Outfit', sans-serif"
                }}>
                  <BoltIcon /> ACTIVE STATUS
                </span>
                <h3 style={{ 
                  fontFamily: "'Outfit', sans-serif", 
                  fontSize: '1.5rem', 
                  color: 'var(--text-primary, #1a1d2b)', 
                  margin: '0 0 0.5rem 0',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  {userData?.committee || 'No Committee Assigned'}
                </h3>
                <p style={{ color: 'var(--text-muted, #5c6278)', fontSize: '0.95rem', margin: 0, maxWidth: '480px', lineHeight: '1.5' }}>
                  {mentorName ? (
                    <span>Your assigned mentor is <strong style={{ color: 'var(--text-primary, #1a1d2b)' }}>{mentorName}</strong>. Reach out for feedback and evaluations.</span>
                  ) : (
                    <span>No mentor has tracked your profile yet. Once a mentor joins your committee, they can assign you under them.</span>
                  )}
                </p>
              </div>

              {/* White rounded momentum capsule elements */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ background: 'rgba(26, 29, 43, 0.04)', border: '1px solid rgba(26, 29, 43, 0.08)', padding: '0.85rem 1.15rem', borderRadius: '16px', textAlign: 'center', minWidth: '90px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted, #5c6278)', display: 'block', textTransform: 'uppercase' }}>STREAM</span>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary, #1a1d2b)', display: 'block', marginTop: '0.25rem' }}>{userData?.stream || 'N/A'}</strong>
                </div>
                <div style={{ background: 'rgba(26, 29, 43, 0.04)', border: '1px solid rgba(26, 29, 43, 0.08)', padding: '0.85rem 1.15rem', borderRadius: '16px', textAlign: 'center', minWidth: '90px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted, #5c6278)', display: 'block', textTransform: 'uppercase' }}>SECTION</span>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary, #1a1d2b)', display: 'block', marginTop: '0.25rem' }}>{userData?.section?.toUpperCase() || 'N/A'}</strong>
                </div>
                <a 
                  href="https://drive.google.com/drive/folders/12PtwTWDQnGnGsScFkHOaPgvrs6dtSM0z?usp=drive_link" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    background: 'linear-gradient(135deg, var(--red-500, #8b1e1e) 0%, var(--red-400, #a72828) 100%)', 
                    padding: '0.85rem 1.35rem', 
                    borderRadius: '16px', 
                    textAlign: 'center', 
                    minWidth: '125px', 
                    boxShadow: '0 4px 16px rgba(139, 30, 30, 0.25)',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(139, 30, 30, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(139, 30, 30, 0.25)';
                  }}
                >
                  <span style={{ fontSize: '0.65rem', fontWeight: '800', color: 'rgba(255, 255, 255, 0.85)', display: 'block', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '0.2rem' }}>STUDY GUIDES</span>
                  <strong style={{ fontSize: '0.88rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '800' }}>
                    ACCESS BG <LinkIcon style={{ color: '#ffffff', width: '12px', height: '12px' }} />
                  </strong>
                </a>
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
            background: 'rgba(255, 255, 255, 0.7)', 
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(26, 29, 43, 0.08)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 4px 24px rgba(26, 29, 43, 0.04)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.3rem', color: 'var(--text-primary, #1a1d2b)', fontWeight: '800', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TvIcon style={{ width: '18px', height: '18px', color: 'var(--red-500, #8b1e1e)' }} /> Training Videos
            </h3>
            <p style={{ color: 'var(--text-muted, #5c6278)', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: '1.5' }}>
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
                const isUnlocked = (() => {
                  if (idx === 0) return true;
                  // Look back for the previous non-placeholder video
                  for (let i = idx - 1; i >= 0; i--) {
                    if (!TRAINING_VIDEOS[i].isPlaceholder) {
                      return completedVideos.includes(TRAINING_VIDEOS[i].id);
                    }
                  }
                  return true;
                })();
                
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
                    cursor: video.isPlaceholder ? 'default' : (isUnlocked ? 'pointer' : 'not-allowed'),
                    opacity: isUnlocked ? 1 : 0.55,
                    filter: isUnlocked ? 'none' : 'grayscale(70%)',
                    pointerEvents: isUnlocked ? 'auto' : 'none'
                  }}
                  onClick={() => {
                    if (isUnlocked && !video.isPlaceholder) setActiveVideo(video);
                  }}
                  onMouseEnter={(e) => {
                    if (isUnlocked && !video.isPlaceholder) {
                      e.currentTarget.style.borderColor = 'rgba(139, 30, 30, 0.3)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isUnlocked && !video.isPlaceholder) {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                  >
                    {/* Premium Video Thumbnail */}
                    {video.isPlaceholder ? (
                      <div style={{
                        width: '100px',
                        height: '65px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        position: 'relative',
                        flexShrink: 0,
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        background: '#e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <span style={{ fontSize: '1.5rem' }}>📄</span>
                      </div>
                    ) : (
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
                    )}

                    {/* Middle: Video info */}
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0a2342', margin: '0 0 0.25rem 0' }}>{video.title}</h4>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>
                        {video.isPlaceholder ? (
                          "Video & Quiz coming soon"
                        ) : (
                          (() => {
                            const checkpoints = VIDEO_CHECKPOINTS[video.id] || [];
                            if (checkpoints.length === 0) return "No checkpoints";
                            return `${checkpoints.length} Checkpoint${checkpoints.length === 1 ? '' : 's'} (at ${checkpoints.map(cp => cp.timestampLabel).join(' & ')})`;
                          })()
                        )}
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
                       ) : video.isPlaceholder ? (
                         <span style={{ 
                           background: '#fef3c7', 
                           color: '#d97706', 
                           fontSize: '0.75rem', 
                           fontWeight: '700', 
                           padding: '4px 10px', 
                           borderRadius: '20px',
                           display: 'inline-flex',
                           alignItems: 'center',
                           gap: '0.25rem',
                           border: '1px solid #fde68a'
                         }}>
                           ⏳ Coming Soon
                         </span>
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
                        color: video.isPlaceholder ? '#d97706' : '#ef4444', 
                        background: video.isPlaceholder ? 'rgba(217, 119, 6, 0.06)' : 'rgba(239, 68, 68, 0.06)', 
                        padding: '6px 12px', 
                        borderRadius: '20px',
                        border: video.isPlaceholder ? '1px solid rgba(217, 119, 6, 0.12)' : '1px solid rgba(239, 68, 68, 0.12)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}>
                        <CalendarIcon /> {video.isPlaceholder ? 'Available:' : 'Deadline:'} {video.deadline}
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
              <UploadIcon style={{ width: '18px', height: '18px', color: '#8b1e1e' }} /> Document Submissions
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Submit draft resolutions, research binders, or opening speeches to receive scoring.
            </p>
            
            <form onSubmit={handleSubmitDocument} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                  <option value="draft_resolution">Draft Resolution</option>
                  <option value="research_binder">Research Binder</option>
                  <option value="opening_speech">Opening Speech</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Paste Shared Document URL</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/file/d/..."
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem 0.8rem 2.5rem',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.85rem',
                      color: '#1e293b',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#8b1e1e'}
                    onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                  />
                  <span style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex', alignItems: 'center', color: '#64748b' }}><LinkIcon /></span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.1rem', lineHeight: '1.4' }}>
                  💡 Make sure link sharing settings in Google Drive are set to <strong>"Anyone with the link can view"</strong> so your mentors can grade it.
                </span>
              </div>

              <button 
                type="submit" 
                disabled={!linkUrl || !linkUrl.trim()} 
                style={{ 
                  width: '100%', 
                  padding: '0.85rem', 
                  borderRadius: '30px', 
                  background: (!linkUrl || !linkUrl.trim())
                    ? '#e2e8f0' 
                    : 'linear-gradient(90deg, #8b1e1e 0%, #a72828 100%)', 
                  color: (!linkUrl || !linkUrl.trim())
                    ? '#94a3b8' 
                    : '#ffffff', 
                  border: 'none', 
                  cursor: (!linkUrl || !linkUrl.trim()) ? 'not-allowed' : 'pointer', 
                  fontWeight: '700', 
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  transition: 'all 0.3s ease',
                  boxShadow: (linkUrl && linkUrl.trim()) ? '0 4px 12px rgba(139, 30, 30, 0.15)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (linkUrl && linkUrl.trim()) e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  if (linkUrl && linkUrl.trim()) e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Submit Document
              </button>
              
              {uploadMessage && (
                <p style={{ 
                  textAlign: 'center',
                  fontWeight: '600',
                  color: uploadMessage.toLowerCase().includes('success') 
                    ? '#16a34a' 
                    : uploadMessage.toLowerCase().includes('submitting')
                      ? '#3b82f6' 
                      : '#ef4444',
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
      {activeVideo && (() => {
        const isFullScreenActive = isFullScreenViewer || isFullscreen;
        return (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(10px)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isFullScreenActive ? '0' : '2rem',
            transition: 'all 0.3s ease'
          }}>
            <div
              ref={modalContainerRef}
              style={{
                background: isFullScreenActive ? '#000000' : '#ffffff',
                border: isFullScreenActive ? 'none' : '1px solid #cbd5e1',
                borderRadius: isFullScreenActive ? '0' : '24px',
                padding: isFullScreenActive ? '0' : '2rem',
                maxWidth: isFullScreenActive ? '100vw' : '1240px',
                width: isFullScreenActive ? '100vw' : '100%',
                height: isFullScreenActive ? '100vh' : 'auto',
                maxHeight: isFullScreenActive ? '100vh' : '90vh',
                overflow: 'hidden',
                boxShadow: isFullScreenActive ? 'none' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                position: 'relative',
                display: 'flex',
                gap: isSidebarOpen && !isFullScreenActive ? '2rem' : '0',
                flexWrap: 'nowrap',
                alignContent: 'start',
                alignItems: 'stretch',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>

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
                  top: '1.5rem',
                  right: isFullScreenActive ? '2.5rem' : '1.75rem',
                  background: isFullScreenActive ? 'rgba(15, 23, 42, 0.6)' : 'rgba(241, 245, 249, 0.8)',
                  backdropFilter: 'blur(4px)',
                  border: isFullScreenActive ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #cbd5e1',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isFullScreenActive ? '#ffffff' : '#64748b',
                  fontSize: '1.4rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  lineHeight: '1',
                  zIndex: 101,
                  opacity: isFullScreenActive && isPlaying && !isMouseActive ? 0 : 1,
                  pointerEvents: isFullScreenActive && isPlaying && !isMouseActive ? 'none' : 'auto',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ef4444';
                  e.currentTarget.style.background = isFullScreenActive ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2';
                  e.currentTarget.style.borderColor = isFullScreenActive ? '#ef4444' : '#fca5a5';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isFullScreenActive ? '#ffffff' : '#64748b';
                  e.currentTarget.style.background = isFullScreenActive ? 'rgba(15, 23, 42, 0.6)' : 'rgba(241, 245, 249, 0.8)';
                  e.currentTarget.style.borderColor = isFullScreenActive ? 'rgba(255, 255, 255, 0.2)' : '#cbd5e1';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                ×
              </button>

              {/* Left: Cinematic Video Player Column */}
              <div style={{ 
                flex: isSidebarOpen ? '1 1 70%' : '1 1 100%', 
                width: isSidebarOpen ? '70%' : '100%',
                display: 'flex', 
                flexDirection: 'column', 
                gap: isFullScreenActive ? '0' : '1rem',
                minWidth: 0,
                transition: 'all 0.3s ease',
                height: isFullScreenActive ? '100%' : 'auto'
              }}>
                {!isFullScreenActive ? (
                  <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.6rem', color: '#0a2342', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <PlayIcon style={{ width: '22px', height: '22px', color: '#8b1e1e' }} /> {activeVideo.title}
                  </h3>
                ) : (
                  <h3 style={{
                    position: 'absolute',
                    top: '1.5rem',
                    left: '2rem',
                    zIndex: 100,
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '1.5rem',
                    color: '#ffffff',
                    fontWeight: '800',
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                    pointerEvents: 'none',
                    opacity: isMouseActive || !isPlaying ? 1 : 0,
                    transition: 'opacity 0.4s ease'
                  }}>
                    <PlayIcon style={{ width: '20px', height: '20px', color: '#ff4a4a' }} /> {activeVideo.title}
                  </h3>
                )}
              
              <div 
                style={{ 
                  position: 'relative',
                  width: '100%',
                  height: isFullScreenActive ? '100%' : 0,
                  paddingBottom: isFullScreenActive ? '0' : '56.25%',
                  overflow: 'hidden',
                  borderRadius: isFullScreenActive ? '0' : '16px',
                  background: '#000000',
                  boxShadow: isFullScreenActive ? 'none' : '0 10px 25px rgba(0,0,0,0.15)',
                  flex: isFullScreenActive ? 1 : 'none'
                }}
              >
                <div id="csmun-yt-player" style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}></div>

                {/* Spectacular Custom Player Timeline Overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zIndex: 20,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0) 100%)',
                  padding: '2.5rem 1.5rem 1rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  transition: 'opacity 0.4s ease, visibility 0.4s ease',
                  opacity: isMouseActive || !isPlaying ? 1 : 0,
                  pointerEvents: isMouseActive || !isPlaying ? 'auto' : 'none',
                  boxSizing: 'border-box'
                }}>
                  {/* 1. Custom Play / Pause Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayPause();
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#ffffff',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'transform 0.2s ease',
                      width: '32px',
                      height: '32px',
                      outline: 'none'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                      </svg>
                    ) : (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    )}
                  </button>

                  {/* 2. Custom Rewind 10 Seconds Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (ytPlayer && typeof ytPlayer.getCurrentTime === 'function') {
                        const newTime = Math.max(0, ytPlayer.getCurrentTime() - 10);
                        ytPlayer.seekTo(newTime);
                      }
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#ffffff',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'transform 0.2s ease',
                      width: '32px',
                      height: '32px',
                      outline: 'none'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    title="Rewind 10s"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                      <path d="M3 3v5h5"/>
                      <text x="12" y="15.5" fontSize="8.5" fontWeight="900" fill="currentColor" textAnchor="middle" stroke="none" fontFamily="'Outfit', sans-serif">10</text>
                    </svg>
                  </button>

                  {/* 3. Playback Speed Button (cycles rate) */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (ytPlayer && typeof ytPlayer.setPlaybackRate === 'function') {
                        const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
                        const currentIdx = speeds.indexOf(playbackSpeed);
                        const nextSpeed = speeds[(currentIdx + 1) % speeds.length];
                        setPlaybackSpeed(nextSpeed);
                        ytPlayer.setPlaybackRate(nextSpeed);
                      }
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#ffffff',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: '800',
                      padding: '3px 7px',
                      borderRadius: '6px',
                      border: '1.5px solid rgba(255,255,255,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                      minWidth: '40px',
                      fontFamily: "'Outfit', sans-serif",
                      outline: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                      e.currentTarget.style.borderColor = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
                    }}
                    title="Speed"
                  >
                    {playbackSpeed}x
                  </button>

                  {/* 4. Timeline Progress Slider Track Container (Times above, droplets below) */}
                  <div style={{ 
                    flex: '1', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '0.15rem',
                    position: 'relative'
                  }}>
                    {/* Times sitting above */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      fontSize: '0.75rem', 
                      color: '#e2e8f0', 
                      fontWeight: '800',
                      fontFamily: 'monospace',
                      padding: '0 4px',
                      textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                    }}>
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>

                    {/* Progress slider bar target */}
                    <div style={{ 
                      position: 'relative', 
                      width: '100%', 
                      height: '14px', 
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      const newTime = (clickX / rect.width) * duration;
                      handleSeek(newTime);
                    }}
                    >
                      {/* Background Line */}
                      <div style={{
                        width: '100%',
                        height: '5px',
                        background: 'rgba(255, 255, 255, 0.35)',
                        borderRadius: '3px',
                        position: 'relative'
                      }}>
                        {/* Active Progress Blue Fill */}
                        <div style={{ 
                          position: 'absolute', 
                          top: 0, 
                          left: 0, 
                          height: '100%', 
                          width: `${Math.min(100, (currentTime / (duration || 1)) * 100)}%`, 
                          background: '#007aff', 
                          borderRadius: '3px',
                          transition: 'width 0.1s linear'
                        }} />

                        {/* Blue Thumb Indicator */}
                        <div style={{
                          position: 'absolute',
                          left: `${Math.min(100, (currentTime / (duration || 1)) * 100)}%`,
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: '#007aff',
                          border: '2px solid #ffffff',
                          boxShadow: '0 0 5px rgba(0,0,0,0.6)',
                          transition: 'left 0.1s linear, transform 0.1s ease',
                          cursor: 'pointer'
                        }} />
                      </div>
                    </div>

                    {/* Droplet Markers sitting below */}
                    <div style={{ 
                      position: 'relative', 
                      width: '100%', 
                      height: '16px', 
                      marginTop: '-2px'
                    }}>
                      {(VIDEO_CHECKPOINTS[activeVideo.id] || []).map((cp, idx) => {
                        const pct = (cp.timestamp / (duration || 237)) * 100;
                        const isCompleted = answeredCheckpoints.includes(cp.id);
                        const isWrong = wrongCheckpoints.includes(cp.id);
                        const markerColor = isWrong ? '#ef4444' : (isCompleted ? '#22c55e' : '#94a3b8');
                        
                        return (
                          <div 
                            key={cp.id}
                            style={{
                              position: 'absolute',
                              left: `${pct}%`,
                              top: '0',
                              transform: 'translateX(-50%)',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              cursor: 'pointer',
                              zIndex: 15
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSeek(cp.timestamp - 2);
                            }}
                            title={`Checkpoint ${idx + 1} (${cp.timestampLabel})`}
                          >
                            {/* Water drop shape */}
                            <svg width="14" height="14" viewBox="0 0 24 24" fill={markerColor} style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.8))' }}>
                              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                            </svg>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 5. Closed Captions CC Toggle Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (ytPlayer) {
                        if (isCaptionsOn) {
                          ytPlayer.unloadModule('captions');
                          setIsCaptionsOn(false);
                        } else {
                          ytPlayer.loadModule('captions');
                          setIsCaptionsOn(true);
                        }
                      }
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: isCaptionsOn ? '#007aff' : '#ffffff',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: '800',
                      padding: '3px 5px',
                      borderRadius: '5px',
                      border: `1.8px solid ${isCaptionsOn ? '#007aff' : 'rgba(255,255,255,0.4)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                      fontFamily: "'Outfit', sans-serif",
                      outline: 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!isCaptionsOn) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                        e.currentTarget.style.borderColor = '#ffffff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isCaptionsOn) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
                      }
                    }}
                    title="Captions"
                  >
                    CC
                  </button>

                  {/* 6. Volume Mute Toggle Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (ytPlayer) {
                        if (isMuted) {
                          ytPlayer.unMute();
                          setIsMuted(false);
                        } else {
                          ytPlayer.mute();
                          setIsMuted(true);
                        }
                      }
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#ffffff',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'transform 0.2s ease',
                      width: '32px',
                      height: '32px',
                      outline: 'none'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77zM4.34 2.93L2.93 4.34 7.59 9H3v6h4l5 5v-6.59l4.18 4.18c-.65.49-1.37.88-2.18 1.11v2.06c1.34-.3 2.57-.92 3.61-1.75l2.05 2.05 1.41-1.41L4.34 2.93zM10 15.17L7.83 13H5v-2h2.83l.88-.88L10 11.29v3.88z"/>
                      </svg>
                    ) : (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                      </svg>
                    )}
                  </button>

                  {/* 7. Sidebar Show / Hide Option Toggle Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsSidebarOpen(!isSidebarOpen);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#ffffff',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'transform 0.2s ease',
                      width: '32px',
                      height: '32px',
                      outline: 'none'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    title={isSidebarOpen ? "Hide Checklist Sidebar" : "Show Checklist Sidebar"}
                  >
                    {isSidebarOpen ? (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <line x1="14" y1="3" x2="14" y2="21" />
                        <path d="M10 15l-3-3 3-3" />
                      </svg>
                    ) : (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <line x1="14" y1="3" x2="14" y2="21" />
                        <path d="M7 9l3 3-3 3" />
                      </svg>
                    )}
                  </button>

                  {/* 8. HTML5 True Fullscreen Toggle Button */}
                  <button 
                    onClick={toggleHTML5Fullscreen}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#ffffff',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'transform 0.2s ease',
                      width: '32px',
                      height: '32px',
                      outline: 'none'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    title="Fullscreen"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Sidebar Checkpoint Quiz Column */}
            <div style={{ 
              flex: isSidebarOpen ? '1 1 30%' : '0 0 0%', 
              width: isSidebarOpen ? '30%' : '0%',
              opacity: isSidebarOpen ? 1 : 0,
              visibility: isSidebarOpen ? 'visible' : 'hidden',
              overflow: 'hidden',
              background: isFullScreenActive ? '#ffffff' : '#f8fafc', 
              border: isSidebarOpen ? (isFullScreenActive ? 'none' : '1px solid #cbd5e1') : 'none', 
              borderLeft: isSidebarOpen && isFullScreenActive ? '1px solid #e2e8f0' : 'none',
              borderRadius: isFullScreenActive ? '0' : '20px', 
              padding: isSidebarOpen ? (isFullScreenActive ? '2.5rem' : '1.75rem') : '0',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              boxSizing: 'border-box',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              minWidth: isSidebarOpen ? (isFullScreenActive ? '380px' : '300px') : '0',
              height: isFullScreenActive ? '100%' : 'auto',
              zIndex: 10
            }}>
              {activeCheckpoint ? (
                <>
                  <span style={{ 
                    background: '#fee2e2', 
                    color: '#8b1e1e', 
                    fontSize: '0.75rem', 
                    fontWeight: '800', 
                    padding: '4px 10px', 
                    borderRadius: '20px', 
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    alignSelf: 'start',
                    marginBottom: '1rem',
                    letterSpacing: '0.5px'
                  }}>
                    <AlertIcon /> VIDEO PAUSED (AT {activeCheckpoint.timestampLabel})
                  </span>

                  <form onSubmit={handleCheckpointSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <h4 style={{ fontSize: '1rem', color: '#0a2342', fontWeight: '800', margin: 0, lineHeight: '1.4' }}>
                      {activeCheckpoint.question}
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {activeCheckpoint.options.map((opt, idx) => {
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
                              name="checkpointOption" 
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
                      <div style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <AlertIcon /> {quizError}
                      </div>
                    )}

                    {quizSuccess && (
                      <div style={{ color: '#16a34a', fontSize: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <SuccessIcon /> Correct! Continuing playback...
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
                      Submit & Resume
                    </button>
                  </form>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                  {completedVideos.includes(activeVideo.id) ? (
                    <>
                      <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: '#d1fae5', color: '#10b981', marginBottom: '1rem' }}>
                        <SuccessIcon style={{ width: '40px', height: '40px' }} />
                      </div>
                      <h4 style={{ color: '#16a34a', fontSize: '1.2rem', fontWeight: '800', margin: '0 0 0.5rem 0' }}>Module Completed!</h4>
                      <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                        Excellent job! You have successfully answered all mid-video checkpoints and fully completed this training module!
                      </p>
                      <button
                        onClick={() => resetVideoProgress(activeVideo.id)}
                        style={{
                          padding: '0.6rem 1.25rem',
                          borderRadius: '20px',
                          background: '#fee2e2',
                          color: '#8b1e1e',
                          border: '1px solid #fee2e2',
                          cursor: 'pointer',
                          fontWeight: '700',
                          fontSize: '0.75rem',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 4px 12px rgba(139,30,30,0.1)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#8b1e1e';
                          e.currentTarget.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#fee2e2';
                          e.currentTarget.style.color = '#8b1e1e';
                        }}
                      >
                        Reset Progress
                      </button>
                    </>
                  ) : (
                    <>
                      <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: '50%', background: '#eff6ff', color: '#3b82f6', marginBottom: '0.5rem' }}>
                        <TvIcon style={{ width: '30px', height: '30px' }} />
                      </div>
                      <h4 style={{ color: '#0a2342', fontSize: '1.1rem', fontWeight: '800', margin: '0 0 0.5rem 0' }}>Active Playback</h4>
                      <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: '1.5', margin: '0 0 1.5rem 0' }}>
                        Watch the video in full. Playback will pause at <strong>1:50</strong> and <strong>2:50</strong>. Answer correctly to unlock this module!
                      </p>

                      {/* Checkpoint Status Indicator Checklist */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center', width: '100%' }}>
                        {(VIDEO_CHECKPOINTS[activeVideo.id] || []).map((cp, idx) => {
                          const isAns = answeredCheckpoints.includes(cp.id);
                          const isWr = wrongCheckpoints.includes(cp.id);
                          
                          let bg = '#f1f5f9';
                          let fg = '#64748b';
                          let borderStyle = '1px solid #cbd5e1';
                          let label = '⏳ Pending';
                          
                          if (isWr) {
                            bg = '#fee2e2';
                            fg = '#ef4444';
                            borderStyle = '1px solid #fca5a5';
                            label = '✗ Wrong';
                          } else if (isAns) {
                            bg = '#dcfce7';
                            fg = '#16a34a';
                            borderStyle = '1px solid #86efac';
                            label = '✓ Correct';
                          }
                          
                          return (
                            <div key={cp.id} style={{ 
                              background: bg,
                              color: fg,
                              padding: '0.65rem 1rem',
                              borderRadius: '12px',
                              fontSize: '0.8rem',
                              fontWeight: '700',
                              border: borderStyle,
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                              boxSizing: 'border-box'
                            }}>
                              <span>Checkpoint {idx + 1} ({cp.timestampLabel})</span>
                              <span>{label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
        );
      })()}

    </div>
  );
}
