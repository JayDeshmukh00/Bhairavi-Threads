import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

export default function StoreView({ 
  products, 
  searchQuery, setSearchQuery, 
  filterDesign, setFilterDesign, 
  filterColor, setFilterColor, 
  sortBy, setSortBy, 
  selectedVariants, handleVariantChange, 
  addToCart, wishlist, setWishlist, 
  setDetailProduct,
  currentTab, categories 
}) {
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const isCategoryTab = categories.some(c => c.name === currentTab);
      const matchesCategory = !isCategoryTab || p.material === currentTab;

      const matchesSearch = !searchQuery || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const vIndex = selectedVariants[p._id] || 0;
      const activeVariant = p.variants?.[vIndex] || p.variants?.[0];
      const matchesDesign = filterDesign === 'All' || (activeVariant && activeVariant.design === filterDesign);
      const matchesColor = filterColor === 'All' || (activeVariant && activeVariant.color === filterColor);

      return matchesCategory && matchesSearch && matchesDesign && matchesColor;
    }).sort((a, b) => {
      const vAIdx = selectedVariants[a._id] || 0;
      const vBIdx = selectedVariants[b._id] || 0;
      const priceA = a.variants?.[vAIdx]?.price || a.price || 0;
      const priceB = b.variants?.[vBIdx]?.price || b.price || 0;

      if (sortBy === 'low-high') return priceA - priceB;
      if (sortBy === 'high-low') return priceB - priceA;
      if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      return 0;
    });
  }, [products, searchQuery, filterDesign, filterColor, sortBy, currentTab, selectedVariants, categories]);

  const toggleWishlist = (pId) => {
    setWishlist(prev => prev.includes(pId) ? prev.filter(id => id !== pId) : [...prev, pId]);
  };

  return (
    <div className="bg-[#000103] text-[#f8fafc] min-h-screen relative overflow-x-hidden font-sans pb-24 pt-8 px-4 sm:px-8 lg:px-12 max-w-[1500px] mx-auto pointer-events-auto">
      
      {/* STATIC BACKGROUND GLOW ORBS */}
      <div className="absolute top-1/4 left-10 w-[600px] h-[600px] bg-[#1c39bb]/15 rounded-full blur-[220px] pointer-events-none z-0" />
      <div className="absolute top-[55%] right-10 w-[600px] h-[600px] bg-[#3b60e4]/15 rounded-full blur-[220px] pointer-events-none z-0" />

      {/* SEARCH & FILTERS PANEL */}
      <div className="bg-[#02040c]/90 backdrop-blur-2xl p-5 sm:p-6 rounded-3xl flex flex-col md:flex-row gap-4 items-center justify-between relative z-10 border border-white/15 shadow-[0_15px_35px_rgba(0,0,0,0.5)] mb-12">
        <div className="w-full md:w-1/3">
          <input 
            type="text" 
            placeholder="Search drops..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full bg-[#02040c]/90 border border-white/20 px-4 py-3 rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#3b60e4] transition-all shadow-inner"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select value={filterDesign} onChange={(e) => setFilterDesign(e.target.value)} className="bg-[#02040c] border border-white/20 px-4 py-3 rounded-2xl text-xs text-white focus:outline-none focus:border-[#3b60e4] cursor-pointer">
            <option value="All" className="bg-[#02040c]">All Designs</option>
            <option value="Classic" className="bg-[#02040c]">Classic Motifs</option>
            <option value="Kalamkari" className="bg-[#02040c]">Kalamkari</option>
          </select>

          <select value={filterColor} onChange={(e) => setFilterColor(e.target.value)} className="bg-[#02040c] border border-white/20 px-4 py-3 rounded-2xl text-xs text-white focus:outline-none focus:border-[#3b60e4] cursor-pointer">
            <option value="All" className="bg-[#02040c]">All Colors</option>
            <option value="Crimson" className="bg-[#02040c]">Crimson</option>
            <option value="Ivory" className="bg-[#02040c]">Ivory</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-[#02040c] border border-white/20 px-4 py-3 rounded-2xl text-xs text-white focus:outline-none focus:border-[#3b60e4] cursor-pointer">
            <option value="default" className="bg-[#02040c]">Sort: Featured</option>
            <option value="low-high" className="bg-[#02040c]">Price: Low to High</option>
            <option value="high-low" className="bg-[#02040c]">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* PRODUCT GRID - 4 WIDER CARDS WITH GLASSMORPHISM */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 relative z-10" style={{ perspective: 1400 }}>
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-20 text-gray-400 font-serif text-sm">
            No sarees found matching this category curation.
          </div>
        ) : (
          filteredProducts.map((p, idx) => {
            const vIndex = selectedVariants[p._id] || 0;
            const variant = p.variants?.[vIndex] || p.variants?.[0] || {};
            const currentImages = variant.images?.length > 0 ? variant.images : (p.images || ['https://via.placeholder.com/300']);
            const isWishlisted = wishlist.includes(p._id);

            return (
              <motion.div 
                key={p._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.03 }}
                whileHover={{ 
                  scale: 1.02, 
                  y: -6, 
                  rotateX: 2, 
                  rotateY: -2, 
                  transition: { duration: 0.2, ease: "easeOut" } 
                }}
                style={{ 
                  backfaceVisibility: 'hidden', 
                  transformStyle: 'preserve-3d', 
                  willChange: 'transform' 
                }}
                onClick={() => setDetailProduct(p)}
                className="group bg-white/[0.03] backdrop-blur-xl rounded-3xl p-5 border border-white/10 hover:border-[#3b60e4]/80 flex flex-col justify-between cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
              >
                <div>
                  {/* Wider Image Container */}
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black mb-4 shadow-2xl">
                    <img src={currentImages[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95" />
                    
                    <button onClick={(e) => { e.stopPropagation(); toggleWishlist(p._id); }} className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white text-sm border border-white/20 hover:bg-[#1c39bb] transition-colors cursor-pointer shadow-lg">
                      {isWishlisted ? '♥' : '♡'}
                    </button>

                    {variant.stockStatus === 'Out of Stock' && (
                      <div className="absolute inset-x-0 bottom-0 bg-black/90 text-red-400 text-[9px] uppercase tracking-widest text-center py-2 font-bold backdrop-blur-md border-t border-red-500/20">
                        Sold Out
                      </div>
                    )}
                  </div>

                  <span className="text-[9px] uppercase font-mono text-blue-300 tracking-widest block mb-1">{p.material}</span>
                  <h3 className="font-serif text-sm sm:text-base text-white font-normal line-clamp-1">{p.name}</h3>
                </div>

                <div className="pt-3.5 flex items-center justify-between mt-3.5 border-t border-white/10">
                  <span className="font-mono text-sm text-gray-100 font-semibold">₹{variant.price || 0}</span>
                  
                  {p.variants && p.variants.length > 1 && (
                    <div className="flex items-center gap-2">
                      {p.variants.map((v, i) => (
                        <span 
                          key={i} 
                          onClick={(e) => { e.stopPropagation(); handleVariantChange(p._id, i); }}
                          className={`w-3 h-3 rounded-full border border-white/35 shadow-md cursor-pointer ${vIndex === i ? 'ring-2 ring-blue-400' : ''}`} 
                          style={{ backgroundColor: v.color?.toLowerCase() || '#1c39bb' }} 
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Glassmorphic Add to Bag Button */}
                <button 
                  onClick={(e) => { e.stopPropagation(); addToCart(p); }}
                  disabled={variant.stockStatus === 'Out of Stock'}
                  className={`w-full mt-3.5 py-3 text-[10px] uppercase tracking-[0.2em] rounded-xl font-medium transition-all shadow-xl backdrop-blur-md ${variant.stockStatus === 'Out of Stock' ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5' : 'bg-[#1c39bb]/80 hover:bg-[#3b60e4] text-white cursor-pointer border border-blue-400/50 shadow-[0_0_20px_rgba(28,57,187,0.4)]'}`}
                >
                  {variant.stockStatus === 'Out of Stock' ? 'Sold Out' : 'Add to Bag'}
                </button>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}