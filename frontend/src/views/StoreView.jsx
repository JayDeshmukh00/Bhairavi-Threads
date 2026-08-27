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
  const availableDesigns = useMemo(() => {
    const designs = new Set(['All']);
    products.forEach(p => {
      p.variants?.forEach(v => {
        if (v.design) designs.add(v.design);
      });
    });
    return Array.from(designs);
  }, [products]);

  const availableColors = useMemo(() => {
    const colors = new Set(['All']);
    products.forEach(p => {
      p.variants?.forEach(v => {
        if (v.color) colors.add(v.color);
      });
    });
    return Array.from(colors);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const isCategoryTab = categories.some(c => c.name === currentTab);
      const matchesCategory = !isCategoryTab || p.material === currentTab || p.category === currentTab;

      const matchesSearch = !searchQuery || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.material && p.material.toLowerCase().includes(searchQuery.toLowerCase()));
      
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
    <div className="bg-transparent text-[#111111] min-h-screen relative overflow-x-hidden font-sans pb-28 pt-3 px-4 sm:px-8 lg:px-16 w-full pointer-events-auto">
      
      {/* EDITORIAL SEARCH & DYNAMIC FILTERS BAR */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl flex flex-col lg:flex-row gap-4 items-center justify-between relative z-10 border border-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.03)] mb-6">
        <div className="w-full lg:w-1/3">
          <input 
            type="text" 
            placeholder="Search curations, materials, or motifs..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full bg-[#f9f8f6] border border-gray-200 px-4.5 py-3 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black transition-all font-semibold"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
          <select value={filterDesign} onChange={(e) => setFilterDesign(e.target.value)} className="w-full sm:w-auto bg-[#f9f8f6] border border-gray-200 px-4 py-3 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-black cursor-pointer">
            {availableDesigns.map(d => (
              <option key={d} value={d}>{d === 'All' ? 'All Designs' : d}</option>
            ))}
          </select>

          <select value={filterColor} onChange={(e) => setFilterColor(e.target.value)} className="w-full sm:w-auto bg-[#f9f8f6] border border-gray-200 px-4 py-3 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-black cursor-pointer">
            {availableColors.map(c => (
              <option key={c} value={c}>{c === 'All' ? 'All Colors' : c}</option>
            ))}
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full sm:w-auto bg-[#f9f8f6] border border-gray-200 px-4 py-3 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-black cursor-pointer">
            <option value="default">Sort: Featured</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
            <option value="newest">Newest Drops</option>
          </select>
        </div>
      </div>

      {/* LOOKBOOK PRODUCT GRID - Adjusted to smaller, compact card layout (up to 5 columns on xl screens) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6 relative z-10">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-24 text-gray-500 font-serif text-sm tracking-wide">
            No pieces found matching this curation.
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
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
                onClick={() => setDetailProduct(p)}
                className="group bg-white rounded-xl p-3 border border-gray-200 flex flex-col justify-between cursor-pointer shadow-[0_5px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.07)] transition-all duration-300"
              >
                <div>
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-[#f0eee9] mb-3 border border-gray-100">
                    <img src={currentImages[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    
                    <button onClick={(e) => { e.stopPropagation(); toggleWishlist(p._id); }} className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-900 text-[11px] hover:bg-black hover:text-white transition-colors cursor-pointer shadow-sm">
                      {isWishlisted ? '♥' : '♡'}
                    </button>

                    {variant.stockStatus === 'Out of Stock' && (
                      <div className="absolute inset-x-0 bottom-0 bg-black/80 text-white text-[8px] uppercase tracking-widest text-center py-1.5 font-medium backdrop-blur-md">
                        Sold Out
                      </div>
                    )}
                  </div>

                  <span className="text-[9px] uppercase font-mono text-gray-500 tracking-wider block mb-0.5 font-semibold">{p.material || p.category}</span>
                  <h3 className="font-serif text-xs sm:text-sm text-gray-900 font-bold tracking-wide line-clamp-1">{p.name}</h3>
                </div>

                <div className="pt-2.5 flex items-center justify-between mt-2.5 border-t border-gray-100">
                  <span className="font-mono text-xs text-gray-900 font-bold">₹{variant.price || 0}</span>
                  
                  {p.variants && p.variants.length > 1 && (
                    <div className="flex items-center gap-1">
                      {p.variants.map((v, i) => (
                        <span 
                          key={i} 
                          onClick={(e) => { e.stopPropagation(); handleVariantChange(p._id, i); }}
                          className={`w-2.5 h-2.5 rounded-full border border-gray-400 cursor-pointer transition-transform ${vIndex === i ? 'ring-2 ring-black scale-110' : 'opacity-70 hover:opacity-100'}`} 
                          style={{ backgroundColor: v.color?.toLowerCase() || '#000' }} 
                          title={v.color}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); addToCart(p); }}
                  disabled={variant.stockStatus === 'Out of Stock'}
                  className={`w-full mt-3 py-2 text-[9px] uppercase tracking-[0.15em] font-bold rounded-lg transition-all ${variant.stockStatus === 'Out of Stock' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-black hover:bg-neutral-800 text-white cursor-pointer shadow-sm'}`}
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