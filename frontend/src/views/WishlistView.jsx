export default function WishlistView({ products, wishlist, setWishlist, addToCart, setDetailProduct }) {
  const wishlistedProducts = products.filter(p => wishlist.includes(p._id));

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-serif">My Wishlist ({wishlistedProducts.length})</h2>
      {wishlistedProducts.length === 0 ? (
        <p className="text-sm text-[#777] py-12">Your wishlist is currently empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {wishlistedProducts.map(product => {
            const variant = product.variants?.[0] || {};
            return (
              <div key={product._id} className="group relative bg-[#fafafa] rounded-2xl p-4 border border-black/5 space-y-4">
                <div className="aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden cursor-pointer" onClick={() => setDetailProduct(product)}>
                  <img src={variant.images?.[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <button onClick={() => setWishlist(prev => prev.filter(id => id !== product._id))} className="absolute top-3 right-3 p-2 bg-white rounded-full shadow">❤️</button>
                </div>
                <div>
                  <h3 className="font-serif text-lg">{product.name}</h3>
                  <p className="font-serif text-base mt-1">₹{variant.price}</p>
                </div>
                <button onClick={() => addToCart(product)} className="w-full py-3 bg-[#1a1a1a] text-white rounded-full text-xs uppercase tracking-widest">Add to Bag</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}