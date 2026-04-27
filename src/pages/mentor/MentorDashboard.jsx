import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { collection, query, where, getDocs, updateDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';

export default function MentorDashboard() {
  const { currentUser, logout } = useAuth();
  const [delegates, setDelegates] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [newMeeting, setNewMeeting] = useState({ title: '', date: '', time: '', link: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Fetch delegates
    const qDelegates = query(collection(db, 'users'), where('role', '==', 'delegate'));
    const delSnapshot = await getDocs(qDelegates);
    setDelegates(delSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    // Fetch uploads
    const qUploads = query(collection(db, 'uploads'));
    const upSnapshot = await getDocs(qUploads);
    setUploads(upSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    // Fetch meetings
    const qMeetings = query(collection(db, 'meetings'), where('mentorUid', '==', currentUser.uid));
    const meetSnapshot = await getDocs(qMeetings);
    setMeetings(meetSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleAttendance = async (delegateId, status) => {
    // In a real app, this would be a subcollection or a specific document for the date.
    // For simplicity, we just log it or update the delegate's record here.
    alert(`Marked ${status} for delegate ${delegateId}`);
  };

  const scheduleMeeting = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, 'meetings'), {
      ...newMeeting,
      mentorUid: currentUser.uid,
      createdAt: serverTimestamp()
    });
    setNewMeeting({ title: '', date: '', time: '', link: '' });
    fetchData(); // Refresh list
  };

  const rankUpload = async (uploadId, rank) => {
    const uploadRef = doc(db, 'uploads', uploadId);
    await updateDoc(uploadRef, { rank: parseInt(rank, 10) });
    fetchData(); // Refresh list
  };

  return (
    <div className="dashboard-container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Mentor Dashboard</h2>
        <button onClick={logout} className="btn btn-secondary">Log Out</button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        
        {/* Attendance Section */}
        <div className="card" style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Delegate Attendance</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6' }}>Name</th>
                <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6' }}>Email</th>
                <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {delegates.map(del => (
                <tr key={del.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '0.75rem' }}>{del.name || 'N/A'}</td>
                  <td style={{ padding: '0.75rem' }}>{del.email}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <button onClick={() => handleAttendance(del.id, 'Present')} className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', marginRight: '0.5rem' }}>Present</button>
                    <button onClick={() => handleAttendance(del.id, 'Absent')} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }}>Absent</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Schedule Meetings Section */}
        <div className="card" style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Schedule Meeting</h3>
          <form onSubmit={scheduleMeeting} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <input type="text" placeholder="Title" required value={newMeeting.title} onChange={e => setNewMeeting({...newMeeting, title: e.target.value})} style={{ padding: '0.5rem' }} />
            <input type="date" required value={newMeeting.date} onChange={e => setNewMeeting({...newMeeting, date: e.target.value})} style={{ padding: '0.5rem' }} />
            <input type="time" required value={newMeeting.time} onChange={e => setNewMeeting({...newMeeting, time: e.target.value})} style={{ padding: '0.5rem' }} />
            <input type="url" placeholder="Meeting Link" required value={newMeeting.link} onChange={e => setNewMeeting({...newMeeting, link: e.target.value})} style={{ padding: '0.5rem' }} />
            <button type="submit" className="btn btn-primary">Schedule</button>
          </form>

          <h4 style={{ marginTop: '2rem' }}>Upcoming Meetings</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {meetings.map(m => (
              <li key={m.id} style={{ background: '#f8f9fa', padding: '1rem', marginBottom: '0.5rem', borderRadius: '4px' }}>
                <strong>{m.title}</strong> - {m.date} at {m.time} <br/>
                <a href={m.link} target="_blank" rel="noopener noreferrer">Join Link</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Rank Uploads Section */}
        <div className="card" style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Delegate Uploads</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6' }}>Delegate</th>
                <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6' }}>Type</th>
                <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6' }}>Document</th>
                <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6' }}>Current Rank</th>
                <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6' }}>Update Rank</th>
              </tr>
            </thead>
            <tbody>
              {uploads.map(up => (
                <tr key={up.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '0.75rem' }}>{up.delegateEmail}</td>
                  <td style={{ padding: '0.75rem' }}>{up.type.replace('_', ' ')}</td>
                  <td style={{ padding: '0.75rem' }}><a href={up.url} target="_blank" rel="noopener noreferrer">View</a></td>
                  <td style={{ padding: '0.75rem' }}>{up.rank || 'Unranked'}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <input 
                      type="number" 
                      min="1" 
                      placeholder="Rank" 
                      defaultValue={up.rank || ''}
                      onBlur={(e) => {
                        if (e.target.value) rankUpload(up.id, e.target.value);
                      }}
                      style={{ width: '60px', padding: '0.25rem' }}
                    />
                  </td>
                </tr>
              ))}
              {uploads.length === 0 && (
                <tr><td colSpan="5" style={{ padding: '1rem', textAlign: 'center' }}>No uploads found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
