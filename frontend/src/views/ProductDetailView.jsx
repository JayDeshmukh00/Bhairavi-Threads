import { Carousel } from 'react-responsive-carousel';
import { MY_WHATSAPP_NUMBER, ui } from '../utils/constants';

export default function ProductDetailView({ 
  detailProduct, setDetailProduct, setCurrentTab,
  selectedVariants, handleVariantChange, 
  setZoomImage, addToCart, 
  reviewRating, setReviewRating, 
  reviewComment, setReviewComment, 
  handleAddReview 
}) {
  const vIndex = selectedVariants[detailProduct._id] || 0;
  const variant = detailProduct.variants?.[vIndex] || detailProduct.variants?.[0] || {};
  const images = (variant.images && variant.images.length > 0) ? variant.images : (detailProduct.images || ['https://via.placeholder.com/500']);
  const variantVideo = variant.videoUrl || '';
  const primaryImage = images[0] || '';

  const handleWhatsAppInquiry = () => {
    const msg = `Hello Bhairavi Threads! I would like to inquire about this saree:\n\n*${detailProduct.name}*\nMaterial: ${detailProduct.material}\nVariant: ${variant.color} - ${variant.design}\nPrice: ₹${variant.price}\nImage Link: ${primaryImage}`;
    window.open(`https://wa.me/${MY_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-24 text-[#f8fafc] px-4 sm:px-6 pt-10">
      <button 
        onClick={() => {
          setDetailProduct(null);
          setCurrentTab('store');
        }} 
        className="text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors cursor-pointer"
      >
        ← Back to Collection
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-white/[0.02] backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/10 p-6 shadow-2xl">
          <Carousel showThumbs={true} infiniteLoop emulateTouch showStatus={false}>
            {images.map((img, i) => (
              <div key={`detail-img-${i}`} className="aspect-[3/4] cursor-zoom-in" onClick={() => setZoomImage(img)}>
                <img src={img} alt="" className="w-full h-full object-cover rounded-2xl border border-white/10" />
              </div>
            ))}
            {variantVideo && (
              <div key="detail-video" className="aspect-[3/4] bg-black rounded-2xl overflow-hidden flex items-center justify-center border border-white/10">
                <video src={variantVideo} controls playsInline className="w-full h-full object-contain" />
              </div>
            )}
          </Carousel>
        </div>

        <div className="space-y-6">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-blue-300 block mb-1">{detailProduct.material}</span>
            <h1 className="font-serif text-3xl md:text-4xl text-white block font-normal">{detailProduct.name}</h1>
            <p className="font-serif text-2xl mt-4 text-blue-300 font-medium">₹{variant.price}</p>
          </div>

          <p className="text-sm text-gray-300 leading-relaxed font-serif font-light">{detailProduct.description || 'Handcrafted meticulously with premium threads and artisanal care.'}</p>

          {detailProduct.variants && detailProduct.variants.length > 1 && (
            <div className="space-y-2 pt-4 border-t border-white/10">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold block">Select Variant / Color</label>
              <div className="flex gap-2 flex-wrap">
                {detailProduct.variants.map((v, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleVariantChange(detailProduct._id, idx)}
                    className={`text-xs px-4 py-2 rounded-xl border transition-all cursor-pointer ${vIndex === idx ? 'bg-[#1c39bb] text-white border-blue-400 font-medium shadow-lg' : 'bg-white/5 text-gray-300 border-white/15 hover:bg-white/10'}`}
                  >
                    {v.color} - {v.design}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3 pt-4">
            <button 
              onClick={() => addToCart(detailProduct)}
              disabled={variant.stockStatus === 'Out of Stock'}
              className={`w-full py-4 text-xs uppercase tracking-[0.2em] font-medium rounded-xl transition-all shadow-xl ${variant.stockStatus === 'Out of Stock' ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/10' : 'bg-[#1c39bb] hover:bg-[#3b60e4] text-white cursor-pointer border border-blue-400/40'}`}
            >
              {variant.stockStatus === 'Out of Stock' ? 'Currently Out of Stock' : 'Add to Shopping Bag'}
            </button>
            <button 
              onClick={handleWhatsAppInquiry}
              className="w-full py-3.5 text-xs uppercase tracking-[0.2em] font-medium rounded-xl bg-emerald-600/80 text-white transition-all hover:bg-emerald-600 cursor-pointer border border-emerald-500/40 shadow-xl"
            >
              💬 Enquire on WhatsApp with Photo
            </button>
          </div>

          {/* Customer Reviews Section */}
          <div className="pt-8 border-t border-white/10 space-y-6">
            <h3 className="font-serif text-xl text-white">Customer Reviews</h3>
            
            <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
              {detailProduct.reviews?.length > 0 ? detailProduct.reviews.map((r, i) => (
                <div key={i} className="bg-white/[0.03] backdrop-blur-md p-4 rounded-xl border border-white/10 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-xs text-white">{r.userName}</span>
                    <span className="text-xs text-amber-400">{'★'.repeat(r.rating)}</span>
                  </div>
                  <p className="text-xs text-gray-300 font-serif font-light">{r.comment}</p>
                </div>
              )) : (
                <p className="text-xs text-gray-400 font-serif font-light">No reviews yet. Be the first to review!</p>
              )}
            </div>

            <div className="bg-white/[0.02] backdrop-blur-2xl p-6 rounded-2xl border border-white/10 space-y-4 w-full shadow-2xl">
              <h4 className="text-xs uppercase tracking-widest font-semibold text-blue-300">Leave a Review</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-300">Rating:</span>
                <select value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))} className="bg-[#02040c] border border-white/20 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#3b60e4] cursor-pointer">
                  {[5, 4, 3, 2, 1].map(num => <option key={num} value={num} className="bg-[#02040c]">{num} Stars</option>)}
                </select>
              </div>
              <textarea 
                rows={4} 
                placeholder="Share your thoughts on the weave and drape..." 
                value={reviewComment} 
                onChange={(e) => setReviewComment(e.target.value)} 
                className="w-full bg-[#02040c]/90 border border-white/20 px-4 py-3 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#3b60e4] resize-none shadow-inner" 
              />
              <button onClick={() => handleAddReview(detailProduct._id)} className="px-6 py-2.5 text-[10px] uppercase tracking-widest bg-[#1c39bb] hover:bg-[#3b60e4] text-white font-medium rounded-xl transition-all shadow-xl cursor-pointer border border-blue-400/40">
                Submit Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}