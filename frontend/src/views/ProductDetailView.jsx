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
    <div className="space-y-12 max-w-6xl mx-auto pb-28 text-[#111111] px-4 sm:px-6 pt-10">
      <button 
        onClick={() => {
          setDetailProduct(null);
          setCurrentTab('store');
        }} 
        className="text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors cursor-pointer"
      >
        ← Back to Collection
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
          <Carousel showThumbs={true} infiniteLoop emulateTouch showStatus={false}>
            {images.map((img, i) => (
              <div key={`detail-img-${i}`} className="aspect-[3/4] cursor-zoom-in" onClick={() => setZoomImage(img)}>
                <img src={img} alt="" className="w-full h-full object-cover rounded-xl border border-gray-100" />
              </div>
            ))}
            {variantVideo && (
              <div key="detail-video" className="aspect-[3/4] bg-black rounded-xl overflow-hidden flex items-center justify-center border border-gray-100">
                <video src={variantVideo} controls playsInline className="w-full h-full object-contain" />
              </div>
            )}
          </Carousel>
        </div>

        <div className="space-y-6">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-gray-500 block mb-1">{detailProduct.material}</span>
            <h1 className="font-serif text-3xl md:text-4xl text-gray-900 block font-normal">{detailProduct.name}</h1>
            <p className="font-serif text-2xl mt-4 text-gray-900 font-medium">₹{variant.price}</p>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed font-serif font-light">{detailProduct.description || 'Handcrafted meticulously with premium threads and artisanal care.'}</p>

          {detailProduct.variants && detailProduct.variants.length > 1 && (
            <div className="space-y-2 pt-4 border-t border-gray-200">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold block">Select Variant / Color</label>
              <div className="flex gap-2 flex-wrap">
                {detailProduct.variants.map((v, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleVariantChange(detailProduct._id, idx)}
                    className={`text-xs px-4 py-2 rounded-xl border transition-all cursor-pointer ${vIndex === idx ? 'bg-black text-white border-black font-medium shadow-sm' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
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
              className={`w-full py-4 text-xs uppercase tracking-[0.2em] font-medium rounded-xl transition-all shadow-md ${variant.stockStatus === 'Out of Stock' ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' : 'bg-black hover:bg-neutral-800 text-white cursor-pointer'}`}
            >
              {variant.stockStatus === 'Out of Stock' ? 'Currently Out of Stock' : 'Add to Shopping Bag'}
            </button>
            <button 
              onClick={handleWhatsAppInquiry}
              className="w-full py-3.5 text-xs uppercase tracking-[0.2em] font-medium rounded-xl bg-emerald-700 text-white transition-all hover:bg-emerald-800 cursor-pointer shadow-sm"
            >
              💬 Enquire on WhatsApp with Photo
            </button>
          </div>

          {/* Customer Reviews Section */}
          <div className="pt-8 border-t border-gray-200 space-y-6">
            <h3 className="font-serif text-xl text-gray-900">Customer Reviews</h3>
            
            <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
              {detailProduct.reviews?.length > 0 ? detailProduct.reviews.map((r, i) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 space-y-1 shadow-[0_5px_15px_rgba(0,0,0,0.02)]">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-xs text-gray-900">{r.userName}</span>
                    <span className="text-xs text-amber-500">{'★'.repeat(r.rating)}</span>
                  </div>
                  <p className="text-xs text-gray-600 font-serif font-light">{r.comment}</p>
                </div>
              )) : (
                <p className="text-xs text-gray-500 font-serif font-light">No reviews yet. Be the first to review!</p>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-4 w-full shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
              <h4 className="text-xs uppercase tracking-widest font-semibold text-gray-900">Leave a Review</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Rating:</span>
                <select value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))} className="bg-[#f9f8f6] border border-gray-200 text-gray-900 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-black cursor-pointer">
                  {[5, 4, 3, 2, 1].map(num => <option key={num} value={num}>{num} Stars</option>)}
                </select>
              </div>
              <textarea 
                rows={4} 
                placeholder="Share your thoughts on the weave and drape..." 
                value={reviewComment} 
                onChange={(e) => setReviewComment(e.target.value)} 
                className="w-full bg-[#f9f8f6] border border-gray-200 px-4 py-3 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black resize-none" 
              />
              <button onClick={() => handleAddReview(detailProduct._id)} className="px-6 py-2.5 text-[10px] uppercase tracking-widest bg-black hover:bg-neutral-800 text-white font-medium rounded-xl transition-all shadow-sm cursor-pointer">
                Submit Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}