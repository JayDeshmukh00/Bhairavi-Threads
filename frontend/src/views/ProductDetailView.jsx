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
    <div className="space-y-12 max-w-6xl mx-auto pb-20">
      <button 
        onClick={() => {
          setDetailProduct(null);
          setCurrentTab('store');
        }} 
        className="text-xs uppercase tracking-widest text-[#777] hover:text-[#1a1a1a] transition-colors"
      >
        ← Back to Collection
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-[#fafafa] rounded-2xl overflow-hidden border border-black/5 p-4 shadow-sm">
          <Carousel showThumbs={true} infiniteLoop emulateTouch showStatus={false}>
            {images.map((img, i) => (
              <div key={`detail-img-${i}`} className="aspect-[3/4] cursor-zoom-in" onClick={() => setZoomImage(img)}>
                <img src={img} alt="" className="w-full h-full object-cover rounded-xl" />
              </div>
            ))}
            {variantVideo && (
              <div key="detail-video" className="aspect-[3/4] bg-black rounded-xl overflow-hidden flex items-center justify-center">
                <video src={variantVideo} controls playsInline className="w-full h-full object-contain" />
              </div>
            )}
          </Carousel>
        </div>

        <div className="space-y-6">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#777] block mb-1">{detailProduct.material}</span>
            <h1 className="saree-brand-title-dark text-3xl md:text-4xl block">{detailProduct.name}</h1>
            <p className="font-serif text-2xl mt-4">₹{variant.price}</p>
          </div>

          <p className="text-sm text-[#666] leading-relaxed">{detailProduct.description || 'Handcrafted meticulously with premium threads and artisanal care.'}</p>

          {detailProduct.variants && detailProduct.variants.length > 1 && (
            <div className="space-y-2 pt-4 border-t border-black/10">
              <label className="text-[10px] uppercase tracking-widest text-[#777] font-semibold block">Select Variant / Color</label>
              <div className="flex gap-2 flex-wrap">
                {detailProduct.variants.map((v, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleVariantChange(detailProduct._id, idx)}
                    className={`text-xs px-4 py-2 rounded-lg border transition-all ${vIndex === idx ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]' : 'bg-white text-[#333] border-black/10'}`}
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
              className={`w-full py-4 text-xs uppercase tracking-widest ${variant.stockStatus === 'Out of Stock' ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : ui.primaryBtn}`}
            >
              {variant.stockStatus === 'Out of Stock' ? 'Currently Out of Stock' : 'Add to Shopping Bag'}
            </button>
            <button 
              onClick={handleWhatsAppInquiry}
              className="w-full py-3.5 text-xs uppercase tracking-widest rounded-xl bg-[#2fae60] text-white font-semibold transition-all hover:bg-[#258d50]"
            >
              💬 Enquire on WhatsApp with Photo
            </button>
          </div>

          {/* Customer Reviews Section */}
          <div className="pt-8 border-t border-black/10 space-y-6">
            <h3 className="saree-brand-title-dark text-xl">Customer Reviews</h3>
            
            <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
              {detailProduct.reviews?.length > 0 ? detailProduct.reviews.map((r, i) => (
                <div key={i} className="bg-[#fafafa] p-4 rounded-xl border border-black/5 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-xs">{r.userName}</span>
                    <span className="text-xs text-amber-600">{'★'.repeat(r.rating)}</span>
                  </div>
                  <p className="text-xs text-[#666]">{r.comment}</p>
                </div>
              )) : (
                <p className="text-xs text-[#777]">No reviews yet. Be the first to review!</p>
              )}
            </div>

            <div className="bg-[#fafafa] p-6 rounded-xl border border-black/5 space-y-4 w-full shadow-sm">
              <h4 className="text-xs uppercase tracking-widest font-semibold text-[#777]">Leave a Review</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs">Rating:</span>
                <select value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))} className={ui.select}>
                  {[5, 4, 3, 2, 1].map(num => <option key={num} value={num}>{num} Stars</option>)}
                </select>
              </div>
              <textarea 
                rows={4} 
                placeholder="Share your thoughts on the weave and drape..." 
                value={reviewComment} 
                onChange={(e) => setReviewComment(e.target.value)} 
                className={`${ui.input} w-full`} 
              />
              <button onClick={() => handleAddReview(detailProduct._id)} className={`px-6 py-2.5 text-[10px] uppercase tracking-widest ${ui.primaryBtn}`}>
                Submit Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}