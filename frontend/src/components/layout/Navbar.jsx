import { useState, useRef, useEffect } from 'react';
import { CATEGORIES } from '../../utils/constants';

export default function Navbar({ 
  currentTab, setCurrentTab, 
  token, userEmail, 
  wishlistCount, cartCount, 
  onLogout, onOpenAuth,
  onGoToLanding 
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-black/10 shadow-sm">
      <div className="w-[94%] max-w-[1600px] mx-auto py-4 flex flex-col gap-4">
        
        {/* Top Row: Brand Logo & Hamburger Menu */}
        <div className="flex items-center justify-between border-b border-black/5 pb-3 relative">
          
          {/* Brand Logo */}
          <div className="cursor-pointer flex items-center gap-2 group" onClick={onGoToLanding}>
            <h1 className="saree-brand-title-dark text-2xl lg:text-3xl tracking-[0.18em] uppercase group-hover:opacity-85 transition-opacity">
              Bhairavi Threads
            </h1>
          </div>

          {/* Right Hamburger Account & Bag Drawer Trigger */}
          <div className="flex items-center gap-4" ref={menuRef}>
            <div className="relative">
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="px-4 py-2 rounded-full bg-[#fafafa] border border-black/10 flex items-center gap-2 text-xs uppercase tracking-[0.15em] hover:bg-black/5 transition-all focus:outline-none"
                aria-label="Menu"
              >
                <span>Menu</span>
                <span className="text-base font-bold">{menuOpen ? '✕' : '☰'}</span>
              </button>

              {/* Collapsible Dropdown Drawer */}
              {menuOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-black/10 py-3 px-2 z-50 flex flex-col gap-1 text-xs uppercase tracking-[0.15em] animate-fadeIn">
                  {token ? (
                    <>
                      <div className="px-4 py-2 border-b border-black/5 mb-1 text-[10px] text-[#777]">
                        Signed in as <span className="font-semibold text-black">{userEmail.split('@')[0]}</span>
                      </div>
                      <button 
                        onClick={() => { setCurrentTab('cart'); setMenuOpen(false); }} 
                        className={`text-left px-4 py-2.5 rounded-xl transition-all flex justify-between items-center ${currentTab === 'cart' ? 'bg-black text-white font-bold' : 'text-[#333] hover:bg-[#fafafa]'}`}
                      >
                        <span>🛍️ Shopping Bag</span>
                        <span className="bg-gray-200 text-black px-2 py-0.5 rounded-full text-[10px]">{cartCount}</span>
                      </button>
                      <button 
                        onClick={() => { setCurrentTab('wishlist'); setMenuOpen(false); }} 
                        className={`text-left px-4 py-2.5 rounded-xl transition-all flex justify-between items-center ${currentTab === 'wishlist' ? 'bg-black text-white font-bold' : 'text-[#333] hover:bg-[#fafafa]'}`}
                      >
                        <span>♥ Wishlist</span>
                        <span className="bg-gray-200 text-black px-2 py-0.5 rounded-full text-[10px]">{wishlistCount}</span>
                      </button>
                      <button 
                        onClick={() => { setCurrentTab('profile'); setMenuOpen(false); }} 
                        className={`text-left px-4 py-2.5 rounded-xl transition-all ${currentTab === 'profile' ? 'bg-black text-white font-bold' : 'text-[#333] hover:bg-[#fafafa]'}`}
                      >
                        👤 Profile Details
                      </button>
                      <button 
                        onClick={() => { setCurrentTab('my-orders'); setMenuOpen(false); }} 
                        className={`text-left px-4 py-2.5 rounded-xl transition-all ${currentTab === 'my-orders' ? 'bg-black text-white font-bold' : 'text-[#333] hover:bg-[#fafafa]'}`}
                      >
                        📦 My Orders
                      </button>
                      <button 
                        onClick={() => { setCurrentTab('admin'); setMenuOpen(false); }} 
                        className={`text-left px-4 py-2.5 rounded-xl transition-all ${currentTab === 'admin' ? 'bg-black text-white font-bold' : 'text-[#333] hover:bg-[#fafafa]'}`}
                      >
                        ⚙️ Admin Dashboard
                      </button>
                      <div className="border-t border-black/5 my-1" />
                      <button 
                        onClick={() => { onLogout(); setMenuOpen(false); }} 
                        className="text-left px-4 py-2.5 rounded-xl text-red-600 font-semibold hover:bg-red-50 transition-all"
                      >
                        🚪 Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => { setCurrentTab('cart'); setMenuOpen(false); }} 
                        className="text-left px-4 py-2.5 rounded-xl text-[#333] hover:bg-[#fafafa] transition-all flex justify-between items-center"
                      >
                        <span>🛍️ Shopping Bag</span>
                        <span className="bg-gray-200 text-black px-2 py-0.5 rounded-full text-[10px]">{cartCount}</span>
                      </button>
                      <button 
                        onClick={() => { setCurrentTab('wishlist'); setMenuOpen(false); }} 
                        className="text-left px-4 py-2.5 rounded-xl text-[#333] hover:bg-[#fafafa] transition-all flex justify-between items-center"
                      >
                        <span>♥ Wishlist</span>
                        <span className="bg-gray-200 text-black px-2 py-0.5 rounded-full text-[10px]">{wishlistCount}</span>
                      </button>
                      <div className="border-t border-black/5 my-1" />
                      <button 
                        onClick={() => { onOpenAuth(); setMenuOpen(false); }} 
                        className="w-full bg-[#1a1a1a] text-white py-3 rounded-xl text-center font-semibold tracking-widest hover:bg-black transition-all shadow-sm"
                      >
                        Login / Sign Up
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Bottom Row: Centered Navigation & Categories */}
        <nav className="flex items-center justify-center gap-8 lg:gap-12 overflow-x-auto py-1 no-scrollbar">
          <button 
            onClick={() => setCurrentTab('store')}
            className={`text-xs uppercase tracking-[0.2em] transition-all whitespace-nowrap pb-1 ${currentTab === 'store' ? 'font-bold text-black border-b-2 border-black' : 'text-[#666] hover:text-black'}`}
          >
            Home
          </button>

          <button 
            onClick={() => setCurrentTab('Recently Updated')}
            className={`text-xs uppercase tracking-[0.2em] transition-all whitespace-nowrap pb-1 ${currentTab === 'Recently Updated' ? 'font-bold text-black border-b-2 border-black' : 'text-[#666] hover:text-black'}`}
          >
            ✨ Recently Updated
          </button>

          {CATEGORIES.map(cat => (
            <button 
              key={cat} 
              onClick={() => setCurrentTab(cat)}
              className={`text-xs uppercase tracking-[0.2em] whitespace-nowrap transition-all pb-1 ${currentTab === cat ? 'font-bold text-black border-b-2 border-black' : 'text-[#666] hover:text-black'}`}
            >
              {cat}
            </button>
          ))}
        </nav>

      </div>
    </header>
  );
}