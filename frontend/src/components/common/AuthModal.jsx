import { useState } from 'react';
import axios from 'axios';
import { ui } from '../../utils/constants';

export default function AuthModal({ showAuth, setShowAuth, handleSuccessfulAuth, API_BASE }) {
  const [authMode, setAuthMode] = useState('login'); // 'login', 'signup', or 'forgot'
  
  // Form fields
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState(''); // Email or Phone
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Forgot Password flow fields
  const [resetStep, setResetStep] = useState(1); // 1: Request code, 2: Enter code & new pass
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  if (!showAuth) return null;

  const handleLoginSignup = async (e) => {
    e.preventDefault();
    const isLogin = authMode === 'login';
    const endpoint = isLogin ? '/api/login' : '/api/signup';
    
    const payload = isLogin 
      ? { identifier, password } 
      : { name, email, phone, password };

    try {
      const res = await axios.post(`${API_BASE}${endpoint}`, payload);
      if (isLogin) {
        handleSuccessfulAuth({
          token: res.data.token,
          name: res.data.name || identifier.split('@')[0],
          email: res.data.email || (identifier.includes('@') ? identifier : ''),
          phone: res.data.phone || (!identifier.includes('@') ? identifier : '')
        });
      } else {
        alert("Account created successfully! Please sign in.");
        setAuthMode('login');
      }
    } catch (err) {
      alert(err.response?.data?.message || "Authentication failed. Please verify your credentials.");
    }
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/api/auth/forgot-password`, { identifier });
      setResetStep(2);
      alert(`Password reset code generated. (Dev Code: ${res.data.debugCode || 'Check terminal'})`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to process reset request.");
    }
  };

  const handleConfirmReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/api/auth/reset-password`, { identifier, code: resetCode, newPassword });
      alert("Password successfully reset! Please sign in with your new password.");
      setAuthMode('login');
      setResetStep(1);
      setResetCode('');
      setNewPassword('');
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#02040c] border border-white/15 rounded-3xl p-8 max-w-md w-full relative shadow-[0_25px_60px_rgba(0,0,0,0.9)] space-y-6 animate-fadeIn">
        
        <button 
          onClick={() => { setShowAuth(false); setAuthMode('login'); setResetStep(1); }}
          className="absolute top-5 right-5 text-lg font-bold text-gray-400 hover:text-white cursor-pointer"
        >
          ✕
        </button>

        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#3b60e4] font-semibold">Bhairavi Atelier</span>
          <h3 className="font-serif text-2xl font-normal text-white">
            {authMode === 'forgot' ? 'Reset Password' : authMode === 'login' ? 'Sign In' : 'Create Account'}
          </h3>
        </div>

        {authMode !== 'forgot' ? (
          <>
            <div className="flex border-b border-white/10 pb-2 text-xs uppercase tracking-widest justify-center gap-6">
              <button onClick={() => setAuthMode('login')} className={`pb-1 transition-all cursor-pointer ${authMode === 'login' ? 'font-bold border-b-2 border-[#3b60e4] text-white' : 'text-gray-400 hover:text-white'}`}>
                Sign In
              </button>
              <button onClick={() => setAuthMode('signup')} className={`pb-1 transition-all cursor-pointer ${authMode === 'signup' ? 'font-bold border-b-2 border-[#3b60e4] text-white' : 'text-gray-400 hover:text-white'}`}>
                Register
              </button>
            </div>

            <form onSubmit={handleLoginSignup} className="space-y-4">
              {authMode === 'signup' && (
                <>
                  <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#02040c]/90 border border-white/20 px-4 py-3 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#3b60e4]" required />
                  <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#02040c]/90 border border-white/20 px-4 py-3 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#3b60e4]" required />
                  <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-[#02040c]/90 border border-white/20 px-4 py-3 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#3b60e4]" required />
                </>
              )}

              {authMode === 'login' && (
                <input type="text" placeholder="Email Address or Phone Number" value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="w-full bg-[#02040c]/90 border border-white/20 px-4 py-3 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#3b60e4]" required />
              )}

              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#02040c]/90 border border-white/20 px-4 py-3 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#3b60e4]" required />

              <button type="submit" className="w-full py-3.5 text-xs uppercase tracking-[0.2em] bg-[#1c39bb] hover:bg-[#3b60e4] text-white font-medium rounded-xl transition-all shadow-xl cursor-pointer border border-blue-400/40">
                {authMode === 'login' ? 'Sign In to Atelier' : 'Register Account'}
              </button>

              {authMode === 'login' && (
                <div className="text-center pt-1">
                  <button type="button" onClick={() => setAuthMode('forgot')} className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-white transition-colors cursor-pointer">
                    Forgot Password?
                  </button>
                </div>
              )}
            </form>
          </>
        ) : (
          <div className="space-y-4">
            {resetStep === 1 ? (
              <form onSubmit={handleRequestReset} className="space-y-4">
                <p className="text-xs text-center text-gray-300 font-serif">Enter your registered Email or Phone Number to receive a password reset code.</p>
                <input type="text" placeholder="Email or Phone Number" value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="w-full bg-[#02040c]/90 border border-white/20 px-4 py-3 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#3b60e4]" required />
                <button type="submit" className="w-full py-3.5 text-xs uppercase tracking-[0.2em] bg-[#1c39bb] hover:bg-[#3b60e4] text-white font-medium rounded-xl transition-all shadow-xl cursor-pointer border border-blue-400/40">
                  Send Reset Code
                </button>
                <button type="button" onClick={() => setAuthMode('login')} className="w-full text-center text-[10px] text-gray-400 uppercase tracking-widest hover:text-white pt-2 cursor-pointer">
                  Back to Sign In
                </button>
              </form>
            ) : (
              <form onSubmit={handleConfirmReset} className="space-y-4">
                <p className="text-xs text-center text-gray-300 font-serif">Enter the 4-digit reset code and your new password.</p>
                <input type="text" maxLength={4} placeholder="• • • •" value={resetCode} onChange={(e) => setResetCode(e.target.value)} className="w-full bg-[#02040c]/90 border border-white/20 px-4 py-3 rounded-xl text-center text-lg font-mono text-white placeholder-gray-500 focus:outline-none focus:border-[#3b60e4] tracking-widest" required />
                <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-[#02040c]/90 border border-white/20 px-4 py-3 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#3b60e4]" required />
                <button type="submit" className="w-full py-3.5 text-xs uppercase tracking-[0.2em] bg-[#1c39bb] hover:bg-[#3b60e4] text-white font-medium rounded-xl transition-all shadow-xl cursor-pointer border border-blue-400/40">
                  Update Password
                </button>
                <button type="button" onClick={() => setResetStep(1)} className="w-full text-center text-[10px] text-gray-400 uppercase tracking-widest hover:text-white pt-2 cursor-pointer">
                  Back
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
}