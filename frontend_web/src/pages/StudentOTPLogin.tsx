import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Phone, Key, Loader2, GraduationCap } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const StudentOTPLogin = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/send-otp`, { phone, role: 'student' });
      setOtpSent(true);
      if (res.data.mockOtp) {
        setOtp(res.data.mockOtp);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/verify-otp`, { phone, otp });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/student/search');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <GraduationCap size={48} color="var(--primary)" />
          <h2>Student Portal</h2>
          <p className="auth-subtitle">
            {otpSent ? 'Enter the 6-digit code sent to your phone' : 'Enter your phone number to login'}
          </p>
        </div>
        
        {error && <div className="error-alert">{error}</div>}
        
        {!otpSent ? (
          <form onSubmit={handleSendOTP}>
            <div className="form-group">
              <label>Phone Number</label>
              <div className="input-with-icon">
                <Phone size={18} />
                <input 
                  type="tel" 
                  placeholder="+91 00000 00000" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required 
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <div className="form-group">
              <label>Enter OTP</label>
              <div className="input-with-icon">
                <Key size={18} />
                <input 
                  type="text" 
                  placeholder="000000" 
                  maxLength={6}
                  style={{ letterSpacing: '8px', fontSize: '1.2rem', textAlign: 'center' }}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required 
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : 'Verify & Login'}
            </button>
            <button 
              type="button" 
              className="btn btn-block" 
              style={{ marginTop: '0.5rem', background: 'transparent', color: 'var(--text-muted)' }}
              onClick={() => setOtpSent(false)}
            >
              Change Phone Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default StudentOTPLogin;
