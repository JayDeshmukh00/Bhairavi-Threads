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
    <div className="bg-transparent text-[#111111] min-h-screen relative overflow-x-hidden font-sans pb-28 pt-8 sm:pt-12 px-4 sm:px-8 lg:px-16 w-full pointer-events-auto">
      
      {/* EDITORIAL SEARCH & FILTERS BAR */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl flex flex-col lg:flex-row gap-4 items-center justify-between relative z-10 border border-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.03)] mb-12">
        <div className="w-full lg:w-1/3">
          <input 
            type="text" 
            placeholder="Search curations..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full bg-[#f9f8f6] border border-gray-200 px-4.5 py-3 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black transition-all"
          />
        </div>

        <div className="grid grid-cols-2 sm:flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <select value={filterDesign} onChange={(e) => setFilterDesign(e.target.value)} className="w-full sm:w-auto bg-[#f9f8f6] border border-gray-200 px-4 py-3 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-black cursor-pointer">
            <option value="All">All Designs</option>
            <option value="Classic">Classic Motifs</option>
            <option value="Kalamkari">Kalamkari</option>
          </select>

          <select value={filterColor} onChange={(e) => setFilterColor(e.target.value)} className="w-full sm:w-auto bg-[#f9f8f6] border border-gray-200 px-4 py-3 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-black cursor-pointer">
            <option value="All">All Colors</option>
            <option value="Crimson">Crimson</option>
            <option value="Ivory">Ivory</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="col-span-2 sm:col-span-1 w-full sm:w-auto bg-[#f9f8f6] border border-gray-200 px-4 py-3 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-black cursor-pointer">
            <option value="default">Sort: Featured</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* LOOKBOOK PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 sm:gap-10 relative z-10">
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
                whileHover={{ y: -6, transition: { duration: 0.2, ease: "easeOut" } }}
                onClick={() => setDetailProduct(p)}
                className="group bg-white rounded-2xl p-4 border border-gray-100 flex flex-col justify-between cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300"
              >
                <div>
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#f0eee9] mb-4">
                    <img src={currentImages[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-100" />
                    
                    <button onClick={(e) => { e.stopPropagation(); toggleWishlist(p._id); }} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-gray-900 text-xs hover:bg-black hover:text-white transition-colors cursor-pointer shadow-sm">
                      {isWishlisted ? '♥' : '♡'}
                    </button>

                    {variant.stockStatus === 'Out of Stock' && (
                      <div className="absolute inset-x-0 bottom-0 bg-black/80 text-white text-[9px] uppercase tracking-widest text-center py-2 font-medium backdrop-blur-md">
                        Sold Out
                      </div>
                    )}
                  </div>

                  <span className="text-[9px] uppercase font-mono text-gray-500 tracking-widest block mb-1">{p.material}</span>
                  <h3 className="font-serif text-sm sm:text-base text-gray-900 font-normal tracking-wide line-clamp-1">{p.name}</h3>
                </div>

                <div className="pt-3.5 flex items-center justify-between mt-3.5 border-t border-gray-100">
                  <span className="font-mono text-xs sm:text-sm text-gray-900 font-medium">₹{variant.price || 0}</span>
                  
                  {p.variants && p.variants.length > 1 && (
                    <div className="flex items-center gap-1.5">
                      {p.variants.map((v, i) => (
                        <span 
                          key={i} 
                          onClick={(e) => { e.stopPropagation(); handleVariantChange(p._id, i); }}
                          className={`w-2.5 h-2.5 rounded-full border border-gray-300 cursor-pointer ${vIndex === i ? 'ring-2 ring-black' : ''}`} 
                          style={{ backgroundColor: v.color?.toLowerCase() || '#000' }} 
                        />
                      ))}
                    </div>
                  )}
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); addToCart(p); }}
                  disabled={variant.stockStatus === 'Out of Stock'}
                  className={`w-full mt-3.5 py-2.5 text-[10px] uppercase tracking-[0.2em] rounded-xl font-medium transition-all ${variant.stockStatus === 'Out of Stock' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-black hover:bg-neutral-800 text-white cursor-pointer shadow-md'}`}
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