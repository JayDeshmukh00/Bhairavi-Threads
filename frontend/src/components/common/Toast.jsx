export default function Toast({ toast, onViewCart }) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-24 right-6 z-[80] bg-[#111111] text-[#fbf9f5] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-bounce border border-white/20">
      <span className="text-xl">✨</span>
      <div className="space-y-0.5">
        <p className="text-xs uppercase tracking-widest font-semibold">{toast.title}</p>
        <p className="text-[10px] text-[#bbb] tracking-wider">{toast.message}</p>
      </div>
      {toast.showViewCart && (
        <button 
          onClick={onViewCart} 
          className="bg-[#fbf9f5] text-black px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest font-bold hover:bg-white transition-all ml-2"
        >
          View Bag →
        </button>
      )}
    </div>
  );
}