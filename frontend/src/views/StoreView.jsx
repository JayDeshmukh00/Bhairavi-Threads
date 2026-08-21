import { useState } from 'react';
import { DESIGN_OPTIONS, COLOR_OPTIONS, MY_WHATSAPP_NUMBER, ui } from '../utils/constants';

export default function StoreView({ 
  products, searchQuery, setSearchQuery, 
  filterDesign, setFilterDesign, filterColor, setFilterColor, 
  sortBy, setSortBy, selectedVariants, handleVariantChange, 
  addToCart, wishlist, setWishlist, setDetailProduct 
}) {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [openDrawerId, setOpenDrawerId] = useState(null);

  return (
    <div className="space-y-16 pb-24 text-[#1a1a1a]">
      
      {/* EDITORIAL HERO BANNER */}
      <div className="text-center max-w-2xl mx-auto space-y-4 pt-4 pb-2">
        <span className="text-[10px] uppercase tracking-[0.35em] text-[#777]">The Trousseau Collection</span>
        <h2 className="saree-brand-title-dark text-3xl md:text-5xl font-normal tracking-wide">Handwoven Heritage</h2>
        <p className="text-xs text-[#666] tracking-wider leading-relaxed font-serif">
          Each drape tells a story of ancient looms, pure zari threads, and generational craftsmanship.
        </p>
      </div>

      {/* MINIMALIST ATELIER FILTERS */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-y border-black/10 py-6">
        <div className="w-full md:w-80">
          <input 
            type="text" 
            placeholder="Search by weave, name, or thread..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full bg-[#f4f1ea] border border-black/10 rounded-full px-5 py-3 text-xs uppercase tracking-widest focus:outline-none focus:border-black transition-all" 
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
          <select value={filterDesign} onChange={(e) => setFilterDesign(e.target.value)} className="bg-transparent border border-black/15 rounded-full px-5 py-2.5 text-[10px] uppercase tracking-widest text-[#444] focus:outline-none">
            <option value="All">All Weaves</option>
            {DESIGN_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <select value={filterColor} onChange={(e) => setFilterColor(e.target.value)} className="bg-transparent border border-black/15 rounded-full px-5 py-2.5 text-[10px] uppercase tracking-widest text-[#444] focus:outline-none">
            <option value="All">All Shades</option>
            {COLOR_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent border border-black/15 rounded-full px-5 py-2.5 text-[10px] uppercase tracking-widest text-[#444] focus:outline-none">
            <option value="default">Sort: Curated</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* LUXURY EDITORIAL GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-20 items-start">
        {products.map(product => {
          const vIndex = selectedVariants[product._id] ?? 0;
          const variant = product.variants?.[vIndex] || product.variants?.[0] || {};
          
          const images = (variant.images && variant.images.length > 0) ? variant.images : (product.images || ['https://via.placeholder.com/400']);
          const primaryImage = images[0] || '';
          const secondaryImage = images[1] || primaryImage;
          const variantVideo = variant.videoUrl || '';
          const isHovered = hoveredCard === product._id;
          const isDrawerOpen = openDrawerId === product._id;

          const handleWhatsAppInquiry = (e) => {
            e.stopPropagation();
            const msg = `Hello Bhairavi Threads! I wish to enquire about this creation:\n\n*${product.name}*\nMaterial: ${product.material}\nVariant: ${variant.color} - ${variant.design}\nPrice: ₹${variant.price}\nImage: ${primaryImage}`;
            window.open(`https://wa.me/${MY_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
          };

          return (
            <div 
              key={product._id} 
              className="group flex flex-col justify-between h-full space-y-4 cursor-pointer"
              onMouseEnter={() => setHoveredCard(product._id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Cinematic Visual Frame with Auto-Hover Video / Zoom */}
              <div 
                className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl bg-[#f4f1ea] shadow-sm transition-all duration-700 group-hover:shadow-xl"
                onClick={() => setDetailProduct(product)}
              >
                {/* Video plays on hover if available */}
                {variantVideo && isHovered ? (
                  <video 
                    src={variantVideo} 
                    autoPlay 
                    muted 
                    loop 
                    playsInline 
                    className="w-full h-full object-cover transition-transform duration-1000 scale-105"
                  />
                ) : (
                  <img 
                    src={isHovered ? secondaryImage : primaryImage} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                )}

                {/* Floating Wishlist Heart */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    const exists = wishlist.includes(product._id);
                    setWishlist(exists ? wishlist.filter(id => id !== product._id) : [...wishlist, product._id]);
                  }}
                  className="absolute top-4 right-4 z-20 text-sm transition-transform hover:scale-125 bg-white/90 backdrop-blur-md w-9 h-9 rounded-full flex items-center justify-center shadow-md"
                >
                  {wishlist.includes(product._id) ? '♥' : '♡'}
                </button>

                {/* Craftsmanship Badge */}
                <div className="absolute bottom-4 left-4 z-10 bg-black/40 backdrop-blur-md text-[#fbf9f5] px-3 py-1 rounded-full text-[9px] uppercase tracking-[0.2em]">
                  100% Handloom
                </div>
              </div>

              {/* Title & Price Information */}
              <div className="space-y-1 text-center" onClick={() => setDetailProduct(product)}>
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#888] block">{product.material} Weave</span>
                <h3 className="saree-brand-title-dark text-base font-normal tracking-wide hover:opacity-75 truncate px-2">
                  {product.name}
                </h3>
                <p className="font-serif text-base font-medium tracking-wide text-black">₹{variant.price || 'N/A'}</p>
              </div>

              {/* Curated Action & Options Drawer */}
              <div className="space-y-2 pt-1">
                <button 
                  onClick={() => addToCart(product)}
                  disabled={variant.stockStatus === 'Out of Stock'}
                  className={`w-full py-3 text-[10px] uppercase tracking-[0.25em] rounded-xl transition-all font-medium ${variant.stockStatus === 'Out of Stock' ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#111111] text-[#fbf9f5] hover:bg-black shadow-sm'}`}
                >
                  {variant.stockStatus === 'Out of Stock' ? 'Archived / Sold Out' : 'Curate to Trunk'}
                </button>

                {/* Atelier Quick Drawer Toggle */}
                <div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDrawerId(isDrawerOpen ? null : product._id);
                    }}
                    className="w-full py-2 text-[9px] uppercase tracking-[0.2em] text-[#555] bg-[#f4f1ea] border border-black/10 rounded-xl hover:bg-[#ebe6dc] transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>{isDrawerOpen ? 'Close Atelier Options ▲' : 'Shades & Enquire ▼'}</span>
                  </button>

                  {/* Collapsible Atelier Drawer */}
                  {isDrawerOpen && (
                    <div className="mt-2 p-3.5 bg-[#f4f1ea] rounded-xl border border-black/15 space-y-3 animate-fadeIn text-left">
                      {product.variants && product.variants.length > 0 && (
                        <div>
                          <span className="text-[8px] uppercase tracking-widest text-[#777] block mb-1.5">Color Shades:</span>
                          <div className="flex gap-1.5 flex-wrap">
                            {product.variants.map((v, idx) => (
                              <button 
                                key={idx}
                                onClick={(e) => { e.stopPropagation(); handleVariantChange(product._id, idx); }}
                                className={`text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-lg transition-all ${vIndex === idx ? 'bg-black text-white font-bold shadow-sm' : 'bg-white text-[#444] border border-black/10 hover:border-black'}`}
                              >
                                {v.color}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <button 
                        onClick={handleWhatsAppInquiry}
                        className="w-full py-2.5 text-[9px] uppercase tracking-[0.2em] rounded-xl bg-[#2fae60] text-white font-medium hover:bg-[#258d50] transition-all flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        💬 Private WhatsApp Enquire
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}