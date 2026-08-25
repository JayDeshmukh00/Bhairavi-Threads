import { MY_WHATSAPP_NUMBER } from '../utils/constants';

export default function SupportView() {
  const handleOpenWhatsApp = (customMsg) => {
    const text = customMsg || "Hello Bhairavi Threads! I need assistance with my order and saree curation.";
    window.open(`https://wa.me/${MY_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 text-[#f8fafc] px-4 sm:px-6 pt-10">
      <div className="text-center space-y-3 border-b border-white/10 pb-8">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#3b60e4] font-semibold">Atelier Assistance</span>
        <h2 className="font-serif text-3xl md:text-5xl text-white font-normal">WhatsApp Concierge</h2>
        <p className="text-xs text-gray-300 font-serif max-w-lg mx-auto font-light leading-relaxed">
          Our master weavers and personal stylists are available instantly via WhatsApp for customized saree draping guides, bridal trousseau consultations, and order tracking.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => handleOpenWhatsApp("Hello! I need assistance with tracking my active order.")}
          className="bg-white/[0.02] backdrop-blur-2xl p-8 rounded-3xl border border-white/10 space-y-3 cursor-pointer hover:border-emerald-500/50 hover:shadow-2xl transition-all text-center group shadow-xl"
        >
          <span className="text-3xl">📦</span>
          <h4 className="font-serif text-lg text-white font-normal">Order & Shipping Support</h4>
          <p className="text-xs text-gray-300 font-serif font-light">Inquire about dispatch dates, delivery statuses, and express shipping.</p>
          <span className="inline-block text-[10px] uppercase tracking-widest font-bold text-emerald-400 pt-2 group-hover:underline">Chat on WhatsApp →</span>
        </div>

        <div 
          onClick={() => handleOpenWhatsApp("Hello! I would like personal styling advice for a wedding / special occasion.")}
          className="bg-white/[0.02] backdrop-blur-2xl p-8 rounded-3xl border border-white/10 space-y-3 cursor-pointer hover:border-emerald-500/50 hover:shadow-2xl transition-all text-center group shadow-xl"
        >
          <span className="text-3xl">✨</span>
          <h4 className="font-serif text-lg text-white font-normal">Bridal & Trousseau Styling</h4>
          <p className="text-xs text-gray-300 font-serif font-light">Get personalized saree recommendations tailored to your occasion and color palette.</p>
          <span className="inline-block text-[10px] uppercase tracking-widest font-bold text-emerald-400 pt-2 group-hover:underline">Consult Stylist →</span>
        </div>

        <div 
          onClick={() => handleOpenWhatsApp("Hello! I have a general inquiry regarding handloom materials and care.")}
          className="bg-white/[0.02] backdrop-blur-2xl p-8 rounded-3xl border border-white/10 space-y-3 cursor-pointer hover:border-emerald-500/50 hover:shadow-2xl transition-all text-center group shadow-xl"
        >
          <span className="text-3xl">🧵</span>
          <h4 className="font-serif text-lg text-white font-normal">Weave & Fabric Care</h4>
          <p className="text-xs text-gray-300 font-serif font-light">Learn expert techniques for dry cleaning, starching, and preserving pure zari.</p>
          <span className="inline-block text-[10px] uppercase tracking-widest font-bold text-emerald-400 pt-2 group-hover:underline">Ask Artisan →</span>
        </div>
      </div>

      <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/15 p-10 rounded-3xl text-center space-y-6 shadow-2xl">
        <h3 className="font-serif text-2xl text-white font-normal">Direct Concierge Line</h3>
        <p className="text-xs text-gray-400 tracking-wider font-light">Available Monday to Saturday, 10:00 AM – 7:00 PM IST</p>
        <button 
          onClick={() => handleOpenWhatsApp()}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-full text-xs uppercase tracking-[0.25em] font-medium transition-all shadow-xl inline-flex items-center gap-2 cursor-pointer border border-emerald-400/40"
        >
          <span>💬 Open WhatsApp Chat Now</span>
        </button>
      </div>
    </div>
  );
}