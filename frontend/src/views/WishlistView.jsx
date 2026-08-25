export default function WishlistView({ products, wishlist, setWishlist, addToCart, setDetailProduct }) {
  const wishlistedProducts = products.filter(p => wishlist.includes(p._id));

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-24 text-[#f8fafc] px-4 sm:px-6 pt-10">
      <div className="text-center space-y-2 border-b border-white/10 pb-6">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#3b60e4] font-semibold">Atelier Curation</span>
        <h2 className="font-serif text-3xl md:text-4xl text-white font-normal">My Wishlist ({wishlistedProducts.length})</h2>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="text-center py-20 bg-white/[0.02] backdrop-blur-2xl rounded-3xl border border-white/10 space-y-3 shadow-2xl">
          <p className="text-xs uppercase tracking-widest text-gray-400 font-serif">Your wishlist is currently empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {wishlistedProducts.map(product => {
            const variant = product.variants?.[0] || {};
            return (
              <div key={product._id} className="group relative bg-white/[0.02] backdrop-blur-2xl rounded-3xl p-5 border border-white/10 space-y-4 shadow-2xl hover:border-[#3b60e4]/60 transition-all">
                <div className="aspect-[3/4] bg-black rounded-2xl overflow-hidden cursor-pointer relative" onClick={() => setDetailProduct(product)}>
                  <img src={variant.images?.[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95" />
                  <button onClick={() => setWishlist(prev => prev.filter(id => id !== product._id))} className="absolute top-3 right-3 w-9 h-9 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-sm border border-white/20 shadow-lg cursor-pointer">❤️</button>
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-lg text-white font-normal line-clamp-1">{product.name}</h3>
                  <p className="font-serif text-base text-blue-300 font-medium">₹{variant.price}</p>
                </div>
                <button onClick={() => addToCart(product)} className="w-full py-3.5 bg-[#1c39bb] hover:bg-[#3b60e4] text-white rounded-xl text-xs uppercase tracking-[0.2em] font-medium transition-all shadow-xl cursor-pointer border border-blue-400/40">Add to Bag</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}