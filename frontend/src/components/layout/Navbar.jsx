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
    <header className="sticky top-0 z-50 bg-[#f9f8f6]/90 backdrop-blur-md border-b border-gray-200/60 shadow-sm transition-all">
      <audio ref={audioRef} loop src="/music/music.mp3" />

      <div className="w-[94%] max-w-[1600px] mx-auto py-4 flex flex-col gap-3">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-gray-200/50 pb-3 relative">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="cursor-pointer flex items-center gap-2 group" 
            onClick={onGoToLanding}
          >
            {/* Editorial Cursive Title */}
            <h1 className="text-xl lg:text-2xl font-serif italic font-normal tracking-wide text-gray-900 group-hover:text-black transition-colors">
              Bhairavi<span className="text-gray-400 font-light not-italic ml-1">.threads</span>
            </h1>
          </motion.div>

          <div className="flex items-center gap-3">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleAudio}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] uppercase tracking-wider transition-all cursor-pointer ${isPlayingAudio ? 'bg-black border-black text-white shadow-md' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
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
              className="text-xs uppercase tracking-[0.15em] text-gray-800 hover:text-black flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-sm transition-all cursor-pointer"
            >
              <span>Bag</span>
              <span className="bg-black text-white px-2 py-0.5 rounded-full text-[10px] font-bold">{cartCount}</span>
            </motion.button>

            <div className="relative" ref={menuRef}>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-sm text-gray-900 shadow-sm hover:border-black transition-all cursor-pointer"
              >
                {menuOpen ? '✕' : '☰'}
              </motion.button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-3 w-72 rounded-2xl py-4 px-3 z-50 flex flex-col gap-1.5 text-xs uppercase tracking-[0.15em] bg-white border border-gray-200 shadow-xl"
                  >
                    {token ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-100 mb-1 text-[10px] text-gray-400">
                          User <span className="font-semibold text-gray-900 block text-xs truncate">{userName || userEmail}</span>
                        </div>
                        <button onClick={() => { setCurrentTab('profile'); setMenuOpen(false); }} className="text-left px-4 py-2 rounded-xl hover:bg-gray-50 text-gray-800 cursor-pointer">Profile</button>
                        <button onClick={() => { setCurrentTab('my-orders'); setMenuOpen(false); }} className="text-left px-4 py-2 rounded-xl hover:bg-gray-50 text-gray-800 cursor-pointer">Orders</button>
                        <button onClick={() => { setCurrentTab('wishlist'); setMenuOpen(false); }} className="text-left px-4 py-2 rounded-xl flex justify-between items-center hover:bg-gray-50 text-gray-800 cursor-pointer">
                          <span>Wishlist</span>
                          <span className="bg-gray-100 text-gray-900 px-2 py-0.5 rounded-full text-[10px]">{wishlistCount}</span>
                        </button>
                        {isAdmin && (
                          <button onClick={() => { setCurrentTab('admin'); setMenuOpen(false); }} className="text-left px-4 py-2 rounded-xl bg-gray-100 text-gray-900 font-bold border border-gray-300 mt-1 cursor-pointer">
                            Admin Dashboard
                          </button>
                        )}
                        <div className="border-t border-gray-100 my-1" />
                        <button onClick={() => { onLogout(); setMenuOpen(false); }} className="text-left px-4 py-2 rounded-xl text-red-600 font-semibold hover:bg-red-50 cursor-pointer">Logout</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { setCurrentTab('wishlist'); setMenuOpen(false); }} className="text-left px-4 py-2 rounded-xl text-gray-800 hover:bg-gray-50 flex justify-between items-center cursor-pointer">
                          <span>Wishlist</span>
                          <span className="bg-gray-100 text-gray-900 px-2 py-0.5 rounded-full text-[10px]">{wishlistCount}</span>
                        </button>
                        <button onClick={() => { setCurrentTab('support'); setMenuOpen(false); }} className="text-left px-4 py-2 rounded-xl text-gray-800 hover:bg-gray-50 cursor-pointer">Support</button>
                        <div className="border-t border-gray-100 my-1" />
                        <button onClick={() => { onOpenAuth(); setMenuOpen(false); }} className="w-full bg-black text-white py-2.5 rounded-xl text-center font-bold tracking-widest cursor-pointer shadow-md">
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

        {/* Minimalist Editorial Nav Links */}
        <nav className="flex items-center justify-start sm:justify-center gap-6 overflow-x-auto py-1 no-scrollbar text-[11px] tracking-[0.2em] uppercase">
          <button onClick={() => setCurrentTab('store')} className={`transition-all whitespace-nowrap pb-1 cursor-pointer ${currentTab === 'store' ? 'font-bold text-black border-b-2 border-black' : 'text-gray-500 hover:text-black'}`}>Store</button>
          <button onClick={() => setCurrentTab('Recently Updated')} className={`transition-all whitespace-nowrap pb-1 cursor-pointer ${currentTab === 'Recently Updated' ? 'font-bold text-black border-b-2 border-black' : 'text-gray-500 hover:text-black'}`}>New Drops</button>
          {categories.map(cat => (
            <button key={cat.name} onClick={() => setCurrentTab(cat.name)} className={`whitespace-nowrap transition-all pb-1 cursor-pointer ${currentTab === cat.name ? 'font-bold text-black border-b-2 border-black' : 'text-gray-500 hover:text-black'}`}>{cat.name}</button>
          ))}
          <button onClick={() => setCurrentTab('support')} className={`transition-all whitespace-nowrap pb-1 cursor-pointer ${currentTab === 'support' ? 'font-bold text-black border-b-2 border-black' : 'text-gray-500 hover:text-black'}`}>Support</button>
        </nav>
      </div>
    </header>
  );
}