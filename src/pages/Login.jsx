import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider, signInWithPopup } from '../firebase';
import { useAppContext } from '../context/AppContext';

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAppContext();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      navigate('/onboarding');
    } catch (err) {
      console.error(err);
      setError('Failed to log in with Google. ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Allows proceeding offline / without auth
    navigate('/onboarding');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '40px 20px', backgroundColor: 'var(--bg-color)', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', color: 'var(--primary-dark)', marginBottom: '8px' }}>WiseBite</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Wellness and Goodness by Yoosa</p>
      </div>

      <div className="card" style={{ width: '100%', maxWidth: '360px', textAlign: 'center', padding: '32px 20px' }}>
        <h2 style={{ marginBottom: '24px', fontSize: '24px' }}>Welcome Back</h2>
        
        {error && <div style={{ color: 'var(--error)', fontSize: '14px', marginBottom: '16px' }}>{error}</div>}

        <button 
          className="btn" 
          onClick={handleGoogleLogin} 
          disabled={loading}
          style={{ backgroundColor: '#fff', color: '#333', border: '1px solid #ddd', marginBottom: '16px' }}
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" style={{ width: '20px', height: '20px' }} />
          Continue with Google
        </button>

        <div style={{ margin: '20px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>OR</div>

        <button className="btn btn-secondary" onClick={handleSkip}>
          Skip for now
        </button>
      </div>
    </div>
  );
}
