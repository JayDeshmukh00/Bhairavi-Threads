import { motion, AnimatePresence } from 'framer-motion';

export default function AuthModal({ showAuth, setShowAuth, isLoginView, setIsLoginView, handleAuth, email, setEmail, password, setPassword }) {
  if (!showAuth) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[90] flex items-center justify-center p-5 bg-black/40 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowAuth(false)}
      >
        <motion.div
          className="w-full max-w-md bg-white border border-black/10 rounded-2xl shadow-xl overflow-hidden text-[#1a1a1a]"
          initial={{ opacity: 0, y: 28, scale: .97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: .98 }}
          transition={{ duration: .25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-8 pt-8 pb-6 border-b border-black/5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="saree-brand-title-dark" style={{ fontSize: '12px' }}>BHAIRAVI THREADS</span>
                <h2 className="mt-3 text-2xl font-serif font-normal text-[#1a1a1a]">
                  {isLoginView ? 'Welcome back.' : 'Begin your story.'}
                </h2>
                <p className="mt-2 text-xs text-[#666] font-normal">
                  {isLoginView ? 'Sign in to continue your textile journey.' : 'Create your Bhairavi Threads account.'}
                </p>
              </div>
              <button type="button" onClick={() => setShowAuth(false)} className="text-xl leading-none text-[#666] hover:text-[#1a1a1a]">×</button>
            </div>

            <div className="mt-6 grid grid-cols-2 rounded-full border border-black/10 p-1 bg-[#fafafa]">
              <button
                type="button"
                onClick={() => setIsLoginView(true)}
                className={`rounded-full py-2.5 text-[10px] font-semibold uppercase tracking-[0.15em] transition-all ${isLoginView ? 'bg-[#1a1a1a] text-white shadow-xs' : 'text-[#666] hover:text-[#1a1a1a]'}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setIsLoginView(false)}
                className={`rounded-full py-2.5 text-[10px] font-semibold uppercase tracking-[0.15em] transition-all ${!isLoginView ? 'bg-[#1a1a1a] text-white shadow-xs' : 'text-[#666] hover:text-[#1a1a1a]'}`}
              >
                Sign Up
              </button>
            </div>
          </div>

          <form onSubmit={handleAuth} className="p-8 space-y-5">
            <div>
              <label className="block mb-2 text-[10px] uppercase tracking-[0.15em] font-semibold text-[#777]">Email</label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border-b border-black/15 bg-white px-0 py-3 text-sm text-[#1a1a1a] outline-none placeholder:text-[#888] focus:border-[#1a1a1a]"
              />
            </div>
            <div>
              <label className="block mb-2 text-[10px] uppercase tracking-[0.15em] font-semibold text-[#777]">Password</label>
              <input
                type="password"
                autoComplete={isLoginView ? "current-password" : "new-password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full border-b border-black/15 bg-white px-0 py-3 text-sm text-[#1a1a1a] outline-none placeholder:text-[#888] focus:border-[#1a1a1a]"
              />
            </div>
            <button type="submit" className="w-full rounded-full bg-[#1a1a1a] hover:bg-[#333333] text-white py-4 text-[10px] font-semibold uppercase tracking-[0.2em] transition-all shadow-md hover:shadow-lg mt-4">
              {isLoginView ? 'Login to Bhairavi Threads' : 'Create Account'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}