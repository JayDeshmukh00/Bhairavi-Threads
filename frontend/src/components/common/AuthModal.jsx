import { useState } from 'react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

// Added showAlert to the destructured props list
export default function AuthModal({ showAuth, setShowAuth, handleSuccessfulAuth, API_BASE, showAlert }) {
  const [authMode, setAuthMode] = useState('login'); // 'login', 'signup', or 'forgot'

  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState(''); // Email or Phone
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [resetStep, setResetStep] = useState(1);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  if (!showAuth) return null;

  // Reset all form fields when closing
  const closeModal = () => {
    setShowAuth(false);
    setAuthMode('login');
    setResetStep(1);
    // Clear fields
    setName('');
    setIdentifier('');
    setPhone('');
    setEmail('');
    setPassword('');
    setResetCode('');
    setNewPassword('');
  };

  // Use custom showAlert instead of browser alert()
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
        // showAlert('Welcome back!', 'success'); // handleSuccessfulAuth already shows welcome
      } else {
        // Success alert
        showAlert("Account created successfully! Please sign in.", "success");
        setAuthMode('login');
        setPassword(''); // Clear password field for login
      }
    } catch (err) {
      // Error alert
      showAlert(err.response?.data?.message || "Authentication failed. Please verify your credentials.", "error");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const tokenParts = credentialResponse.credential.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));

      const res = await axios.post(`${API_BASE}/api/auth/google`, {
        name: payload.name,
        email: payload.email,
        googleId: payload.sub
      });

      handleSuccessfulAuth({
        token: res.data.token,
        name: res.data.name,
        email: res.data.email,
        phone: res.data.phone || ''
      });
    } catch (err) {
      showAlert("Google sign-in verification failed.", "error");
    }
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/api/auth/forgot-password`, { identifier });
      setResetStep(2);
      // Dev code alert
      showAlert(`Password reset code generated. (Dev Code: ${res.data.debugCode || 'Check terminal'})`, "success");
    } catch (err) {
      showAlert(err.response?.data?.message || "Failed to process reset request. Please confirm your number/email is registered.", "error");
    }
  };

  const handleConfirmReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/api/auth/reset-password`, { identifier, code: resetCode, newPassword });
      showAlert("Password successfully reset! Please sign in with your new password.", "success");
      setAuthMode('login');
      setResetStep(1);
      setResetCode('');
      setNewPassword('');
    } catch (err) {
      showAlert(err.response?.data?.message || "Failed to reset password.", "error");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#f9f8f6]/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md w-full relative shadow-[0_20px_50px_rgba(0,0,0,0.08)] space-y-6">

        <button
          onClick={closeModal}
          className="absolute top-5 right-5 text-lg font-bold text-gray-400 hover:text-black cursor-pointer"
        >
          ✕
        </button>

        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-semibold">Bhairavi Atelier</span>
          <h3 className="font-serif text-2xl font-normal text-gray-900">
            {authMode === 'forgot' ? 'Reset Password' : authMode === 'login' ? 'Sign In' : 'Create Account'}
          </h3>
        </div>

        {authMode !== 'forgot' ? (
          <>
            <div className="flex border-b border-gray-200 pb-2 text-xs uppercase tracking-widest justify-center gap-6">
              <button onClick={() => setAuthMode('login')} className={`pb-1 transition-all cursor-pointer ${authMode === 'login' ? 'font-bold border-b-2 border-black text-gray-900' : 'text-gray-400 hover:text-black'}`}>
                Sign In
              </button>
              <button onClick={() => setAuthMode('signup')} className={`pb-1 transition-all cursor-pointer ${authMode === 'signup' ? 'font-bold border-b-2 border-black text-gray-900' : 'text-gray-400 hover:text-black'}`}>
                Register
              </button>
            </div>

            {/* Google Sign In Button */}
            <div className="flex justify-center pt-2 w-full">
              <div className="w-full flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => showAlert('Google Sign In Failed', 'error')}
                  theme="outline"
                  shape="pill"
                  width="100%"
                />
              </div>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-[9px] uppercase tracking-widest text-gray-400">or with atelier credentials</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <form onSubmit={handleLoginSignup} className="space-y-4">
              {authMode === 'signup' && (
                <>
                  <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#f9f8f6] border border-gray-200 px-4 py-3 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black" required />
                  <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#f9f8f6] border border-gray-200 px-4 py-3 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black" required />
                  <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-[#f9f8f6] border border-gray-200 px-4 py-3 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black" required />
                </>
              )}

              {authMode === 'login' && (
                <input type="text" placeholder="Email Address or Phone Number" value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="w-full bg-[#f9f8f6] border border-gray-200 px-4 py-3 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black" required />
              )}

              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#f9f8f6] border border-gray-200 px-4 py-3 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black" required />

              <button type="submit" className="w-full py-3.5 text-xs uppercase tracking-[0.2em] bg-black hover:bg-neutral-800 text-white font-medium rounded-xl transition-all shadow-md cursor-pointer">
                {authMode === 'login' ? 'Sign In to Atelier' : 'Register Account'}
              </button>

              {authMode === 'login' && (
                <div className="text-center pt-1">
                  <button type="button" onClick={() => setAuthMode('forgot')} className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-black transition-colors cursor-pointer">
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
                <p className="text-xs text-center text-gray-600 font-serif">Enter your registered Email or Phone Number to receive a password reset code.</p>
                <input type="text" placeholder="Email or Phone Number" value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="w-full bg-[#f9f8f6] border border-gray-200 px-4 py-3 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black" required />
                <button type="submit" className="w-full py-3.5 text-xs uppercase tracking-[0.2em] bg-black hover:bg-neutral-800 text-white font-medium rounded-xl transition-all shadow-md cursor-pointer">
                  Send Reset Code
                </button>
                <button type="button" onClick={() => setAuthMode('login')} className="w-full text-center text-[10px] text-gray-500 uppercase tracking-widest hover:text-black pt-2 cursor-pointer">
                  Back to Sign In
                </button>
              </form>
            ) : (
              <form onSubmit={handleConfirmReset} className="space-y-4">
                <p className="text-xs text-center text-gray-600 font-serif">Enter the 4-digit reset code and your new password.</p>
                <input type="text" maxLength={4} placeholder="• • • •" value={resetCode} onChange={(e) => setResetCode(e.target.value)} className="w-full bg-[#f9f8f6] border border-gray-200 px-4 py-3 rounded-xl text-center text-lg font-mono text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black tracking-widest" required />
                <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-[#f9f8f6] border border-gray-200 px-4 py-3 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black" required />
                <button type="submit" className="w-full py-3.5 text-xs uppercase tracking-[0.2em] bg-black hover:bg-neutral-800 text-white font-medium rounded-xl transition-all shadow-md cursor-pointer">
                  Update Password
                </button>
                <button type="button" onClick={() => setResetStep(1)} className="w-full text-center text-[10px] text-gray-500 uppercase tracking-widest hover:text-black pt-2 cursor-pointer">
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