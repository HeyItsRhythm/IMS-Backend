import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, KeyRound, Layers, UserRound, Mail, Lock, Menu } from 'lucide-react';
import emailjs from 'emailjs-com';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userOtp, setUserOtp] = useState('');
  const [pendingUser, setPendingUser] = useState(null);
  
  const { login, finalizeLogin, verifyUserEmail, token } = useAuth();
  const navigate = useNavigate();
  const savedStudentProfile = JSON.parse(localStorage.getItem('ims_studentProfile') || 'null');

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      // Admin bypasses OTP. Verified users bypass OTP.
      // (Using strictly false so older existing accounts don't get locked out)
      if (user.role === 'admin' || user.isVerified !== false) {
        finalizeLogin(user);
        navigate('/');
        return;
      }
      
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otp);
      setPendingUser(user);

      // --- EMAILJS CONFIGURATION ---
      const SERVICE_ID = 'service_f8lquk8';
      const TEMPLATE_ID = 'template_t3vk7uu';
      const PUBLIC_KEY = '-c6vzS6kgWs4oVRJX';

      try {
        await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
          to_email: email,
          otp_code: otp,
          to_name: user.name
        }, PUBLIC_KEY);
      } catch (err) {
        console.error("EmailJS sending failed:", err);
        console.log("PRESENTATION OTP FALLBACK: " + otp);
        alert("EmailJS Failed to send the email.\nError: " + (err.text || err.message) + "\n\nFallback OTP for testing: " + otp);
      }

      setStep(2);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (userOtp.trim() === generatedOtp.trim()) {
      try {
        await verifyUserEmail(pendingUser.id);
        const verifiedUser = { ...pendingUser, isVerified: true };
        finalizeLogin(verifiedUser, token);
        navigate('/');
      } catch (err) {
        const message = err?.message || err || 'Error verifying email. Please try again.';
        setError(`Verification failed: ${message}`);
        console.error('verifyUserEmail error', err);
      }
    } else {
      setError('Invalid OTP code. Please try again.');
    }
  };

  return (
    <div className="login-page-bg">
      <div className="login-card">
        {/* Left Panel */}
        <div className="login-left">
          <div className="login-logo">
            <Layers size={24} color="#4F46E5" />
            Template Design
          </div>
          
          <div className="login-form-container">
            {step === 1 ? (
              <>
                <div className="login-avatar">
                  <UserRound size={40} />
                </div>
                
                {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center', fontSize: '0.85rem' }}>{error}</div>}
                
                <form onSubmit={handleCredentialsSubmit} style={{ width: '100%' }}>
                  <div className="login-input-group">
                    <UserRound size={18} />
                    <input 
                      type="email" 
                      className="login-input" 
                      placeholder="USERNAME"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                  
                  <div className="login-input-group">
                    <Lock size={18} />
                    <input 
                      type="password" 
                      className="login-input" 
                      placeholder="********"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                  </div>
                  
                  <button type="submit" className="login-submit-btn">
                    Login
                  </button>
                  
                  <div className="login-actions">
                    <label className="login-checkbox">
                      <input type="checkbox" /> Remember me
                    </label>
                    <Link to="/forgot-password" className="login-forgot">Forgot your password?</Link>
                  </div>
                </form>
              </>
            ) : (
              <>
                <div className="login-avatar">
                  <KeyRound size={40} />
                </div>
                
                <h3 style={{ marginBottom: '1rem', textAlign: 'center', fontWeight: '800' }}>Verify Email</h3>
                <p style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  We've sent a 6-digit code to <strong>{email}</strong>.
                </p>
                {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center', fontSize: '0.85rem' }}>{error}</div>}
                
                <form onSubmit={handleOtpSubmit} style={{ width: '100%' }}>
                  <div className="login-input-group">
                    <KeyRound size={18} />
                    <input 
                      type="text" 
                      maxLength={6}
                      className="login-input" 
                      placeholder="ENTER OTP"
                      style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '1.1rem', fontWeight: 'bold' }}
                      value={userOtp}
                      onChange={(e) => setUserOtp(e.target.value)}
                      required 
                    />
                  </div>
                  
                  <button type="submit" className="login-submit-btn">
                    Verify & Login
                  </button>
                  
                  <button 
                    type="button" 
                    className="login-submit-btn" 
                    style={{ backgroundColor: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', marginTop: '1rem' }}
                    onClick={() => { setStep(1); setError(''); setUserOtp(''); }}
                  >
                    Back to Login
                  </button>
                </form>
              </>
            )}
          </div>
          
          <div className="login-dots">
            <div className="login-dot active"></div>
            <div className="login-dot"></div>
            <div className="login-dot"></div>
          </div>
        </div>
        
        {/* Right Panel */}
        <div className="login-right">
          <div className="login-nav">
            <Link to="/register" className="login-nav-btn">SIGN UP</Link>
            <Menu size={24} style={{ cursor: 'pointer' }} />
          </div>
          
          <div className="login-welcome-container">
            <h1 className="login-welcome-title">Welcome.</h1>
            <p className="login-welcome-text">
              Log in to access your internship management dashboard. Manage your applications, track progress, and connect with companies seamlessly.
            </p>
          </div>
          
          <div className="login-signup-link">
            Not a member? <Link to="/register">Sign up now</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
