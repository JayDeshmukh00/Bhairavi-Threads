import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ 
  currentTab, setCurrentTab, 
  token, userName, userEmail, isAdmin,
  wishlistCount, cartCount, 
  onLogout, onOpenAuth,
  onGoToLanding, categories 
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  
  const menuRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlayingAudio) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((err) => console.log("Audio play blocked:", err));
      }
      setIsPlayingAudio(!isPlayingAudio);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#000103]/90 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
      <audio ref={audioRef} loop src="/music/music.mp3" />

      <div className="w-[94%] max-w-[1600px] mx-auto py-3.5 flex flex-col gap-2.5">
        
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-white/5 pb-2.5 relative">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="cursor-pointer flex items-center gap-2 group" 
            onClick={onGoToLanding}
          >
            {/* Cursive Luxury Title */}
            <h1 className="text-xl lg:text-2xl font-serif italic font-normal tracking-wide text-white group-hover:text-[#3b60e4] transition-colors">
              Bhairavi<span className="text-[#3b60e4] font-light not-italic ml-1">.threads</span>
            </h1>
          </motion.div>

          <div className="flex items-center gap-2.5">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleAudio}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] uppercase tracking-wider transition-all cursor-pointer backdrop-blur-md ${isPlayingAudio ? 'bg-[#1c39bb]/50 border-blue-400 text-white shadow-[0_0_15px_rgba(28,57,187,0.6)]' : 'bg-white/5 border-white/15 text-gray-300 hover:bg-white/10'}`}
            >
              <span className={`flex items-center gap-0.5 h-3 ${isPlayingAudio ? 'animate-pulse' : ''}`}>
                <span className="w-0.5 h-2 bg-current rounded-full animate-bounce" />
                <span className="w-0.5 h-3 bg-current rounded-full animate-bounce" />
              </span>
              <span className="hidden sm:inline font-mono">{isPlayingAudio ? 'Playing ♫' : 'Sound'}</span>
            </motion.button>

            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentTab('cart')} 
              className="text-xs uppercase tracking-[0.15em] text-gray-300 hover:text-white flex items-center gap-2 bg-white/5 backdrop-blur-xl px-3.5 py-1.5 rounded-full border border-white/10 hover:border-[#3b60e4]/40 transition-all cursor-pointer"
            >
              <span>Bag</span>
              <span className="bg-[#1c39bb] text-white px-2 py-0.5 rounded-full text-[10px] font-bold">{cartCount}</span>
            </motion.button>

            <div className="relative" ref={menuRef}>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-9 h-9 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-sm text-white hover:border-[#3b60e4]/40 transition-all cursor-pointer"
              >
                {menuOpen ? '✕' : '☰'}
              </motion.button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-3 w-72 rounded-2xl py-4 px-3 z-50 flex flex-col gap-1.5 text-xs uppercase tracking-[0.15em] bg-[#02040c]/95 border border-white/15 backdrop-blur-2xl shadow-2xl"
                  >
                    {token ? (
                      <>
                        <div className="px-4 py-2 border-b border-white/10 mb-1 text-[10px] text-gray-400">
                          User <span className="font-semibold text-blue-300 block text-xs truncate">{userName || userEmail}</span>
                        </div>
                        <button onClick={() => { setCurrentTab('profile'); setMenuOpen(false); }} className="text-left px-4 py-2 rounded-xl hover:bg-white/10 text-gray-200 cursor-pointer">Profile</button>
                        <button onClick={() => { setCurrentTab('my-orders'); setMenuOpen(false); }} className="text-left px-4 py-2 rounded-xl hover:bg-white/10 text-gray-200 cursor-pointer">Orders</button>
                        <button onClick={() => { setCurrentTab('wishlist'); setMenuOpen(false); }} className="text-left px-4 py-2 rounded-xl flex justify-between items-center hover:bg-white/10 text-gray-200 cursor-pointer">
                          <span>Wishlist</span>
                          <span className="bg-white/10 text-white px-2 py-0.5 rounded-full text-[10px]">{wishlistCount}</span>
                        </button>
                        {isAdmin && (
                          <button onClick={() => { setCurrentTab('admin'); setMenuOpen(false); }} className="text-left px-4 py-2 rounded-xl bg-[#1c39bb]/30 text-blue-200 font-bold border border-blue-400/40 mt-1 cursor-pointer">
                            Admin Dashboard
                          </button>
                        )}
                        <div className="border-t border-white/10 my-1" />
                        <button onClick={() => { onLogout(); setMenuOpen(false); }} className="text-left px-4 py-2 rounded-xl text-red-400 font-semibold hover:bg-red-500/10 cursor-pointer">Logout</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { setCurrentTab('wishlist'); setMenuOpen(false); }} className="text-left px-4 py-2 rounded-xl text-gray-200 hover:bg-white/10 flex justify-between items-center cursor-pointer">
                          <span>Wishlist</span>
                          <span className="bg-white/10 text-white px-2 py-0.5 rounded-full text-[10px]">{wishlistCount}</span>
                        </button>
                        <button onClick={() => { setCurrentTab('support'); setMenuOpen(false); }} className="text-left px-4 py-2 rounded-xl text-gray-200 hover:bg-white/10 cursor-pointer">Support</button>
                        <div className="border-t border-white/10 my-1" />
                        <button onClick={() => { onOpenAuth(); setMenuOpen(false); }} className="w-full bg-gradient-to-r from-[#1c39bb] to-[#3b60e4] text-white py-2.5 rounded-xl text-center font-bold tracking-widest cursor-pointer shadow-lg">
                          Sign In / Register
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Clean Scrollable Nav Links */}
        <nav className="flex items-center justify-start sm:justify-center gap-5 overflow-x-auto py-1 no-scrollbar text-[11px] tracking-[0.18em] uppercase">
          <button onClick={() => setCurrentTab('store')} className={`transition-all whitespace-nowrap pb-1 cursor-pointer ${currentTab === 'store' ? 'font-bold text-blue-400 border-b-2 border-[#3b60e4]' : 'text-gray-400 hover:text-white'}`}>Store</button>
          <button onClick={() => setCurrentTab('Recently Updated')} className={`transition-all whitespace-nowrap pb-1 cursor-pointer ${currentTab === 'Recently Updated' ? 'font-bold text-blue-400 border-b-2 border-[#3b60e4]' : 'text-gray-400 hover:text-white'}`}>New Drops</button>
          {categories.map(cat => (
            <button key={cat.name} onClick={() => setCurrentTab(cat.name)} className={`whitespace-nowrap transition-all pb-1 cursor-pointer ${currentTab === cat.name ? 'font-bold text-blue-400 border-b-2 border-[#3b60e4]' : 'text-gray-400 hover:text-white'}`}>{cat.name}</button>
          ))}
          <button onClick={() => setCurrentTab('support')} className={`transition-all whitespace-nowrap pb-1 cursor-pointer ${currentTab === 'support' ? 'font-bold text-blue-400 border-b-2 border-[#3b60e4]' : 'text-gray-400 hover:text-white'}`}>Support</button>
        </nav>
      </div>
    </header>
  );
}