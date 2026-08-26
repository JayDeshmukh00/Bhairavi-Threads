export default function WishlistView({ products, wishlist, setWishlist, addToCart, setDetailProduct }) {
  const wishlistedProducts = products.filter(p => wishlist.includes(p._id));

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-28 text-[#111111] px-4 sm:px-6 pt-10">
      <div className="text-center space-y-2 border-b border-gray-200 pb-6">
        <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-semibold">Atelier Curation</span>
        <h2 className="font-serif text-3xl md:text-4xl text-gray-900 font-normal">My Wishlist ({wishlistedProducts.length})</h2>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 space-y-3 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
          <p className="text-xs uppercase tracking-widest text-gray-500 font-serif">Your wishlist is currently empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {wishlistedProducts.map(product => {
            const variant = product.variants?.[0] || {};
            return (
              <div key={product._id} className="group relative bg-white rounded-2xl p-4 border border-gray-200 space-y-4 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all">
                <div className="aspect-[3/4] bg-[#f0eee9] rounded-xl overflow-hidden cursor-pointer relative" onClick={() => setDetailProduct(product)}>
                  <img src={variant.images?.[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <button onClick={(e) => { e.stopPropagation(); setWishlist(prev => prev.filter(id => id !== product._id)); }} className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-xs shadow-sm hover:bg-black hover:text-white transition-colors cursor-pointer">♥</button>
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-lg text-gray-900 font-normal line-clamp-1">{product.name}</h3>
                  <p className="font-serif text-base text-gray-700 font-medium">₹{variant.price}</p>
                </div>
                <button onClick={() => addToCart(product)} className="w-full py-3 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs uppercase tracking-[0.2em] font-medium transition-all shadow-md cursor-pointer">Add to Bag</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}