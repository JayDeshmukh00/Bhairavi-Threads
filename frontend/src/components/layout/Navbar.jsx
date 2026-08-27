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
    <header className="sticky top-0 z-50 bg-[#f9f8f6] border-b border-gray-300 shadow-sm transition-all antialiased">
      <audio ref={audioRef} loop src="/music/music.mp3" />

      <div className="w-[94%] max-w-[1600px] mx-auto pt-2 pb-1 flex flex-col gap-1">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between relative">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="cursor-pointer flex items-center gap-2.5 group" 
            onClick={onGoToLanding}
          >
            {/* Logo from public folder */}
            <img 
              src="/favicon.jpeg" 
              alt="Bhairavi Threads Logo" 
              className="w-8 h-8 rounded-full object-cover border border-gray-300 shadow-sm group-hover:border-black transition-all"
            />
            <h1 className="text-2xl lg:text-3xl font-serif font-normal italic tracking-wide text-gray-900 group-hover:text-black transition-colors">
              Bhairavi<span className="text-gray-500 font-light not-italic ml-0.5">.threads</span>
            </h1>
          </motion.div>

          <div className="flex items-center gap-2.5">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleAudio}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-medium uppercase tracking-wider transition-all cursor-pointer ${isPlayingAudio ? 'bg-black border-black text-white shadow-md' : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-100'}`}
            >
              <span className={`flex items-center gap-0.5 h-2.5 ${isPlayingAudio ? 'animate-pulse' : ''}`}>
                <span className="w-0.5 h-2 bg-current rounded-full animate-bounce" />
                <span className="w-0.5 h-3 bg-current rounded-full animate-bounce" />
              </span>
              <span className="hidden sm:inline font-mono">{isPlayingAudio ? 'Playing ♫' : 'Sound'}</span>
            </motion.button>

            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentTab('cart')} 
              className="text-[11px] font-medium uppercase tracking-[0.15em] text-gray-800 hover:text-black flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-gray-300 shadow-sm transition-all cursor-pointer"
            >
              <span>Bag</span>
              <span className="bg-black text-white px-1.5 py-0.2 rounded-full text-[10px] font-bold">{cartCount}</span>
            </motion.button>

            <div className="relative" ref={menuRef}>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center text-xs font-semibold text-gray-900 shadow-sm hover:border-black transition-all cursor-pointer"
              >
                {menuOpen ? '✕' : '☰'}
              </motion.button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2.5 w-64 rounded-2xl py-3 px-2.5 z-50 flex flex-col gap-1 text-[11px] font-medium uppercase tracking-[0.15em] bg-white border border-gray-200 shadow-xl"
                  >
                    {token ? (
                      <>
                        <div className="px-3 py-1.5 border-b border-gray-100 mb-1 text-[10px] text-gray-400 font-normal">
                          User <span className="font-semibold text-gray-900 block text-[11px] truncate">{userName || userEmail}</span>
                        </div>
                        <button onClick={() => { setCurrentTab('profile'); setMenuOpen(false); }} className="text-left px-3 py-2 rounded-xl hover:bg-gray-50 text-gray-800 cursor-pointer">Profile</button>
                        <button onClick={() => { setCurrentTab('my-orders'); setMenuOpen(false); }} className="text-left px-3 py-2 rounded-xl hover:bg-gray-50 text-gray-800 cursor-pointer">Orders</button>
                        <button onClick={() => { setCurrentTab('wishlist'); setMenuOpen(false); }} className="text-left px-3 py-2 rounded-xl flex justify-between items-center hover:bg-gray-50 text-gray-800 cursor-pointer">
                          <span>Wishlist</span>
                          <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-[10px] font-bold">{wishlistCount}</span>
                        </button>
                        {isAdmin && (
                          <button onClick={() => { setCurrentTab('admin'); setMenuOpen(false); }} className="text-left px-3 py-2 rounded-xl bg-gray-900 text-white font-semibold border border-gray-900 mt-1 cursor-pointer">
                            Admin Dashboard
                          </button>
                        )}
                        <div className="border-t border-gray-100 my-1" />
                        <button onClick={() => { onLogout(); setMenuOpen(false); }} className="text-left px-3 py-2 rounded-xl text-red-600 font-semibold hover:bg-red-50 cursor-pointer">Logout</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { setCurrentTab('wishlist'); setMenuOpen(false); }} className="text-left px-3 py-2 rounded-xl text-gray-800 hover:bg-gray-50 flex justify-between items-center cursor-pointer">
                          <span>Wishlist</span>
                          <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-[10px] font-bold">{wishlistCount}</span>
                        </button>
                        <button onClick={() => { setCurrentTab('support'); setMenuOpen(false); }} className="text-left px-3 py-2 rounded-xl text-gray-800 hover:bg-gray-50 cursor-pointer">Support</button>
                        <div className="border-t border-gray-100 my-1" />
                        <button onClick={() => { onOpenAuth(); setMenuOpen(false); }} className="w-full bg-black text-white py-2.5 rounded-xl text-center font-semibold tracking-widest cursor-pointer shadow-md">
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

        {/* Classy, Classically-Spaced Minimalist Nav Links */}
        <nav className="flex items-center justify-start sm:justify-center gap-7 overflow-x-auto py-1 border-t border-gray-200/60 no-scrollbar text-[11px] font-medium tracking-[0.25em] uppercase">
          <button onClick={() => setCurrentTab('store')} className={`transition-all whitespace-nowrap py-1 cursor-pointer ${currentTab === 'store' ? 'text-black font-semibold border-b border-black' : 'text-gray-600 hover:text-black'}`}>Store</button>
          <button onClick={() => setCurrentTab('Recently Updated')} className={`transition-all whitespace-nowrap py-1 cursor-pointer ${currentTab === 'Recently Updated' ? 'text-black font-semibold border-b border-black' : 'text-gray-600 hover:text-black'}`}>New Drops</button>
          {categories.map(cat => (
            <button key={cat.name} onClick={() => setCurrentTab(cat.name)} className={`whitespace-nowrap transition-all py-1 cursor-pointer ${currentTab === cat.name ? 'text-black font-semibold border-b border-black' : 'text-gray-600 hover:text-black'}`}>{cat.name}</button>
          ))}
          <button onClick={() => setCurrentTab('support')} className={`transition-all whitespace-nowrap py-1 cursor-pointer ${currentTab === 'support' ? 'text-black font-semibold border-b border-black' : 'text-gray-600 hover:text-black'}`}>Support</button>
        </nav>
      </div>
    </header>
  );
}