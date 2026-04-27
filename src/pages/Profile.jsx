import { useNavigate } from 'react-router-dom';
import { LogOut, RefreshCcw } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { auth, signOut } from '../firebase';

export default function Profile() {
  const { userData, user, resetData } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      if (user) {
        await signOut(auth);
      }
      resetData();
      navigate('/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const age = userData?.dob ? new Date().getFullYear() - userData.dob.year : 25;

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <h2 style={{ marginBottom: '24px' }}>Profile</h2>

      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>
          {user?.displayName ? user.displayName.charAt(0) : 'W'}
        </div>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{user?.displayName || 'WiseBite User'}</div>
          <div style={{ color: 'var(--text-secondary)' }}>{user?.email || 'Guest Mode'}</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '16px', color: 'var(--text-secondary)' }}>Health Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{userData?.height || 170}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Height (cm)</div>
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{userData?.weight || 70}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Weight (kg)</div>
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{age}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Age</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <div style={{ padding: '4px 12px', backgroundColor: 'rgba(0, 230, 118, 0.1)', color: 'var(--primary-dark)', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold' }}>
            Goal: {userData?.goal || 'Maintain'}
          </div>
          <div style={{ padding: '4px 12px', backgroundColor: 'rgba(0, 230, 118, 0.1)', color: 'var(--primary-dark)', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold' }}>
            Diet: {userData?.diet || 'Classic'}
          </div>
        </div>
      </div>

      <button className="btn btn-secondary" style={{ marginBottom: '16px', justifyContent: 'flex-start' }} onClick={() => navigate('/onboarding')}>
        <RefreshCcw size={20} /> Recalculate Targets
      </button>

      <button className="btn btn-secondary" style={{ color: 'var(--error)', border: '1px solid var(--error)', justifyContent: 'flex-start' }} onClick={handleLogout}>
        <LogOut size={20} /> Reset & Logout
      </button>

    </div>
  );
}
