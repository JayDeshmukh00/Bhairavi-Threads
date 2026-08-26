export default function Toast({ toast, onViewCart }) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-24 right-6 z-[200] bg-black text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce border border-neutral-800 pointer-events-auto">
      <span className="text-xl">✨</span>
      <div className="space-y-0.5">
        <p className="text-xs uppercase tracking-widest font-semibold">{toast.title}</p>
        <p className="text-[10px] text-gray-400 tracking-wider">{toast.message}</p>
      </div>
      {toast.showViewCart && (
        <button 
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onViewCart) onViewCart();
          }} 
          className="bg-white text-black px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest font-bold hover:bg-gray-100 transition-all ml-2 cursor-pointer shadow-sm pointer-events-auto"
        >
          View Bag →
        </button>
      )}
    </div>
  );
}