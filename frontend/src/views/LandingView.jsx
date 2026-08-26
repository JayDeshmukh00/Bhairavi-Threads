import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

export default function LandingView({ setCurrentTab, token, setIsLoginView, setShowAuth }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeStorySlide, setActiveStorySlide] = useState(0);

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

  const bgVideoY = useTransform(scrollYProgress, [0, 0.3], ["0%", "20%"]);

  // 4 Full-Width Runway Videos with dedicated poster thumbnails and independent loading states
  const cinematicVideos = [
    {
      id: "01",
      title: "RAGA TISSUE ELEGANCE",
      subtitle: "Pure Gold & Silver Zari Weaves",
      desc: "A mesmerizing showcase of lustrous tissue drapes that shimmer gracefully under ambient light with timeless grace.",
      videoUrl: "https://res.cloudinary.com/dp3njnwvf/video/upload/v1787743132/raga_vr3wku.mp4",
      posterUrl: "https://res.cloudinary.com/dp3njnwvf/image/upload/v1787745923/Fashion_model_in_saree_202608261733_kcewke.jpg"
    },
    {
      id: "02",
      title: "HAND-PAINTED SILK ARTISTRY",
      subtitle: "Masterpieces Crafted by Artisans",
      desc: "Exquisite hand-painted florals and cultural motifs brought to life on pure mulberry silk canvases.",
      videoUrl: "https://res.cloudinary.com/dp3njnwvf/video/upload/v1787743131/handpainted_nhqimr.mp4",
      posterUrl: "https://res.cloudinary.com/dp3njnwvf/image/upload/v1787745924/Model_wearing_lotus_saree_202608261733_hj5tzp.jpg"
    },
    {
      id: "03",
      title: "ETHEREAL ORGANZA GRACE",
      subtitle: "Lightweight & Flowing Drapes",
      desc: "Delicate organza layers that float effortlessly around you, combining traditional ease with refined elegance.",
      videoUrl: "https://res.cloudinary.com/dp3njnwvf/video/upload/v1787743131/organza_rqjmfi.mp4",
      posterUrl: "https://res.cloudinary.com/dp3njnwvf/image/upload/v1787745924/Model_wearing_translucent_organz__202608261733_kl4khi.jpg"
    },
    {
      id: "04",
      title: "HERITAGE KALAMKARI",
      subtitle: "Traditional Stories on Fine Silk",
      desc: "Intricate pen-crafted heritage designs celebrating timeless Indian storytelling and unmatched craftsmanship.",
      videoUrl: "https://res.cloudinary.com/dp3njnwvf/video/upload/v1787743133/kalamkari_srd4ee.mp4",
      posterUrl: "https://res.cloudinary.com/dp3njnwvf/image/upload/v1787746490/Model_wearing_Kalamkari_print_saree_202608261741_nhddeo.jpg"
    }
  ];

  const collectionsList = [
    { 
      id: "01", 
      title: "Pure Silk Radiance", 
      desc: "Luxurious pure silk drapes designed for grace and celebratory elegance.", 
      longStory: "A stunning celebration of authentic Indian silk weaving, crafted to make every occasion feel truly unforgettable.",
      image: "https://res.cloudinary.com/dp3njnwvf/image/upload/v1787746490/Model_wearing_silk_saree_202608261743_cafdgm.jpg" 
    },
    { 
      id: "02", 
      title: "Obsidian Weave Edition", 
      desc: "Deep nightfall silks engineered with subtle matte threadwork.", 
      longStory: "Constructed for high-impact traditional gatherings and graceful evening occasions.",
      image: "https://res.cloudinary.com/dp3njnwvf/image/upload/v1787745924/Model_wearing_silk_saree_202608261733_lft8z8.jpg" 
    },
    { 
      id: "03", 
      title: "Structured Jamdani", 
      desc: "Tactile geometric patterns woven directly into sheer foundational threads.", 
      longStory: "A beautiful fusion of heritage handloom techniques created for graceful everyday elegance.",
      image: "https://res.cloudinary.com/dp3njnwvf/image/upload/v1787745923/Model_posing_in_Jamdani_saree_202608261733_cclanu.jpg" 
    },
    { 
      id: "04", 
      title: "Architectural Linen", 
      desc: "Breathable handspun linen structured into comfortable, graceful silhouettes.", 
      longStory: "Pure, soft, and delightfully comfortable—designed for effortless daily traditional wear.",
      image: "https://res.cloudinary.com/dp3njnwvf/image/upload/v1787745923/Model_posing_in_linen_saree_202608261733_kjjyxu.jpg" 
    },
    { 
      id: "05", 
      title: "Classic Tissue Splendor", 
      desc: "Gleaming tissue weaves reflecting rich cultural opulence and royal heritage.", 
      longStory: "An exquisite creation capturing the golden glow of traditional Indian celebrations.",
      image: "https://res.cloudinary.com/dp3njnwvf/image/upload/v1787745923/Fashion_model_in_saree_202608261733_kcewke.jpg" 
    },
    { 
      id: "06", 
      title: "Artisan Brushstroke Silk", 
      desc: "Artistic expressionist motifs painted directly onto rich silk canvases.", 
      longStory: "Wearable art born from the creative soul of traditional Indian craft studios.",
      image: "https://res.cloudinary.com/dp3njnwvf/image/upload/v1787745923/Model_posing_against_concrete_wall_202608261733_ekfbmp.jpg" 
    },
    { 
      id: "07", 
      title: "Pure Alabaster Weave", 
      desc: "Graceful ivory silhouettes crafted for serene family gatherings.", 
      longStory: "Timeless traditional beauty expressed through pure fabrics and flawless drapes.",
      image: "https://res.cloudinary.com/dp3njnwvf/image/upload/v1787745924/Model_posing_in_white_saree_202608261733_phxsqu.jpg" 
    }
  ];

  const newDropsProducts = [
    { 
      id: 1, 
      category: "Hand Painted", 
      title: "Hand-Painted Lotus Masterpiece", 
      price: "₹13,850", 
      img: "https://res.cloudinary.com/dp3njnwvf/image/upload/v1787745924/Model_wearing_lotus_saree_202608261733_hj5tzp.jpg", 
      colors: ["#111111", "#d4af37", "#3b82f6"] 
    },
    { 
      id: 2, 
      category: "Organza", 
      title: "Translucent Smoke Organza", 
      price: "₹9,250", 
      img: "https://res.cloudinary.com/dp3njnwvf/image/upload/v1787745924/Model_wearing_translucent_organz__202608261733_kl4khi.jpg", 
      colors: ["#e5e7eb", "#9ca3af", "#4b5563"] 
    },
    { 
      id: 3, 
      category: "Kalamkari", 
      title: "Traditional Kalamkari Print", 
      price: "₹12,950", 
      img: "https://res.cloudinary.com/dp3njnwvf/image/upload/v1787746490/Model_wearing_Kalamkari_print_saree_202608261741_nhddeo.jpg", 
      colors: ["#111111", "#333333", "#8b4513"] 
    },
    { 
      id: 4, 
      category: "Cotton", 
      title: "Pure Handspun Cotton", 
      price: "₹7,150", 
      img: "https://res.cloudinary.com/dp3njnwvf/image/upload/v1787745923/Model_posing_in_cotton_saree_202608261733_jamku8.jpg", 
      colors: ["#f3f4f6", "#d1d5db", "#9ca3af"] 
    },
    { 
      id: 5, 
      category: "Cyber Tissue", 
      title: "Lustrous Tissue Drape", 
      price: "₹14,500", 
      img: "https://res.cloudinary.com/dp3njnwvf/image/upload/v1787745923/Fashion_model_in_saree_202608261733_kcewke.jpg", 
      colors: ["#e2e8f0", "#d4af37", "#334155"] 
    },
    { 
      id: 6, 
      category: "Hand Painted", 
      title: "Artisan Brushstroke Silk", 
      price: "₹11,850", 
      img: "https://res.cloudinary.com/dp3njnwvf/image/upload/v1787745923/Model_posing_against_concrete_wall_202608261733_ekfbmp.jpg", 
      colors: ["#000000", "#71717a", "#d4af37"] 
    },
    { 
      id: 7, 
      category: "Organza", 
      title: "Ethereal Chiffon Drape", 
      price: "₹10,400", 
      img: "https://res.cloudinary.com/dp3njnwvf/image/upload/v1787745924/Model_wearing_chiffon_saree_202608261733_xjtvlg.jpg", 
      colors: ["#cbd5e1", "#64748b", "#0f172a"] 
    },
    { 
      id: 8, 
      category: "Kalamkari", 
      title: "Heritage Silk Weave", 
      price: "₹15,200", 
      img: "https://res.cloudinary.com/dp3njnwvf/image/upload/v1787745924/Model_posing_in_silk_saree_202608261733_eed21f.jpg", 
      colors: ["#1c1917", "#44403c", "#d4af37"] 
    }
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
    <div ref={containerRef} className="bg-[#fcfbf9] text-[#111111] min-h-screen overflow-x-hidden relative selection:bg-[#111111] selection:text-white font-sans pointer-events-auto">
      
      {/* BACKGROUND AUDIO */}
      <audio ref={audioRef} loop src="/music/music.mp3" />

      {/* HEADER */}
      <header className="absolute top-0 inset-x-0 z-50 bg-gradient-to-b from-black/60 via-black/20 to-transparent px-6 lg:px-16 py-6 transition-all">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between text-white">
          
          <div className="cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <h1 className="font-serif text-lg sm:text-2xl tracking-[0.25em] uppercase font-light text-white drop-shadow-md">
              Bhairavi Threads
            </h1>
            <span className="text-[7px] uppercase tracking-[0.4em] text-gray-300 block font-mono">
              Varanasi · Pune · Handloom
            </span>
          </div>

          <nav className="hidden lg:flex items-center gap-8 text-[10px] uppercase tracking-[0.25em] font-medium text-gray-200">
            <button onClick={() => setCurrentTab("store")} className="hover:text-white transition-colors cursor-pointer bg-transparent border-none text-gray-200 drop-shadow">Store</button>
            <a href="#new-drops" className="hover:text-white transition-colors drop-shadow">Collections</a>
            <a href="#btv-cinematic" className="hover:text-white transition-colors drop-shadow">Runway</a>
            <a href="#btv-story" className="hover:text-white transition-colors drop-shadow">Our Story</a>
            <a href="#btv-collections" className="hover:text-white transition-colors drop-shadow">Exclusives</a>
          </nav>

          <div className="flex items-center gap-5">
            <button 
              onClick={toggleAudio}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] uppercase tracking-widest border transition-all cursor-pointer backdrop-blur-md ${isPlayingAudio ? 'bg-white text-black border-white' : 'border-white/40 text-gray-200 hover:bg-white/20 bg-black/40'}`}
            >
              <span>{isPlayingAudio ? '♫ Audio On' : 'Sound Vibe'}</span>
            </button>

            <button onClick={() => setCurrentTab("store")} className="text-[10px] uppercase tracking-[0.2em] text-gray-200 hover:text-white transition-colors bg-transparent border-none cursor-pointer hidden sm:block drop-shadow">
              Search
            </button>

            <button onClick={() => setCurrentTab("cart")} className="text-[10px] uppercase tracking-[0.2em] text-gray-200 hover:text-white transition-colors bg-transparent border-none cursor-pointer drop-shadow">
              Bag
            </button>

            {token ? (
              <button onClick={() => setCurrentTab("profile")} className="text-[10px] uppercase tracking-[0.2em] text-white font-medium border-b border-white pb-0.5 cursor-pointer bg-transparent drop-shadow">
                Profile
              </button>
            ) : (
              <div className="flex items-center gap-2.5">
                <button onClick={() => handleOpenAuth(true)} className="text-[10px] uppercase tracking-[0.2em] text-gray-200 hover:text-white transition-colors bg-transparent border-none cursor-pointer drop-shadow">
                  Login
                </button>
                <button onClick={() => handleOpenAuth(false)} className="px-4 py-1.5 bg-white text-black text-[9px] uppercase tracking-[0.2em] rounded-none hover:bg-gray-100 transition-colors cursor-pointer font-medium shadow-lg">
                  Register
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      <main className="relative z-10 bg-[#fcfbf9]">
        
        {/* HERO SECTION WITH BALANCED CONTRAST OVERLAY */}
        <section className="relative h-screen w-full flex flex-col justify-end items-start pb-24 px-8 lg:px-16 overflow-hidden bg-black">
          <motion.div 
            style={{ y: bgVideoY }}
            className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
          >
            <video 
              src="https://res.cloudinary.com/dp3njnwvf/video/upload/v1787750108/Models_modeling_silk_sarees_202608261842_v90zej.mp4" 
              autoPlay 
              muted 
              loop 
              playsInline 
              className="w-full h-full object-cover filter brightness-[0.75]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10 max-w-4xl space-y-6 text-white"
          >
            <span className="text-[9px] uppercase tracking-[0.4em] text-gray-300 block font-mono">
              [ HANDCRAFTED HERITAGE SAREES ]
            </span>

            <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light leading-[1.1] tracking-tight text-white drop-shadow-md">
              Timeless Indian Grace, <br />
              <span className="italic font-light text-gray-200">Reimagined for Today</span>
            </h2>

            <p className="font-sans text-xs sm:text-sm text-gray-200 max-w-lg leading-relaxed font-light tracking-wide drop-shadow">
              Experience the unmatched richness of authentic Indian handlooms. From the sacred looms of Varanasi to your wardrobe, every weave tells a story of unmatched devotion and artistry.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentTab("store")}
                className="bg-white text-black hover:bg-gray-100 px-8 py-3.5 text-[10px] uppercase tracking-[0.3em] font-medium transition-all cursor-pointer shadow-2xl"
              >
                Explore Sarees
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsVideoModalOpen(true)}
                className="bg-black/30 hover:bg-black/50 text-white border border-white/40 px-7 py-3.5 text-[10px] uppercase tracking-[0.3em] font-light transition-all cursor-pointer backdrop-blur-md"
              >
                Watch Our Craft ✦
              </motion.button>
            </div>
          </motion.div>
        </section>


        {/* RUNWAY SECTIONS — TRANSFORMED INTO INDEPENDENT GALLERY CARDS WITH SPACING */}
        <div id="btv-cinematic" className="w-full bg-[#fcfbf9] py-20 px-8 lg:px-16 max-w-[1800px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-14 border-b border-black/15 pb-8"
          >
            <span className="text-[9px] uppercase tracking-[0.4em] text-gray-500 font-mono block mb-2">SIGNATURE DRAPES</span>
            <h3 className="font-serif text-3xl sm:text-5xl font-light text-[#111111]">Artistry in Motion</h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
            {cinematicVideos.map((vid, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: (idx % 2) * 0.15 }}
                className="group bg-white border border-black/15 overflow-hidden flex flex-col justify-between shadow-lg hover:border-black/40 transition-all duration-500"
              >
                {/* Independent Video Container with Poster Fallback */}
                <div className="relative aspect-[16/10] w-full bg-black overflow-hidden">
                  <video 
                    src={vid.videoUrl}
                    poster={vid.posterUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="none"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-[0.85]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#111111] px-3 py-1 text-[8px] uppercase tracking-widest font-mono border border-black/15 shadow-sm">
                    RUNWAY {vid.id}
                  </span>
                </div>

                {/* Content Area */}
                <div className="p-8 space-y-4 flex flex-col justify-between flex-grow">
                  <div className="space-y-2">
                    <span className="text-[9px] uppercase tracking-[0.4em] text-gray-500 font-mono block">
                      {vid.subtitle}
                    </span>
                    <h4 className="font-serif text-2xl sm:text-3xl font-light tracking-wide text-[#111111]">
                      {vid.title}
                    </h4>
                    <p className="font-sans text-xs sm:text-sm text-gray-700 font-light leading-relaxed">
                      {vid.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-black/10 flex items-center justify-between">
                    <span className="text-[9px] uppercase tracking-[0.4em] font-mono text-gray-500">[ BHAIRAVI RUNWAY ]</span>
                    <button 
                      onClick={() => setCurrentTab("store")}
                      className="text-[10px] uppercase tracking-[0.3em] text-[#111111] hover:text-gray-600 transition-colors bg-transparent cursor-pointer font-bold font-mono"
                    >
                      Explore Weave →
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>


        {/* BRAND STORY SECTION (LIGHT THEME WITH CRISP TEXT) */}
        <section id="btv-story" className="relative w-full min-h-screen bg-[#fcfbf9] py-28 px-8 lg:px-16 overflow-hidden flex flex-col justify-center border-t border-black/10">
          <div className="max-w-[1800px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="lg:col-span-5 space-y-8 z-10"
            >
              <div className="space-y-3">
                <span className="text-[9px] uppercase tracking-[0.4em] text-gray-500 font-mono">
                  [ CHAPTER 0{activeStorySlide + 1} // OUR HERITAGE STORY ]
                </span>
                <h3 className="font-serif text-3xl sm:text-5xl font-light text-[#111111] leading-tight">
                  Rooted in Tradition, Crafted with Love
                </h3>
              </div>

              <div className="space-y-6 text-gray-800 font-light text-sm leading-relaxed">
                {activeStorySlide === 0 && (
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-4">
                    <p className="text-gray-800 font-normal">
                      Bhairavi Threads was born out of a deep reverence for India’s rich textile heritage. Connecting the historic handloom clusters of Varanasi with the vibrant creative energy of Pune, our journey is dedicated to celebrating the authentic soul of the Indian saree.
                    </p>
                    <p className="text-xs text-gray-600 font-mono">
                      "Every drape tells a story of family, celebration, and generational craftsmanship."
                    </p>
                  </motion.div>
                )}
                {activeStorySlide === 1 && (
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-4">
                    <p className="text-gray-800 font-normal">
                      Behind every single saree is the patient, unhurried work of master artisans. Passing fine silk threads through traditional wooden looms, they pour weeks of devotion into creating wearable masterpieces that honor our ancestors.
                    </p>
                    <p className="text-xs text-gray-600 font-mono">
                      "True luxury is measured in the hours of skilled hands and timeless dedication."
                    </p>
                  </motion.div>
                )}
                {activeStorySlide === 2 && (
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-4">
                    <p className="text-gray-800 font-normal">
                      We bring you authentic handlooms styled with contemporary grace. Whether it is a grand wedding celebration or an intimate family gathering, our sarees ensure you carry Indian elegance with effortless pride.
                    </p>
                    <p className="text-xs text-gray-600 font-mono">
                      "Wear your heritage with pride and absolute grace."
                    </p>
                  </motion.div>
                )}
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-black/15">
                {[
                  { title: "Our Roots" },
                  { title: "Our Artisans" },
                  { title: "Our Promise" }
                ].map((tab, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveStorySlide(idx)}
                    className={`text-[9px] uppercase tracking-[0.3em] py-2 px-4 transition-all cursor-pointer font-mono border ${activeStorySlide === idx ? 'bg-[#111111] text-white border-[#111111] font-bold shadow-md' : 'bg-white text-gray-800 border-black/20 hover:border-black'}`}
                  >
                    0{idx + 1} // {tab.title}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="lg:col-span-7 relative"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-white border border-black/15 shadow-2xl group">
                <img 
                  src="https://res.cloudinary.com/dp3njnwvf/image/upload/v1787745923/Artisans_crafting_luxury_hand-pa__202608261733_x9ikh4.jpg" 
                  alt="Artisans crafting luxury hand-painted sarees" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white font-mono text-[10px] tracking-[0.3em] drop-shadow-md">
                  <span>[ VARANASI & PUNE CRAFT STUDIOS ]</span>
                  <span className="text-gray-200">100% AUTHENTIC HANDLOOM</span>
                </div>
              </div>
            </motion.div>

          </div>
        </section>


        {/* NEW DROPS & PRODUCT GRID */}
        <section id="new-drops" className="py-28 px-8 lg:px-16 max-w-[1800px] mx-auto bg-[#fcfbf9]">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 border-b border-black/15 pb-8"
          >
            <div className="space-y-2">
              <span className="text-[9px] uppercase tracking-[0.4em] text-gray-500 font-mono">CURATED COLLECTIONS</span>
              <h3 className="font-serif text-3xl sm:text-5xl font-light text-[#111111]">Handloom Masterpieces</h3>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {['All', 'Hand Painted', 'Organza', 'Kalamkari', 'Cotton', 'Cyber Tissue'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-[10px] uppercase tracking-[0.25em] transition-all cursor-pointer border ${selectedCategory === cat ? 'bg-[#111111] text-white border-[#111111] font-medium' : 'bg-white text-gray-800 border-black/20 hover:border-black'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((prod, idx) => (
                <motion.div 
                  key={prod.id || idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: (idx % 4) * 0.15 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  onClick={() => setCurrentTab("store")}
                  className="group bg-white border border-black/15 p-4 flex flex-col justify-between cursor-pointer hover:border-black/50 transition-all duration-500 shadow-md"
                >
                  <div>
                    <div className="aspect-[4/5] overflow-hidden bg-gray-100 mb-4 relative">
                      <img src={prod.img} alt={prod.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <span className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-xs text-black border border-black/20 shadow-sm">
                        ♡
                      </span>
                      <span className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md text-[#111111] px-3 py-1 text-[8px] uppercase tracking-widest font-mono border border-black/15">
                        {prod.category}
                      </span>
                    </div>
                    <h4 className="font-serif text-lg text-[#111111] font-medium line-clamp-1">{prod.title}</h4>
                  </div>

                  <div className="pt-4 flex items-center justify-between mt-4 border-t border-black/10">
                    <span className="font-mono text-sm text-[#111111] font-bold">{prod.price}</span>
                    <div className="flex items-center gap-1.5">
                      {prod.colors.map((c, cIdx) => (
                        <span key={cIdx} className="w-2.5 h-2.5 rounded-full border border-black/30 shadow-xs" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-gray-500 font-serif text-sm">
                No sarees found in this collection. Explore All!
              </div>
            )}
          </div>
        </section>


        {/* EXCLUSIVE EDITIONS */}
        <section id="btv-collections" className="py-28 px-8 lg:px-16 max-w-[1800px] mx-auto bg-[#fcfbf9]">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-xl mx-auto space-y-3 mb-20"
          >
            <span className="text-[9px] uppercase tracking-[0.4em] text-gray-500 font-mono">EXCLUSIVE EDITIONS</span>
            <h3 className="font-serif text-3xl sm:text-5xl font-light text-[#111111]">Classic Handloom Drapes</h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {collectionsList.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: (idx % 2) * 0.2 }}
                onClick={() => setCurrentTab("store")}
                className={`group bg-white border border-black/15 p-6 flex flex-col justify-between cursor-pointer hover:border-black/50 transition-all duration-500 shadow-md ${idx === 0 ? 'md:col-span-2' : ''}`}
              >
                <div className="space-y-4">
                  <div className={`overflow-hidden bg-gray-100 relative ${idx === 0 ? 'aspect-[21/9]' : 'aspect-[16/10]'}`}>
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[#111111] px-3 py-1 text-[8px] uppercase tracking-widest font-mono border border-black/15">
                      EDITION {item.id}
                    </span>
                  </div>
                  <div className="space-y-2 pt-2">
                    <h4 className="font-serif text-2xl sm:text-3xl text-[#111111] font-medium">{item.title}</h4>
                    <p className="font-sans text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">{item.desc}</p>
                    <p className="font-sans text-[11px] text-gray-600 italic font-light pt-2 border-t border-black/10">{item.longStory}</p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-black/10 flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-[0.4em] font-mono text-gray-500">[ BHAIRAVI ARCHIVES ]</span>
                  <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-[#111111] group-hover:text-gray-600 transition-colors font-bold">
                    Explore Edition →
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>


        {/* CONCIERGE CONTACT SECTION */}
        <section id="btv-contact" className="bg-[#fcfbf9] py-24 border-t border-black/15 px-8">
          <div className="max-w-2xl mx-auto bg-white border border-black/20 p-10 shadow-2xl">
            <button 
              onClick={() => setIsContactOpen(!isContactOpen)}
              className="w-full flex items-center justify-between text-left cursor-pointer bg-transparent border-none"
            >
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-[0.4em] text-gray-500 font-mono">CUSTOMER CONCIERGE</span>
                <h3 className="font-serif text-xl sm:text-2xl text-[#111111] font-medium">Custom Inquiries & Private Consultations</h3>
              </div>
              <span className="text-lg font-mono text-[#111111] font-bold">
                {isContactOpen ? '−' : '+'}
              </span>
            </button>

            <AnimatePresence>
              {isContactOpen && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden pt-8 border-t border-black/15 mt-6"
                >
                  {isSubmitted ? (
                    <div className="py-8 text-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-[#111111] text-white flex items-center justify-center mx-auto text-xs font-bold">✓</div>
                      <h4 className="font-serif text-xl text-[#111111] font-medium">Inquiry Sent Successfully</h4>
                      <p className="font-sans text-xs text-gray-600">Our team will get in touch with you shortly.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-[9px] uppercase tracking-wider text-gray-700 font-mono font-semibold">Your Name</label>
                          <input 
                            type="text" 
                            required
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            placeholder="Ananya Deshmukh" 
                            className="w-full bg-gray-50 border border-black/25 px-4 py-3 text-xs text-[#111111] focus:outline-none focus:border-black font-sans"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[9px] uppercase tracking-wider text-gray-700 font-mono font-semibold">Email Address</label>
                          <input 
                            type="email" 
                            required
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            placeholder="ananya@example.com" 
                            className="w-full bg-gray-50 border border-black/25 px-4 py-3 text-xs text-[#111111] focus:outline-none focus:border-black font-sans"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase tracking-wider text-gray-700 font-mono font-semibold">Message / Requirements</label>
                        <textarea 
                          rows="3" 
                          required
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          placeholder="Tell us about your saree preference or special occasion..." 
                          className="w-full bg-gray-50 border border-black/25 px-4 py-3 text-xs text-[#111111] focus:outline-none focus:border-black font-sans resize-none"
                        />
                      </div>

                      <button 
                        type="submit" 
                        className="w-full bg-[#111111] hover:bg-black text-white py-4 text-[10px] uppercase tracking-[0.3em] font-medium transition-colors cursor-pointer shadow-lg"
                      >
                        Submit Inquiry →
                      </button>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-[#111111] text-gray-300 py-16 px-8 text-center font-mono tracking-widest text-[10px] space-y-4 border-t border-black/20">
        <h2 className="font-serif text-3xl tracking-[0.3em] uppercase text-white font-light">Bhairavi Threads</h2>
        <p className="text-gray-400 text-[9px]">Handloom Studios · Varanasi · Pune · Mumbai · Delhi</p>
        <div className="w-12 h-[1px] bg-white/35 mx-auto my-4" />
        <p className="text-[9px] text-gray-400">© {new Date().getFullYear()} Bhairavi Threads. All rights reserved. Authentic Indian Handlooms.</p>
      </footer>

      {/* BRAND FILM MODAL */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
          >
            <div className="relative w-full max-w-6xl aspect-video bg-black border border-white/20 shadow-2xl">
              <button 
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute top-5 right-5 z-30 w-9 h-9 bg-white text-black flex items-center justify-center font-mono text-xs font-bold cursor-pointer hover:bg-gray-200"
              >
                ✕
              </button>
              <video 
                src="https://res.cloudinary.com/dp3njnwvf/video/upload/v1787751698/Handloom_saree_creation_visual_s__202608261911_ickzj3.mp4" 
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