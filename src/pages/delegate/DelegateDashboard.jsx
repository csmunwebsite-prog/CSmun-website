import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db, storage } from '../../firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const TRAINING_VIDEOS = [
  { id: 'v1', title: 'Introduction to MUN', url: 'https://www.youtube.com/embed/dummy1' },
  { id: 'v2', title: 'Rules of Procedure', url: 'https://www.youtube.com/embed/dummy2' },
  { id: 'v3', title: 'How to Write a Position Paper', url: 'https://www.youtube.com/embed/dummy3' }
];

export default function DelegateDashboard() {
  const { currentUser, userData, logout } = useAuth();
  const [completedVideos, setCompletedVideos] = useState([]);
  const [uploadType, setUploadType] = useState('position_paper');
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState('');

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
    <div className="dashboard-container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ marginBottom: '0.25rem' }}>Welcome, {userData?.name || (currentUser?.displayName || 'Delegate').split(' ')[0]}!</h2>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Delegate Portal — {userData?.grade ? `Grade ${userData.grade}` : 'Profile Incomplete'}</p>
        </div>
        <button onClick={logout} className="btn btn-secondary">Log Out</button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Training Section */}
        <div className="card" style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Training Progress</h3>
          <div style={{ background: '#e0e0e0', borderRadius: '10px', height: '20px', margin: '1rem 0' }}>
            <div style={{ background: '#007bff', height: '100%', borderRadius: '10px', width: `${progressPercentage}%`, transition: 'width 0.3s' }}></div>
          </div>
          <p>{progressPercentage}% Completed ({completedVideos.length}/{TRAINING_VIDEOS.length})</p>

          <div style={{ marginTop: '2rem' }}>
            {TRAINING_VIDEOS.map(video => (
              <div key={video.id} style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #eee', borderRadius: '5px' }}>
                <h4>{video.title}</h4>
                <div style={{ background: '#ccc', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', borderRadius: '4px' }}>
                  [Video Player Placeholder]
                </div>
                {completedVideos.includes(video.id) ? (
                  <span style={{ color: 'green', fontWeight: 'bold' }}>✓ Completed</span>
                ) : (
                  <button onClick={() => markCompleted(video.id)} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Mark as Completed</button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upload Section */}
        <div className="card" style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Document Upload</h3>
          <p>Submit your Position Paper or Draft Resolution here.</p>
          
          <form onSubmit={handleUpload} style={{ marginTop: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label>Document Type:</label>
              <select value={uploadType} onChange={(e) => setUploadType(e.target.value)} style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}>
                <option value="position_paper">Position Paper</option>
                <option value="draft_resolution">Draft Resolution</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label>Select File:</label>
              <input type="file" onChange={(e) => setFile(e.target.files[0])} style={{ display: 'block', marginTop: '0.5rem' }} />
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <p>Uploading: {Math.round(uploadProgress)}%</p>
            )}

            <button type="submit" disabled={!file || (uploadProgress > 0 && uploadProgress < 100)} className="btn btn-primary">
              Upload Document
            </button>
            
            {uploadMessage && <p style={{ marginTop: '1rem', color: uploadMessage.includes('success') ? 'green' : 'red' }}>{uploadMessage}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
