import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { assets } from '../utils/constants';

export default function LandingView({ setCurrentTab, token, setIsLoginView, setShowAuth }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const audioRef = useRef(null);

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

  const handleOpenAuth = (isLogin) => {
    if (typeof setIsLoginView === 'function') setIsLoginView(isLogin);
    if (typeof setShowAuth === 'function') {
      setShowAuth(true);
    } else {
      setCurrentTab("store");
    }
  };

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const bgModelY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const floatingY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  // Authenticated handloom saree imagery and textures
  const collectionsList = [
    { 
      id: "01", 
      title: "Kalamkari", 
      desc: "Hand-painted ancient narratives using organic vegetable dyes on pure breathable silk.", 
      longStory: "Each motif is hand-drawn using a bamboo pen dipped in fermented jaggery and iron rust, taking up to 21 days per meter.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH06vKxqToW7HNP2iuNXnjuzCIPwVCozlOmPRG5_577A&s=10" 
    },
    { 
      id: "02", 
      title: "Organza", 
      desc: "Ethereal translucent drapes with delicate shimmering gold zari borders.", 
      longStory: "Woven with sheer glass-like crispness that floats around the wearer like morning mist over sacred riverbanks.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiZ9jMv5QrpSuc3BSVn5XcmvFFI0KPIkPvsJl2VSIUlOMjtkkKALq-YZb9&s=10" 
    },
    { 
      id: "03", 
      title: "Raga Tissue", 
      desc: "Lustrous gold and silver tissue weaves fit for royal celebrations.", 
      longStory: "A harmonious blend of metallic warp and fine silk weft that catches fire under moonlight and chandelier glow.",
      image: "https://houseofaaradhya.com/cdn/shop/files/DSC00014.jpg?v=1767974106" 
    },
    { 
      id: "04", 
      title: "Cotton", 
      desc: "Luxuriously soft handspun mulmul cottons crafted for effortless daily grace.", 
      longStory: "Breathable heritage yarn spun by veteran women artisans, offering unmatched comfort that softens with every wash.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQupZV7rx0KRIaJiK-QaruwoAO1wqB90zXz_gVPEVwrHA&s=10" 
    },
    { 
      id: "05", 
      title: "Embroidery", 
      desc: "Intricate needle threadwork and zardozi detailing by master craftsmen.", 
      longStory: "Countless hours of painstaking hand embroidery turning plain silk canvases into opulent heirloom treasures.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn0U6svtPAEofOMIWHSBEbp9f8K2pUcLzlVVh5ryD_vw&s=10" 
    },
    { 
      id: "06", 
      title: "Hand Painted", 
      desc: "One-of-a-kind wearable art painted directly onto fine silk by master artists.", 
      longStory: "No stencils, no prints—pure imagination transferred straight from the artisan's brush to fabric.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRt6iSubulRTfFexH7sQNlbAxT3HbPXE9toZlMa0PjHhg&s=10" 
    }
  ];

  const newDropsProducts = [
    { id: 1, category: "Kalamkari", title: "Royal Purple Kalamkari", price: "₹8,950", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH06vKxqToW7HNP2iuNXnjuzCIPwVCozlOmPRG5_577A&s=10", colors: ["#1c39bb", "#3b60e4", "#0f172a"] },
    { id: 2, category: "Organza", title: "Lavender Organza Tissue", price: "₹7,250", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiZ9jMv5QrpSuc3BSVn5XcmvFFI0KPIkPvsJl2VSIUlOMjtkkKALq-YZb9&s=10", colors: ["#93c5fd", "#3b82f6", "#1e3a8a"] },
    { id: 3, category: "Raga Tissue", title: "Ivory Gold Heirloom", price: "₹10,500", img: "https://houseofaaradhya.com/cdn/shop/files/DSC00014.jpg?v=1767974106", colors: ["#fef08a", "#ca8a04", "#1c39bb"] },
    { id: 4, category: "Cotton", title: "Peacock Green Cotton", price: "₹6,150", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQupZV7rx0KRIaJiK-QaruwoAO1wqB90zXz_gVPEVwrHA&s=10", colors: ["#065f46", "#1c39bb", "#047857"] },
    { id: 5, category: "Hand Painted", title: "Hand Painted Blush Silk", price: "₹9,850", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRt6iSubulRTfFexH7sQNlbAxT3HbPXE9toZlMa0PjHhg&s=10", colors: ["#60a5fa", "#2563eb", "#1e40af"] }
  ];

  const filteredProducts = selectedCategory === 'All' 
    ? newDropsProducts 
    : newDropsProducts.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.email || !contactForm.message) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setContactForm({ name: '', email: '', message: '' });
      setIsContactOpen(false);
    }, 3000);
  };

  return (
    <div ref={containerRef} className="btx-page bg-[#000103] text-[#f8fafc] min-h-screen overflow-x-hidden relative selection:bg-[#1c39bb] selection:text-white font-sans pointer-events-auto">
      
      {/* BACKGROUND AUDIO */}
      <audio 
        ref={audioRef} 
        loop 
        src="/music/music.mp3" 
      />

      {/* ULTRA-MODERN CINEMATIC PARALLAX BACKGROUND */}
      <div className="absolute inset-0 h-[120vh] w-full overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ scale: [1, 1.05, 1], rotate: [0, 0.5, 0] }} 
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          style={{ y: bgModelY }} 
          className="w-full h-full relative"
        >
          <img 
            src="http://chowkhat.com/cdn/shop/files/Untitled_Session0767.jpg?v=1756967605&width=2048" 
            alt="Hand-painted saree background" 
            className="w-full h-full object-cover object-center filter brightness-[0.5] contrast-[1.2]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#000103]/40 via-[#000103]/85 to-[#000103]" />
      </div>

      {/* Dynamic Immersive Glow Orbs */}
      <motion.div 
        animate={{ x: [0, 80, 0], y: [0, -40, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-10 w-[700px] h-[700px] bg-[#1c39bb]/25 rounded-full blur-[250px] pointer-events-none z-0" 
      />
      <motion.div 
        animate={{ x: [0, -70, 0], y: [0, 60, 0], scale: [1, 1.25, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[55%] right-10 w-[700px] h-[700px] bg-[#3b60e4]/25 rounded-full blur-[250px] pointer-events-none z-0" 
      />

      {/* ULTRA-MODERN FLOATING NAVIGATION BAR */}
      <div className="fixed top-4 inset-x-0 z-50 px-4 sm:px-8 max-w-[1350px] mx-auto pointer-events-auto">
        <motion.header 
          initial={{ y: -25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-[#02040c]/85 backdrop-blur-2xl px-6 py-3.5 flex justify-between items-center rounded-full border border-white/15 shadow-[0_15px_35px_rgba(0,0,0,0.5)]"
        >
          <button className="focus:outline-none text-left group flex items-center cursor-pointer bg-transparent border-none" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <span className="text-sm tracking-[0.2em] font-serif text-white font-normal italic">
              Bhairavi<span className="text-[#3b60e4] font-serif">.threads</span>
            </span>
          </button>
          
          <nav className="hidden md:flex items-center gap-7 text-[11px] tracking-[0.2em] uppercase text-gray-300 font-light">
            <button onClick={() => setCurrentTab("store")} className="text-white hover:text-[#3b60e4] transition-colors cursor-pointer bg-transparent border-none">Store</button>
            <a href="#new-drops" className="hover:text-white transition-colors">New Drops</a>
            <a href="#btv-story" className="hover:text-white transition-colors">Story</a>
            <a href="#btv-film" className="hover:text-white transition-colors">Film</a>
            <a href="#btv-collections" className="hover:text-white transition-colors">Collections</a>
            <button onClick={() => setIsContactOpen(true)} className="hover:text-white transition-colors bg-transparent border-none cursor-pointer uppercase tracking-[0.2em] text-[11px] text-gray-300">Contact</button>
          </nav>

          <div className="flex items-center gap-3">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleAudio}
              className={`relative flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border text-[10px] uppercase tracking-wider transition-all cursor-pointer backdrop-blur-md ${isPlayingAudio ? 'bg-[#1c39bb]/50 border-blue-400 text-white shadow-[0_0_20px_rgba(28,57,187,0.6)]' : 'bg-white/5 border-white/15 text-gray-300 hover:bg-white/10'}`}
              title="Toggle Audio Experience"
            >
              <span className={`flex items-center gap-0.5 h-3 ${isPlayingAudio ? 'animate-pulse' : ''}`}>
                <span className="w-0.5 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <span className="w-0.5 h-3 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                <span className="w-0.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
              </span>
              <span className="hidden sm:inline font-mono">{isPlayingAudio ? 'Playing ♫' : 'Sound Vibe'}</span>
            </motion.button>

            <button onClick={() => setCurrentTab("store")} className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 flex items-center justify-center text-xs text-white transition-all cursor-pointer backdrop-blur-md">
              <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </button>
            
            <button onClick={() => setCurrentTab("cart")} className="relative w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 flex items-center justify-center text-xs text-white transition-all cursor-pointer backdrop-blur-md">
              <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            </button>

            {token ? (
              <button onClick={() => setCurrentTab("profile")} className="hidden sm:flex px-4 py-1.5 rounded-full bg-[#1c39bb] text-white text-[10px] uppercase tracking-wider font-medium shadow-lg cursor-pointer">
                Profile
              </button>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button onClick={() => handleOpenAuth(true)} className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white text-[10px] uppercase tracking-wider transition-all cursor-pointer">
                  Login
                </button>
                <button onClick={() => handleOpenAuth(false)} className="px-4 py-1.5 rounded-full bg-[#1c39bb] hover:bg-[#3b60e4] text-white text-[10px] uppercase tracking-wider font-medium shadow-lg cursor-pointer transition-colors">
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </motion.header>
      </div>

      <main className="relative z-10 pt-32 px-4 sm:px-8 lg:px-12 max-w-[1450px] mx-auto pointer-events-auto">
        
        {/* HERO SECTION */}
        <section className="relative min-h-[80vh] flex flex-col justify-center items-start pb-12 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ y: floatingY }}
            className="max-w-4xl space-y-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.9 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/15 backdrop-blur-2xl text-[10px] uppercase tracking-[0.3em] text-blue-200 shadow-xl"
            >
              <span className="text-[#3b60e4]">✦</span> ULTRA-LUXURY HANDLOOM EXPERIENCE
            </motion.div>

            <div className="space-y-2">
              <motion.h1 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="font-['Playfair_Display',serif] italic text-6xl sm:text-8xl lg:text-9xl text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-[#3b60e4] leading-[1.05] font-normal tracking-tight"
              >
                Bhairavi Threads
              </motion.h1>
            </div>

            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="font-serif text-xs sm:text-sm uppercase tracking-[0.35em] text-blue-300 font-light"
            >
              Master artisan weaves meets immersive digital architecture.
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="font-serif text-xs sm:text-sm text-gray-300 max-w-lg leading-relaxed tracking-wide font-light"
            >
              Immerse yourself in hand-painted organzas, royal tissue golds, and pristine mulberry silks. Curated directly from heritage looms in Pune and Varanasi for modern connoisseurs.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="flex flex-wrap items-center gap-5 pt-4"
            >
              <motion.button 
                whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(59,96,228,0.6)" }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setCurrentTab("store")}
                className="bg-[#1c39bb] hover:bg-[#3b60e4] text-white px-8 py-3.5 rounded-full text-[11px] uppercase tracking-[0.25em] font-medium transition-all flex items-center gap-3 shadow-2xl cursor-pointer border border-blue-400/40"
              >
                <span>Explore Collection</span>
                <span>→</span>
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setIsContactOpen(true)}
                className="bg-white/5 hover:bg-white/10 text-white px-8 py-3.5 rounded-full text-[11px] uppercase tracking-[0.25em] font-light border border-white/20 backdrop-blur-2xl transition-all flex items-center gap-3 cursor-pointer shadow-xl"
              >
                <span>Concierge Support</span>
                <span className="text-[#3b60e4]">✦</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </section>


        {/* HERITAGE CHRONICLES */}
        <section id="btv-story" className="py-24 relative">
          <div className="space-y-4 mb-14">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[10px] uppercase tracking-[0.35em] text-[#3b60e4] font-semibold"
            >
              The Heritage Chronicles
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-5xl font-serif text-white"
            >
              Rooted in Tradition. <em className="italic text-blue-200 font-light">Woven for the Future.</em>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            <motion.div 
              whileHover={{ y: -8, scale: 1.02 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/[0.02] backdrop-blur-3xl border border-white/15 rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col justify-between space-y-6 relative overflow-hidden group"
            >
              <div className="absolute inset-0 opacity-15 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH06vKxqToW7HNP2iuNXnjuzCIPwVCozlOmPRG5_577A&s=10" alt="Texture 1" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              </div>
              <div className="relative z-10 space-y-4">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#3b60e4] font-mono">Chapter I</span>
                <h3 className="font-serif text-2xl text-white font-normal">The Unhurried Loom</h3>
                <p className="text-xs sm:text-sm text-gray-300 font-serif leading-relaxed font-light">
                  In an era dictated by instant algorithms, our veteran weavers in Varanasi take weeks to perfect a single border. True luxury requires absolute silence, unhurried devotion, and timeless technique.
                </p>
              </div>
              <div className="relative z-10 pt-5 border-t border-white/10 text-[10px] text-blue-300 font-mono">
                <span>✦ Handcrafted in Varanasi</span>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -8, scale: 1.02 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/[0.02] backdrop-blur-3xl border border-white/15 rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col justify-between space-y-6 relative overflow-hidden group"
            >
              <div className="absolute inset-0 opacity-15 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRt6iSubulRTfFexH7sQNlbAxT3HbPXE9toZlMa0PjHhg&s=10" alt="Texture 2" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              </div>
              <div className="relative z-10 space-y-4">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#3b60e4] font-mono">Chapter II</span>
                <h3 className="font-serif text-2xl text-white font-normal">Living Artistry</h3>
                <p className="text-xs sm:text-sm text-gray-300 font-serif leading-relaxed font-light">
                  Our hand-painted Kalamkaris merge ancient mythological storytelling with modern minimalist color palettes. Each brushstroke breathes vibrant life into pure mulberry silk canvases.
                </p>
              </div>
              <div className="relative z-10 pt-5 border-t border-white/10 text-[10px] text-blue-300 font-mono">
                <span>✦ Organic Vegetable Dyes</span>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -8, scale: 1.02 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/[0.02] backdrop-blur-3xl border border-white/15 rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col justify-between space-y-6 relative overflow-hidden group"
            >
              <div className="absolute inset-0 opacity-15 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none">
                <img src="https://houseofaaradhya.com/cdn/shop/files/DSC00014.jpg?v=1767974106" alt="Texture 3" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              </div>
              <div className="relative z-10 space-y-4">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#3b60e4] font-mono">Chapter III</span>
                <h3 className="font-serif text-2xl text-white font-normal">The Mindful Wardrobe</h3>
                <p className="text-xs sm:text-sm text-gray-300 font-serif leading-relaxed font-light">
                  Bhairavi.threads stands for radical sustainability and ethical craftsmanship. By bridging rural master artisans with global connoisseurs, we preserve heritage while empowering families.
                </p>
              </div>
              <div className="relative z-10 pt-5 border-t border-white/10 text-[10px] text-blue-300 font-mono">
                <span>✦ Ethical & Sustainable</span>
              </div>
            </motion.div>

          </div>
        </section>


        {/* CINEMATIC BRAND FILM SECTION */}
        <section id="btv-film" className="py-16 relative max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="backdrop-blur-2xl bg-white/[0.02] rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.7)] grid grid-cols-1 lg:grid-cols-12 gap-6 items-center border border-white/10"
          >
            
            <div className="lg:col-span-6 space-y-4">
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#3b60e4] font-semibold px-3 py-1 rounded-full bg-[#1c39bb]/25 border border-[#1c39bb]/40">
                Cinematic Feature
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-white leading-tight">
                The Story Behind <br /><em className="italic text-blue-200 font-light">Every Single Weave</em>
              </h2>
              <p className="text-xs text-gray-300 font-serif leading-relaxed font-light">
                Step inside our family looms in Pune and Varanasi. Witness the meditative rhythm of shuttle looms and master craftsmanship captured in pristine detail.
              </p>
              <motion.button 
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setIsVideoModalOpen(true)}
                className="bg-white text-black hover:bg-[#3b60e4] hover:text-white px-6 py-2.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-medium transition-all shadow-xl cursor-pointer flex items-center gap-2.5"
              >
                <span>▶ Watch Brand Film</span>
              </motion.button>
            </div>

            <div className="lg:col-span-6">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={() => setIsVideoModalOpen(true)}
                className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-xl group cursor-pointer bg-black border border-white/15 max-w-sm mx-auto w-full"
              >
                <video 
                  src={assets.modelVideo1 || assets.heroVideo} 
                  autoPlay 
                  muted 
                  loop 
                  playsInline 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-[#1c39bb] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <div className="w-3 h-3 text-white ml-0.5 text-xs">▶</div>
                  </div>
                </div>
              </motion.div>
            </div>

          </motion.div>
        </section>


        {/* NEW DROPS & PRODUCT GRID */}
        <section id="new-drops" className="py-20 relative">
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <h2 className="font-serif text-3xl sm:text-4xl text-white">New Drops</h2>
                <span className="text-[#3b60e4]">✦</span>
              </div>
              <p className="text-xs text-gray-400 font-serif font-light">Fresh master weaves. Limited editions. Endless elegance.</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {['All', 'Kalamkari', 'Cotton', 'Organza', 'Raga Tissue', 'Embroidery', 'Hand Painted'].map((cat) => (
                <motion.button
                  key={cat}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4.5 py-2 rounded-full text-[11px] transition-all tracking-wide cursor-pointer border ${selectedCategory === cat ? 'bg-[#1c39bb] text-white font-medium shadow-lg border-blue-400/50' : 'bg-white/5 text-gray-300 hover:bg-white/10 border-white/15'}`}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((prod, idx) => (
                <motion.div 
                  key={prod.id || idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  whileHover={{ y: -8, scale: 1.03, rotateX: 3, rotateY: -3 }}
                  style={{ perspective: 1000 }}
                  onClick={() => setCurrentTab("store")}
                  className="group bg-white/[0.02] backdrop-blur-2xl rounded-2xl p-4 border border-white/10 hover:border-[#3b60e4]/60 transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-2xl"
                >
                  <div>
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-black mb-3.5 shadow-xl">
                      <img src={prod.img} alt={prod.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-95" />
                      <button onClick={(e) => { e.stopPropagation(); setCurrentTab("store"); }} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white text-xs border border-white/20 hover:bg-[#1c39bb] transition-colors cursor-pointer border-none shadow-lg">
                        ♡
                      </button>
                    </div>
                    <span className="text-[9px] uppercase font-mono text-blue-300 tracking-widest block mb-1">{prod.category}</span>
                    <h3 className="font-serif text-xs sm:text-sm text-white font-normal line-clamp-1">{prod.title}</h3>
                  </div>

                  <div className="pt-3.5 flex items-center justify-between mt-3 border-t border-white/10">
                    <span className="font-mono text-xs text-gray-100 font-semibold">{prod.price}</span>
                    <div className="flex items-center gap-1.5">
                      {prod.colors.map((c, cIdx) => (
                        <span key={cIdx} className="w-2.5 h-2.5 rounded-full border border-white/30 shadow-md" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center text-gray-400 font-serif text-xs">
                No pieces found in this category. Explore All drops!
              </div>
            )}
          </div>

        </section>


        {/* RUNWAY SHOWCASE (Compact & Sleek Vertical Cards) */}
        <section id="btv-runway" className="py-20 relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#3b60e4] font-semibold">Runway Showcase</span>
              <h2 className="text-3xl sm:text-5xl text-white font-serif">Draped in <em className="italic text-blue-200 font-light">Movement.</em></h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 max-w-md font-serif font-light">
              Experience how our drapes flow, catch the ambient light, and move in real time with absolute majestic grace.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {[assets.modelVideo1, assets.modelVideo2, assets.modelVideo3, assets.modelVideo4].map((vid, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ scale: 1.02, y: -4 }}
                onClick={() => setCurrentTab("store")} 
                className="bg-white/[0.02] backdrop-blur-2xl rounded-2xl overflow-hidden border border-white/10 group shadow-lg flex flex-col hover:border-[#3b60e4]/50 transition-all cursor-pointer max-w-[240px] mx-auto w-full"
              >
                <div className="relative aspect-[4/5] bg-black overflow-hidden">
                  <video src={vid} autoPlay muted loop playsInline className="w-full h-full object-cover opacity-95 group-hover:scale-108 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000103] via-transparent to-transparent opacity-75" />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[8px] font-mono text-blue-300 border border-white/10">
                    LOOK 0{idx + 1}
                  </span>
                </div>
                <div className="p-3.5 space-y-1">
                  <h3 className="font-serif text-xs text-white font-medium">Fluid Silk Drapes</h3>
                  <p className="text-[9px] text-gray-400 font-light line-clamp-1">Handcrafted cinematic motion.</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>


        {/* SLEEK, COMPACT COLLECTIONS GRID */}
        <section id="btv-collections" className="py-20 relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#3b60e4] font-semibold">The Collections</span>
              <h2 className="text-3xl sm:text-5xl text-white font-serif">Textiles with a <em className="italic text-blue-200 font-light">Point of View.</em></h2>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-xs sm:text-sm text-gray-300 max-w-sm font-serif font-light"
            >
              Six expressions of cloth. Each carrying its own rhythm, history, and memory.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {collectionsList.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ scale: 1.02, y: -5, boxShadow: "0 15px 30px rgba(28,57,187,0.2)" }}
                onClick={() => setCurrentTab("store")}
                className="bg-white/[0.02] backdrop-blur-2xl rounded-2xl overflow-hidden border border-white/10 group cursor-pointer shadow-lg transition-all hover:border-[#3b60e4]/60 flex flex-col justify-between max-w-[360px] mx-auto w-full"
              >
                <div>
                  <div className="aspect-[16/9] overflow-hidden bg-black relative shadow-md">
                    <motion.img 
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.6 }}
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover opacity-95" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#02040c] via-transparent to-transparent opacity-65" />
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[8px] font-mono text-blue-300 border border-white/10">
                      CHAPTER {item.id}
                    </span>
                  </div>
                  
                  <div className="p-4 space-y-1.5">
                    <h3 className="font-serif text-base text-white font-normal">{item.title}</h3>
                    <p className="text-[10px] text-gray-300 leading-relaxed font-serif font-light line-clamp-2">{item.desc}</p>
                    <p className="text-[9px] text-gray-400 italic pt-1.5 border-t border-white/5 font-serif line-clamp-1">{item.longStory}</p>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-1">
                  <span className="text-[9px] uppercase tracking-[0.2em] font-medium text-blue-300 inline-block group-hover:translate-x-1 transition-transform">Explore Weaves →</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>


        {/* CONCIERGE CONTACT SECTION */}
        <section id="btv-contact" className="py-16 relative max-w-2xl mx-auto">
          <div className="backdrop-blur-3xl bg-white/[0.02] border border-white/20 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
            
            <button 
              onClick={() => setIsContactOpen(!isContactOpen)}
              className="w-full px-7 py-5 flex items-center justify-between text-left cursor-pointer bg-transparent border-none hover:bg-white/[0.03] transition-colors"
            >
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#3b60e4] font-semibold">Concierge</span>
                <h3 className="font-serif text-xl text-white font-normal">Have questions? Send us a message</h3>
              </div>
              <span className="text-sm text-blue-300 font-mono w-8 h-8 rounded-full bg-white/5 border border-white/15 flex items-center justify-center shadow-md">
                {isContactOpen ? '−' : '+'}
              </span>
            </button>

            <AnimatePresence>
              {isContactOpen && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden px-7 pb-7 pt-3 border-t border-white/10"
                >
                  {isSubmitted ? (
                    <div className="py-10 text-center space-y-3">
                      <div className="w-10 h-10 rounded-full bg-[#1c39bb] text-white flex items-center justify-center mx-auto text-xs font-bold shadow-xl">✓</div>
                      <h4 className="font-serif text-lg text-white">Message Sent</h4>
                      <p className="text-xs text-gray-300 font-serif font-light">Thank you for reaching out. Our concierge will connect with you soon.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-wider text-blue-200 font-medium">Your Name</label>
                          <input 
                            type="text" 
                            required
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            placeholder="Ananya Deshmukh" 
                            className="w-full bg-[#02040c]/90 border border-white/20 px-3.5 py-2.5 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#3b60e4] transition-all shadow-inner"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-wider text-blue-200 font-medium">Email Address</label>
                          <input 
                            type="email" 
                            required
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            placeholder="ananya@example.com" 
                            className="w-full bg-[#02040c]/90 border border-white/20 px-3.5 py-2.5 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#3b60e4] transition-all shadow-inner"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-blue-200 font-medium">Your Message</label>
                        <textarea 
                          rows="3" 
                          required
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          placeholder="Tell us about your custom order or inquiry..." 
                          className="w-full bg-[#02040c]/90 border border-white/20 px-3.5 py-2.5 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#3b60e4] transition-all resize-none shadow-inner"
                        />
                      </div>

                      <motion.button 
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit" 
                        className="w-full bg-[#1c39bb] hover:bg-[#3b60e4] text-white py-3 rounded-xl text-[10px] uppercase tracking-[0.25em] font-medium shadow-2xl transition-all cursor-pointer border border-blue-400/40"
                      >
                        Send Message →
                      </motion.button>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10 px-6 text-center text-[11px] text-gray-500 tracking-wider relative z-15 bg-[#000103] font-light">
        <p>© {new Date().getFullYear()} Bhairavi Threads. All rights reserved. · Handcrafted in Pune & Varanasi</p>
      </footer>

      {/* BRAND FILM MODAL */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8"
          >
            <div className="relative w-full max-w-5xl aspect-video bg-[#020514] rounded-3xl overflow-hidden border border-white/25 shadow-2xl">
              <button 
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute top-5 right-5 z-30 w-9 h-9 rounded-full bg-black/70 border border-white/25 text-white flex items-center justify-center hover:bg-[#1c39bb] transition-colors cursor-pointer text-sm shadow-xl"
              >
                ✕
              </button>
              <video 
                src={assets.modelVideo1 || assets.heroVideo} 
                autoPlay 
                controls 
                playsInline 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}